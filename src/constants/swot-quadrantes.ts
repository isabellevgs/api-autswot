/**
 * Regras dos quadrantes SWOT (desbloqueio).
 * Espelhado em app-autswot/src/constants/swotQuadrantes.js
 */

/** true = desbloqueio sequencial obrigatório (ameaças → fraquezas → oportunidades → forças). */
export const DESBLOQUEIO_SEQUENCIAL_ATIVO = true;

export const QUADRANTES_ORDEM = ['ameaca', 'fraqueza', 'oportunidade', 'forca'] as const;

export type QuadranteKey = (typeof QUADRANTES_ORDEM)[number];

/** Traços respondidos no quadrante anterior necessários para desbloquear este. */
export const TRACOS_PARA_DESBLOQUEAR: Record<QuadranteKey, number> = {
  ameaca: 0,
  fraqueza: 5,
  oportunidade: 3,
  forca: 2,
};

export const QUADRANTE_ANTERIOR: Record<QuadranteKey, QuadranteKey | null> = {
  ameaca: null,
  fraqueza: 'ameaca',
  oportunidade: 'fraqueza',
  forca: 'oportunidade',
};

/** Traços respondidos neste quadrante para desbloquear o próximo. */
export const TRACOS_PARA_DESBLOQUEAR_PROXIMO: Record<QuadranteKey, number> = {
  ameaca: TRACOS_PARA_DESBLOQUEAR.fraqueza,
  fraqueza: TRACOS_PARA_DESBLOQUEAR.oportunidade,
  oportunidade: TRACOS_PARA_DESBLOQUEAR.forca,
  forca: 0,
};

/** Exige no máximo o configurado ou o total de traços existentes no quadrante anterior. */
export function tracosNecessariosParaDesbloquear(
  quadrante: QuadranteKey,
  totalTracosQuadranteAnterior = 0,
): number {
  const configurado = TRACOS_PARA_DESBLOQUEAR[quadrante];
  if (!QUADRANTE_ANTERIOR[quadrante]) return 0;
  if (totalTracosQuadranteAnterior <= 0) return 0;
  return Math.min(configurado, totalTracosQuadranteAnterior);
}

export function tracosNecessariosParaDesbloquearProximo(
  quadrante: QuadranteKey,
  totalTracosQuadrante = 0,
): number {
  const configurado = TRACOS_PARA_DESBLOQUEAR_PROXIMO[quadrante];
  if (configurado === 0) return 0;
  if (totalTracosQuadrante <= 0) return 0;
  return Math.min(configurado, totalTracosQuadrante);
}

export function quadranteEstaDesbloqueado(
  quadrante: QuadranteKey,
  concluidosPorQuadrante: Partial<Record<QuadranteKey, number>>,
  totalTracosPorQuadrante: Partial<Record<QuadranteKey, number>> = {},
): boolean {
  if (!DESBLOQUEIO_SEQUENCIAL_ATIVO) return true;
  const anterior = QUADRANTE_ANTERIOR[quadrante];
  if (!anterior) return true;
  const totalAnterior = totalTracosPorQuadrante[anterior] ?? 0;
  const necessarios = tracosNecessariosParaDesbloquear(quadrante, totalAnterior);
  if (necessarios === 0) return true;
  return (concluidosPorQuadrante[anterior] ?? 0) >= necessarios;
}

export function tracosFaltandoParaDesbloquear(
  quadrante: QuadranteKey,
  concluidosPorQuadrante: Partial<Record<QuadranteKey, number>>,
  totalTracosPorQuadrante: Partial<Record<QuadranteKey, number>> = {},
): number {
  const anterior = QUADRANTE_ANTERIOR[quadrante];
  if (!anterior) return 0;
  const totalAnterior = totalTracosPorQuadrante[anterior] ?? 0;
  const necessarios = tracosNecessariosParaDesbloquear(quadrante, totalAnterior);
  if (necessarios === 0) return 0;
  return Math.max(0, necessarios - (concluidosPorQuadrante[anterior] ?? 0));
}
