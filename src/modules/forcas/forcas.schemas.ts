import { z } from 'zod';

export const createForcasSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  pergunta: z.string().min(1, 'Pergunta é obrigatória'),
  exemplo: z.string().min(1, 'Exemplo é obrigatório'),
});

export const updateForcasSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo').optional(),
  pergunta: z.string().min(1, 'Pergunta é obrigatória').optional(),
  exemplo: z.string().min(1, 'Exemplo é obrigatório').optional(),
});

export const getForcasParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listForcasQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return 1;
    return typeof val === 'string' ? parseInt(val, 10) : val;
  }),
  limit: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return 10;
    return typeof val === 'string' ? parseInt(val, 10) : val;
  }),
  numeroTraco: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return undefined;
    return typeof val === 'string' ? parseInt(val, 10) : val;
  }),
});

export type CreateForcasInput = z.infer<typeof createForcasSchema>;
export type UpdateForcasInput = z.infer<typeof updateForcasSchema>;
export type GetForcasParams = z.infer<typeof getForcasParamsSchema>;
export type ListForcasQuery = z.infer<typeof listForcasQuerySchema>;

