import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo').optional(),
  email: z.string().email('Email inválido').optional(),
});

export const getUserParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listUsersQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

