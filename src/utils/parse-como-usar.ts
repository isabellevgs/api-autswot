export interface ComoUsarParsed {
  comoUsarAcademico: string;
  comoUsarProfissional: string;
  comoUsarCotidiano: string;
}

const CATEGORIAS: { key: keyof ComoUsarParsed; patterns: RegExp[] }[] = [
  {
    key: 'comoUsarAcademico',
    patterns: [/^ambiente acad[eê]mico/i, /^na faculdade/i, /^acad[eê]mico/i],
  },
  {
    key: 'comoUsarProfissional',
    patterns: [/^ambiente profissional/i, /^no ambiente de trabalho/i, /^no trabalho/i, /^profissional/i],
  },
  {
    key: 'comoUsarCotidiano',
    patterns: [/^cotidiano/i, /^na vida pessoal/i],
  },
];

/**
 * Converte o array legado `comoUsar` em colunas estruturadas por ambiente.
 */
export function parseComoUsar(itens: string[]): ComoUsarParsed {
  const result: ComoUsarParsed = {
    comoUsarAcademico: '',
    comoUsarProfissional: '',
    comoUsarCotidiano: '',
  };

  const buffers: Partial<Record<keyof ComoUsarParsed, string[]>> = {};
  let currentKey: keyof ComoUsarParsed | null = null;

  for (const raw of itens) {
    const item = raw.trim().replace(/^:\s*/, '');
    if (!item) continue;

    const categoria = CATEGORIAS.find((c) =>
      c.patterns.some((pattern) => pattern.test(item)),
    );
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

  for (const [key, parts] of Object.entries(buffers) as [keyof ComoUsarParsed, string[]][]) {
    result[key] = parts.join('\n\n');
  }

  return result;
}
