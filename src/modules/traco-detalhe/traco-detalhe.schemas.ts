import { z } from 'zod';

const stringArray = z.array(z.string()).default([]);

export const createTracoDetalheSchema = z.object({
  tipo:             z.enum(['SH', 'CH', 'FO', 'F']),
  numeroTraco:      z.number().int().positive(),
  titulo:           z.string().min(1),
  oQueE:              stringArray,
  comoUsarAcademico:    z.string().default(''),
  comoUsarProfissional: z.string().default(''),
  comoUsarCotidiano:    z.string().default(''),
  comoOportunidade:   stringArray,
  exemplosOportunidadeAcademico:    z.string().default(''),
  exemplosOportunidadeProfissional: z.string().default(''),
  exemplosOportunidadeFamiliar:     z.string().default(''),
  exemplosOportunidadeAmigosColegas:z.string().default(''),
  exemplosOportunidadeParceiros:    z.string().default(''),
  exemplosPraticosEstudo:    z.string().default(''),
  exemplosPraticosTrabalho:  z.string().default(''),
  exemplosPraticosCotidiano: z.string().default(''),
  fraquezaOuAmeaca:   stringArray,
  atrapalharAcademico:      z.string().default(''),
  atrapalharProfissional:    z.string().default(''),
  atrapalharFamiliar:        z.string().default(''),
  atrapalharAmigosColegas:   z.string().default(''),
  atrapalharParceiros:       z.string().default(''),
  transformarEmForca:        stringArray,
  transformarEmOportunidade: stringArray,
  reduzirImpacto:     stringArray,
  dicas:              stringArray,
  exemplos:           stringArray,
});

export const updateTracoDetalheSchema = createTracoDetalheSchema.partial().omit({ tipo: true, numeroTraco: true });

export type CreateTracoDetalheInput = z.infer<typeof createTracoDetalheSchema>;
export type UpdateTracoDetalheInput = z.infer<typeof updateTracoDetalheSchema>;
