import { prisma } from '../../config/database.js';
import type { UpsertReflexaoInput } from './reflexao-traco.schemas.js';

// Quantidade de reflexões necessárias para desbloquear cada quadrante
const THRESHOLDS = { ameaca: 5, fraqueza: 3, oportunidade: 2 } as const;

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

  const mapa: Record<string, number> = {};
  for (const c of contagens) {
    mapa[c.quadrante] = c._count.id;
  }

  const ameaca       = mapa['ameaca']       ?? 0;
  const fraqueza     = mapa['fraqueza']     ?? 0;
  const oportunidade = mapa['oportunidade'] ?? 0;
  const forca        = mapa['forca']        ?? 0;

  return {
    ameaca:       { concluidos: ameaca,       necessarios: THRESHOLDS.ameaca,       desbloqueado: true },
    fraqueza:     { concluidos: fraqueza,     necessarios: THRESHOLDS.fraqueza,     desbloqueado: ameaca       >= THRESHOLDS.ameaca },
    oportunidade: { concluidos: oportunidade, necessarios: THRESHOLDS.oportunidade, desbloqueado: fraqueza     >= THRESHOLDS.fraqueza },
    forca:        { concluidos: forca,        necessarios: 0,                       desbloqueado: oportunidade >= THRESHOLDS.oportunidade },
  };
}
