import { z } from 'zod';

const stringArray = z.array(z.string()).default([]);

export const createRelatorioShSchema = z.object({
  numeroTraco: z.number().int().positive(),
  titulo: z.string().min(1),
  oQueE: stringArray,
  atrapalharAcademico: z.string().default(''),
  atrapalharProfissional: z.string().default(''),
  atrapalharFamiliar: z.string().default(''),
  atrapalharAmigosColegas: z.string().default(''),
  atrapalharParceiros: z.string().default(''),
  reduzirImpacto: stringArray,
  dicas: stringArray,
  exemplos: stringArray,
});

export const updateRelatorioShSchema = createRelatorioShSchema.partial().omit({ numeroTraco: true });

export type CreateRelatorioShInput = z.infer<typeof createRelatorioShSchema>;
export type UpdateRelatorioShInput = z.infer<typeof updateRelatorioShSchema>;
