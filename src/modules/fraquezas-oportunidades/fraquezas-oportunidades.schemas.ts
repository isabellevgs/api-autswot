import { z } from 'zod';
import { paginationQueryFields } from '../../utils/pagination.js';

export const createFraquezasOportunidadesSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  pergunta: z.string().min(1, 'Pergunta é obrigatória'),
  explicacao: z.string().optional().default(''),
  swot: z.string().optional().default(''),
  tracoNeutro: z.array(z.string()).optional(),
  tracoOportunidade: z.array(z.string()).optional(),
  tracoFraqueza: z.array(z.string()).optional(),
});

export const updateFraquezasOportunidadesSchema = z.object({
  numeroTraco:       z.number().int().positive().optional(),
  pergunta:          z.string().min(1).optional(),
  explicacao:        z.string().optional(),
  swot:              z.string().optional(),
  tracoNeutro:       z.array(z.string()).optional(),
  tracoOportunidade: z.array(z.string()).optional(),
  tracoFraqueza:     z.array(z.string()).optional(),
});

export const getFraquezasOportunidadesParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listFraquezasOportunidadesQuerySchema = z.object({
  ...paginationQueryFields,
  numeroTraco: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return undefined;
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    return Number.isFinite(n) ? n : undefined;
  }),
});

export type CreateFraquezasOportunidadesInput = z.infer<typeof createFraquezasOportunidadesSchema>;
export type UpdateFraquezasOportunidadesInput = z.infer<typeof updateFraquezasOportunidadesSchema>;
export type GetFraquezasOportunidadesParams = z.infer<typeof getFraquezasOportunidadesParamsSchema>;
export type ListFraquezasOportunidadesQuery = z.infer<typeof listFraquezasOportunidadesQuerySchema>;

