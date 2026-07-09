import { z } from 'zod';
import { paginationQueryFields } from '../../utils/pagination.js';

export const createFraquezasAmeacasChSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  numHistoria: z.number().int().positive('Número da história deve ser positivo'),
  frequencia: z.number().min(0, 'Frequência deve ser um número não negativo'),
  intensidade: z.number().min(0, 'Intensidade deve ser um número não negativo'),
  swot: z.string().optional().default(''),
});

export const updateFraquezasAmeacasChSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo').optional(),
  numHistoria: z.number().int().positive('Número da história deve ser positivo').optional(),
  frequencia: z.number().min(0, 'Frequência deve ser um número não negativo').optional(),
  intensidade: z.number().min(0, 'Intensidade deve ser um número não negativo').optional(),
  swot: z.string().optional(),
});

export const getFraquezasAmeacasChParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listFraquezasAmeacasChQuerySchema = z.object({
  ...paginationQueryFields,
  numeroTraco: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return undefined;
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    return Number.isFinite(n) ? n : undefined;
  }),
});

export type CreateFraquezasAmeacasChInput = z.infer<typeof createFraquezasAmeacasChSchema>;
export type UpdateFraquezasAmeacasChInput = z.infer<typeof updateFraquezasAmeacasChSchema>;
export type GetFraquezasAmeacasChParams = z.infer<typeof getFraquezasAmeacasChParamsSchema>;
export type ListFraquezasAmeacasChQuery = z.infer<typeof listFraquezasAmeacasChQuerySchema>;

