import { z } from 'zod';
import { validarRespostaQuestionario } from '../../utils/validar-resposta-questionario.js';

export const salvarRespostaSchema = z
  .object({
    perguntaId: z.string().uuid('ID da pergunta inválido'),
    tipo: z.enum(['SH', 'CH', 'FO', 'F']),
    numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
    resposta: z.enum(['sim', 'nao']).nullable().optional(),
    frequencia: z.number().int().min(1).max(5).nullable().optional(),
    intensidade: z.number().int().min(1).max(3).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.resposta) return;
    if (data.resposta === 'nao') return;

    if (!data.frequencia) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Frequência é obrigatória quando a resposta é sim',
        path: ['frequencia'],
      });
    }

    if (data.tipo === 'SH' && !data.intensidade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Intensidade é obrigatória quando a resposta é sim',
        path: ['intensidade'],
      });
    }
  });

export const salvarRespostasSchema = z.object({
  respostas: z.array(salvarRespostaSchema).min(1, 'Deve ter pelo menos uma resposta').max(200, 'Máximo de 200 respostas por lote'),
});

export const getRespostaParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listRespostasQuerySchema = z.object({
  tipo: z.enum(['SH', 'CH', 'FO', 'F']).optional(),
});

export const listRespostasByUserIdParamsSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
});

export const listRespostasByUserIdQuerySchema = z.object({
  tipo: z.enum(['SH', 'CH', 'FO', 'F']).optional(),
});

export type SalvarRespostaInput = z.infer<typeof salvarRespostaSchema>;
export type SalvarRespostasInput = z.infer<typeof salvarRespostasSchema>;
export type GetRespostaParams = z.infer<typeof getRespostaParamsSchema>;
export type ListRespostasQuery = z.infer<typeof listRespostasQuerySchema>;
export type ListRespostasByUserIdParams = z.infer<typeof listRespostasByUserIdParamsSchema>;
export type ListRespostasByUserIdQuery = z.infer<typeof listRespostasByUserIdQuerySchema>;

/** Validação estrutural (Zod) + regras de negócio assíncronas (inclui CH intensidade). */
export async function parseSalvarRespostaInput(body: unknown): Promise<SalvarRespostaInput> {
  const data = salvarRespostaSchema.parse(body);
  await validarRespostaQuestionario(data);
  return data;
}

export async function parseSalvarRespostasInput(body: unknown): Promise<SalvarRespostasInput> {
  const data = salvarRespostasSchema.parse(body);
  for (const resposta of data.respostas) {
    await validarRespostaQuestionario(resposta);
  }
  return data;
}
