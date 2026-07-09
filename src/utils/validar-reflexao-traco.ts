import { ValidationError } from './errors.js';
import type { QuadranteKey } from '../constants/swot-quadrantes.js';
import {
  QUESTOES_POR_QUADRANTE,
  contarPalavras,
  quadranteTemExercicios,
  MAX_PALAVRAS_RESPOSTA,
} from '../constants/reflexao-questoes.js';
import type { UpsertReflexaoInput } from '../modules/reflexao-traco/reflexao-traco.schemas.js';
import { QuestionarioRespostaService } from '../modules/questionario-resposta/questionario-resposta.service.js';

const questionarioService = new QuestionarioRespostaService();

export async function validarReflexaoTraco(userId: string, data: UpsertReflexaoInput): Promise<void> {
  const { tipo, numeroTraco, quadrante, respostas, enviado } = data;
  const details: Array<{ field: string; message: string }> = [];

  for (const [key, valor] of Object.entries(respostas)) {
    if (valor && valor.length > MAX_PALAVRAS_RESPOSTA) {
      details.push({
        field: key,
        message: `Resposta muito longa (máximo ${MAX_PALAVRAS_RESPOSTA} caracteres)`,
      });
    }
  }

  if (details.length) {
    throw new ValidationError('Dados inválidos', details);
  }

  const swot = await questionarioService.obterSwotCompleto(userId);
  const buckets: Record<QuadranteKey, Array<{ tipo: string; numeroTraco: number }>> = {
    ameaca: swot.ameacas,
    fraqueza: swot.fraquezas,
    oportunidade: swot.oportunidades,
    forca: swot.forcas,
  };

  const noQuadranteSolicitado = (buckets[quadrante] ?? []).some(
    (r) => r.tipo === tipo && r.numeroTraco === numeroTraco,
  );

  if (!noQuadranteSolicitado) {
    throw new ValidationError('Dados inválidos', [
      {
        field: 'quadrante',
        message: 'Este traço não pertence ao quadrante informado no seu SWOT',
      },
    ]);
  }

  if (!enviado) return;

  const questoes = QUESTOES_POR_QUADRANTE[quadrante] ?? [];
  if (!quadranteTemExercicios(quadrante)) return;

  for (const { id, min } of questoes) {
    const palavras = contarPalavras(respostas[id] ?? '');
    if (palavras < min) {
      details.push({
        field: id,
        message: `Mínimo de ${min} palavras (atual: ${palavras})`,
      });
    }
  }

  if (details.length) {
    throw new ValidationError('Respostas incompletas para envio', details);
  }
}
