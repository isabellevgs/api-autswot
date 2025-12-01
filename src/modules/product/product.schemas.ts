import { z } from 'zod';

// TODO: Ajustar schemas quando o modelo Product for definido
export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo').optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100).optional(),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo').optional(),
});

export const getProductParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listProductsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductParams = z.infer<typeof getProductParamsSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

