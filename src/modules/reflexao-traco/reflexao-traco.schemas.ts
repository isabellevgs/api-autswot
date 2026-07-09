import { z } from 'zod';

const respostasSchema = z.object({
  q1: z.string().max(10000).optional().default(''),
  q2: z.string().max(10000).optional().default(''),
  q3: z.string().max(10000).optional().default(''),
  q4: z.string().max(10000).optional().default(''),
  q5: z.string().max(10000).optional().default(''),
  q6: z.string().max(10000).optional().default(''),
  q7: z.string().max(10000).optional().default(''),
  q8: z.string().max(10000).optional().default(''),
});

export const upsertReflexaoSchema = z.object({
  tipo:        z.enum(['SH', 'CH', 'FO', 'F']),
  numeroTraco: z.number().int().positive(),
  quadrante:   z.enum(['ameaca', 'fraqueza', 'oportunidade', 'forca']),
  respostas:   respostasSchema,
  enviado:     z.boolean().optional().default(false),
});

export type UpsertReflexaoInput = z.infer<typeof upsertReflexaoSchema>;
