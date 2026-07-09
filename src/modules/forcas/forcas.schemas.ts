import { z } from 'zod';
import { paginationQueryFields } from '../../utils/pagination.js';

export const createForcasSchema = z.object({
  numeroTraco:       z.number().int().positive('Número do traço deve ser positivo'),
  pergunta:          z.string().min(1, 'Pergunta é obrigatória'),
  exemplo:           z.string().optional().default(''),
  swot:              z.string().optional().default(''),
  tracoNeutro:       z.array(z.string()).optional().default([]),
  tracoForca:        z.array(z.string()).optional().default([]),
  tracoFraqueza:     z.array(z.string()).optional().default([]),
  tracoOportunidade: z.array(z.string()).optional().default([]),
});

export const updateForcasSchema = z.object({
  numeroTraco:       z.number().int().positive('Número do traço deve ser positivo').optional(),
  pergunta:          z.string().min(1, 'Pergunta é obrigatória').optional(),
  exemplo:           z.string().optional(),
  swot:              z.string().optional(),
  tracoNeutro:       z.array(z.string()).optional(),
  tracoForca:        z.array(z.string()).optional(),
  tracoFraqueza:     z.array(z.string()).optional(),
  tracoOportunidade: z.array(z.string()).optional(),
});

export const getForcasParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listForcasQuerySchema = z.object({
  ...paginationQueryFields,
  numeroTraco: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return undefined;
    const n = typeof val === 'string' ? parseInt(val, 10) : val;
    return Number.isFinite(n) ? n : undefined;
  }),
});

export type CreateForcasInput   = z.infer<typeof createForcasSchema>;
export type UpdateForcasInput   = z.infer<typeof updateForcasSchema>;
export type GetForcasParams     = z.infer<typeof getForcasParamsSchema>;
export type ListForcasQuery     = z.infer<typeof listForcasQuerySchema>;
export type UpdateForcasParams  = { id: string };
export type DeleteForcasParams  = { id: string };
