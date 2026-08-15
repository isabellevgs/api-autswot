import type { QuadranteKey } from './swot-quadrantes.js';

export const MIN_PALAVRAS_JORNADA = 20;
export const MIN_PALAVRAS_AUTOADVOCACIA = 20;
export const QUINZENAS_INICIAIS = 8;
export const DIAS_POR_QUINZENA = 15;

export const TITULOS_QUADRANTE: Record<QuadranteKey, string> = {
  ameaca: 'Ameaças',
  fraqueza: 'Fraquezas',
  oportunidade: 'Oportunidades',
  forca: 'Forças',
};

export const PROMPT_MICRO_AMEACA_FRAQUEZA =
  'Descreva aqui como foi a experiência de ter feito o exercício de autoconhecimento, relatando:\n' +
  '1) Sobre que traço você construiu autoconhecimento hoje?\n' +
  '2) O que você sentiu ao escrever sobre ele?\n' +
  '3) O que você mais aprendeu? Algo te surpreendeu?\n'+ 
  '4) Como foi a experiência de pensar em estratégias e em necessidades específicas?\n'+
  '5) Qual foi o grau de dificuldade em fazer o exercício (difícil, fácil, moderado)? Se foi difícil ou moderado, escreva os porquês.';

export const PROMPT_MICRO_OPORTUNIDADE =
  'Descreva aqui como foi a experiência de ter conhecido suas forças autísticas, relatando:\n' +
  '1) Sobre que traço você construiu autoconhecimento hoje?\n' +
  '2) O que você sentiu ao escrever sobre ele?\n'+ 
  '3) O que você mais aprendeu? Algo te surpreendeu?\n'+
  '4) Como foi a experiência de pensar em estratégias para transformar esse traço em força?\n'+
  '5) Qual foi o grau de dificuldade em fazer o exercício (difícil, fácil, moderado)? Se foi difícil ou moderado, escreva os porquês.';

export const PROMPT_QUADRANTE_FINAL: Record<'ameaca' | 'fraqueza' | 'oportunidade', string> = {
  ameaca:
    'Descreva como foi terminar os exercícios dos traços de ameaça, contando: Como você se sentiu ao terminar? Houve dificuldades, se sim, quais? Quanto tempo em média você levou para fazer a atividade de cada traço? E para o quadrante todo? Como você se sente em relação a colocar em prática as estratégias que você definiu?',
  fraqueza:
    'Descreva como foi terminar os exercícios dos traços de fraquezas, contando: Como você se sentiu ao terminar? Houve dificuldades, se sim, quais? Quanto tempo em média você levou para fazer a atividade de cada traço? E para o quadrante todo? Como você se sente em relação a colocar em prática as estratégias que você definiu?',
  oportunidade:
    'Descreva como foi terminar os exercícios dos traços de oportunidades, contando: Como você se sentiu ao terminar? Houve dificuldades, se sim, quais? Quanto tempo em média você levou para fazer a atividade de cada traço? E para o quadrante todo? Como você se sente em relação a colocar em prática as estratégias que você definiu?',
};

export const PROMPT_FORCAS =
  'Descreva aqui como foi a experiência de ter conhecido suas forças autísticas, relatando:\n' +
  '1) Como você se sentiu ao conhecer e refletir sobre suas forças? Você já tinha conhecimento prévio sobre alguma delas? Existe alguma força sobre a qual você discorda ter, por quê? Te surpreendeu conhecer forças que você não sabia que tinha, como e por quê? Você acha possível utilizar uma ou mais forças para ajudar a reduzir o impacto negativos de traços classificados como ameaças ou fraquezas, dê algum exemplo?';

export const PROMPT_JORNADA_FINAL =
  'No geral, como foi essa experiência para você?\n' +
  'Você sente que se conhece melhor depois dessa análise? Você pretende continuar trabalhando nos seus traços? Você se sente mais preparado(a) para expressar suas necessidades e limites? Você pretende compartilhar o que você aprendeu sobre você com alguém (médico, terapeuta, família, parceiro romântico, professor, chefe, amigos etc). Se sim, explique porque e se não, também explique. Em uma frase: o que essa experiência trouxe para você?';

export const PERGUNTA_AUTOADVOCACIA_1 =
  'Você tem compartilhado com alguém informações sobre seu processo de autoconhecimento por meio da AutSWOT? Se sim, com quem? Descreva como tem sido. Se não, escreva sobre as razões pelas quais não tem compartilhado descrevendo as barreiras ou dificuldades.';

export const PERGUNTA_AUTOADVOCACIA_2 =
  'Você tem tentado aplicar as estratégias de enfrentamento e autoadvogar suas necessidades especificas nos diversos âmbitos em que circula (estudo, trabalho, família, amigos, parceiros românticos). Se sim, escreva como tem sido esse processo. Se não, escreva sobre as razões pelas quais não tem conseguido, descrevendo as barreiras ou dificuldades.';

export type TipoDiarioPagina = 'micro_traco' | 'quadrante_final' | 'forcas' | 'jornada_final';

export function chaveMicroTraco(quadrante: string, tipo: string, numeroTraco: number): string {
  return `micro:${quadrante}:${tipo}:${numeroTraco}`;
}

export function chaveQuadranteFinal(quadrante: string): string {
  return `quadrante:${quadrante}`;
}

export const CHAVE_FORCAS = 'forcas';
export const CHAVE_JORNADA_FINAL = 'jornada:final';

export function contarPalavras(texto: string): number {
  return String(texto ?? '').trim().split(/\s+/).filter(Boolean).length;
}

export function obterPromptPagina(
  tipo: TipoDiarioPagina,
  quadrante: string | null,
): string {
  if (tipo === 'micro_traco') {
    if (quadrante === 'oportunidade') return PROMPT_MICRO_OPORTUNIDADE;
    return PROMPT_MICRO_AMEACA_FRAQUEZA;
  }
  if (tipo === 'quadrante_final' && quadrante && quadrante in PROMPT_QUADRANTE_FINAL) {
    return PROMPT_QUADRANTE_FINAL[quadrante as keyof typeof PROMPT_QUADRANTE_FINAL];
  }
  if (tipo === 'forcas') return PROMPT_FORCAS;
  return PROMPT_JORNADA_FINAL;
}

export function obterTituloPagina(
  tipo: TipoDiarioPagina,
  quadrante: string | null,
  tituloTraco: string | null,
): string {
  if (tipo === 'micro_traco') return tituloTraco ?? 'Traço';
  if (tipo === 'quadrante_final' && quadrante) {
    return `Reflexão — ${TITULOS_QUADRANTE[quadrante as QuadranteKey] ?? quadrante}`;
  }
  if (tipo === 'forcas') return 'Reflexão — Forças';
  return 'Experiência geral';
}
