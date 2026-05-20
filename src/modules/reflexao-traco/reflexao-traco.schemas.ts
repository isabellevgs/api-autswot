import { z } from 'zod';

const respostasSchema = z.object({
  q1: z.string().optional().default(''),
  q2: z.string().optional().default(''),
  q3: z.string().optional().default(''),
  q4: z.string().optional().default(''),
  q5: z.string().optional().default(''),
  q6: z.string().optional().default(''),
  q7: z.string().optional().default(''),
  q8: z.string().optional().default(''),
});

export const upsertReflexaoSchema = z.object({
  tipo:        z.enum(['SH', 'CH', 'FO', 'F']),
  numeroTraco: z.number().int().positive(),
  quadrante:   z.enum(['ameaca', 'fraqueza', 'oportunidade', 'forca']),
  respostas:   respostasSchema,
});

export type UpsertReflexaoInput = z.infer<typeof upsertReflexaoSchema>;
