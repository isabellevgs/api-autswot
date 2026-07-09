import { prisma } from '../../config/database.js';
import { QuestionarioRespostaService } from '../questionario-resposta/questionario-resposta.service.js';
import {
  QUADRANTES_ORDEM,
  quadranteEstaDesbloqueado,
  type QuadranteKey,
} from '../../constants/swot-quadrantes.js';
import {
  CHAVE_FORCAS,
  CHAVE_JORNADA_FINAL,
  MIN_PALAVRAS_JORNADA,
  MIN_PALAVRAS_AUTOADVOCACIA,
  QUINZENAS_INICIAIS,
  DIAS_POR_QUINZENA,
  chaveMicroTraco,
  chaveQuadranteFinal,
  contarPalavras,
  obterPromptPagina,
  obterTituloPagina,
  type TipoDiarioPagina,
} from '../../constants/diario-prompts.js';
import { ForbiddenError, NotFoundError, ValidationError } from '../../utils/errors.js';

const questionarioService = new QuestionarioRespostaService();

const QUADRANTES_COM_EXERCICIOS: QuadranteKey[] = ['ameaca', 'fraqueza', 'oportunidade'];

interface TracoSwot {
  tipo: string;
  numeroTraco: number;
  swot: string | null;
}

interface DefinicaoPagina {
  chave: string;
  tipo: TipoDiarioPagina;
  quadrante: QuadranteKey | null;
  tipoTraco: string | null;
  numeroTraco: number | null;
  tituloTraco: string | null;
  ordem: number;
}

interface PaginaExistente {
  id: string;
  chave: string;
  tipo: string;
  quadrante: string | null;
  tipoTraco: string | null;
  numeroTraco: number | null;
  tituloTraco: string | null;
  ordem: number;
  texto: string;
  concluida: boolean;
  arquivada: boolean;
  desbloqueada: boolean;
}

interface SyncContext {
  definicoes: DefinicaoPagina[];
  chavesValidas: Set<string>;
  existentesMap: Map<string, PaginaExistente>;
  existentes: PaginaExistente[];
  enviados: Set<string>;
  totaisPorQuadrante: Record<QuadranteKey, number>;
  concluidosPorQuadrante: Partial<Record<QuadranteKey, number>>;
}

function labelTraco(traco: TracoSwot): string {
  if (traco.swot?.trim()) return traco.swot.trim();
  return `Traço ${traco.numeroTraco}`;
}

function totalTracosSwot(totais: Record<QuadranteKey, number>): number {
  return QUADRANTES_ORDEM.reduce((acc, q) => acc + (totais[q] ?? 0), 0);
}

function jornadaCompleta(
  concluidos: Partial<Record<QuadranteKey, number>>,
  totais: Record<QuadranteKey, number>,
): boolean {
  if (totalTracosSwot(totais) === 0) return false;

  for (const quadrante of QUADRANTES_COM_EXERCICIOS) {
    const total = totais[quadrante] ?? 0;
    if (total <= 0) continue;
    if ((concluidos[quadrante] ?? 0) < total) return false;
  }

  if ((totais.forca ?? 0) > 0) {
    return quadranteEstaDesbloqueado('forca', concluidos, totais);
  }

  return true;
}

function montarDefinicoesPaginas(
  swot: Awaited<ReturnType<QuestionarioRespostaService['obterSwotCompleto']>>,
): DefinicaoPagina[] {
  const paginas: DefinicaoPagina[] = [];
  let ordem = 0;

  const adicionarMicro = (quadrante: QuadranteKey, tracos: TracoSwot[]) => {
    for (const traco of tracos) {
      paginas.push({
        chave: chaveMicroTraco(quadrante, traco.tipo, traco.numeroTraco),
        tipo: 'micro_traco',
        quadrante,
        tipoTraco: traco.tipo,
        numeroTraco: traco.numeroTraco,
        tituloTraco: labelTraco(traco),
        ordem: ordem++,
      });
    }
  };

  adicionarMicro('ameaca', swot.ameacas);
  if (swot.ameacas.length > 0) {
    paginas.push({
      chave: chaveQuadranteFinal('ameaca'),
      tipo: 'quadrante_final',
      quadrante: 'ameaca',
      tipoTraco: null,
      numeroTraco: null,
      tituloTraco: null,
      ordem: ordem++,
    });
  }

  adicionarMicro('fraqueza', swot.fraquezas);
  if (swot.fraquezas.length > 0) {
    paginas.push({
      chave: chaveQuadranteFinal('fraqueza'),
      tipo: 'quadrante_final',
      quadrante: 'fraqueza',
      tipoTraco: null,
      numeroTraco: null,
      tituloTraco: null,
      ordem: ordem++,
    });
  }

  adicionarMicro('oportunidade', swot.oportunidades);
  if (swot.oportunidades.length > 0) {
    paginas.push({
      chave: chaveQuadranteFinal('oportunidade'),
      tipo: 'quadrante_final',
      quadrante: 'oportunidade',
      tipoTraco: null,
      numeroTraco: null,
      tituloTraco: null,
      ordem: ordem++,
    });
  }

  if (swot.forcas.length > 0) {
    paginas.push({
      chave: CHAVE_FORCAS,
      tipo: 'forcas',
      quadrante: 'forca',
      tipoTraco: null,
      numeroTraco: null,
      tituloTraco: null,
      ordem: ordem++,
    });
  }

  paginas.push({
    chave: CHAVE_JORNADA_FINAL,
    tipo: 'jornada_final',
    quadrante: null,
    tipoTraco: null,
    numeroTraco: null,
    tituloTraco: null,
    ordem: ordem++,
  });

  return paginas;
}

function calcularDesbloqueio(
  def: DefinicaoPagina,
  enviados: Set<string>,
  concluidosPorQuadrante: Partial<Record<QuadranteKey, number>>,
  totaisPorQuadrante: Record<QuadranteKey, number>,
): boolean {
  if (def.tipo === 'micro_traco' && def.tipoTraco && def.numeroTraco != null && def.quadrante) {
    return enviados.has(`${def.tipoTraco}-${def.numeroTraco}-${def.quadrante}`);
  }

  if (def.tipo === 'quadrante_final' && def.quadrante) {
    const total = totaisPorQuadrante[def.quadrante] ?? 0;
    if (total <= 0) return false;
    return (concluidosPorQuadrante[def.quadrante] ?? 0) >= total;
  }

  if (def.tipo === 'forcas') {
    return quadranteEstaDesbloqueado('forca', concluidosPorQuadrante, totaisPorQuadrante);
  }

  if (def.tipo === 'jornada_final') {
    return jornadaCompleta(concluidosPorQuadrante, totaisPorQuadrante);
  }

  return false;
}

function paginaTemConteudo(pagina: Pick<PaginaExistente, 'concluida' | 'texto'>): boolean {
  return pagina.concluida || !!pagina.texto?.trim();
}

function paginaEditavel(pagina: {
  desbloqueada: boolean;
  concluida: boolean;
  texto: string;
}): boolean {
  return pagina.desbloqueada || paginaTemConteudo(pagina);
}

function resolverDesbloqueada(
  calculada: boolean,
  existente: PaginaExistente | undefined,
): boolean {
  if (calculada) return true;
  if (existente && paginaTemConteudo(existente)) return true;
  return false;
}

function serializarPagina(pagina: {
  id: string;
  chave: string;
  tipo: string;
  quadrante: string | null;
  tipoTraco: string | null;
  numeroTraco: number | null;
  tituloTraco: string | null;
  ordem: number;
  texto: string;
  concluida: boolean;
  desbloqueada: boolean;
  arquivada: boolean;
  updatedAt: Date;
}) {
  const tipo = pagina.tipo as TipoDiarioPagina;
  return {
    id: pagina.id,
    chave: pagina.chave,
    tipo: pagina.tipo,
    quadrante: pagina.quadrante,
    tipoTraco: pagina.tipoTraco,
    numeroTraco: pagina.numeroTraco,
    tituloTraco: pagina.tituloTraco,
    titulo: obterTituloPagina(tipo, pagina.quadrante, pagina.tituloTraco),
    prompt: obterPromptPagina(tipo, pagina.quadrante),
    minPalavras: MIN_PALAVRAS_JORNADA,
    ordem: pagina.ordem,
    texto: pagina.texto,
    concluida: pagina.concluida,
    desbloqueada: pagina.desbloqueada,
    arquivada: pagina.arquivada,
    editavel: paginaEditavel(pagina),
    updatedAt: pagina.updatedAt,
  };
}

async function carregarContextoSync(userId: string): Promise<SyncContext> {
  const [swot, reflexoes, user, existentes] = await Promise.all([
    questionarioService.obterSwotCompleto(userId),
    prisma.reflexaoTraco.findMany({ where: { userId, enviado: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.diarioPagina.findMany({ where: { userId } }),
  ]);

  if (!user) throw new NotFoundError('Usuário não encontrado');

  const definicoes = montarDefinicoesPaginas(swot);
  const chavesValidas = new Set(definicoes.map((d) => d.chave));
  const existentesMap = new Map(existentes.map((p) => [p.chave, p]));

  const enviados = new Set(
    reflexoes.map((r) => `${r.tipo}-${r.numeroTraco}-${r.quadrante}`),
  );

  const totaisPorQuadrante: Record<QuadranteKey, number> = {
    ameaca: swot.ameacas.length,
    fraqueza: swot.fraquezas.length,
    oportunidade: swot.oportunidades.length,
    forca: swot.forcas.length,
  };

  const concluidosPorQuadrante: Partial<Record<QuadranteKey, number>> = {};
  for (const q of QUADRANTES_ORDEM) {
    concluidosPorQuadrante[q] = reflexoes.filter((r) => r.quadrante === q).length;
  }

  return {
    definicoes,
    chavesValidas,
    existentesMap,
    existentes,
    enviados,
    totaisPorQuadrante,
    concluidosPorQuadrante,
  };
}

function definicaoDivergeDeExistente(def: DefinicaoPagina, existente: PaginaExistente): boolean {
  return (
    existente.tipo !== def.tipo
    || existente.quadrante !== def.quadrante
    || existente.tipoTraco !== def.tipoTraco
    || existente.numeroTraco !== def.numeroTraco
    || existente.tituloTraco !== def.tituloTraco
    || existente.ordem !== def.ordem
  );
}

function syncNecessario(ctx: SyncContext): boolean {
  for (const def of ctx.definicoes) {
    const existente = ctx.existentesMap.get(def.chave);
    if (!existente || existente.arquivada) return true;
    if (definicaoDivergeDeExistente(def, existente)) return true;

    const desbloqueioCalculado = calcularDesbloqueio(
      def,
      ctx.enviados,
      ctx.concluidosPorQuadrante,
      ctx.totaisPorQuadrante,
    );
    const desbloqueada = resolverDesbloqueada(desbloqueioCalculado, existente);
    if (existente.desbloqueada !== desbloqueada) return true;
  }

  return ctx.existentes.some((p) => !p.arquivada && !ctx.chavesValidas.has(p.chave));
}

export async function sincronizarPaginasJornada(userId: string, options?: { force?: boolean }) {
  const ctx = await carregarContextoSync(userId);
  if (!options?.force && !syncNecessario(ctx)) return;

  await prisma.$transaction(async (tx) => {
    for (const def of ctx.definicoes) {
      const existente = ctx.existentesMap.get(def.chave);
      const desbloqueioCalculado = calcularDesbloqueio(
        def,
        ctx.enviados,
        ctx.concluidosPorQuadrante,
        ctx.totaisPorQuadrante,
      );
      const desbloqueada = resolverDesbloqueada(desbloqueioCalculado, existente);

      await tx.diarioPagina.upsert({
        where: { userId_chave: { userId, chave: def.chave } },
        create: {
          userId,
          chave: def.chave,
          tipo: def.tipo,
          quadrante: def.quadrante,
          tipoTraco: def.tipoTraco,
          numeroTraco: def.numeroTraco,
          tituloTraco: def.tituloTraco,
          ordem: def.ordem,
          desbloqueada,
          arquivada: false,
        },
        update: {
          tipo: def.tipo,
          quadrante: def.quadrante,
          tipoTraco: def.tipoTraco,
          numeroTraco: def.numeroTraco,
          tituloTraco: def.tituloTraco,
          ordem: def.ordem,
          desbloqueada,
          arquivada: false,
        },
      });
    }

    const obsoletas = ctx.existentes.filter((p) => !ctx.chavesValidas.has(p.chave) && !p.arquivada);
    if (obsoletas.length) {
      await tx.diarioPagina.updateMany({
        where: { id: { in: obsoletas.map((p) => p.id) } },
        data: { arquivada: true, desbloqueada: true },
      });
    }
  });
}

const filtroPaginasVisiveis = {
  OR: [
    {
      arquivada: false,
      OR: [
        { desbloqueada: true },
        { concluida: true },
        { texto: { not: '' } },
      ],
    },
    {
      arquivada: true,
      OR: [
        { concluida: true },
        { texto: { not: '' } },
      ],
    },
  ],
};

export async function listarPaginasJornada(userId: string) {
  await sincronizarPaginasJornada(userId);
  const paginas = await prisma.diarioPagina.findMany({
    where: { userId, ...filtroPaginasVisiveis },
    orderBy: { ordem: 'asc' },
  });
  return paginas.map(serializarPagina);
}

export async function obterPaginaJornada(userId: string, chave: string) {
  await sincronizarPaginasJornada(userId);
  const pagina = await prisma.diarioPagina.findUnique({
    where: { userId_chave: { userId, chave } },
  });
  if (!pagina || (pagina.arquivada && !paginaTemConteudo(pagina))) {
    throw new NotFoundError('Página do diário não encontrada');
  }
  return serializarPagina(pagina);
}

export async function salvarPaginaJornada(
  userId: string,
  chave: string,
  texto: string,
  finalizar = false,
) {
  let pagina = await prisma.diarioPagina.findUnique({
    where: { userId_chave: { userId, chave } },
  });

  if (!pagina || (pagina.arquivada && !paginaTemConteudo(pagina))) {
    await sincronizarPaginasJornada(userId, { force: true });
    pagina = await prisma.diarioPagina.findUnique({
      where: { userId_chave: { userId, chave } },
    });
  }

  if (!pagina || (pagina.arquivada && !paginaTemConteudo(pagina))) {
    throw new NotFoundError('Página do diário não encontrada');
  }

  if (!paginaEditavel(pagina)) {
    throw new ForbiddenError('Esta página do diário ainda não está disponível.');
  }

  const palavras = contarPalavras(texto);
  if (finalizar && palavras < MIN_PALAVRAS_JORNADA) {
    throw new ValidationError('Texto insuficiente', [
      {
        field: 'texto',
        message: `Escreva no mínimo ${MIN_PALAVRAS_JORNADA} palavras (atual: ${palavras}).`,
      },
    ]);
  }

  const concluida = finalizar || pagina.concluida
    ? palavras >= MIN_PALAVRAS_JORNADA
    : false;

  const atualizada = await prisma.diarioPagina.update({
    where: { id: pagina.id },
    data: { texto, concluida },
  });

  return serializarPagina(atualizada);
}

export async function listarPaginasJornadaAdmin(userId: string) {
  await sincronizarPaginasJornada(userId);
  const paginas = await prisma.diarioPagina.findMany({
    where: { userId },
    orderBy: { ordem: 'asc' },
  });
  return paginas.map(serializarPagina);
}

export function chaveDiarioAposEnvioTraco(
  tipo: string,
  numeroTraco: number,
  quadrante: string,
): string {
  return chaveMicroTraco(quadrante, tipo, numeroTraco);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function formatRotuloQuinzena(numero: number, inicio: Date, fim: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
  return `Quinzena ${numero} (${fmt(inicio)} – ${fmt(fim)})`;
}

async function obterDataBaseQuinzenas(userId: string): Promise<Date> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });
  if (!user) throw new NotFoundError('Usuário não encontrado');
  return user.createdAt;
}

export async function garantirQuinzenasIniciais(userId: string) {
  const count = await prisma.diarioAutoadvocaciaQuinzena.count({ where: { userId } });
  if (count >= QUINZENAS_INICIAIS) return;

  const base = await obterDataBaseQuinzenas(userId);
  const inicioBase = new Date(Date.UTC(
    base.getUTCFullYear(),
    base.getUTCMonth(),
    base.getUTCDate(),
  ));

  for (let i = 0; i < QUINZENAS_INICIAIS; i++) {
    const inicio = addDays(inicioBase, i * DIAS_POR_QUINZENA);
    const fim = addDays(inicio, DIAS_POR_QUINZENA - 1);
    await prisma.diarioAutoadvocaciaQuinzena.upsert({
      where: { userId_numero: { userId, numero: i + 1 } },
      create: {
        userId,
        numero: i + 1,
        rotulo: formatRotuloQuinzena(i + 1, inicio, fim),
        inicio,
        fim,
      },
      update: {},
    });
  }
}

function serializarQuinzena(q: {
  id: string;
  numero: number;
  rotulo: string | null;
  inicio: Date;
  fim: Date;
  resposta1: string;
  resposta2: string;
  concluida: boolean;
  updatedAt: Date;
}) {
  return {
    id: q.id,
    numero: q.numero,
    rotulo: q.rotulo ?? `Quinzena ${q.numero}`,
    inicio: q.inicio,
    fim: q.fim,
    resposta1: q.resposta1,
    resposta2: q.resposta2,
    concluida: q.concluida,
    minPalavras: MIN_PALAVRAS_AUTOADVOCACIA,
    updatedAt: q.updatedAt,
  };
}

export async function listarQuinzenasAutoadvocacia(userId: string) {
  await garantirQuinzenasIniciais(userId);
  const quinzenas = await prisma.diarioAutoadvocaciaQuinzena.findMany({
    where: { userId },
    orderBy: { numero: 'asc' },
  });
  return quinzenas.map(serializarQuinzena);
}

export async function criarQuinzenaAutoadvocacia(userId: string) {
  await garantirQuinzenasIniciais(userId);

  const ultima = await prisma.diarioAutoadvocaciaQuinzena.findFirst({
    where: { userId },
    orderBy: { numero: 'desc' },
  });

  const numero = (ultima?.numero ?? 0) + 1;
  const inicio = ultima ? addDays(ultima.fim, 1) : await obterDataBaseQuinzenas(userId);
  const fim = addDays(inicio, DIAS_POR_QUINZENA - 1);

  const criada = await prisma.diarioAutoadvocaciaQuinzena.create({
    data: {
      userId,
      numero,
      rotulo: formatRotuloQuinzena(numero, inicio, fim),
      inicio,
      fim,
    },
  });

  return serializarQuinzena(criada);
}

export async function salvarQuinzenaAutoadvocacia(
  userId: string,
  numero: number,
  resposta1: string,
  resposta2: string,
  finalizar = false,
) {
  await garantirQuinzenasIniciais(userId);

  const quinzena = await prisma.diarioAutoadvocaciaQuinzena.findUnique({
    where: { userId_numero: { userId, numero } },
  });

  if (!quinzena) throw new NotFoundError('Quinzena não encontrada');

  const p1 = contarPalavras(resposta1);
  const p2 = contarPalavras(resposta2);

  if (finalizar) {
    if (p1 < MIN_PALAVRAS_AUTOADVOCACIA || p2 < MIN_PALAVRAS_AUTOADVOCACIA) {
      throw new ValidationError('Respostas insuficientes', [
        {
          field: 'respostas',
          message: `Cada resposta deve ter no mínimo ${MIN_PALAVRAS_AUTOADVOCACIA} palavras.`,
        },
      ]);
    }
  }

  const concluida = finalizar || quinzena.concluida
    ? p1 >= MIN_PALAVRAS_AUTOADVOCACIA && p2 >= MIN_PALAVRAS_AUTOADVOCACIA
    : false;

  const atualizada = await prisma.diarioAutoadvocaciaQuinzena.update({
    where: { id: quinzena.id },
    data: { resposta1, resposta2, concluida },
  });

  return serializarQuinzena(atualizada);
}

export async function listarQuinzenasAutoadvocaciaAdmin(userId: string) {
  await garantirQuinzenasIniciais(userId);
  const quinzenas = await prisma.diarioAutoadvocaciaQuinzena.findMany({
    where: { userId },
    orderBy: { numero: 'asc' },
  });
  return quinzenas.map(serializarQuinzena);
}
