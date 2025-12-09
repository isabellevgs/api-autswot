import { z } from 'zod';

export const createHistoriasSociaisSchema = z.object({
  numeroHistoria: z.number().int().positive('Número da história deve ser positivo'),
  introducao: z.string().min(1, 'Introdução é obrigatória'),
  titulo: z.string().min(1, 'Título é obrigatório'),
  personagem: z.string().min(1, 'Personagem é obrigatório'),
  ambientacao: z.string().min(1, 'Ambientação é obrigatória'),
  historia: z.string().min(1, 'História é obrigatória'),
  questionamento: z.string().min(1, 'Questionamento é obrigatório'),
  perguntaIntensidade: z.string().min(1, 'Pergunta sobre intensidade é obrigatória'),
  intensidadeLeve: z.string().min(1, 'Descrição de intensidade leve é obrigatória'),
  intensidadeModerada: z.string().min(1, 'Descrição de intensidade moderada é obrigatória'),
  intensidadeAlta: z.string().min(1, 'Descrição de intensidade alta é obrigatória'),
});

export const updateHistoriasSociaisSchema = z.object({
  numeroHistoria: z.number().int().positive('Número da história deve ser positivo').optional(),
  introducao: z.string().min(1, 'Introdução é obrigatória').optional(),
  titulo: z.string().min(1, 'Título é obrigatório').optional(),
  personagem: z.string().min(1, 'Personagem é obrigatório').optional(),
  ambientacao: z.string().min(1, 'Ambientação é obrigatória').optional(),
  historia: z.string().min(1, 'História é obrigatória').optional(),
  questionamento: z.string().min(1, 'Questionamento é obrigatório').optional(),
  perguntaIntensidade: z.string().min(1, 'Pergunta sobre intensidade é obrigatória').optional(),
  intensidadeLeve: z.string().min(1, 'Descrição de intensidade leve é obrigatória').optional(),
  intensidadeModerada: z.string().min(1, 'Descrição de intensidade moderada é obrigatória').optional(),
  intensidadeAlta: z.string().min(1, 'Descrição de intensidade alta é obrigatória').optional(),
});

export const getHistoriasSociaisParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listHistoriasSociaisQuerySchema = z.object({
  page: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return 1;
    return typeof val === 'string' ? parseInt(val, 10) : val;
  }),
  limit: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return 10;
    return typeof val === 'string' ? parseInt(val, 10) : val;
  }),
  numeroHistoria: z.union([z.string(), z.number()]).optional().transform(val => {
    if (val === undefined) return undefined;
    return typeof val === 'string' ? parseInt(val, 10) : val;
  }),
});

export type CreateHistoriasSociaisInput = z.infer<typeof createHistoriasSociaisSchema>;
export type UpdateHistoriasSociaisInput = z.infer<typeof updateHistoriasSociaisSchema>;
export type GetHistoriasSociaisParams = z.infer<typeof getHistoriasSociaisParamsSchema>;
export type ListHistoriasSociaisQuery = z.infer<typeof listHistoriasSociaisQuerySchema>;

