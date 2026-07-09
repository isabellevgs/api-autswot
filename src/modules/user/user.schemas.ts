import { z } from 'zod';
import { paginationQueryFields } from '../../utils/pagination.js';

export const updateUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo').optional(),
  email: z
    .string()
    .email('Email inválido')
    .transform((e) => e.trim().toLowerCase())
    .optional(),
});

export const getUserParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listUsersQuerySchema = z.object({
  ...paginationQueryFields,
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

