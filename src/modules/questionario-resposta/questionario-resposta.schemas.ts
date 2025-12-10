import { z } from 'zod';

export const salvarRespostaSchema = z.object({
  perguntaId: z.string().uuid('ID da pergunta inválido'),
  tipo: z.enum(['SH', 'CH', 'FO', 'F']),
  numeroTraco: z.number().int().positive('Número do traço deve ser positivo'),
  resposta: z.string().nullable().optional(),
  frequencia: z.number().int().min(1).max(5).nullable().optional(),
  intensidade: z.number().int().min(1).max(3).nullable().optional(),
});

export const salvarRespostasSchema = z.object({
  respostas: z.array(salvarRespostaSchema).min(1, 'Deve ter pelo menos uma resposta'),
});

export const getRespostaParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listRespostasQuerySchema = z.object({
  tipo: z.enum(['SH', 'CH', 'FO', 'F']).optional(),
});

export const listRespostasByUserIdParamsSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
});

export const listRespostasByUserIdQuerySchema = z.object({
  tipo: z.enum(['SH', 'CH', 'FO', 'F']).optional(),
});

export type SalvarRespostaInput = z.infer<typeof salvarRespostaSchema>;
export type SalvarRespostasInput = z.infer<typeof salvarRespostasSchema>;
export type GetRespostaParams = z.infer<typeof getRespostaParamsSchema>;
export type ListRespostasQuery = z.infer<typeof listRespostasQuerySchema>;
export type ListRespostasByUserIdParams = z.infer<typeof listRespostasByUserIdParamsSchema>;
export type ListRespostasByUserIdQuery = z.infer<typeof listRespostasByUserIdQuerySchema>;

