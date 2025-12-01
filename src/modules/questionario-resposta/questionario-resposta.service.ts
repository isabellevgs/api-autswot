import { QuestionarioRespostaRepository } from './questionario-resposta.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import { calcularMediaUser, classificarTracoFO, classificarTracoF } from '../../utils/calculos.js';
import { FraquezasAmeacasShRepository } from '../fraquezas-ameacas-sh/fraquezas-ameacas-sh.repository.js';
import { FraquezasAmeacasChRepository } from '../fraquezas-ameacas-ch/fraquezas-ameacas-ch.repository.js';
import { FraquezasOportunidadesRepository } from '../fraquezas-oportunidades/fraquezas-oportunidades.repository.js';
import { ForcasRepository } from '../forcas/forcas.repository.js';
import type { QuestionarioResposta } from '../../../generated/prisma/index.js';

/**
 * Service de QuestionarioResposta
 * Contém a lógica de negócio relacionada às respostas do questionário
 */
export class QuestionarioRespostaService {
  private repository: QuestionarioRespostaRepository;
  private fraquezasAmeacasShRepository: FraquezasAmeacasShRepository;
  private fraquezasAmeacasChRepository: FraquezasAmeacasChRepository;
  private fraquezasOportunidadesRepository: FraquezasOportunidadesRepository;
  private forcasRepository: ForcasRepository;

  constructor() {
    this.repository = new QuestionarioRespostaRepository();
    this.fraquezasAmeacasShRepository = new FraquezasAmeacasShRepository();
    this.fraquezasAmeacasChRepository = new FraquezasAmeacasChRepository();
    this.fraquezasOportunidadesRepository = new FraquezasOportunidadesRepository();
    this.forcasRepository = new ForcasRepository();
  }

  /**
   * Determina se é ameaça ou fraqueza comparando mediaUser com intensidade da tabela
   * Se mediaUser >= intensidade da tabela → é uma ameaça
   * Se mediaUser < intensidade da tabela → é uma fraqueza
   */
  private async determinarAmeacaFraqueza(
    tipo: string,
    numeroTraco: number,
    mediaUser: number | null
  ): Promise<'ameaça' | 'fraqueza' | null> {
    // Só determina para tipos SH e CH quando mediaUser está disponível
    if ((tipo !== 'SH' && tipo !== 'CH') || mediaUser === null) {
      return null;
    }

    try {
      let registro: { intensidade: number } | null = null;

      // Busca o registro na tabela correspondente
      if (tipo === 'SH') {
        registro = await this.fraquezasAmeacasShRepository.findByNumeroTraco(numeroTraco);
      } else if (tipo === 'CH') {
        registro = await this.fraquezasAmeacasChRepository.findByNumeroTraco(numeroTraco);
      }

      // Se não encontrou o registro, retorna null
      if (!registro || registro.intensidade === null || registro.intensidade === undefined) {
        return null;
      }

      // Compara mediaUser com intensidade da tabela
      if (mediaUser >= registro.intensidade) {
        return 'ameaça';
      } else {
        return 'fraqueza';
      }
    } catch (error) {
      // Em caso de erro, retorna null
      return null;
    }
  }

  /**
   * Classifica traço FO comparando frequência com valores das colunas
   */
  private async classificarTracoFO(
    numeroTraco: number,
    frequencia: number | null | undefined
  ): Promise<'neutro' | 'oportunidade' | 'fraqueza' | null> {
    if (frequencia === null || frequencia === undefined) {
      return null;
    }

    try {
      const registro = await this.fraquezasOportunidadesRepository.findByNumeroTraco(numeroTraco);
      
      if (!registro) {
        return null;
      }

      return classificarTracoFO(
        frequencia,
        registro.tracoNeutro,
        registro.tracoOportunidade,
        registro.tracoFraqueza
      );
    } catch (error) {
      return null;
    }
  }

  /**
   * Classifica traço F comparando frequência com valores das colunas
   */
  private async classificarTracoF(
    numeroTraco: number,
    frequencia: number | null | undefined
  ): Promise<'neutro' | 'forca' | 'fraqueza' | 'oportunidade' | null> {
    if (frequencia === null || frequencia === undefined) {
      return null;
    }

    try {
      const registro = await this.forcasRepository.findByNumeroTraco(numeroTraco);
      
      if (!registro) {
        return null;
      }

      return classificarTracoF(
        frequencia,
        registro.tracoNeutro,
        registro.tracoForca,
        registro.tracoFraqueza,
        registro.tracoOportunidade
      );
    } catch (error) {
      return null;
    }
  }

  /**
   * Adiciona os campos calculados para todas as respostas
   */
  private async adicionarCamposCalculados(
    resposta: QuestionarioResposta
  ): Promise<QuestionarioResposta & { 
    mediaUser: number | null; 
    classificacaoAmeacaFraqueza: 'ameaça' | 'fraqueza' | null;
    classificacaoTraco: 'neutro' | 'oportunidade' | 'fraqueza' | 'forca' | null;
    swot: string | null;
  }> {
    let mediaUser: number | null = null;
    let classificacaoAmeacaFraqueza: 'ameaça' | 'fraqueza' | null = null;
    let classificacaoTraco: 'neutro' | 'oportunidade' | 'fraqueza' | 'forca' | null = null;
    let swot: string | null = null;

    // Busca o campo swot da tabela correspondente
    try {
      if (resposta.tipo === 'SH') {
        const registro = await this.fraquezasAmeacasShRepository.findByNumeroTraco(resposta.numeroTraco);
        swot = registro?.swot || null;
      } else if (resposta.tipo === 'CH') {
        const registro = await this.fraquezasAmeacasChRepository.findByNumeroTraco(resposta.numeroTraco);
        swot = registro?.swot || null;
      } else if (resposta.tipo === 'FO') {
        const registro = await this.fraquezasOportunidadesRepository.findByNumeroTraco(resposta.numeroTraco);
        swot = registro?.swot || null;
      } else if (resposta.tipo === 'F') {
        const registro = await this.forcasRepository.findByNumeroTraco(resposta.numeroTraco);
        swot = registro?.swot || null;
      }
    } catch (error) {
      // Se houver erro ao buscar swot, mantém como null
      swot = null;
    }

    // Calcula mediaUser e classificacaoAmeacaFraqueza para tipos SH e CH quando resposta é 'sim'
    if ((resposta.tipo === 'SH' || resposta.tipo === 'CH') && resposta.resposta === 'sim') {
      try {
        mediaUser = calcularMediaUser(resposta.frequencia, resposta.intensidade);
        
        // Se mediaUser foi calculado, determina se é ameaça ou fraqueza
        if (mediaUser !== null) {
          classificacaoAmeacaFraqueza = await this.determinarAmeacaFraqueza(
            resposta.tipo,
            resposta.numeroTraco,
            mediaUser
          );
        }
      } catch (error) {
        // Se houver erro no cálculo, mantém como null
        mediaUser = null;
        classificacaoAmeacaFraqueza = null;
      }
    }

    // Classifica traço para tipos FO
    if (resposta.tipo === 'FO') {
      classificacaoTraco = await this.classificarTracoFO(resposta.numeroTraco, resposta.frequencia);
    }

    // Classifica traço para tipos F
    if (resposta.tipo === 'F') {
      console.log('[DEBUG adicionarCamposCalculados] Classificando traço F:', {
        numeroTraco: resposta.numeroTraco,
        frequencia: resposta.frequencia
      });
      classificacaoTraco = await this.classificarTracoF(resposta.numeroTraco, resposta.frequencia);
      console.log('[DEBUG adicionarCamposCalculados] Resultado classificação:', classificacaoTraco);
    }

    return {
      ...resposta,
      mediaUser,
      classificacaoAmeacaFraqueza,
      classificacaoTraco,
      swot,
    };
  }

  /**
   * Obter resposta por ID
   */
  async getRespostaById(id: string) {
    const resposta = await this.repository.findById(id);

    if (!resposta) {
      throw new NotFoundError('Resposta não encontrada');
    }

    return this.adicionarCamposCalculados(resposta);
  }

  /**
   * Obter resposta por usuário, pergunta e tipo
   */
  async getRespostaByUserPerguntaTipo(
    userId: string,
    perguntaId: string,
    tipo: string
  ) {
    const resposta = await this.repository.findByUserPerguntaTipo(userId, perguntaId, tipo);
    if (!resposta) {
      return null;
    }
    return this.adicionarCamposCalculados(resposta);
  }

  /**
   * Listar todas as respostas de um usuário
   */
  async listRespostasByUserId(userId: string, tipo?: string) {
    const respostas = await this.repository.findByUserId(userId, tipo);
    return Promise.all(respostas.map(resposta => this.adicionarCamposCalculados(resposta)));
  }

  /**
   * Salvar ou atualizar uma resposta
   */
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
    const resposta = await this.repository.upsert({
      userId,
      ...data,
    });
    return this.adicionarCamposCalculados(resposta);
  }

  /**
   * Salvar múltiplas respostas em batch
   */
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
    const respostasComUserId = respostas.map(resposta => ({
      userId,
      ...resposta,
    }));

    return this.repository.createMany(respostasComUserId);
  }

  /**
   * Deletar resposta
   */
  async deletarResposta(id: string) {
    const resposta = await this.repository.findById(id);
    if (!resposta) {
      throw new NotFoundError('Resposta não encontrada');
    }

    return this.repository.delete(id);
  }

  /**
   * Deletar todas as respostas de um usuário
   */
  async deletarRespostasByUserId(userId: string, tipo?: string) {
    return this.repository.deleteByUserId(userId, tipo);
  }

  /**
   * Retorna o SWOT completo organizado por módulos
   */
  async obterSwotCompleto(userId: string) {
    // Busca todas as respostas do usuário
    const respostas = await this.repository.findByUserId(userId);
    
    console.log('[DEBUG obterSwotCompleto] Respostas encontradas:', respostas.length);
    console.log('[DEBUG obterSwotCompleto] Respostas:', respostas.map(r => ({
      tipo: r.tipo,
      numeroTraco: r.numeroTraco,
      frequencia: r.frequencia,
      resposta: r.resposta
    })));
    
    // Adiciona campos calculados a todas as respostas
    const respostasComCalculos = await Promise.all(
      respostas.map(resposta => this.adicionarCamposCalculados(resposta))
    );

    console.log('[DEBUG obterSwotCompleto] Respostas com cálculos:', respostasComCalculos.map(r => ({
      tipo: r.tipo,
      numeroTraco: r.numeroTraco,
      classificacaoAmeacaFraqueza: r.classificacaoAmeacaFraqueza,
      classificacaoTraco: r.classificacaoTraco,
      swot: r.swot
    })));

    // Organiza por módulos
    const forcas: typeof respostasComCalculos = [];
    const fraquezas: typeof respostasComCalculos = [];
    const oportunidades: typeof respostasComCalculos = [];
    const ameacas: typeof respostasComCalculos = [];

    for (const resposta of respostasComCalculos) {
      // Para SH e CH: usa classificacaoAmeacaFraqueza
      if (resposta.tipo === 'SH' || resposta.tipo === 'CH') {
        if (resposta.classificacaoAmeacaFraqueza === 'ameaça') {
          ameacas.push(resposta);
        } else if (resposta.classificacaoAmeacaFraqueza === 'fraqueza') {
          fraquezas.push(resposta);
        }
      }

      // Para FO e F: usa classificacaoTraco
      if (resposta.tipo === 'FO' || resposta.tipo === 'F') {
        console.log('[DEBUG obterSwotCompleto] Processando resposta tipo', resposta.tipo, 'com classificacaoTraco:', resposta.classificacaoTraco);
        if (resposta.classificacaoTraco === 'forca') {
          forcas.push(resposta);
        } else if (resposta.classificacaoTraco === 'fraqueza') {
          console.log('[DEBUG obterSwotCompleto] Adicionando fraqueza:', resposta.numeroTraco, resposta.swot);
          fraquezas.push(resposta);
        } else if (resposta.classificacaoTraco === 'oportunidade') {
          oportunidades.push(resposta);
        }
        // 'neutro' não é adicionado a nenhum módulo
      }
    }

    console.log('[DEBUG obterSwotCompleto] Resultado final:', {
      forcas: forcas.length,
      fraquezas: fraquezas.length,
      oportunidades: oportunidades.length,
      ameacas: ameacas.length
    });

    // Ordena por numeroTraco em cada módulo
    const ordenarPorNumeroTraco = (a: typeof respostasComCalculos[0], b: typeof respostasComCalculos[0]) => 
      a.numeroTraco - b.numeroTraco;

    forcas.sort(ordenarPorNumeroTraco);
    fraquezas.sort(ordenarPorNumeroTraco);
    oportunidades.sort(ordenarPorNumeroTraco);
    ameacas.sort(ordenarPorNumeroTraco);

    return {
      forcas,
      fraquezas,
      oportunidades,
      ameacas,
    };
  }
}

