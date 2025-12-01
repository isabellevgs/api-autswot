import { z } from 'zod';

export const createFraquezasAmeacasChSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  numHistoria: z.number().int().positive('Número da história deve ser positivo'),
  frequencia: z.number().min(0, 'Frequência deve ser um número não negativo'),
  intensidade: z.number().min(0, 'Intensidade deve ser um número não negativo'),
});

export const updateFraquezasAmeacasChSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo').optional(),
  numHistoria: z.number().int().positive('Número da história deve ser positivo').optional(),
  frequencia: z.number().min(0, 'Frequência deve ser um número não negativo').optional(),
  intensidade: z.number().min(0, 'Intensidade deve ser um número não negativo').optional(),
});

export const getFraquezasAmeacasChParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listFraquezasAmeacasChQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  numeroTraco: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
});

export type CreateFraquezasAmeacasChInput = z.infer<typeof createFraquezasAmeacasChSchema>;
export type UpdateFraquezasAmeacasChInput = z.infer<typeof updateFraquezasAmeacasChSchema>;
export type GetFraquezasAmeacasChParams = z.infer<typeof getFraquezasAmeacasChParamsSchema>;
export type ListFraquezasAmeacasChQuery = z.infer<typeof listFraquezasAmeacasChQuerySchema>;

