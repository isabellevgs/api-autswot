export interface AtrapalharParsed {
  atrapalharAcademico: string;
  atrapalharProfissional: string;
  atrapalharFamiliar: string;
  atrapalharAmigosColegas: string;
  atrapalharParceiros: string;
}

const CATEGORIAS: { key: keyof AtrapalharParsed; pattern: RegExp }[] = [
  { key: 'atrapalharAcademico', pattern: /^acad[eê]mico/i },
  { key: 'atrapalharProfissional', pattern: /^profissional/i },
  { key: 'atrapalharFamiliar', pattern: /^familiar/i },
  { key: 'atrapalharAmigosColegas', pattern: /^amigos e colegas/i },
  { key: 'atrapalharParceiros', pattern: /^parceiros rom[aâ]nticos/i },
];

/**
 * Converte o array legado `comoAtrapalhar` em colunas estruturadas por categoria.
 */
export function parseComoAtrapalhar(itens: string[]): AtrapalharParsed {
  const result: AtrapalharParsed = {
    atrapalharAcademico: '',
    atrapalharProfissional: '',
    atrapalharFamiliar: '',
    atrapalharAmigosColegas: '',
    atrapalharParceiros: '',
  };

  const buffers: Partial<Record<keyof AtrapalharParsed, string[]>> = {};
  let currentKey: keyof AtrapalharParsed | null = null;

  for (const raw of itens) {
    const item = raw.trim();
    if (!item) continue;

    const categoria = CATEGORIAS.find((c) => c.pattern.test(item));
    if (categoria) {
      currentKey = categoria.key;
      const afterColon = item.split(':').slice(1).join(':').trim();
      if (afterColon) {
        buffers[currentKey] = buffers[currentKey] ?? [];
        buffers[currentKey]!.push(afterColon);
      }
      continue;
    }

    if (currentKey) {
      buffers[currentKey] = buffers[currentKey] ?? [];
      buffers[currentKey]!.push(item);
    }
  }

  for (const [key, parts] of Object.entries(buffers) as [keyof AtrapalharParsed, string[]][]) {
    result[key] = parts.join('\n\n');
  }

  return result;
}
