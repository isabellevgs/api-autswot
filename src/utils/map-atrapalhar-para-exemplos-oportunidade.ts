import type { AtrapalharParsed } from './parse-como-atrapalhar.js';

export function mapAtrapalharParaExemplosOportunidade(parsed: AtrapalharParsed) {
  return {
    exemplosOportunidadeAcademico: parsed.atrapalharAcademico,
    exemplosOportunidadeProfissional: parsed.atrapalharProfissional,
    exemplosOportunidadeFamiliar: parsed.atrapalharFamiliar,
    exemplosOportunidadeAmigosColegas: parsed.atrapalharAmigosColegas,
    exemplosOportunidadeParceiros: parsed.atrapalharParceiros,
  };
}
