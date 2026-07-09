import { prisma } from '../../config/database.js';
import { QuestionarioRespostaRepository } from './questionario-resposta.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import { calcularMediaUser, classificarTracoFO, classificarTracoF } from '../../utils/calculos.js';
import type { QuestionarioResposta } from '../../../generated/prisma/index.js';

type RespostaCalculada = QuestionarioResposta & {
  mediaUser: number | null;
  classificacaoAmeacaFraqueza: 'ameaça' | 'fraqueza' | null;
  classificacaoTraco: 'neutro' | 'oportunidade' | 'fraqueza' | 'forca' | null;
  swot: string | null;
};

interface ReferenciasCache {
  sh: Map<number, { swot: string; intensidade: number }>;
  ch: Map<number, { swot: string; intensidade: number }>;
  fo: Map<number, {
    swot: string;
    tracoNeutro: Array<{ valor: string }>;
    tracoOportunidade: Array<{ valor: string }>;
    tracoFraqueza: Array<{ valor: string }>;
  }>;
  f: Map<number, {
    swot: string;
    tracoNeutro: Array<{ valor: string }>;
    tracoForca: Array<{ valor: string }>;
    tracoFraqueza: Array<{ valor: string }>;
    tracoOportunidade: Array<{ valor: string }>;
  }>;
}

/**
 * Service de QuestionarioResposta
 * Contém a lógica de negócio relacionada às respostas do questionário
 */
export class QuestionarioRespostaService {
  private repository: QuestionarioRespostaRepository;

  constructor() {
    this.repository = new QuestionarioRespostaRepository();
  }

  private numerosUnicosPorTipo(respostas: QuestionarioResposta[], tipo: string): number[] {
    return [...new Set(respostas.filter((r) => r.tipo === tipo).map((r) => r.numeroTraco))];
  }

  private async carregarReferencias(respostas: QuestionarioResposta[]): Promise<ReferenciasCache> {
    const shNumeros = this.numerosUnicosPorTipo(respostas, 'SH');
    const chNumeros = this.numerosUnicosPorTipo(respostas, 'CH');
    const foNumeros = this.numerosUnicosPorTipo(respostas, 'FO');
    const fNumeros = this.numerosUnicosPorTipo(respostas, 'F');

    const [sh, ch, fo, f] = await Promise.all([
      shNumeros.length
        ? prisma.fraquezasAmeacasSh.findMany({ where: { numeroTraco: { in: shNumeros } } })
        : Promise.resolve([]),
      chNumeros.length
        ? prisma.fraquezasAmeacasCh.findMany({ where: { numeroTraco: { in: chNumeros } } })
        : Promise.resolve([]),
      foNumeros.length
        ? prisma.fraquezasOportunidades.findMany({
            where: { numeroTraco: { in: foNumeros } },
            include: { tracoNeutro: true, tracoOportunidade: true, tracoFraqueza: true },
          })
        : Promise.resolve([]),
      fNumeros.length
        ? prisma.forcas.findMany({
            where: { numeroTraco: { in: fNumeros } },
            include: {
              tracoNeutro: true,
              tracoForca: true,
              tracoFraqueza: true,
              tracoOportunidade: true,
            },
          })
        : Promise.resolve([]),
    ]);

    return {
      sh: new Map(sh.map((r) => [r.numeroTraco, { swot: r.swot, intensidade: r.intensidade }])),
      ch: new Map(ch.map((r) => [r.numeroTraco, { swot: r.swot, intensidade: r.intensidade }])),
      fo: new Map(fo.map((r) => [r.numeroTraco, r])),
      f: new Map(f.map((r) => [r.numeroTraco, r])),
    };
  }

  private determinarAmeacaFraquezaComCache(
    tipo: string,
    numeroTraco: number,
    mediaUser: number | null,
    cache: ReferenciasCache,
  ): 'ameaça' | 'fraqueza' | null {
    if ((tipo !== 'SH' && tipo !== 'CH') || mediaUser === null) return null;

    const registro = tipo === 'SH' ? cache.sh.get(numeroTraco) : cache.ch.get(numeroTraco);
    if (!registro || registro.intensidade === null || registro.intensidade === undefined) return null;

    return mediaUser >= registro.intensidade ? 'ameaça' : 'fraqueza';
  }

  private adicionarCamposCalculadosComCache(
    resposta: QuestionarioResposta,
    cache: ReferenciasCache,
  ): RespostaCalculada {
    let mediaUser: number | null = null;
    let classificacaoAmeacaFraqueza: 'ameaça' | 'fraqueza' | null = null;
    let classificacaoTraco: 'neutro' | 'oportunidade' | 'fraqueza' | 'forca' | null = null;
    let swot: string | null = null;

    if (resposta.tipo === 'SH') {
      swot = cache.sh.get(resposta.numeroTraco)?.swot ?? null;
    } else if (resposta.tipo === 'CH') {
      swot = cache.ch.get(resposta.numeroTraco)?.swot ?? null;
    } else if (resposta.tipo === 'FO') {
      swot = cache.fo.get(resposta.numeroTraco)?.swot ?? null;
    } else if (resposta.tipo === 'F') {
      swot = cache.f.get(resposta.numeroTraco)?.swot ?? null;
    }

    if ((resposta.tipo === 'SH' || resposta.tipo === 'CH') && resposta.resposta === 'sim') {
      try {
        mediaUser = calcularMediaUser(resposta.frequencia, resposta.intensidade);
        if (mediaUser !== null) {
          classificacaoAmeacaFraqueza = this.determinarAmeacaFraquezaComCache(
            resposta.tipo,
            resposta.numeroTraco,
            mediaUser,
            cache,
          );
        }
      } catch {
        mediaUser = null;
        classificacaoAmeacaFraqueza = null;
      }
    }

    if (resposta.tipo === 'FO' && resposta.resposta === 'sim' && resposta.frequencia != null) {
      const registro = cache.fo.get(resposta.numeroTraco);
      if (registro) {
        classificacaoTraco = classificarTracoFO(
          resposta.frequencia,
          registro.tracoNeutro,
          registro.tracoOportunidade,
          registro.tracoFraqueza,
        );
      }
    }

    if (resposta.tipo === 'F' && resposta.resposta === 'sim' && resposta.frequencia != null) {
      const registro = cache.f.get(resposta.numeroTraco);
      if (registro) {
        classificacaoTraco = classificarTracoF(
          resposta.frequencia,
          registro.tracoNeutro,
          registro.tracoForca,
          registro.tracoFraqueza,
          registro.tracoOportunidade,
        );
      }
    }

    return {
      ...resposta,
      mediaUser,
      classificacaoAmeacaFraqueza,
      classificacaoTraco,
      swot,
    };
  }

  private async adicionarCamposCalculados(resposta: QuestionarioResposta): Promise<RespostaCalculada> {
    const cache = await this.carregarReferencias([resposta]);
    return this.adicionarCamposCalculadosComCache(resposta, cache);
  }

  private async adicionarCamposCalculadosEmLote(respostas: QuestionarioResposta[]): Promise<RespostaCalculada[]> {
    if (!respostas.length) return [];
    const cache = await this.carregarReferencias(respostas);
    return respostas.map((resposta) => this.adicionarCamposCalculadosComCache(resposta, cache));
  }

  async getRespostaById(id: string) {
    const resposta = await this.repository.findById(id);
    if (!resposta) {
      throw new NotFoundError('Resposta não encontrada');
    }
    return this.adicionarCamposCalculados(resposta);
  }

  async getRespostaByUserPerguntaTipo(userId: string, perguntaId: string, tipo: string) {
    const resposta = await this.repository.findByUserPerguntaTipo(userId, perguntaId, tipo);
    if (!resposta) return null;
    return this.adicionarCamposCalculados(resposta);
  }

  async listRespostasByUserId(userId: string, tipo?: string) {
    const respostas = await this.repository.findByUserId(userId, tipo);
    return this.adicionarCamposCalculadosEmLote(respostas);
  }

  async salvarResposta(
    userId: string,
    data: {
      perguntaId: string;
      tipo: string;
      numeroTraco: number;
      resposta?: string | null;
      frequencia?: number | null;
      intensidade?: number | null;
    }
  ) {
    const resposta = await this.repository.upsert({ userId, ...data });
    return this.adicionarCamposCalculados(resposta);
  }

  async salvarRespostas(
    userId: string,
    respostas: Array<{
      perguntaId: string;
      tipo: string;
      numeroTraco: number;
      resposta?: string | null;
      frequencia?: number | null;
      intensidade?: number | null;
    }>
  ) {
    const respostasComUserId = respostas.map((resposta) => ({ userId, ...resposta }));
    return this.repository.createMany(respostasComUserId);
  }

  async deletarResposta(id: string) {
    const resposta = await this.repository.findById(id);
    if (!resposta) {
      throw new NotFoundError('Resposta não encontrada');
    }
    return this.repository.delete(id);
  }

  async deletarRespostasByUserId(userId: string, tipo?: string) {
    return this.repository.deleteByUserId(userId, tipo);
  }

  async obterSwotCompleto(userId: string) {
    const respostas = await this.repository.findByUserId(userId);
    const respostasComCalculos = await this.adicionarCamposCalculadosEmLote(respostas);

    const forcas: RespostaCalculada[] = [];
    const fraquezas: RespostaCalculada[] = [];
    const oportunidades: RespostaCalculada[] = [];
    const ameacas: RespostaCalculada[] = [];

    for (const resposta of respostasComCalculos) {
      if (resposta.tipo === 'SH' || resposta.tipo === 'CH') {
        if (resposta.classificacaoAmeacaFraqueza === 'ameaça') {
          ameacas.push(resposta);
        } else if (resposta.classificacaoAmeacaFraqueza === 'fraqueza') {
          fraquezas.push(resposta);
        }
      }

      if (resposta.tipo === 'FO' || resposta.tipo === 'F') {
        if (resposta.classificacaoTraco === 'forca') {
          forcas.push(resposta);
        } else if (resposta.classificacaoTraco === 'fraqueza') {
          fraquezas.push(resposta);
        } else if (resposta.classificacaoTraco === 'oportunidade') {
          oportunidades.push(resposta);
        }
      }
    }

    const ordenarPorNumeroTraco = (a: RespostaCalculada, b: RespostaCalculada) =>
      a.numeroTraco - b.numeroTraco;

    forcas.sort(ordenarPorNumeroTraco);
    fraquezas.sort(ordenarPorNumeroTraco);
    oportunidades.sort(ordenarPorNumeroTraco);
    ameacas.sort(ordenarPorNumeroTraco);

    return { forcas, fraquezas, oportunidades, ameacas };
  }
}
