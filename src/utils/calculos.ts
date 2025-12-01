/**
 * Utilitários para cálculos do questionário SWOT
 */

/**
 * Calcula a média do usuário para tabelas SH e CH
 * Fórmula: mediaUser = (userFREQ + userINT * 5/3) / 2
 * 
 * @param userFREQ - Frequência do traço (1-5)
 * @param userINT - Intensidade (1-3)
 * @returns A média calculada ou null se os valores não estiverem disponíveis
 */
export function calcularMediaUser(
  userFREQ: number | null | undefined,
  userINT: number | null | undefined
): number | null {
  // Retorna null se algum dos valores não estiver disponível
  if (userFREQ === null || userFREQ === undefined || userINT === null || userINT === undefined) {
    return null;
  }

  // Validação dos ranges
  if (userFREQ < 1 || userFREQ > 5) {
    throw new Error('Frequência deve estar entre 1 e 5');
  }

  if (userINT < 1 || userINT > 3) {
    throw new Error('Intensidade deve estar entre 1 e 3');
  }

  // Calcula a média usando a fórmula: (userFREQ + userINT * 5/3) / 2
  const mediaUser = (userFREQ + userINT * (5 / 3)) / 2;

  return mediaUser;
}

/**
 * Mapeia frequência numérica para label de texto baseado no tipo
 */
export function mapearFrequenciaParaLabel(
  frequencia: number,
  tipo: 'FO' | 'F'
): string {
  if (frequencia < 1 || frequencia > 5) {
    throw new Error('Frequência deve estar entre 1 e 5');
  }

  const labelsFO = ['Quase Nunca', 'Raramente', 'Ocasionalmente', 'Muito frequentemente', 'Quase Sempre'];
  const labelsF = ['Nunca', 'Raramente', 'Ocasionalmente', 'Muito frequentemente', 'Quase sempre'];

  if (tipo === 'FO') {
    return labelsFO[frequencia - 1];
  } else {
    return labelsF[frequencia - 1];
  }
}

/**
 * Normaliza string para comparação (remove acentos, converte para minúsculas)
 */
function normalizarString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Compara dois valores de frequência considerando variações de escrita
 */
function compararValores(valor1: string, valor2: string): boolean {
  const normalizado1 = normalizarString(valor1);
  const normalizado2 = normalizarString(valor2);
  
  // Comparação exata
  if (normalizado1 === normalizado2) {
    return true;
  }
  
  // Mapeamento de variações comuns (normaliza para valores canônicos)
  const normalizarVariacoes = (str: string): string => {
    // Remove dois pontos e texto após eles (ex: "Quase Nunca: esse tipo...")
    const semDescricao = str.split(':')[0].trim();
    const normalizado = normalizarString(semDescricao);
    
    // Mapeia variações para valores canônicos
    const variacoes: Record<string, string> = {
      'quase nunca': 'quase nunca',
      'nunca': 'quase nunca',
      'raramente': 'raramente',
      'ocasionalmente': 'ocasionalmente',
      'muito frequentemente': 'muito frequentemente',
      'quase sempre': 'quase sempre',
    };
    
    return variacoes[normalizado] || normalizado;
  };
  
  const normalizado1Variacao = normalizarVariacoes(valor1);
  const normalizado2Variacao = normalizarVariacoes(valor2);
  
  return normalizado1Variacao === normalizado2Variacao;
}

/**
 * Classifica traço FO comparando frequência do usuário com valores das colunas
 */
export function classificarTracoFO(
  frequencia: number | null | undefined,
  tracoNeutro: Array<{ valor: string }>,
  tracoOportunidade: Array<{ valor: string }>,
  tracoFraqueza: Array<{ valor: string }>
): 'neutro' | 'oportunidade' | 'fraqueza' | null {
  if (frequencia === null || frequencia === undefined) {
    return null;
  }

  const labelFrequencia = mapearFrequenciaParaLabel(frequencia, 'FO');

  // Verifica em qual coluna a frequência se encaixa
  // Prioridade: fraqueza > oportunidade > neutro
  const valoresFraqueza = tracoFraqueza.map(t => t.valor);
  const valoresOportunidade = tracoOportunidade.map(t => t.valor);
  const valoresNeutro = tracoNeutro.map(t => t.valor);

  // Verifica se está em fraqueza
  if (valoresFraqueza.some(valor => compararValores(valor, labelFrequencia))) {
    return 'fraqueza';
  }

  // Verifica se está em oportunidade
  if (valoresOportunidade.some(valor => compararValores(valor, labelFrequencia))) {
    return 'oportunidade';
  }

  // Verifica se está em neutro
  if (valoresNeutro.some(valor => compararValores(valor, labelFrequencia))) {
    return 'neutro';
  }

  // Se não encontrou em nenhuma coluna, retorna null
  return null;
}

/**
 * Classifica traço F comparando frequência do usuário com valores das colunas
 */
export function classificarTracoF(
  frequencia: number | null | undefined,
  tracoNeutro: Array<{ valor: string }>,
  tracoForca: Array<{ valor: string }>,
  tracoFraqueza: Array<{ valor: string }>,
  tracoOportunidade: Array<{ valor: string }>
): 'neutro' | 'forca' | 'fraqueza' | 'oportunidade' | null {
  if (frequencia === null || frequencia === undefined) {
    console.log('[DEBUG classificarTracoF] Frequência é null ou undefined');
    return null;
  }

  const labelFrequencia = mapearFrequenciaParaLabel(frequencia, 'F');
  console.log('[DEBUG classificarTracoF] Frequência:', frequencia, 'Label:', labelFrequencia);

  // Verifica em qual coluna a frequência se encaixa
  // Prioridade: fraqueza > oportunidade > forca > neutro
  const valoresFraqueza = tracoFraqueza.map(t => t.valor);
  const valoresOportunidade = tracoOportunidade.map(t => t.valor);
  const valoresForca = tracoForca.map(t => t.valor);
  const valoresNeutro = tracoNeutro.map(t => t.valor);

  console.log('[DEBUG classificarTracoF] Valores das colunas:', {
    valoresFraqueza,
    valoresOportunidade,
    valoresForca,
    valoresNeutro
  });

  // Verifica se está em fraqueza
  const estaEmFraqueza = valoresFraqueza.some(valor => compararValores(valor, labelFrequencia));
  console.log('[DEBUG classificarTracoF] Está em fraqueza?', estaEmFraqueza);
  if (estaEmFraqueza) {
    return 'fraqueza';
  }

  // Verifica se está em oportunidade
  if (valoresOportunidade.some(valor => compararValores(valor, labelFrequencia))) {
    return 'oportunidade';
  }

  // Verifica se está em forca
  if (valoresForca.some(valor => compararValores(valor, labelFrequencia))) {
    return 'forca';
  }

  // Verifica se está em neutro
  if (valoresNeutro.some(valor => compararValores(valor, labelFrequencia))) {
    return 'neutro';
  }

  // Se não encontrou em nenhuma coluna, retorna null
  return null;
}

