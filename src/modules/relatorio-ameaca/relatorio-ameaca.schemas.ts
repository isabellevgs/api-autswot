import { z } from 'zod';

const stringArray = z.array(z.string()).default([]);

/** Schema compartilhado entre relatórios SH e CH (mesma estrutura editorial). */
export const createRelatorioAmeacaSchema = z.object({
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

export const updateRelatorioAmeacaSchema = createRelatorioAmeacaSchema.partial().omit({ numeroTraco: true });

export type CreateRelatorioAmeacaInput = z.infer<typeof createRelatorioAmeacaSchema>;
export type UpdateRelatorioAmeacaInput = z.infer<typeof updateRelatorioAmeacaSchema>;

export const relatorioAmeacaJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    numeroTraco: { type: 'number' },
    titulo: { type: 'string' },
    oQueE: { type: 'array', items: { type: 'string' } },
    atrapalharAcademico: { type: 'string' },
    atrapalharProfissional: { type: 'string' },
    atrapalharFamiliar: { type: 'string' },
    atrapalharAmigosColegas: { type: 'string' },
    atrapalharParceiros: { type: 'string' },
    reduzirImpacto: { type: 'array', items: { type: 'string' } },
    dicas: { type: 'array', items: { type: 'string' } },
    exemplos: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
};
