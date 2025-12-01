import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  imageUrl: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo').optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório').optional(),
  imageUrl: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
});

export const getPostParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const listPostsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional(), // Busca por título ou conteúdo
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type GetPostParams = z.infer<typeof getPostParamsSchema>;
export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;

