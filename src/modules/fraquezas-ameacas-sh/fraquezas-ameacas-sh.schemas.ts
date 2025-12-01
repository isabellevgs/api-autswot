import { z } from 'zod';

export const createFraquezasAmeacasShSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  pergunta: z.string().min(1, 'Pergunta é obrigatória'),
  explicacao: z.string().min(1, 'Explicação é obrigatória'),
  frequencia: z.number().min(0, 'Frequência deve ser um número não negativo'),
  intensidade: z.number().min(0, 'Intensidade deve ser um número não negativo'),
});

export const updateFraquezasAmeacasShSchema = z.object({
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo').optional(),
  pergunta: z.string().min(1, 'Pergunta é obrigatória').optional(),
  explicacao: z.string().min(1, 'Explicação é obrigatória').optional(),
  frequencia: z.number().int().min(0, 'Frequência deve ser um número não negativo').optional(),
  intensidade: z.number().int().min(0, 'Intensidade deve ser um número não negativo').optional(),
});

export const getFraquezasAmeacasShParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listFraquezasAmeacasShQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  numeroTraco: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
});

export type CreateFraquezasAmeacasShInput = z.infer<typeof createFraquezasAmeacasShSchema>;
export type UpdateFraquezasAmeacasShInput = z.infer<typeof updateFraquezasAmeacasShSchema>;
export type GetFraquezasAmeacasShParams = z.infer<typeof getFraquezasAmeacasShParamsSchema>;
export type ListFraquezasAmeacasShQuery = z.infer<typeof listFraquezasAmeacasShQuerySchema>;

