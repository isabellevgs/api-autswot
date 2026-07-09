import type { QuadranteKey } from './swot-quadrantes.js';

export interface QuestaoReflexao {
  id: string;
  min: number;
}

export const QUESTOES_AMEACA_FRAQUEZA: QuestaoReflexao[] = [
  { id: 'q1', min: 40 },
  { id: 'q2', min: 40 },
  { id: 'q3', min: 50 },
  { id: 'q4', min: 45 },
  { id: 'q5', min: 50 },
  { id: 'q6', min: 1 },
  { id: 'q7', min: 1 },
];

export const QUESTOES_OPORTUNIDADE: QuestaoReflexao[] = [
  { id: 'q1', min: 40 },
  { id: 'q2', min: 40 },
  { id: 'q3', min: 45 },
  { id: 'q4', min: 45 },
  { id: 'q5', min: 50 },
  { id: 'q6', min: 35 },
  { id: 'q7', min: 1 },
  { id: 'q8', min: 1 },
];

export const QUESTOES_POR_QUADRANTE: Record<QuadranteKey, QuestaoReflexao[]> = {
  ameaca: QUESTOES_AMEACA_FRAQUEZA,
  fraqueza: QUESTOES_AMEACA_FRAQUEZA,
  oportunidade: QUESTOES_OPORTUNIDADE,
  forca: [],
};

export const MAX_PALAVRAS_RESPOSTA = 10000;

export function contarPalavras(texto: string): number {
  return String(texto ?? '').trim().split(/\s+/).filter(Boolean).length;
}

export function quadranteTemExercicios(quadrante: QuadranteKey): boolean {
  return (QUESTOES_POR_QUADRANTE[quadrante]?.length ?? 0) > 0;
}
