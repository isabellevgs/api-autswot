import { z } from 'zod';

export const createFraquezasOportunidadesSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  pergunta: z.string().min(1, 'Pergunta é obrigatória'),
  explicacao: z.string().min(1, 'Explicação é obrigatória'),
});

export const updateFraquezasOportunidadesSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo').optional(),
  pergunta: z.string().min(1, 'Pergunta é obrigatória').optional(),
  explicacao: z.string().min(1, 'Explicação é obrigatória').optional(),
});

export const getFraquezasOportunidadesParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listFraquezasOportunidadesQuerySchema = z.object({
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

export type CreateFraquezasOportunidadesInput = z.infer<typeof createFraquezasOportunidadesSchema>;
export type UpdateFraquezasOportunidadesInput = z.infer<typeof updateFraquezasOportunidadesSchema>;
export type GetFraquezasOportunidadesParams = z.infer<typeof getFraquezasOportunidadesParamsSchema>;
export type ListFraquezasOportunidadesQuery = z.infer<typeof listFraquezasOportunidadesQuerySchema>;

