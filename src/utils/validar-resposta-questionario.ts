import { prisma } from '../config/database.js';
import { ValidationError } from './errors.js';

type RespostaInput = {
  perguntaId?: string;
  tipo: string;
  numeroTraco: number;
  resposta?: string | null;
  frequencia?: number | null;
  intensidade?: number | null;
};

function erroValidacao(message: string, field: string): never {
  throw new ValidationError('Dados inválidos', [{ field, message }]);
}

async function verificarPerguntaId(data: RespostaInput): Promise<void> {
  const { perguntaId, tipo, numeroTraco } = data;
  if (!perguntaId) return;

  let registro: { numeroTraco: number } | null = null;

  switch (tipo) {
    case 'SH':
      registro = await prisma.fraquezasAmeacasSh.findUnique({ where: { id: perguntaId } });
      break;
    case 'CH':
      registro = await prisma.fraquezasAmeacasCh.findUnique({ where: { id: perguntaId } });
      break;
    case 'FO':
      registro = await prisma.fraquezasOportunidades.findUnique({ where: { id: perguntaId } });
      break;
    case 'F':
      registro = await prisma.forcas.findUnique({ where: { id: perguntaId } });
      break;
    default:
      erroValidacao('Tipo de pergunta inválido', 'tipo');
  }

  if (!registro || registro.numeroTraco !== numeroTraco) {
    erroValidacao('Pergunta inválida para o tipo e traço informados', 'perguntaId');
  }
}

async function chExigeIntensidade(numeroTraco: number): Promise<boolean> {
  const ch = await prisma.fraquezasAmeacasCh.findFirst({ where: { numeroTraco } });
  if (!ch) return false;

  const historia = await prisma.historiasSociais.findFirst({
    where: { numeroHistoria: ch.numHistoria },
  });

  if (!historia) return false;

  return !!(
    historia.perguntaIntensidade?.trim() ||
    historia.intensidadeLeve?.trim() ||
    historia.intensidadeModerada?.trim() ||
    historia.intensidadeAlta?.trim()
  );
}

/** Valida regras de negócio de uma resposta do questionário (rascunhos parciais são permitidos). */
export async function validarRespostaQuestionario(data: RespostaInput): Promise<void> {
  await verificarPerguntaId(data);

  if (!data.resposta) return;
  if (data.resposta === 'nao') return;

  if (!data.frequencia) {
    erroValidacao('Frequência é obrigatória quando a resposta é sim', 'frequencia');
  }

  if (data.tipo === 'SH' && !data.intensidade) {
    erroValidacao('Intensidade é obrigatória quando a resposta é sim', 'intensidade');
  }

  if (data.tipo === 'CH' && !data.intensidade) {
    const exige = await chExigeIntensidade(data.numeroTraco);
    if (exige) {
      erroValidacao('Intensidade é obrigatória quando a resposta é sim', 'intensidade');
    }
  }
}
