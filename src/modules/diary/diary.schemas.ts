import { z } from 'zod';

export const createDiaryEntrySchema = z.object({
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).or(z.date()), // Data da entrada
  answers: z.record(z.string().uuid(), z.string()).optional(), // Respostas: { questionId: texto }
});

export const updateDiaryEntrySchema = z.object({
  answers: z.record(z.string().uuid(), z.string()).optional(), // Respostas: { questionId: texto }
});

export const getDiaryEntryParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const getDiaryEntriesByUserParamsSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
});

export const getDiaryEntryByDateParamsSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
  date: z.string().datetime().or(z.date()),
});

export type CreateDiaryEntryInput = z.infer<typeof createDiaryEntrySchema>;
export type UpdateDiaryEntryInput = z.infer<typeof updateDiaryEntrySchema>;
export type GetDiaryEntryParams = z.infer<typeof getDiaryEntryParamsSchema>;
export type GetDiaryEntriesByUserParams = z.infer<typeof getDiaryEntriesByUserParamsSchema>;
export type GetDiaryEntryByDateParams = z.infer<typeof getDiaryEntryByDateParamsSchema>;

