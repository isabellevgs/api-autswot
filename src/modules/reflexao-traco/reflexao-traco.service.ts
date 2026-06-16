import { prisma } from '../../config/database.js';
import type { UpsertReflexaoInput } from './reflexao-traco.schemas.js';
import {
  QUADRANTES_ORDEM,
  quadranteEstaDesbloqueado,
  tracosNecessariosParaDesbloquearProximo,
  type QuadranteKey,
} from '../../constants/swot-quadrantes.js';
import { QuestionarioRespostaService } from '../questionario-resposta/questionario-resposta.service.js';

const questionarioService = new QuestionarioRespostaService();

export async function obterReflexao(userId: string, tipo: string, numeroTraco: number, quadrante: string) {
  return prisma.reflexaoTraco.findUnique({
    where: { userId_tipo_numeroTraco_quadrante: { userId, tipo, numeroTraco, quadrante } },
  });
}

export async function listarReflexoesDoUsuario(userId: string) {
  return prisma.reflexaoTraco.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
}

export async function salvarReflexao(userId: string, data: UpsertReflexaoInput) {
  const { tipo, numeroTraco, quadrante, respostas, enviado } = data;
  return prisma.reflexaoTraco.upsert({
    where: { userId_tipo_numeroTraco_quadrante: { userId, tipo, numeroTraco, quadrante } },
    update: { respostas, enviado },
    create: { userId, tipo, numeroTraco, quadrante, respostas, enviado },
  });
}

export async function listarReflexoesParaAdmin(userId: string) {
  const reflexoes = await prisma.reflexaoTraco.findMany({
    where: { userId },
    orderBy: [{ quadrante: 'asc' }, { tipo: 'asc' }, { numeroTraco: 'asc' }],
  });

  if (!reflexoes.length) return [];

  // Busca os títulos dos traços em lote
  const pares = [...new Map(reflexoes.map(r => [`${r.tipo}-${r.numeroTraco}`, { tipo: r.tipo, numeroTraco: r.numeroTraco }])).values()];
  const detalhes = await prisma.tracoDetalhe.findMany({
    where: { OR: pares },
    select: { tipo: true, numeroTraco: true, titulo: true },
  });

  const mapaDetalhes = new Map(detalhes.map(d => [`${d.tipo}-${d.numeroTraco}`, d.titulo]));

  return reflexoes.map(r => ({
    ...r,
    titulo: mapaDetalhes.get(`${r.tipo}-${r.numeroTraco}`) ?? null,
  }));
}

export async function obterProgressoQuadrantes(userId: string) {
  const [contagens, swot] = await Promise.all([
    prisma.reflexaoTraco.groupBy({
      by: ['quadrante'],
      where: { userId, enviado: true },
      _count: { id: true },
    }),
    questionarioService.obterSwotCompleto(userId),
  ]);

  const concluidos: Partial<Record<QuadranteKey, number>> = {};
  for (const c of contagens) {
    concluidos[c.quadrante as QuadranteKey] = c._count.id;
  }

  const totalTracos: Record<QuadranteKey, number> = {
    ameaca: swot.ameacas.length,
    fraqueza: swot.fraquezas.length,
    oportunidade: swot.oportunidades.length,
    forca: swot.forcas.length,
  };

  const progresso: Record<string, {
    concluidos: number;
    necessarios: number;
    totalTracos: number;
    desbloqueado: boolean;
  }> = {};

  for (const quadrante of QUADRANTES_ORDEM) {
    const total = totalTracos[quadrante];
    progresso[quadrante] = {
      concluidos: concluidos[quadrante] ?? 0,
      necessarios: tracosNecessariosParaDesbloquearProximo(quadrante, total),
      totalTracos: total,
      desbloqueado: quadranteEstaDesbloqueado(quadrante, concluidos, totalTracos),
    };
  }

  return progresso;
}
