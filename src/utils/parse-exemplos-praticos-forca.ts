export interface ExemplosPraticosForcaParsed {
  exemplosPraticosEstudo: string;
  exemplosPraticosTrabalho: string;
  exemplosPraticosCotidiano: string;
}

const CATEGORIAS: { key: keyof ExemplosPraticosForcaParsed; patterns: RegExp[] }[] = [
  {
    key: 'exemplosPraticosEstudo',
    patterns: [/^no estudo/i, /^âmbito acad[eê]mico/i, /^acad[eê]mico/i, /^na faculdade/i],
  },
  {
    key: 'exemplosPraticosTrabalho',
    patterns: [/^no trabalho/i, /^âmbito profissional/i, /^profissional/i, /^no ambiente de trabalho/i],
  },
  {
    key: 'exemplosPraticosCotidiano',
    patterns: [/^no cotidiano/i, /^cotidiano/i],
  },
];

export function parseExemplosPraticosForca(itens: string[]): ExemplosPraticosForcaParsed {
  const result: ExemplosPraticosForcaParsed = {
    exemplosPraticosEstudo: '',
    exemplosPraticosTrabalho: '',
    exemplosPraticosCotidiano: '',
  };

  const buffers: Partial<Record<keyof ExemplosPraticosForcaParsed, string[]>> = {};
  let currentKey: keyof ExemplosPraticosForcaParsed | null = null;

  for (const raw of itens) {
    const item = raw.trim();
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

  for (const [key, parts] of Object.entries(buffers) as [keyof ExemplosPraticosForcaParsed, string[]][]) {
    result[key] = parts.join('\n\n');
  }

  return result;
}

/** Migra campos criados por engano no relatório FO (estudo/trabalho/cotidiano) para F. */
export function migrarExemplosOportunidadeErradosParaForca(payload: Record<string, unknown>) {
  if (payload.tipo !== 'F') return;

  const map: [string, string][] = [
    ['exemplosOportunidadeEstudo', 'exemplosPraticosEstudo'],
    ['exemplosOportunidadeTrabalho', 'exemplosPraticosTrabalho'],
    ['exemplosOportunidadeCotidiano', 'exemplosPraticosCotidiano'],
  ];

  for (const [de, para] of map) {
    const valor = String(payload[de] ?? '').trim();
    if (valor && !payload[para]) payload[para] = valor;
    delete payload[de];
  }
}
