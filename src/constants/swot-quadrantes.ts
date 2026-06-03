/**
 * Regras dos quadrantes SWOT (desbloqueio).
 * Espelhado em app-autswot/src/constants/swotQuadrantes.js
 */

/** Temporário: false = todos os quadrantes abertos. Reativar após ajustes. */
export const DESBLOQUEIO_SEQUENCIAL_ATIVO = false;

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

export function quadranteEstaDesbloqueado(
  quadrante: QuadranteKey,
  concluidosPorQuadrante: Partial<Record<QuadranteKey, number>>,
): boolean {
  if (!DESBLOQUEIO_SEQUENCIAL_ATIVO) return true;
  const anterior = QUADRANTE_ANTERIOR[quadrante];
  if (!anterior) return true;
  return (concluidosPorQuadrante[anterior] ?? 0) >= TRACOS_PARA_DESBLOQUEAR[quadrante];
}
