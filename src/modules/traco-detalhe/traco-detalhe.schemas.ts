import { z } from 'zod';

const stringArray = z.array(z.string()).default([]);

export const createTracoDetalheSchema = z.object({
  tipo:             z.enum(['SH', 'CH', 'FO', 'F']),
  numeroTraco:      z.number().int().positive(),
  titulo:           z.string().min(1),
  oQueE:            stringArray,
  comoUsar:         stringArray,
  comoOportunidade: stringArray,
  comoAtrapalhar:   stringArray,
  reduzirImpacto:   stringArray,
  dicas:            stringArray,
  exemplos:         stringArray,
});

export const updateTracoDetalheSchema = createTracoDetalheSchema.partial().omit({ tipo: true, numeroTraco: true });

export type CreateTracoDetalheInput = z.infer<typeof createTracoDetalheSchema>;
export type UpdateTracoDetalheInput = z.infer<typeof updateTracoDetalheSchema>;
