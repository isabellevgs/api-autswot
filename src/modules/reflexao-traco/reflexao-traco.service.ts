import { prisma } from '../../config/database.js';
import type { UpsertReflexaoInput } from './reflexao-traco.schemas.js';
import {
  QUADRANTES_ORDEM,
  TRACOS_PARA_DESBLOQUEAR_PROXIMO,
  quadranteEstaDesbloqueado,
  type QuadranteKey,
} from '../../constants/swot-quadrantes.js';

export async function obterReflexao(userId: string, tipo: string, numeroTraco: number, quadrante: string) {
  return prisma.reflexaoTraco.findUnique({
    where: { userId_tipo_numeroTraco_quadrante: { userId, tipo, numeroTraco, quadrante } },
  });
}

export async function listarReflexoesDoUsuario(userId: string) {
  return prisma.reflexaoTraco.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
}

export async function salvarReflexao(userId: string, data: UpsertReflexaoInput) {
  const { tipo, numeroTraco, quadrante, respostas } = data;
  return prisma.reflexaoTraco.upsert({
    where: { userId_tipo_numeroTraco_quadrante: { userId, tipo, numeroTraco, quadrante } },
    update: { respostas },
    create: { userId, tipo, numeroTraco, quadrante, respostas },
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
  const contagens = await prisma.reflexaoTraco.groupBy({
    by: ['quadrante'],
    where: { userId },
    _count: { id: true },
  });

  const mapa: Partial<Record<QuadranteKey, number>> = {};
  for (const c of contagens) {
    mapa[c.quadrante as QuadranteKey] = c._count.id;
  }

  const progresso: Record<string, { concluidos: number; necessarios: number; desbloqueado: boolean }> = {};

  for (const quadrante of QUADRANTES_ORDEM) {
    progresso[quadrante] = {
      concluidos: mapa[quadrante] ?? 0,
      /** Traços neste quadrante necessários para desbloquear o próximo. */
      necessarios: TRACOS_PARA_DESBLOQUEAR_PROXIMO[quadrante],
      desbloqueado: quadranteEstaDesbloqueado(quadrante, mapa),
    };
  }

  return progresso;
}
