import { z } from 'zod';
import { paginationQueryFields } from '../../utils/pagination.js';

export const createFraquezasAmeacasShSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  pergunta: z.string().min(1, 'Pergunta é obrigatória'),
  explicacao: z.string().optional().default(''),
  swot: z.string().optional().default(''),
  frequencia: z.number().min(0, 'Frequência deve ser um número não negativo').optional().default(0),
  intensidade: z.number().min(0, 'Intensidade deve ser um número não negativo').optional().default(0),
});

export const updateFraquezasAmeacasShSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo').optional(),
  pergunta: z.string().min(1, 'Pergunta é obrigatória').optional(),
  explicacao: z.string().optional(),
  swot: z.string().optional(),
  frequencia: z.number().int().min(0, 'Frequência deve ser um número não negativo').optional(),
  intensidade: z.number().int().min(0, 'Intensidade deve ser um número não negativo').optional(),
});

export const getFraquezasAmeacasShParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listFraquezasAmeacasShQuerySchema = z.object({
  ...paginationQueryFields,
  numeroTraco: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return undefined;
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    return Number.isFinite(n) ? n : undefined;
  }),
});

export type CreateFraquezasAmeacasShInput = z.infer<typeof createFraquezasAmeacasShSchema>;
export type UpdateFraquezasAmeacasShInput = z.infer<typeof updateFraquezasAmeacasShSchema>;
export type GetFraquezasAmeacasShParams = z.infer<typeof getFraquezasAmeacasShParamsSchema>;
export type ListFraquezasAmeacasShQuery = z.infer<typeof listFraquezasAmeacasShQuerySchema>;

export const updateFraquezasAmeacasShParamsSchema = getFraquezasAmeacasShParamsSchema;
export type UpdateFraquezasAmeacasShParams = GetFraquezasAmeacasShParams;
export type DeleteFraquezasAmeacasShParams = GetFraquezasAmeacasShParams;

