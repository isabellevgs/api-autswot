import { z } from 'zod';

export const createQuestionSchema = z.object({
  texto: z.string().min(1, 'Texto da pergunta é obrigatório'),
  ordem: z.number().int().positive().optional(),
});

export const updateQuestionSchema = z.object({
  texto: z.string().min(1, 'Texto da pergunta é obrigatório').optional(),
  ordem: z.number().int().positive().optional(),
  ativo: z.boolean().optional(),
});

export const getQuestionParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const getQuestionsByUserParamsSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
});

export const reorderQuestionsSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string().uuid(),
      ordem: z.number().int().positive(),
    })
  ).min(1, 'É necessário pelo menos uma pergunta'),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type GetQuestionParams = z.infer<typeof getQuestionParamsSchema>;
export type GetQuestionsByUserParams = z.infer<typeof getQuestionsByUserParamsSchema>;
export type ReorderQuestionsInput = z.infer<typeof reorderQuestionsSchema>;

