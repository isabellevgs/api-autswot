import { z } from 'zod';

export const salvarPaginaJornadaSchema = z.object({
  texto: z.string(),
  finalizar: z.boolean().optional().default(false),
});

export const salvarQuinzenaSchema = z.object({
  resposta1: z.string(),
  resposta2: z.string(),
  finalizar: z.boolean().optional().default(false),
});

export type SalvarPaginaJornadaInput = z.infer<typeof salvarPaginaJornadaSchema>;
export type SalvarQuinzenaInput = z.infer<typeof salvarQuinzenaSchema>;
