import { PrismaClient } from '../generated/prisma/index.js';

// Garantir que DATABASE_URL está definida
if (!process.env.DATABASE_URL) {
  console.error('❌ Erro: DATABASE_URL não está definida.');
  console.error('Por favor, defina a variável de ambiente DATABASE_URL antes de executar o seed.');
  process.exit(1);
}

// Criar PrismaClient (ele lê automaticamente DATABASE_URL da variável de ambiente)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

/**
 * Seed de Fraquezas e Ameaças SH
 * Popula a tabela com os dados iniciais
 */
const FRAQUEZAS_AMEACAS_SH = [
  {
    numeroTraco: 1,
    pergunta: 'Suas emoções ou humor podem oscilar em um curto espaço de tempo?',
    explicacao: 'Mudanças rápidas e intensas no estado emocional ao longo do dia, podendo incluir sentimentos opostos em sequência. Exemplo: sentir-se animado e, pouco depois, ansioso ou irritado sem um motivo razoável.',
    frequencia: 3.0,
    intensidade: 3.0,
    swot: 'Oscilação de emoções ou humor',
  },
  {
    numeroTraco: 2,
    pergunta: 'Você se sente inseguro sobre as suas capacidades ou tem receio de ser julgado com frequência?',
    explicacao: 'Duvidar frequentemente de sua competência ou ter receio de ser julgado por colegas. Ao receber feedbacks ou críticas, ficar sempre na defensiva. Exemplo: hesitar em falar durante reuniões por medo de errar ou dar opiniões numa roda de conversas por medo de se expor. Dar uma resposta inadequada ao receber um feedback por achar que está senso alvo de críticas.',
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Insegurança'
  },
  {
    numeroTraco: 3,
    pergunta: 'Você tem opiniões negativas ou pessimistas sobre as coisas na maior parte do tempo? Ou, você enxerga com mais facilidade os erros do que os acertos?',
    explicacao: 'Com frequência acha que as coisas vão dar mais errado do que certo. Enxerga com mais facilidade os erros ou o lado negativo das coisas.',
    frequencia: 3.0,
    intensidade: 3.25,
    swot:'Negativismo'
  },
  {
    numeroTraco: 4,
    pergunta: 'Você acredita ter alguns comportamentos repetitivos que podem gerar prejuízos à saúde ou bem-estar?',
    explicacao: 'Roer unhas, arrancar cutícula, fazer bruxismo (apertar os dentes), morder os lábios, arrancar fios de cabelo, comer compulsivamente, usar bebida alcoolica ou cigarro em momentos de estress ou ansiedade. Dificuldade para manter hábitos saudáveis de forma consistente.',
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Comportamentos auto-destrutivos'
  },
  {
    numeroTraco: 5,
    pergunta: 'Você costuma se fixar intensamente em uma pessoa, ideia ou atividade a ponto de não conseguir ou ter dificuldade se desligar?',
    explicacao: 'Padrão de comportamento marcado por fixações intensas e repetitivas em pessoas, atividades, objetos, roupas ou pensamentos. Pode envolver apego exagerado a alguém específico, como uma pessoa em quem se confia profundamente, direcionando toda a atenção emocional para essa relação. Também pode aparecer como repetição excessiva de músicas, filmes, jogos ou rotinas, dificultando a variação e flexibilidade, por exemplo, assistindo sempre os mesmos filmes./séries, usando as mesmas roupas.Pode até sentir ansiedade ao tentar se afastar daquilo que está fixada e, muitas vezes, tem dificuldade de perceber os próprios limites.',
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Comportamento compulsivo-obssessivo'
  },
  {
    numeroTraco: 6,
    pergunta: 'Você se sente sobrecarregado em contextos com muitas pessoas?',
    explicacao: 'Sentir-se exausto após eventos ou situações com muitas pessoas; necessidade de tempo sozinho após eventos sociais.',
    frequencia: 3.3125,
    intensidade: 2.53125,
    swot:'Dificuldade de participar de grupos numerosos'
  },
  {
    numeroTraco: 7,
    pergunta: 'Você sente que é hipersensível ou reativo a sons específicos?',
    explicacao: 'Desconforto ou sofrimento diante de sons como sirenes, carros, barulho de construção ou vozes altas as vezes. Também pode acontecer de alguns dias sentir desconforto com sons mais sutis como o  barulho de mastigação, teclar no teclado, passarinho cantando, gato ronronando. Pode causar distração, irritabilidade ou necessidade de se afastar do ambiente.',
    frequencia: 2.85,
    intensidade: 3.5,
    swot:'Hipersensibilidade auditiva'
  },
  {
    numeroTraco: 8,
    pergunta: 'Você tem dificuldade em sentir-se parte ou integrado a grupos sociais?',
    explicacao: 'Sentir-se como um “observador” ao invés de participante em grupos sociais, por exemplo no trabalho ou na faculdade tem dificuldade de interagir em grupos, se posicionar, participar ativamente das discussões ou eventos.',
    frequencia: 3.5,
    intensidade: 3.0,
    swot:'Dificuldade de se integrar em grupos'
  },
  {
    numeroTraco: 9,
    pergunta: 'Você tem poucos ou nenhum amigo íntimo?',
    explicacao: 'Ter apenas um ou nenhum amigo confiável no trabalho ou na faculdade.  Pode evitar interações superficiais ou sociais em grande escala.',
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Dificuldade de construir laços afetivos'
  },
  {
    numeroTraco: 10,
    pergunta: 'Com frequência, durante uma conversa, você tem dificuldade de conter sua fala na hora que o outro está falando e acaba interrompendo?',
    explicacao: 'Dificuldade de conter sua fala e sem querer, acaba interrompendo o outro quando ele ainda está no meio da fala.',
    frequencia: 1.75,
    intensidade: 1.875,
    swot:'Dificuldade de conter a fala e comportamento de interrupção'
  },
  {
    numeroTraco: 11,
    pergunta: 'Você sente dificuldade para manter energia e foco em tarefas longas ou com muitas etapas?',
    explicacao: 'Queda de energia ou dispersão ao realizar tarefas repetitivas ou estruturadas, especialmente se forem pouco motivadoras ou exigirem foco sustentado. Exemplo: dificuldade para manter o ritmo em projetos extensos, mesmo com interesse no tema.',
    frequencia: 3.0,
    intensidade: 2.875,
    swot:'Dificuldade de manuteção de foco e energia em tarefas longas'
  },
  {
    numeroTraco: 12,
    pergunta: 'Você acredita que demora mais do que comum, ou o esperado, para tomar decisões ou agir em determinada situação.',
    explicacao: 'A tomada de decisão pode ser cuidadosa e demorada, especialmente quando há muitas variáveis envolvidas ou medo de errar ou até em situações mais banais. Exemplo: levar muito tempo para responder e-mails importantes ou escolher entre opções de um cardápio em um restaurante.',
    frequencia: 3.0,
    intensidade: 3.25,
    swot:'Demora para agir e na tomada de decisão'
  },
  {
    numeroTraco: 13,
    pergunta: 'Você tende a planejar excessivamente as tarefas antes de começar a fazer, se distrai com facilidade ou abandona as tarefas sem terminar de faze-las ?',
    explicacao: 'Investe muito tempo organizando tarefas ou prevendo possibilidades, mas ter dificuldade em começar ou finalizar. Exemplo: preparar uma apresentação com muito detalhe e ainda assim sentir que não está pronta e acabar deixando-a de lado para fazer outra coisa.',
    frequencia: 3.0,
    intensidade: 3.25,
    swot:'Dificuldade de iniciar e terminar tarefas'
  },
  {
    numeroTraco: 14,
    pergunta: 'Você tem dificuldade para iniciar tarefas por passar muito tempo planejando-as  e quando as inicia não consegue parar?',
    explicacao: 'Demora dias ou horas para começar uma tarefa simples por pensar demais em como executá-la, mas, ao começar, não conseguir parar, mesmo com sinais de cansaço.',
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Dificuldade de iniciar tarefas e hiperfoco'
  },
];

/**
 * Seed de Fraquezas e Ameaças SH
 */
async function seedFraquezasAmeacasSh() {
  console.log('🌱 Iniciando seed de Fraquezas e Ameaças SH...');

  let created = 0;
  let updated = 0;

  // Fazer upsert de cada registro (criar ou atualizar baseado no numeroTraco)
  for (const registro of FRAQUEZAS_AMEACAS_SH) {
    const existing = await prisma.fraquezasAmeacasSh.findFirst({
      where: { numeroTraco: registro.numeroTraco },
    });

    if (existing) {
      await prisma.fraquezasAmeacasSh.update({
        where: { id: existing.id },
        data: registro,
      });
      updated++;
    } else {
      await prisma.fraquezasAmeacasSh.create({
        data: registro,
      });
      created++;
    }
  }

  console.log(`✅ Fraquezas e Ameaças SH: ${created} registro(s) criado(s), ${updated} registro(s) atualizado(s).`);
}

/**
 * Seed de Fraquezas e Ameaças CH
 * Popula a tabela com os dados iniciais
 */
const FRAQUEZAS_AMEACAS_CH: Array<{
  numeroTraco: number;
  numHistoria: number;
  frequencia: number;
  intensidade: number;
  swot: string;
}> = [
  {
    numeroTraco: 1,
    numHistoria: 12,
    frequencia: 4.0,
    intensidade: 3.25,
    swot:'Dificuldade de expressar as emoções de forma visível em situações de forte carga afetiva'
  },
  {
    numeroTraco: 2,
    numHistoria: 19,
    frequencia: 2.75,
    intensidade: 2.875,
    swot:'Dificuldade em receber e responder a elogios ou gentilezas'
  },
  {
    numeroTraco: 3,
    numHistoria: 20,
    frequencia: 3.0,
    intensidade: 3.25,
    swot:'Respostas diferentes a sinais emocionais ou interações sociais'
  },
  {
    numeroTraco: 4,
    numHistoria: 22,
    frequencia: 2.85,
    intensidade: 2.8125,
    swot:'Dificuldade em demonstrar envolvimento emocional da forma esperada pelo outro'
  },
  {
    numeroTraco: 5,
    numHistoria: 5,
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Dificuldade em perceber sinais de turno nas conversas'
  },
  {
    numeroTraco: 6,
    numHistoria: 32,
    frequencia: 2.875,
    intensidade: 2.5625,
    swot:'Tendência a dar respostas breves ou literais, mesmo em assuntos importantes'
  },
  {
    numeroTraco: 7,
    numHistoria: 7,
    frequencia: 2.75,
    intensidade: 2.875,
    swot:'Dificuldade em se engajar em interações com objetivos compartilhados ou participação alternada'
  },
  {
    numeroTraco: 8,
    numHistoria: 17,
    frequencia: 2.75,
    intensidade: 2.0,
    swot:'Tendência a exigir alto desempenho das outras pessoas, sem aplicar o mesmo nível de exigência a si mesma'
  },
  {
    numeroTraco: 9,
    numHistoria: 14,
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Dificuldade em compreender o sentido prático de normas e expectativas sociais'
  },
  {
    numeroTraco: 10,
    numHistoria: 31,
    frequencia: 3.0,
    intensidade: 3.0,
    swot:'Irritabilidade ou agitação diante de interrupções, com necessidade de recomeçar para recuperar clareza ou controle'
  },
  {
    numeroTraco: 11,
    numHistoria: 1,
    frequencia: 3.0,
    intensidade: 3.0,
    swot:'Dificuldade em perceber limites pessoais e espaciais nas interações'
  },
  {
    numeroTraco: 12,
    numHistoria: 28,
    frequencia: 2.875,
    intensidade: 2.5625,
    swot:'Tendência a elaborar histórias com muitos detalhes, às vezes acrescentando elementos não vividos'
  },
  {
    numeroTraco: 13,
    numHistoria: 4,
    frequencia: 1.75,
    intensidade: 1.875,
    swot:'Reação agressiva ou ríspida diante de brincadeiras'
  },
  {
    numeroTraco: 14,
    numHistoria: 33,
    frequencia: 3.0,
    intensidade: 2.25,
    swot:'Afastamento repentino de relacionamentos após uma decepção não verbalizada'
  },
  {
    numeroTraco: 15,
    numHistoria: 18,
    frequencia: 2.75,
    intensidade: 2.375,
    swot:'Sensação frequente de estar sendo tratado pior que os outros'
  },
  {
    numeroTraco: 16,
    numHistoria: 23,
    frequencia: 2.85,
    intensidade: 3.1875,
    swot:'Desejo de ser/fazer melhor combinado com sentimentos de inferioridade'
  },
  {
    numeroTraco: 17,
    numHistoria: 24,
    frequencia: 2.95,
    intensidade: 2.59375,
    swot:'Autoestima vulnerável'
  },
  {
    numeroTraco: 18,
    numHistoria: 10,
    frequencia: 3.0,
    intensidade: 2.59375,
    swot:'Autocentrismo'
  },
  {
    numeroTraco: 19,
    numHistoria: 11,
    frequencia: 3.0,
    intensidade: 2.375,
    swot:'Reação emocional intensa diante de críticas ou rejeições'
  },
  {
    numeroTraco: 20,
    numHistoria: 21,
    frequencia: 3.0,
    intensidade: 3.25,
    swot:'Baixa responsividade social quando altamente envolvida em um interesse pessoal'
  },
  {
    numeroTraco: 21,
    numHistoria: 29,
    frequencia: 2.875,
    intensidade: 2.5625,
    swot:'Tendência a falar repetidamente sobre temas de interesse específico nas conversas'
  },
  {
    numeroTraco: 22,
    numHistoria: 30,
    frequencia: 2.875,
    intensidade: 2.5625,
    swot:'Tendência a perceber erros ou inconsistências com facilidade, o que pode levar à críticas frequentes'
  },
  {
    numeroTraco: 23,
    numHistoria: 3,
    frequencia: 2.62,
    intensidade: 3.25,
    swot:'Dificuldade em seguir regras que não entende ou não concorda, com tendência a reagir impulsivamente para questioná-las ou modificá-las'
  },
  {
    numeroTraco: 24,
    numHistoria: 15,
    frequencia: 2.75,
    intensidade: 2.625,
    swot:'Tendência a agir conforme interesses próprios, ignorando normas sociais ou padrões externos'
  },
  {
    numeroTraco: 25,
    numHistoria: 13,
    frequencia: 1.75,
    intensidade: 2.0,
    swot:'Rigidez na defesa dos próprios princípios, mesmo quando descontextualizados'
  },
  {
    numeroTraco: 26,
    numHistoria: 16,
    frequencia: 3.0,
    intensidade: 2.875,
    swot:'Tendência a interpretar falas, instruções e situações de forma literal, sem captar nuances implícitas'
  },
  {
    numeroTraco: 27,
    numHistoria: 9,
    frequencia: 2.75,
    intensidade: 3.0,
    swot:'Tendência a manter uma noção rígida de justiça, sem considerar o contexto ou as nuances das situações'
  },
  {
    numeroTraco: 28,
    numHistoria: 25,
    frequencia: 2.5,
    intensidade: 2.875,
    swot:'Dificuldade em ter a iniciativa para desenvolver metas, elaborar planos ou fazer determinadas atividades sozinho'
  },
  {
    numeroTraco: 29,
    numHistoria: 26,
    frequencia: 2.5,
    intensidade: 3.5,
    swot:'Dificuldade para gerenciar tarefas de forma independente, especialmente as que exigem organização prática ou envolvem demandas burocráticas'
  },
  {
    numeroTraco: 30,
    numHistoria: 8,
    frequencia: 2.75,
    intensidade: 2.75,
    swot:'Dificuldades com responsabilidades práticas do dia a dia por não perceber expectativas sociais ou emocionais implícitas'
  },
  {
    numeroTraco: 31,
    numHistoria: 27,
    frequencia: 2.75,
    intensidade: 2.25,
    swot:'Tendência a ter conflitos em casa relacionados ao cumprimento de rotinas ou cuidados pessoais esperados no dia a dia'
  },
  {
    numeroTraco: 32,
    numHistoria: 2,
    frequencia: 1.75,
    intensidade: 1.875,
    swot:'Tendência a demonstrar sofrimento quando rotinas típicas, rituais ou atividades de lazer são alteradas'
  },
  {
    numeroTraco: 33,
    numHistoria: 6,
    frequencia: 2.875,
    intensidade: 2.5625,
    swot:'Tendência a ter pensamentos persistentes e repetitivos que são difíceis de interromper'
  }
];

/**
 * Seed de Fraquezas e Ameaças CH
 */
async function seedFraquezasAmeacasCh() {
  console.log('🌱 Iniciando seed de Fraquezas e Ameaças CH...');

  let created = 0;
  let updated = 0;

  // Fazer upsert de cada registro (criar ou atualizar baseado no numeroTraco)
  for (const registro of FRAQUEZAS_AMEACAS_CH) {
    const existing = await prisma.fraquezasAmeacasCh.findFirst({
      where: { numeroTraco: registro.numeroTraco },
    });

    if (existing) {
      await prisma.fraquezasAmeacasCh.update({
        where: { id: existing.id },
        data: registro,
      });
      updated++;
    } else {
      await prisma.fraquezasAmeacasCh.create({
        data: registro,
      });
      created++;
    }
  }

  console.log(`✅ Fraquezas e Ameaças CH: ${created} registro(s) criado(s), ${updated} registro(s) atualizado(s).`);
}

/**
 * Seed de Histórias Sociais
 * Adicione aqui os dados para popular a tabela HistoriasSociais
 */
async function seedHistoriasSociais() {
  const HISTORIAS_SOCIAIS: Array<{
    numeroHistoria: number;
    introducao: string;
    titulo: string;
    personagem: string;
    ambientacao: string;
    historia: string;
    questionamento: string;
    perguntaIntensidade: string;
    intensidadeLeve: string;
    intensidadeModerada: string;
    intensidadeAlta: string;
  }> = [
    {
      numeroHistoria: 1,
      introducao: 'Em algumas situações do dia a dia, certas pessoas têm uma maneira espontânea de agir ou de ajudar, especialmente quando percebem algo que poderia ser feito de um modo mais eficiente ou organizado. Às vezes, esse impulso de colaborar, reorganizar ou sugerir melhorias surge de forma natural — como uma tentativa genuína de contribuir ou deixar o ambiente mais funcional. No entanto, quando isso acontece em espaços compartilhados, como a casa de outra pessoa, o trabalho ou ambientes coletivos, pode gerar reações diferente do que se imaginava.',
      titulo: 'Só estou tentando ajudar',
      personagem: 'Rafael, 39 anos, namora há alguns meses.',
      ambientacao: 'Casa da namorada.',
      historia: 'Rafael visita a namorada com frequência. Gosta do clima da casa, do tempo juntos e de conversar sobre tudo. Quando chega na casa dela, logo coloca sua mochila em cima do sofá, seu computador em cima da mesa de jantar e seus pertences pessoais de higiene como perfume e gel de cabelo em cima da pia do banheiro. Quando nota que algo poderia ser feito de forma mais prática, sempre comenta, e muitas vezes sempre faz os mesmos comentários toda vez que vai na casa da namorada. Por exemplo, toda semana ele diz: “Se você organizar os livros por tema, fica mais fácil achar depois.” e toda semana a namorada responde: “Eu não ligo muito para isso, está bom do jeito que está “. Rafael insiste e mesmo após a namorada mudar de assunto, durante algum tempo, ele fica  pensando que os livros poderiam ser organizados por tema.',
      questionamento: 'Você já tentou ajudar alguém sugerindo com frequência, um jeito diferente de fazer as coisas ou soluções para problemas, mesmo que não tenham te perguntado ou pedido? Ou já ocupou um espaço de alguém de forma espontânea, sem pensar muito ou perguntar onde seria melhor colocar suas coisas? Isso pode ter acontecido em situações que envolvam parceiros românticos, mas também em outras relações próximas, como com amigos, familiares ou colegas de estudo ou trabalho.',
      perguntaIntensidade: 'Em algumas situações, isso pode acontecer de forma mais sutil, com pequenas sugestões ou gestos, enquanto em outras pode ser mais intensa — como mudar coisas de lugar, dar muitas sugestões seguidas ou ocupar o espaço sem perceber o impacto disso nos outros. Use as cores para indicar como isso costuma acontecer com você:',
      intensidadeLeve: '',
      intensidadeModerada: '',
      intensidadeAlta: '',
    },
    {
      numeroHistoria: 2,
      introducao: 'Às vezes, quando algo não acontece do jeito que esperávamos, é como se uma onda tomasse conta da gente. O coração acelera, a respiração muda, e as palavras parecem fugir ou sair mais fortes do que gostaríamos. Em casa, com pessoas próximas, esse turbilhão pode ser ainda mais intenso, porque existe afeto, confiança  e, muitas vezes, expectativas que nem sempre são ditas em voz alta. Esse é o caso da Clara, a personagem principal da história abaixo.',
      titulo: 'Quando tudo vem de uma vez',
      personagem: 'Clara, 28 anos, mora com os pais e o irmão mais novo.',
      ambientacao: 'Casa, fim de semana.',
      historia: 'Clara estava animada para o fim de semana. Havia planejado passar a tarde ouvindo música e organizando sua coleção de livros, uma atividade que a ajudava a relaxar. Mas, logo após o café da manhã, sua mãe avisou que a tia viria visitar e queria usar o quarto de Clara para descansar. Assim que ouviu aquilo, algo dentro dela se embaralhou. O peito apertou, os olhos arderam, e a voz saiu alta, quase gritando: “Sempre mudam tudo! Nunca me avisam antes!” Sem pensar muito, ela bateu a porta do quarto. Em seguida, se encolheu na cama, sentindo-se dominada por uma mistura de raiva, culpa e tristeza. Ela fica na cama até a visita chegar.',
      questionamento: 'Você já viveu um momento em que algo importante para você mudou de forma inesperada, gerando uma frustração tão intensa que foi difícil conter a emoção e você acabou dizendo algo mais ríspido, levantando o tom de voz, chorando ou reagindo de forma impulsiva? Com algumas pessoas esse tipo de situação pode acontecer em casa, na faculdade, no trabalho, com amigos ou até mesmo com um parceiro romântico...',
      perguntaIntensidade: 'Pense em como você costuma reagir quando algo que era importante para você muda de forma inesperada — como um plano desmarcado, uma alteração de última hora, ou quando as coisas simplesmente não saem como você esperava.',
      intensidadeLeve: 'Você sente um desconforto ou frustração, talvez fique mais quieto(a) ou pensativo(a), mas consegue se reorganizar aos poucos. Pode se adaptar à nova situação, mesmo que com algum esforço.',
      intensidadeModerada: 'A frustração é mais visível. Você pode se isolar por um tempo, evitar interações ou ficar emocionalmente abalado(a) por algumas horas. Talvez precise de apoio ou tempo para conseguir se acalmar.',
      intensidadeAlta: 'A reação é muito intensa. Você pode até chorar, ter uma crise emocional, reagir impulsivamente, se afastar completamente ou ter dificuldade de seguir com o dia. A frustração domina e a sensação de perda de controle é muito forte.',
    },
    {
      numeroHistoria: 3,
      introducao: 'Algumas normas ou regras, aparentemente sem sentido, no ambiente de trabalho parecem existir apenas porque sempre foram assim. Quando algo não faz sentido, o impulso de apontar, discutir ou tentar mudar pode ser inevitável  mesmo que os outros prefiram simplesmente aceitar. Para algumas pessoas, lidar com regras assim pode ser confuso ou até gerar um desconforto profundo. Esse é o caso do Vinícios, o personagem da história abaixo.',
      titulo: 'Não é só porque sempre foi assim',
      personagem: 'Vinícius, 34 anos, analista de dados.',
      ambientacao: 'Trabalho.',
      historia: 'Vinícius gosta do que faz em seu trabalho, tem um bom desempenho e cumpre os prazos com eficiência, mas uma coisa o incomoda: toda semana precisa preencher um formulário da área de recursos humanos descrevendo o que já entregou na semana, mesmo que tudo já esteja no sistema principal da empresa. Para ele, parece uma regra sem sentido, então, numa reunião, o gestor lembra que é sexta-feira e que todos devem preencher o formulário antes de irem embora. Então, Vinícius diz que é uma perda de tempo, que ninguém lê aquilo, e que seria melhor parar com essa exigência. O gestor responde que é uma política da empresa. Vinícius insiste. Sente que precisa explicar, argumentar que essa regra não faz sentido. O gestor encerra a reunião, dizendo que as coisas são assim e não vão mudar. Vinícios vai embora frustrado e fica pensando no assunto por muitas horas.',
      questionamento: 'Alguma vez você já se sentiu profundamente incomodado com uma regra, rotina ou jeito de fazer as coisas que parecia não fazer sentido pra você e tentou argumentar, explicar ou propor uma mudança? Esse tipo de situação pode acontecer também em casa, na faculdade, em grupos de convivência, ou até mesmo em um relacionamento romântico.',
      perguntaIntensidade: 'Quando esse tipo de situação acontece — em que uma regra ou uma exigência parece sem sentido pra você — e você reage de forma negativa, qual costuma ser a intensidade da sua reação? Em algumas situações, a reação pode ser mais contida, em outras, mais intensa ou difícil de controlar. Use as cores para indicar como isso costuma acontecer com você:',
      intensidadeLeve: 'Você expressa seu incômodo de forma mais leve. Pode comentar com alguém ou reclamar de forma pontual, mas logo deixa o assunto de lado e segue com a tarefa, mesmo contrariado(a).',
      intensidadeModerada: 'Você reclama com mais ênfase, comenta com várias pessoas, insiste no assunto e continua incomodado(a) por um tempo. Pode fazer a tarefa, mas com resistência ou atraso.',
      intensidadeAlta: 'A reação é muito forte. Você discute com colegas ou superiores, se recusa a cumprir a tarefa, ou fica tão irritado(a) que se afasta e perde o foco.',
    },
    {
      numeroHistoria: 4,
      introducao: 'Em algumas situações sociais, principalmente em grupos ou rodas de conversa, pode ser difícil entender o tom ou a intenção do que foi dito. O que para uns parece brincadeira ou piada leve, para outros pode soar como crítica, zombaria ou falta de respeito.',
      titulo: 'Não tem a menor graça',
      personagem: 'Felipe, 21 anos, cursa engenharia.',
      ambientacao: 'Sala de aula e pátio da faculdade',
      historia: 'Felipe costuma ficar em silêncio nas rodas de conversa e quando tem algo específico ou importante a dizer, fala com propriedade, dizendo tudo que sabe, descrevendo detalhes importantes que ninguém sabia. Durante uma pausa entre aulas, um colega imita o jeito que Felipe se senta, brincando: “É o nosso Shelton brasileiro!”. Outro ri e comenta: “Quando fala sempre dá uma palestra para a gente”. Felipe se vira rápido e responde alto: “Se vocês têm um problema comigo, falem direto. Ficar fazendo graça não é engraçado.” Os colegas se entreolham, sem reação. Um deles tenta dizer que era só zoeira, “brincadeira entre amigos”. Mas Felipe já está andando para longe, com o corpo tenso e a cabeça cheia.',
      questionamento: 'Você já se sentiu incomodado com uma brincadeira ou piada sobre você, mesmo quando os outros disseram que era só "zoeira" e acabou respondendo de forma mais direta ou grosseira, como se precisasse se defender de algo? Pode ter acontecido na faculdade, mas também em outros lugares — como no trabalho, em reuniões familiares ou até mesmo entre amigos.',
      perguntaIntensidade: 'Quando você percebe que foi alvo de uma piada, brincadeira ou comentário que te fez sentir exposto(a) ou desrespeitado(a), e tem uma reação negativa, qual costuma ser a intensidade da sua reação?Use as cores para indicar como isso costuma acontecer com você:',
      intensidadeLeve: 'Você se incomoda, talvez fique em silêncio ou comente algo breve, mas consegue seguir em frente. A reação é contida, mesmo com desconforto.',
      intensidadeModerada: 'Você rebate a piada ou responde de forma firme. Fica irritado(a) por um tempo e pode se afastar do grupo ou da conversa.',
      intensidadeAlta: 'ocê reage de forma intensa e imediata — fala alto, confronta os outros, perde o controle emocional ou se retira do local visivelmente abalado(a).',
    },
    {
      numeroHistoria: 5,
      introducao: 'Em algumas conversas, o entusiasmo por um assunto pode ser tão grande que se torna difícil conter a vontade de falar. Às vezes, a fala vem como um impulso, uma ideia ou detalhe importante surge  e precisa ser falado antes que desapareça da cabeça. Então, a pessoa age de maneira espontânea, falando em tempo real, tudo que vai surgindo em sua mente. Esse é o caso da Camila, a personagem da história abaixo.',
      titulo: 'Pera aí, pera ai',
      personagem: 'Camila, 27 anos.',
      ambientacao: 'Barzinho tranquilo, encontro com dois amigos próximos.',
      historia: 'Camila adora quando o grupo se encontra. Está animada para falar sobre o documentário que assistiu na noite anterior, ela achou incrível, e não para de pensar nas conexões com a seu trabalho. No encontro, Camila fala com entusiasmo, enquanto um dos amigos tenta comentar algo sobre o documentário, sem perceber Camila o interrompe. “Pera ai, rapidinho, sabe o que é mais curioso ainda? No episódio três…” A outra amiga tenta dar uma opinião, mas Camila continua. “Pera aí, pera ai! Você viu que aquilo aconteceu porque ......”',
      questionamento: 'Em algumas conversas, o entusiasmo por um assunto pode ser tão grande que se torna difícil conter a vontade de falar. Você já viveu momentos assim, em que, mesmo com outras pessoas falando, você acaba interrompendo ou falando por cima, porque sente que precisa compartilhar logo o que está pensando? Isso pode acontecer em situações informais, como em encontros com amigos, em reuniões de trabalho, na sala de aula ou em outras conversas do dia a dia.',
      perguntaIntensidade: 'Quando isso acontece — quando você está muito envolvido(a) com um assunto e acaba interrompendo ou falando por cima de outras pessoas —, qual costuma ser a intensidade da sua reação? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você interrompe de leve',
      intensidadeModerada: 'Sente dificuldade de se conter e interrompe várias vezes em um curto espaço de tempo',
      intensidadeAlta: 'Você fala de forma impulsiva e tem dificuldade real de parar porque está muito empolgado',
    },
    {
      numeroHistoria: 6,
      introducao: 'Algumas situações deixam marcas que o pensamento não consegue soltar com facilidade. Mesmo depois de uma conversa já ter terminado, certas palavras continuam ecoando, como se precisassem ser revistas, reavaliadas, reorganizadas. Às vezes, isso acontece durante horas, dias e até semanas. Esse é o caso da Letícia, a personagem da história abaixo.',
      titulo: 'Aquilo não sai da minha cabeça',
      personagem: 'Letícia, 31 anos.',
      ambientacao: 'Trabalho e casa.',
      historia: 'Letícia é uma ótima profissional e gosta muito de seu trabalho. Certo dia, em uma reunião, o gerente diz que os relatórios de Letícia estão bons, “mas que talvez ela devesse ser menos detalhista, ir mais direto ao ponto”. Ele fala em tom leve, como se fosse só uma sugestão. Letícia sorri, agradece e anota. Mas, por dentro, a frase se repete sem parar. “Menos detalhista... O que ele quis dizer com isso? Que eu complico? Que estou fazendo errado?” Durante o resto do dia, ela tenta focar, mas volta e meia se perde nos próprios pensamentos. No ônibus de volta para casa, continua ruminando. Quando chega, conta para companheiro. Ele diz que parece algo pequeno e que ela não deveria ficar se preocupando com isso. Ela vai dormir com o assunto ainda rondando. No dia seguinte, acorda pensando no mesmo trecho da reunião, e por muitos dias, o assunto ainda ecoa em sua mente.',
      questionamento: 'Algumas situações deixam pensamentos repetitivos, difíceis de desligar. Mesmo depois que uma conversa já terminou, certas palavras ou expressões continuam voltando à mente, como se fosse necessário entender melhor o que foi dito — ou o que ficou subentendido. Você já passou por momentos assim, em que uma fala, um comentário ou um detalhe da interação, ou até mesmo, um assunto ou tema específico que mexeu com você ficou “preso” na sua cabeça por horas, dias ou até semanas, te fazendo pensar e repensar o que aconteceu? Isso pode acontecer em diferentes contextos: no trabalho, na faculdade, com amigos, em reuniões ou até em trocas simples do dia a dia.',
      perguntaIntensidade: 'Quando isso acontece — quando uma situação fica ecoando na sua cabeça por muito tempo —, qual costuma ser a intensidade desse processo? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'O pensamento volta algumas vezes ao longo do dia, mas você consegue se distrair ou deixar de lado.',
      intensidadeModerada: 'A situação ocupa seus pensamentos com frequência por dias. Você tenta parar de pensar, mas acaba voltando ao mesmo ponto, mesmo durante momentos de descanso.',
      intensidadeAlta: 'O pensamento se repete de forma intensa e constante, por muitos dias ou semanas. Você perde o sono, sente dificuldade de concentração e não consegue desligar, mesmo tentando.',
    },
    {
      numeroHistoria: 7,
      introducao: 'Em relacionamentos próximos, é comum que as pessoas falem sobre o que gostam, compartilhem descobertas ou comentem assuntos importantes pra elas. Mesmo que o tema não desperte o mesmo interesse, espera-se algum envolvimento, comentários ou reações. Para algumas pessoas, isso pode ser difícil ,não por desatenção, mas porque nem sempre faz sentido falar algo que não é o que realmente pensam ou sentem. Esse é o caso do André, o personagem da história abaixo.',
      titulo: 'Ah... que legal.',
      personagem: 'André, 35 anos.',
      ambientacao: 'Em casa com a companheira',
      historia: 'A namorada de André está animada. Descobriu uma exposição sobre arquitetura japonesa que abre no fim de semana. Ela fala com empolgação, descreve detalhes, mostra o site no celular.  André escuta tudo em silêncio. No fim, responde: “Ah... que legal.” A companheira espera mais — talvez uma pergunta, uma sugestão, um comentário. Mas André não diz mais nada. A companheira muda de assunto. André percebe um leve incômodo no ar, mas não sabe exatamente o que causou aquilo.',
      questionamento: 'Você já esteve em uma conversa onde o outro falava com empolgação sobre algo, e você respondeu com frases curtas? Pode ter sido com um parceiro romântico, mas também com amigos, familiares ou colegas.',
      perguntaIntensidade: 'Quando isso acontece, como costuma ser a intensidade da sua resposta? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você responde de forma simples, mas com algum engajamento. Pode fazer uma pergunta ou um comentário breve, mesmo sem se aprofundar.',
      intensidadeModerada: 'Você responde com poucas palavras, sem desenvolver o assunto ou puxar conversa.',
      intensidadeAlta: 'Você mal responde ou praticamente não reage.',
    },
    {
      numeroHistoria: 8,
      introducao: 'Manter a casa em ordem pode exigir planejamento, memória, atenção a detalhes e uma sequência de ações que nem sempre são tão simples quanto parecem. Para algumas pessoas, essas atividades podem se tornar confusas ou até sobrecarregantes. Às vezes, elas nem percebem que algo precisa ser feito, ou não sabem por onde começar. Isso pode gerar tensão quando outras pessoas da casa têm expectativas diferentes. Esse é o caso do Eduardo, o personagem da história abaixo.',
      titulo: 'Eu não tinha reparado',
      personagem: 'Eduardo, 37 anos.',
      ambientacao: 'Casa onde mora com o companheiro.',
      historia: 'Eduardo trabalha homeoffice. Sua companheira chega em casa depois do trabalho. A cozinha ainda está bagunçada desde o almoço, o cesto de roupas sujas continua no corredor e o lixo da sala não foi levado para fora. Eduardo está no sofá, com o notebook no colo. Quando a parceira pergunta sobre a bagunça, ele responde com naturalidade: “Eu nem reparei.. Ia fazer já já”. Eduardo não percebeu a urgência e nem que a pia estava cheia de louça do almoço. Ao olhar agora, até sente que deveria ter feito, mas a ideia só surgiu que a companheira o questionou.',
      questionamento: 'Você já se deu conta de que esqueceu ou não percebeu que precisava fazer alguma tarefa doméstica, como limpar, organizar ou jogar algo fora, só depois que alguém chamou a sua atenção e isso acabou gerando conflito ou mal-estar na convivência? Talvez tenha acontecido com um companheiro(a), mas também pode ter sido com familiares, colegas de apartamento ou outras pessoas com quem você dividiu a casa.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser o seu nível de percepção espontânea sobre o que precisa ser feito?Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você percebe algumas coisas, mas outras só nota quando alguém chama atenção.',
      intensidadeModerada: 'Você geralmente não percebe o que precisa ser feito até que alguém fale.',
      intensidadeAlta: 'Você quase nunca percebe ou repara por conta própria, mesmo que o ambiente esteja visivelmente bagunçado ou com tarefas pendentes.',
    },
    {
      numeroHistoria: 9,
      introducao: 'Em algumas situações sociais, certas falas ou comportamentos parecem claramente errados ou injustos para algumas pessoas — especialmente quando envolvem preconceitos, desigualdades ou ofensas sutis. Para quem tem uma percepção aguçada do que considera certo ou justo, pode ser difícil ficar em silêncio. A vontade de intervir vem de forma espontânea, quase automática, mesmo que ninguém mais diga nada ou que o ambiente reaja com desconforto. Esse é o caso de Helena, a personagem da história abaixo.',
      titulo: 'Ninguém vai falar nada?',
      personagem: 'Helena, 22 anos, estudante de Letras.',
      ambientacao: 'Sala de aula na faculdade.',
      historia: 'Durante uma aula, um professor faz uma piada com sotaques regionais. A turma ri. Mas Helena olha séria para o colega ao lado, que é do interior e parece desconfortável. Sem pensar duas vezes, ela levanta a mão. “Professor, isso é preconceito linguístico. Não tem graça. A sala silencia. O professor tenta amenizar: “Foi só uma brincadeira…” Helena insiste: “Brincadeira com desigualdade não é engraçada.” Depois da aula, duas colegas comentam que ela exagerou, que era só um comentário leve. Helena sente o rosto quente. Não entende por que ninguém mais se posicionou. Para ela, era óbvio que alguém precisava defender aquilo.',
      questionamento: 'Você já presenciou algo que te pareceu injusto ou errado com alguém e sentiu que precisava reagir imediatamente, mesmo quando ninguém mais falou nada? Você já defendeu alguém ou se posicionou com firmeza, e depois teve a sensação de que os outros acharam sua reação exagerada? Esse tipo de situação pode ter sido na faculdade, mas também em outras situações, como no trabalho, em casa ou em grupos sociais.',
      perguntaIntensidade: 'Quando isso acontece — quando você sente que precisa se posicionar diante de algo que considera injusto ou errado —, qual costuma ser a intensidade da sua reação? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você comenta ou se posiciona de forma mais contida, tentando equilibrar firmeza e cuidado.',
      intensidadeModerada: 'Você reage com mais firmeza, eleva o tom ou insiste no ponto.',
      intensidadeAlta: 'Você reage de forma direta e intensa, interrompe, confronta ou insiste.',
    },
    {
      numeroHistoria: 10,
      introducao: 'Em relações próximas — como com amigos, familiares ou parceiros românticos — é comum que haja uma troca de experiências, sentimentos e relatos do dia a dia. Compartilhar o que aconteceu, ouvir com atenção e demonstrar interesse pelo que o outro está contando são comportamentos esperados em interações mais íntimas. No entanto, algumas pessoas, mesmo tendo afeto e consideração, podem não perceber que acabam falando muito mais sobre seus próprios assuntos do que o outro.',
      titulo: 'Ah, eu nem tinha pensado em te perguntar',
      personagem: 'Lucas, 29 anos.',
      ambientacao: 'Encontro com amigo de longa data.',
      historia: 'Lucas encontra o melhor amigo em uma cafeteria. Eles não se veem há semanas. Assim que sentam, Lucas começa a contar sobre sua rotina, o novo projeto no trabalho, os problemas com o vizinho, e a última série que assistiu. O tempo passa rápido. Quando olha o relógio, já está na hora de ir embora. O amigo não conseguiu contar as novidades. Na saída, o amigo diz: “Ah, depois te conto como foi minha prova de mestrado.” Lucas para, surpreso. “Ah é né? Foi hoje?”',
      questionamento: 'Você já viveu situações em que, sem perceber, falou por muito tempo sobre seus próprios assuntos e depois notou que o outro não teve espaço para contar o que queria? Talvez tenha sido só depois de um comentário ou de perceber o tempo passando que você se deu conta disso.',
      perguntaIntensidade: 'Quando isso acontece — quando você se envolve em conversas com pessoas próximas —, qual costuma ser o grau com que você fala principalmente sobre os seus próprios assuntos? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você fala bastante sobre os seus assuntos, mas escuta quando o outro começa a falar',
      intensidadeModerada: 'Você fala por mais tempo e às vezes corta ou muda de assunto quando o outro começa a falar.',
      intensidadeAlta: 'Você fala a maior parte do tempo e o outro quase não consegue participar.',
    },
    {
      numeroHistoria: 11,
      introducao: 'Manter um relacionamento saudável exige lidar com opiniões, críticas e diferenças de perspectiva. Para algumas pessoas, o simples ato de ouvir um feedback pode gerar uma reação emocional intensa, mesmo quando a intenção do outro é construtiva. A crítica, ainda que leve, pode ser percebida como rejeição ou desaprovação pessoal. A emoção vem primeiro, e a razão demora a alcançar o mesmo ritmo. Esse é o caso de Marina, a personagem da história abaixo.',
      titulo: 'Demorou pra passar”',
      personagem: 'Marina, 33 anos.',
      ambientacao: 'Apartamento onde mora com a companheira.',
      historia: 'Elas estavam conversando sobre a divisão das tarefas da casa quando a companheira comentou, de forma tranquila, que Marina deixava algumas coisas pela metade. A frase soou como uma acusação. Marina sentiu o rosto esquentar e ficou visivelmente irritada. ” Nos dias seguintes, ficou distante, mesmo sem entender direito o porquê.',
      questionamento: 'Você já ficou irritado ou magoado depois de ouvir uma crítica ou comentário, mesmo que a intenção da outra pessoa fosse ajudar, isso acabou afetando o seu humor ou a convivência por alguns dias? Isso pode ter acontecido em casa, mas também no trabalho ou faculdade com algum colega e até mesmo com amigos próximos.',
      perguntaIntensidade: 'Quando isso acontece — quando alguém faz um comentário ou uma crítica sobre algo que você fez —, qual costuma ser a intensidade da sua reação emocional? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você se chateia no momento, mas logo consegue se acalmar e conversar normalmente no mesmo dia.',
      intensidadeModerada: 'Você fica irritado(a) ou magoado(a) por um ou dois dias, mas depois volta a interagir e conversar aos poucos.',
      intensidadeAlta: 'Você fica muito abalada(o), evita contato e pode passar vários dias sem conseguir falar direito com a pessoa.',
    },
    {
      numeroHistoria: 12,
      introducao: 'Em certas situações, espera-se que as pessoas expressem empatia de forma visível — com palavras de consolo, gestos de apoio ou expressões faciais que indiquem tristeza, alegria ou preocupação. No entanto, algumas pessoas sentem, mas não conseguem demonstrar essas emoções externamente, o que pode causar mal-entendidos ou parecer indiferença. Esse é o caso de Bruno, o personagem da história abaixo.',
      titulo: 'Não soube o que dizer',
      personagem: 'Bruno, 25 anos.',
      ambientacao: 'Corredor da universidade.',
      historia: 'No intervalo entre as aulas, o amigo de Bruno contou que o namorado terminou com ele sem muitas explicações e que passou o fim de semana inteiro na bad, sem vontade de sair. Enquanto o colega falava, Bruno apenas olhava, quase sem reação. Quando o amigo terminou, ele disse em voz baixa: “Poxa…” O outro ficou em silêncio, esperando mais. Bruno percebeu o desconforto, mas não soube o que dizer nem como demonstrar que se importava.',
      questionamento: 'Quando alguém compartilha algo triste ou alegre com você, como uma perda, uma decepção, um problema pessoal ou uma conquista, com que frequência você percebe que tem dificuldade de demonstrar emoção ou dizer algo apropriado para a situação? Isso pode ter acontecido na faculdade, com colegas, mas também em casa, com familiares, no trabalho ou em outras situações.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser o grau com que você demonstra emoção ou reage à situação? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você demonstra alguma emoção, mesmo que de forma discreta, e consegue dizer algo de apoio, ainda que simples.',
      intensidadeModerada: 'Você sente empatia, mas sua reação é quase neutra; tem dificuldade de encontrar palavras ou expressar o que sente.',
      intensidadeAlta: 'Você sente, mas não demonstra nenhuma reação visível — nem facial, nem verbal —, e as pessoas costumam achar que você não se importou.',
    },
    {
      numeroHistoria: 13,
      introducao: 'Manter princípios firmes pode demonstrar integridade e senso de justiça. No entanto, quando a pessoa se prende demais às próprias regras, sem considerar o contexto ou o ponto de vista dos outros, o convívio pode se tornar desgastante. Algumas pessoas sentem uma necessidade intensa de corrigir o que consideram errado, mesmo quando isso gera desconforto ou tensão no ambiente. Esse é o caso de Carol, a personagem da história abaixo.',
      titulo: 'Mas tem que ser do jeito certo',
      personagem: 'Carol, 29 anos.',
      ambientacao: 'Encontro entre amigos em um café.',
      historia: 'Durante a conversa, uma amiga comentou que havia doado roupas para uma instituição de caridade. Carol logo interrompeu, dizendo que conhecia aquela instituição e que ela não era confiável — que vendia as roupas em vez de doar. Ela começou a explicar que, para fazer uma doação correta, era preciso procurar uma ONG cadastrada em um banco oficial, com selo de confiança e registro ativo. “Não adianta querer ajudar se for do jeito errado”, insistia. Os amigos tentaram mudar de assunto, mas Carol continuou explicando passo a passo como verificar o CNPJ das instituições e conferir a lista de entidades autorizadas. O clima ficou tenso; as pessoas começaram a se entreolhar, sem saber como reagir. Carol, no entanto, não percebeu o desconforto — só sentiu que, mais uma vez, estava tentando ensinar o certo e ninguém queria ouvir.',
      questionamento: 'Quando alguém faz ou diz algo que você considera errado, com que frequência você sente dificuldade de deixar passar, insistindo no seu ponto de vista, mesmo que a situação não seja tão grave? Isso pode ter acontecido com amigos, na faculdade, no trabalho, ou em outras situações sociais.',
      perguntaIntensidade: 'Quando isso acontece — quando alguém faz algo que você considera errado —, qual costuma ser o grau da sua reação? Use as cores para indicar como isso geralmente acontece com você:',
      intensidadeLeve: 'Você comenta o que pensa, mas consegue parar.',
      intensidadeModerada: 'Você insiste um pouco mais, tentando explicar ou convencer.',
      intensidadeAlta: 'Você não consegue interromper o assunto.',
    },
    {
      numeroHistoria: 14,
      introducao: 'Nem sempre as convenções sociais parecem fazer sentido para todo mundo. Para algumas pessoas, gestos automáticos — como cumprimentar todos ao chegar, fazer comentários breves para “quebrar o gelo” ou seguir certas etiquetas — podem parecer desnecessários ou artificiais.',
      titulo: 'Ah, tem que falar com todo mundo?',
      personagem: 'Leonardo, 31 anos.',
      ambientacao: 'Escritório, início do expediente.',
      historia: 'Leonardo chega ao trabalho e vai direto para a sua mesa. Ele acena com a cabeça para quem está por perto, mas não diz “bom dia” para todos. Pouco depois, uma colega comenta em tom leve: “Hoje o Leo tá sério, nem deu bom dia.” Ele se espanta. Não quis ser rude — só achou desnecessário repetir a saudação para cada pessoa, já que todos se veem todos os dias. Mais tarde, percebe que o clima ficou diferente, mas não entende muito bem o motivo.',
      questionamento: 'Você já viveu momentos em que outras pessoas acharam que você foi frio ou distante, mas na sua cabeça só estava sendo natural? Talvez em situações como chegar a um lugar e não cumprimentar todos individualmente, ou não comentar sobre assuntos do dia só para puxar conversa. Consegue lembrar de situações assim na escola, no trabalho ou em reuniões de família?',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você deixa de seguir esses costumes ou protocolos sociais que parecem pouco naturais? Use as cores para indicar como isso costuma acontecer com você:',
      intensidadeLeve: 'Você às vezes esquece ou deixa de seguir pequenas convenções, mas se ajusta quando percebe a expectativa.',
      intensidadeModerada: 'Você raramente adota esses costumes e, mesmo quando lembra, prefere não fazer se não parecer genuíno.',
      intensidadeAlta: 'Você não faz esses gestos sociais e mantém sua forma direta de agir, mesmo que os outros estranhem ou comentem.',
    },
    {
      numeroHistoria: 15,
      introducao: 'Às vezes, quando uma pessoa está muito concentrada em algo que gosta ou tem um ritual que lhe traz conforto, pode ser difícil se adaptar a mudanças de ambiente ou a costumes sociais diferentes. Nessas situações, ela tende a seguir seus próprios impulsos, priorizando o que faz sentido para si, mesmo que isso pareça estranho para os outros. Esse é o caso da Fernanda, personagem da história abaixo.',
      titulo: 'Mas é assim que eu começo meu dia',
      personagem: 'Fernanda, 33 anos.',
      ambientacao: 'Viagem em família.',
      historia: 'Fernanda está viajando com os pais e o irmão e todos descem juntos para o café da manhã do hotel. A família se senta animada em uma mesa grande, no centro do salão. Ela prefere mesas de canto, mas todas estão ocupadas então ela fica irritada. Pega seu prato, serve as mesmas coisas que costuma comer em casa — o mesmo tipo de pão, o mesmo suco — e se senta com eles a contra gosto. Enquanto os outros conversam sobre o passeio do dia, Fernanda abre o celular e começa a ler as notícias, como faz toda manhã. A mãe comenta: “Filha, guarda o celular um pouco, estamos de férias.” Fernanda sorri de leve, mas continua lendo. Para ela, aquele momento é o jeito certo de começar o dia.',
      questionamento: 'Quando sua rotina muda, você costuma manter seus hábitos do mesmo jeito, mesmo que o ambiente ou as pessoas ao redor estejam em outro ritmo? Isso pode acontecer em viagens, em cafés com amigos ou até em momentos de descanso com a família.',
      perguntaIntensidade: 'Quando isso acontece, quão forte é a sua necessidade de seguir esses rituais ou impulsos, mesmo que o contexto seja diferente?',
      intensidadeLeve: 'Você mantém alguns hábitos, mas consegue se adaptar quando percebe que o momento pede outra atitude.',
      intensidadeModerada: 'Você segue seus rituais na maior parte das vezes, ajustando detalhes apenas quando é indispensável.',
      intensidadeAlta: 'Você preserva seus rituais mesmo em situações sociais ou ambientes novos.',
    },
    {
      numeroHistoria: 16,
      introducao: 'Em algumas situações do dia a dia, as pessoas dizem coisas como “no começo da semana”, “bem cedo” ou “deixa pronto para apresentar”, contando que o outro compreenda o que está subentendido. Há quem entenda essas instruções exatamente como foram ditas, executando a tarefa de modo direto, sem acrescentar interpretações não faladas. Esse modo de compreender pode gerar desencontros quando as expectativas não foram especificadas em detalhes.',
      titulo: 'Mas você disse "no começo da semana"',
      personagem: 'Joel, 36 anos.',
      ambientacao: 'Agendamento com cliente',
      historia: 'A gerente diz a Joel: “Marca uma conversa com o cliente no começo da semana, logo cedo, e manda o convite.” Ele verifica as agendas e agenda para segunda-feira às 8h, envia o convite e atualiza o canal do projeto. Minutos depois, a gerente pergunta se ele confirmou o horário habitual do cliente e sugere algo “depois das 9h”. Joel responde que seguiu o que foi solicitado: começo da semana e logo cedo. O convite precisa ser remarcado.',
      questionamento: 'Quando alguém dá uma orientação com palavras abertas (como “cedo”, “rápido”, “pronto para apresentar”), com que frequência você executa exatamente o que foi dito, sem acrescentar o que não foi especificado? Isso pode acontecer no trabalho, na faculdade ou em casa, quando você cumpre a instrução de forma literal e depois percebe que havia expectativas não ditas.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você segue a instrução literalmente, sem recorrer a pistas implícitas?',
      intensidadeLeve: 'Você executa o pedido como foi dito e ajusta se percebe que havia detalhes não especificados.',
      intensidadeModerada: 'Você cumpre a instrução literalmente na maior parte das vezes e só procura esclarecimentos quando algum ponto impede a entrega.',
      intensidadeAlta: 'Você segue a formulação exata do pedido e evita acrescentar interpretações.',
    },
    {
      numeroHistoria: 17,
      introducao: 'Em ambientes de convivência, é comum que as pessoas observem como os outros realizam tarefas, comunicam ideias ou cumprem prazos. Algumas pessoas prestam tanta atenção a esses detalhes que acabam percebendo pequenas falhas ou incoerências que passam despercebidas pelos demais. Às vezes, essa atenção se volta mais para o que os outros fazem do que para o seu próprio modo de agir.',
      titulo: 'Ah, ainda vou corrigir',
      personagem: 'Cláudia, 40 anos.',
      ambientacao: 'Reunião de equipe.',
      historia: 'Durante uma reunião, a equipe apresenta um relatório que Cláudia ajudou a revisar na semana anterior. Enquanto o gestor elogia o resultado, ela comenta que a fonte usada está diferente do padrão e que a introdução poderia ser mais objetiva. Os colegas se entreolham em silêncio. No fim do encontro, o gestor agradece a todos e lembra que a parte de Cláudia ainda precisa ser atualizada. Ela sorri e diz: “Sim, ainda vou corrigir, não tive tempo de ajustar, mas a minha versão final vai ficar direitinho.”',
      questionamento: 'Com que frequência você nota pequenos detalhes de coisas que os outros fizeram, e que poderiam ser feitos de outro jeito ou serem aprimorados?',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você observa e comenta as falhas ou inconsistências nos trabalhos ou atitudes dos outros?',
      intensidadeLeve: 'Você nota pequenas diferenças ou falhas e faz comentários pontuais quando considera realmente necessário.',
      intensidadeModerada: 'Você percebe com facilidade o que poderia ser melhorado e costuma comentar, mesmo em situações mais informais.',
      intensidadeAlta: 'Você observa e comenta detalhes com frequência, comparando o que os outros fazem com o que considera o padrão ideal.',
    },
    {
      numeroHistoria: 18,
      introducao: 'Em situações de grupo, nem sempre é fácil interpretar o tom das interações. Às vezes, pequenas diferenças no jeito como alguém fala ou age podem parecer sinais de rejeição ou preferência por outra pessoa. Isso pode gerar a sensação de estar sendo tratado de forma desigual, mesmo quando os motivos não são totalmente claros.',
      titulo: 'Acho que comigo é diferente',
      personagem: 'Bruno, 27 anos.',
      ambientacao: 'Grupo de trabalho.',
      historia: 'Bruno faz parte de um grupo de colegas que estão preparando uma apresentação. Durante a divisão de tarefas, ele percebe que as ideias dele costumam ser deixadas de lado. No dia seguinte, uma colega elogia a sugestão de outro participante que era parecida com a que ele havia dado antes. Bruno sente um aperto no peito e pensa: “Comigo eles sempre são mais exigentes.” Ele passa o resto da reunião mais calado, tentando entender se é impressão ou se realmente o tratam de modo diferente.',
      questionamento: 'Com que frequência você sente que é tratado de forma diferente ou menos valorizada em comparação com outras pessoas do grupo? Isso pode acontecer em reuniões, em trabalhos em grupo, com colegas de curso, amigos ou familiares, quando você tem a impressão de que as suas ideias ou atitudes recebem menos reconhecimento.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade da sua sensação de estar sendo tratado de forma desigual?',
      intensidadeLeve: 'Você percebe às vezes pequenas diferenças no tratamento, mas logo deixa de lado.',
      intensidadeModerada: 'Você nota com frequência essas diferenças e tende a refletir bastante sobre o que pode ter causado.',
      intensidadeAlta: 'Você sente com intensidade que é tratado de forma desigual e isso afeta sua confiança ou disposição para interagir.',
    },
    {
      numeroHistoria: 19,
      introducao: 'Receber elogios pode ser uma forma de reconhecimento pelo esforço, pelas conquistas ou algo em si que mereça ser valorizado. Algumas pessoas anseiam por esse tipo de validação, mas, quando ela acontece, acabam se sentindo desconfortáveis. Mesmo querendo ser valorizadas, podem reagir de forma automática, diminuindo o próprio mérito ou desviando o foco da conversa, o que às vezes faz o elogio perder o efeito.',
      titulo: 'Não foi nada demais',
      personagem: 'Marina, 34 anos.',
      ambientacao: 'Reunião de equipe.',
      historia: 'Durante a reunião semanal, o gestor elogia o relatório de Marina: “Seu levantamento ajudou muito na decisão do cliente, parabéns.” Ela sente um calor subir no rosto, todos olham para ela e, antes que perceba, responde: “Ah, foi sorte, eu só juntei os dados que já estavam prontos.” Alguns colegas riem de leve, e o gestor continua a pauta. Mais tarde, uma colega comenta: “Você devia aceitar o elogio, ficou ótimo mesmo.” Marina sorri, mas por dentro sente arrependimento — queria ter apenas dito “obrigada”.',
      questionamento: 'Com que frequência você se sente desconfortável quando é elogiado por algo que fez muito bem feito e sem querer acaba diminuindo o que fez ou desviando o assunto? Ou por algo que gostaria que fosse valorizado e sem querer falou algo que reduzia seu mérito? Isso pode acontecer em reuniões, apresentações ou conversas informais.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade da sua dificuldade em aceitar ou retribuir o elogio de forma natural?',
      intensidadeLeve: 'Você se sente um pouco envergonhado, mas consegue agradecer ou reagir de forma simples.',
      intensidadeModerada: 'Você costuma minimizar o que fez ou fazer comentários que tiram o foco do elogio.',
      intensidadeAlta: 'Você sente forte desconforto, evita o reconhecimento e responde de modo que anula o próprio mérito, mesmo querendo ser valorizado.',
    },
    {
      numeroHistoria: 20,
      introducao: 'Nas relações afetivas, as pessoas costumam trocar gestos e palavras que demonstram carinho, interesse e presença emocional. Mas, às vezes, alguém pode não perceber esses sinais da mesma forma ou responder de um jeito mais direto e sincero do que o outro esperava. Essas diferenças sutis na forma de reagir podem gerar confusão ou mágoa, mesmo quando a intenção é boa.',
      titulo: 'Ué... Eu só fui sincero',
      personagem: 'Marcos, 35 anos.',
      ambientacao: 'Apartamento do casal.',
      historia: 'Num sábado à noite, Vinícius mostra a nova camisa que comprou e pergunta: “Gostou? Achei que ficou bem em mim.” Marcos olha e responde: “A cor é bonita, mas acho que o outro modelo te deixava mais elegante.” Vinícius faz um meio sorriso e muda de assunto. Mais tarde, enquanto jantam, ele pergunta: “Quer ver um filme comigo depois?” Marcos diz: “Pode ver, eu tô cansado e quero deitar um pouco.” Vinícius apenas acena, tentando disfarçar a decepção. Para Marcos, foi uma conversa comum — ele só respondeu com sinceridade. Mas, no silêncio que se segue, percebe que o clima entre eles mudou.',
      questionamento: 'Com que frequência você percebe que suas respostas em conversas ou convites soaram diferentes do que o outro esperava? Isso pode acontecer em momentos de carinho, elogios ou convites simples, quando você responde de forma direta e sincera, sem perceber que o outro esperava uma reação mais afetiva.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que suas respostas ou reações fogem do que o outro espera em situações afetivas?',
      intensidadeLeve: 'Às vezes suas respostas são mais objetivas, mas você percebe depois e tenta se aproximar de outro modo.',
      intensidadeModerada: 'Suas respostas costumam ser sinceras e diretas, e só depois você nota que o outro esperava mais emoção ou acolhimento.',
      intensidadeAlta: 'Suas respostas frequentemente soam frias ou desconectadas para o outro, e você não percebe que o outro esperava mais emoção e acolhimento.',
    },
    {
      numeroHistoria: 21,
      introducao: 'Quando alguém se envolve profundamente em uma atividade que gosta, o tempo e o que acontece ao redor parecem desaparecer. Esse tipo de concentração intensa pode trazer prazer e satisfação, mas também fazer com que a pessoa não perceba os sinais do ambiente ou as expectativas dos outros naquele momento. Às vezes, isso acontece em situações de convivência, quando o grupo espera colaboração ou atenção compartilhada.',
      titulo: 'Eu só queria terminar o que comecei',
      personagem: 'Daniel, 29 anos.',
      ambientacao: 'Viagem com amigos, casa de praia.',
      historia: 'Daniel e três amigos alugam uma casa na praia para passar o fim de semana. Assim que chegam, todos começam a descarregar o carro, guardar as compras e arrumar os quartos. Enquanto isso, Daniel se senta no sofá com o notebook no colo, concentrado em ajustar o roteiro da viagem que montou com antecedência. Um dos amigos comenta: “Depois a gente vê isso, ajuda aqui primeiro.” Daniel nem percebe. Está tão focado em revisar horários e trajetos que só levanta quando todos já terminaram. O clima fica silencioso. Ele percebe tarde demais que os outros esperavam que ele participasse.',
      questionamento: 'Com que frequência você se envolve tanto em algo que gosta ou está fazendo que não percebe quando os outros esperam sua atenção ou ajuda? Isso pode acontecer em viagens, encontros ou momentos em grupo, quando você fica concentrado em uma atividade e só depois nota que os outros se frustraram com a sua ausência.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você se desliga do ambiente ao redor enquanto está focado em algo que gosta?',
      intensidadeLeve: 'Você às vezes se distrai com o que está fazendo, mas logo percebe e volta a interagir.',
      intensidadeModerada: 'Você se envolve tanto que demora a notar que os outros esperavam sua participação.',
      intensidadeAlta: 'Você fica completamente absorvido pelo que está fazendo, não percebe o que acontece ao redor e só entende depois que isso gerou desconforto.',
    },
    {
      numeroHistoria: 22,
      introducao: 'Em algumas relações, o vínculo emocional se expressa nas conversas cotidianas, nas palavras de incentivo, nas perguntas curiosas, nos comentários que mostram interesse genuíno. No entanto, algumas pessoas têm dificuldade em demonstrar esse envolvimento do modo que o outro espera. Mesmo sentindo carinho e valorizando a relação, podem parecer distantes ou pouco participativas em momentos que pedem empatia e entusiasmo.',
      titulo: 'Eu já te dei parabéns',
      personagem: 'André, 31 anos.',
      ambientacao: 'Restaurante, jantar de comemoração',
      historia: 'André e a namorada estão jantando para comemorar uma conquista dela no trabalho. Ela conta animada como foi elogiada pelo chefe e o quanto se esforçou para chegar até ali. André sorri e diz: “Parabéns, você merece.” Em seguida, pega o cardápio e comenta: “Você já sabe o que vai pedir?” Ela continua sorrindo, mas o brilho da conversa diminui. André não percebe. Acha que demonstrou apoio, mas o tom breve e a mudança de assunto fizeram parecer que ele não estava realmente envolvido.',
      questionamento: 'Com que frequência você percebe que suas reações em momentos de alegria, conquista ou tristeza soam mais neutras do que as pessoas esperam? Isso pode acontecer em relações amorosas, com amigos ou familiares, quando o outro busca proximidade emocional e você responde de forma mais contida ou direta.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que suas respostas soam neutras, mesmo quando você se importa de verdade?',
      intensidadeLeve: 'Às vezes suas respostas soam curtas, mas você demonstra apoio de outras formas.',
      intensidadeModerada: 'Suas reações costumam ser contidas e podem parecer distantes, mesmo quando você quer participar do momento.',
      intensidadeAlta: 'Suas respostas geralmente são vistas como frias ou indiferentes.',
    },
    {
      numeroHistoria: 23,
      introducao: 'Muitas pessoas se dedicam intensamente a atividades que gostam e se sentem felizes quando recebem reconhecimento por isso. Ainda assim, pode ser difícil aceitar elogios ou se orgulhar do próprio resultado. Em vez de celebrar a conquista, algumas pessoas se comparam aos outros e sentem que poderiam ter feito melhor, mesmo quando todos ao redor estão satisfeitos com o que fizeram.',
      titulo: 'O dos outros ficou mais bonito',
      personagem: 'Camila, 28 anos.',
      ambientacao: 'Casa da família, fim de semana.',
      historia: 'Camila passou as últimas semanas pintando um quadro e, quando terminou, pendurou-o na parede da sala para mostrar à família. Todos se aproximam para ver. A mãe diz: “Camila, ficou lindo! As cores combinam perfeitamente.” O pai concorda: “Tem um estilo muito seu, parece obra de galeria.” Camila sorri de leve e responde: “Ah, nada a ver, os quadros do pessoal do curso ficaram muito melhores. O meu tá meio torto, olha essa parte.” Os pais trocam um olhar, tentando convencê-la de que está bonito, mas ela já observa em silêncio, pensando que os quadros dos colegas ficaram muito melhores.',
      questionamento: 'Com que frequência você sente que, mesmo quando as pessoas elogiam algo que você fez, o resultado não parece bom o suficiente e que das outras pessoas sempre é melhor? Isso pode acontecer em casa, no trabalho ou em atividades pessoais, quando os outros demonstram admiração, mas você se concentra no que considera imperfeito e no resultado dos outros, que parece ser melhor.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você se sente insatisfeito ou inferior, mesmo recebendo elogios?',
      intensidadeLeve: 'Você aceita o elogio, mas pensa em ajustes que poderiam deixar o resultado melhor.',
      intensidadeModerada: 'Você tende a minimizar o que fez, achando que não é tão bom quanto os outros dizem.',
      intensidadeAlta: 'Você sente que nunca alcança o padrão que gostaria, ignora elogios e se compara constantemente com os outros.',
    },
    {
      numeroHistoria: 24,
      introducao: 'A forma como alguém se enxerga pode mudar muito dependendo das situações do dia a dia. Há pessoas que se sentem confiantes quando recebem reconhecimento, mas ficam abaladas com facilidade diante de críticas, comentários neutros ou até silêncios. Essa oscilação na autoconfiança faz com que pequenos acontecimentos tenham um grande impacto na maneira como se percebem.',
      titulo: 'Achei que tinha ido bem',
      personagem: 'Yuri, 30 anos.',
      ambientacao: 'Trabalho, sala de reunião.',
      historia: 'Yuri apresenta um projeto para o time e sai da reunião satisfeito. Logo em seguida, o chefe elogia o esforço, mas faz uma observação: “Na próxima, tenta detalhar melhor a parte dos custos.” Yuri sorri e responde que vai ajustar. Quando volta à mesa, já sente um nó no estômago. Pensa que o projeto deve ter ficado ruim e que decepcionou a equipe. À tarde, lê novamente os slides, imaginando o que poderia ter dito de outro modo. O elogio inicial perde o peso, e o comentário do chefe ecoa na cabeça até o fim do dia.',
      questionamento: 'Com que frequência uma crítica leve, um silêncio ou uma observação fazem você duvidar da sua capacidade, mesmo quando recebeu elogios antes? Isso pode acontecer no trabalho, em estudos ou em conversas pessoais, quando um simples comentário muda o modo como você se vê.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que sua autoconfiança muda diante de uma crítica ou falta de retorno positivo?',
      intensidadeLeve: 'Comentários ou críticas te afetam um pouco, mas você recupera a confiança com facilidade.',
      intensidadeModerada: 'Observações simples abalam bastante sua confiança e fazem você repensar o que fez.',
      intensidadeAlta: 'Qualquer crítica ou falta de elogio faz você se sentir inadequado ou fracassado, mesmo quando os resultados foram bons.',
    },
    {
      numeroHistoria: 25,
      introducao: 'Algumas pessoas têm facilidade em definir metas e agir com iniciativa, enquanto outras precisam de tempo ou de um empurrão externo para começar algo. Mesmo tendo boas ideias ou desejos claros, podem se sentir travadas para transformar planos em ação, esperando que alguém indique por onde começar. Isso pode gerar frustração, especialmente quando há expectativas vindas da família ou de pessoas próximas.',
      titulo: 'Você precisa decidir',
      personagem: 'Luciana, 26 anos.',
      ambientacao: 'Casa da família, final de semana.',
      historia: 'Luciana está sentada no sofá da sala, olhando o celular. A mãe pergunta: “E aí, filha, já pensou no curso que vai fazer esse semestre?” Luciana responde: “Ainda não sei… tô vendo umas opções.” O pai comenta: “Mas você sempre fala disso e nunca escolhe.” Ela suspira e diz: “Eu quero estudar, mas não sei se vale a pena agora, talvez eu espere mais um pouco.” A conversa termina sem decisão. À noite, sozinha no quarto, Luciana pensa em várias possibilidades, mas não consegue escolher nenhuma. No fundo, espera que alguém diga qual caminho seguir.',
      questionamento: 'Com que frequência você sente dificuldade em tomar iniciativa para começar algo importante, mesmo quando já pensou no assunto várias vezes? Isso pode acontecer em situações familiares, no trabalho ou nos estudos, quando você tem vontade de fazer algo, mas acaba esperando que os outros digam por onde começar.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade da sua dificuldade em iniciar ou seguir suas próprias metas e decisões?',
      intensidadeLeve: 'Você às vezes adia decisões, mas consegue agir quando há prazos ou incentivo.',
      intensidadeModerada: 'Você tende a esperar orientação dos outros e tem dificuldade em definir ou manter suas metas sozinho.',
      intensidadeAlta: 'Você raramente inicia algo por conta própria, sente dificuldade em planejar ou agir sem que alguém direcione o que deve ser feito.',
    },
    {
      numeroHistoria: 26,
      introducao: 'No dia a dia, muitas tarefas parecem simples: preparar uma refeição, organizar a casa, iniciar um trabalho da faculdade ou planejar um fim de semana. Ainda assim, algumas pessoas sentem dificuldade em fazer essas coisas por conta própria. Às vezes, não é falta de interesse, mas a necessidade de ter alguém junto para dar o primeiro passo, lembrar do que precisa ser feito ou manter o ritmo da rotina.',
      titulo: 'Se você não for, eu também não vou',
      personagem: 'Luciana, 26 anos.',
      ambientacao: 'Apartamento, fim de tarde.',
      historia: 'Luciana está em casa com sua amiga com quem divide apartamento. Ficou de fazer as compras do jantar mas não fez porque não queria ir sozinha, Já é fim de tarde, e a amiga pergunta: “Vamos fazer o jantar?” Luciana responde: “Ah, pode ser… mas o que a gente vai fazer?” A amiga propõe algo simples e pede para ela adiantar o arroz enquanto corta os legumes. Luciana senta na cadeira e diz: “Posso esperar você pra fazer junto? Não quero errar.” Quando a amiga sai para atender o telefone, Luciana fica parada, olhando o fogão. Depois de um tempo, abre o celular e começa a ver vídeos. Quando a irmã volta, o arroz ainda está cru. Luciana dá um sorriso sem graça: “Eu não sabia se devia começar.”',
      questionamento: 'Com que frequência você sente dificuldade em fazer tarefas sozinho e acaba esperando que alguém comece, lembre ou oriente o que deve ser feito? Isso pode acontecer em casa, com amigos ou em trabalhos em grupo, quando você espera ter a presença ou da iniciativa de outra pessoa para agir.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade da sua dificuldade em realizar tarefas sem apoio ou acompanhamento de alguém?',
      intensidadeLeve: 'Você faz algumas tarefas sozinho, mas se sente mais confortável quando alguém está junto ou orienta.',
      intensidadeModerada: 'Você consegue fazer sozinho mas prefere esperar o incentivo ou da presença dos outros para começar ou terminar algo.',
      intensidadeAlta: 'Você realiza tarefas sozinho, mas em diversas tarefas, tende a esperar instruções ou companhia.',
    },
    {
      numeroHistoria: 27,
      introducao: 'Na convivência a dois, existem pequenas tarefas e cuidados que mantêm o dia a dia funcionando — arrumar a cama, cuidar da casa, preparar refeições, trocar o lixo, consertar algo que quebrou. Em muitos casos, essas responsabilidades não são faladas, mas esperadas. Algumas pessoas, porém, não percebem esses acordos implícitos e só se dão conta do problema quando o outro se irrita.',
      titulo: 'Eu não sabia que era pra eu fazer',
      personagem: 'Pedro, 34 anos.',
      ambientacao: 'Apartamento do casal, domingo de manhã.',
      historia: 'Pedro acorda tarde e vai direto para o computador jogar. No quarto, a cama ainda está desfeita, e no canto da sala o lixo do dia anterior continua cheio. A companheira aparece na porta e diz: “Você viu que o chuveiro tá queimado? Ele levanta o olhar e responde: “Vi, mas pensei que a gente ia fazer depois.” Ela suspira: “Pedro, não é pra eu te lembrar de tudo, é nossa casa.” Ele fica em silêncio, tentando entender por que ela ficou irritada. Na cabeça dele, nada era urgente — achava que fariam juntos mais tarde.',
      questionamento: 'Com que frequência você só percebe que o outro esperava que você fizesse algo em casa quando o assunto já virou motivo de irritação? Isso pode acontecer em relações familiares ou de casal, quando pequenas tarefas ou responsabilidades do cotidiano passam despercebidas até que alguém chama atenção.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você deixa de perceber ou realizar tarefas domésticas e de autocuidado que o outro considera óbvias?',
      intensidadeLeve: 'Às vezes você não percebe o que era esperado, mas faz quando alguém comenta ou pede.',
      intensidadeModerada: 'Você frequentemente deixa de realizar tarefas cotidianas até que o outro cobre ou se irrite.',
      intensidadeAlta: 'Você quase nunca percebe ou inicia essas tarefas sozinho, o que acaba gerando conflitos recorrentes sobre responsabilidades e rotina.',
    },
    {
      numeroHistoria: 28,
      introducao: 'Às vezes, em conversas sociais, a pessoa quer compartilhar algo que viveu e acaba descrevendo a situação com mais detalhes ou intensidade do que realmente aconteceu. Isso pode ocorrer sem intenção de enganar — é uma forma de se sentir mais confiante, de tentar se encaixar ou de tornar a própria experiência mais compreensível para os outros. Ainda assim, quem ouve pode achar que a história parece um pouco exagerada.',
      titulo: 'Acho que eu aumentei sem querer',
      personagem: 'Letícia, 23 anos.',
      ambientacao: 'Faculdade, intervalo entre as aulas.',
      historia: 'Letícia faz estágio em uma empresa e, durante o intervalo na faculdade, os colegas perguntam como está sendo. Empolgada, ela começa a contar: “Semana passada o gerente pediu minha opinião num projeto importante, e eu ajudei a resolver um problema que ninguém conseguia.” Os colegas reagem com entusiasmo, e ela continua explicando o caso com muitos detalhes. Mais tarde, lembra que na verdade o gerente apenas perguntou o que ela achava sobre uma planilha, e que o problema já estava sendo resolvido. Ela não mentiu — apenas ampliou a situação, querendo mostrar que estava aprendendo e sendo útil.',
      questionamento: 'Com que frequência você percebe que, ao contar algo que aconteceu, acaba ampliando ou reforçando detalhes para que a história pareça mais completa ou interessante? Isso pode acontecer em conversas com colegas, familiares ou amigos, quando você quer transmitir melhor o que sentiu ou tornar a situação mais compreensível.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você amplia ou reorganiza detalhes ao contar algo, mesmo sem perceber?',
      intensidadeLeve: 'Às vezes você acrescenta detalhes para contextualizar melhor o que aconteceu.',
      intensidadeModerada: 'Você costuma reforçar ou ampliar partes da história, deixando a situação mais marcante do que foi.',
      intensidadeAlta: 'Você frequentemente reorganiza ou aumenta fatos nas suas histórias, tornando difícil lembrar exatamente o que foi dito ou o que de fato aconteceu.',
    },
    {
      numeroHistoria: 29,
      introducao: 'Quando alguém se envolve profundamente com um tema ou projeto, é natural sentir entusiasmo e vontade de compartilhar. Porém, algumas pessoas ficam tão concentradas nesse interesse que acabam trazendo o mesmo assunto em quase todas as conversas.',
      titulo: 'Você só fala disso ultimamente',
      personagem: 'Rodrigo, 35 anos.',
      ambientacao: 'Casa do casal, durante o jantar.',
      historia: 'Rodrigo chega em casa animado. Mal coloca a mochila no chão e começa a contar para a esposa as novidades do projeto em que está trabalhando. Fala sobre cada detalhe técnico, as reuniões do dia e as ideias que teve para resolver um problema. Ela escuta com atenção, mas tenta mudar o rumo da conversa: “Ah, hoje encontrei a Ana no trabalho, ela perguntou de você.” Rodrigo responde rapidamente e, em seguida, volta ao tema: “Sabe que eu pensei em outra forma de otimizar o sistema…” Ela sorri, mas parece cansada. Nas últimas semanas, quase todas as conversas terminam assim — com Rodrigo voltando ao mesmo assunto.',
      questionamento: 'Com que frequência você percebe que traz o mesmo tema ou interesse para as conversas? Isso pode acontecer em casa, no trabalho ou com amigos, quando você está muito envolvido em algo e sente vontade de falar sobre isso o tempo todo.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você insiste em falar sobre o mesmo tema?',
      intensidadeLeve: 'Você comenta bastante sobre o tema, mas percebe quando é hora de mudar de assunto.',
      intensidadeModerada: 'Você costuma voltar ao mesmo tema várias vezes.',
      intensidadeAlta: 'Independentemente do contexto, você fala com tanta frequência sobre o mesmo tema que as conversas giram quase sempre em torno dele.',
    },
    {
      numeroHistoria: 30,
      introducao: 'Algumas pessoas têm um olhar muito atento aos detalhes. Elas percebem com facilidade pequenas falhas, imprecisões ou incoerências que passam despercebidas pelos outros.',
      titulo: 'Você sempre repara nisso primeiro',
      personagem: 'Marcelo, 37 anos.',
      ambientacao: 'Casa do casal, final de tarde.',
      historia: 'Marcelo chega em casa e encontra a esposa empolgada mostrando uma foto do evento da empresa: “Olha, fiquei tão feliz! A gente ganhou o prêmio de equipe do ano!” Ela entrega o celular sorrindo. Ele observa por alguns segundos e comenta: “Legal! Mas a iluminação ficou estranha, tua blusa parece de outra cor.” O sorriso dela diminui um pouco. Marcelo não queria desanimá-la — apenas notou algo que saltou aos seus olhos.',
      questionamento: 'Com que frequência você percebe pequenos erros ou detalhes fora do lugar e acaba comentando? Isso pode acontecer em conversas com parceiros, amigos ou familiares.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade com que você faz observações críticas ou corretivas, mesmo em momentos pessoais ou descontraídos?',
      intensidadeLeve: 'Você às vezes comenta pequenos detalhes, mas logo percebe e muda o foco para o que é positivo.',
      intensidadeModerada: 'Você frequentemente repara e comenta correções ou imperfeições, mesmo em situações informais.',
      intensidadeAlta: 'Você tende a identificar e mencionar erros em quase todas as situações.',
    },
    {
      numeroHistoria: 31,
      introducao: 'Durante conversas de trabalho, é comum que ideias sejam complementadas ou interrompidas para ajustes, perguntas ou comentários rápidos. Porém, algumas pessoas sentem grande dificuldade com esse tipo de interrupção. Quando perdem o raciocínio, precisam recomeçar do início para recuperar a clareza ou o controle do que estavam dizendo, o que pode gerar frustração ou irritação no momento.',
      titulo: 'Deixa eu só terminar de explicar',
      personagem: 'José, 41 anos.',
      ambientacao: 'Trabalho, reunião de equipe.',
      historia: 'José está apresentando um relatório na reunião. Fala concentrado, explicando o raciocínio passo a passo. No meio da explicação, uma colega o interrompe para fazer uma pergunta. Ele para, tenta responder, mas logo se perde. Fica em silêncio por alguns segundos, respira fundo e diz: “Vou começar de novo, pra fazer sentido.” Recomeça do início, repetindo parte do que já havia dito. Quando outro colega comenta novamente, José interrompe, visivelmente irritado: “Pessoal, só um minuto, senão eu me perco.” O clima fica tenso. Ele não quis ser grosso — apenas precisava terminar o raciocínio inteiro para se organizar.',
      questionamento: 'Com que frequência você se sente irritado ou frustrado quando é interrompido e tem dificuldade de retomar o que estava dizendo? Isso pode acontecer em reuniões, conversas em grupo ou até em casa, quando você precisa recomeçar a fala para recuperar o fio do pensamento.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser a intensidade da sua irritação ou necessidade de recomeçar desde o início?',
      intensidadeLeve: 'Você se incomoda um pouco com interrupções, mas consegue continuar depois de um momento.',
      intensidadeModerada: 'Você sente dificuldade em retomar o que estava dizendo e prefere recomeçar a explicação.',
      intensidadeAlta: 'Interrupções te irritam intensamente, fazem você perder totalmente o raciocínio e precisa recomeçar do início para se reorganizar.',
    },
    {
      numeroHistoria: 32,
      introducao: 'Algumas pessoas, mesmo quando se importam com o assunto ou com o outro, preferem se expressar de forma simples e objetiva, sem muitos comentários adicionais.',
      titulo: 'Entendi',
      personagem: 'Caio, 33 anos.',
      ambientacao: 'Escritório, intervalo para o café.',
      historia: 'Durante o intervalo, uma amiga comenta com entusiasmo sobre um projeto do trabalho que finalmente foi aprovado. “Foram meses de esforço!”, diz ela, sorrindo. Caio olha para ela e responde apenas: “Entendi. Que legal. Muito bom.” A amiga fica em silêncio, um pouco desconcertada, sem saber se ele realmente se interessou pelo que ela contou. Para Caio, a resposta parecia suficiente, ele quis demonstrar que ouviu e achou positivo.',
      questionamento: 'Em conversas com colegas, familiares ou amigos, você costuma responder de forma direta e curta, mesmo quando o assunto é importante para você ou para a outra pessoa e isso causou a impressão de desinteresse, mesmo que você não tivesse essa intenção?',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser o grau de objetividade ou brevidade das suas respostas?',
      intensidadeLeve: 'Você responde de forma objetiva, mas adiciona algum comentário ou expressão de apoio.',
      intensidadeModerada: 'Suas respostas são diretas com poucos comentários adicionais.',
      intensidadeAlta: 'Suas respostas são breves e literais, sem comentários.',
    },
    {
      numeroHistoria: 33,
      introducao: 'Em algumas situações, quando ocorre um mal-entendido ou uma decepção em uma amizade, algumas pessoas preferem se afastar em silêncio em vez de conversar sobre o que aconteceu. Esse afastamento pode parecer repentino para o outro, mas para quem se distancia, é uma forma de lidar com o desconforto ou de evitar um conflito que parece difícil de resolver.',
      titulo: 'Melhor me afastar',
      personagem: 'Marcela, 31 anos.',
      ambientacao: 'Cafeteria, durante a semana',
      historia: 'Marcela sempre almoçava com uma colega do trabalho. Um dia, ouviu um comentário da amiga que a deixou magoada — algo dito em tom de brincadeira, mas que ela interpretou como crítica. Desde então, passou a responder de forma mais curta nas mensagens e começou a recusar convites para sair. Quando a colega tentou conversar, Marcela disse apenas que estava cansada e precisava de um tempo. Ela não explicou o real motivo, mas sentia que continuar a amizade seria desgastante, mesmo sem ter certeza se a amiga quis ofendê-la.',
      questionamento: 'Você já se afastou de alguém após um mal-entendido ou uma decepção, sem tentar esclarecer o que aconteceu? Isso já ocorreu com amigos, familiares ou colegas.',
      perguntaIntensidade: 'Quando isso acontece, qual costuma ser o grau do seu afastamento?',
      intensidadeLeve: 'Você se afasta por um tempo, mas tenta retomar o contato depois.',
      intensidadeModerada: 'Você se distancia sem conversar, e leva muito tempo para retomar o contato.',
      intensidadeAlta: 'Você se desliga completamente da pessoa, sem tentar esclarecer o que aconteceu.',
    }
  ];

  let created = 0;
  let updated = 0;

  for (const registro of HISTORIAS_SOCIAIS) {
    const existing = await prisma.historiasSociais.findFirst({
      where: { numeroHistoria: registro.numeroHistoria },
    });

    if (existing) {
      await prisma.historiasSociais.update({
        where: { id: existing.id },
        data: registro,
      });
      updated++;
    } else {
      await prisma.historiasSociais.create({
        data: registro,
      });
      created++;
    }
  }

  console.log(`✅ Histórias Sociais: ${created} registro(s) criado(s), ${updated} registro(s) atualizado(s).`);
}

/**
 * Seed de Fraquezas e Oportunidades
 * Popula a tabela com os dados iniciais e seus traços relacionados
 */
const FRAQUEZAS_OPORTUNIDADES: Array<{
  numeroTraco: number;
  pergunta: string;
  explicacao: string;
  swot: string;
  tracoNeutro?: string[];
  tracoOportunidade?: string[];
  tracoFraqueza?: string[];
}> = [
  {
    numeroTraco: 1,
    pergunta: 'Você percebe que, quando está nervoso, sobrecarregado ou tentando se concentrar, seu corpo reage de forma mais intensa que pode até chamar atenção?',
    explicacao: 'Em situações de estresse, ansiedade ou sobrecarga emocional,  pode apresentar movimentos corporais mais intensos ou repetitivos, como balançar as pernas, mexer as mãos, andar de um lado para o outro, apertar objetos estalar os dedos, movimentar constantemente as pernas, bater o pé no chão, apertar canetas, torcer os dedos, brincar com o cabelo.',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Raramente', 'Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre'],
    swot:'Movimentos repetitivos'
  },
  {
    numeroTraco: 2,
    pergunta: 'Você busca por ambientes calmos e controlados?',
    explicacao: 'Tende a evitar ruídos, luzes fortes, cheiros intensos ou situações imprevisíveis, preferindo lugares tranquilos e organizados para conseguir se concentrar ou relaxar. Exemplos: usar fones de ouvido para reduzir barulhos, escolher locais silenciosos para trabalhar ou estudar, evitar festas ou shoppings movimentados, preferir iluminação suave e manter o ambiente em ordem para se sentir bem.',
    tracoNeutro: [],
    tracoOportunidade: ['Ocasionalmente', 'Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: ['Quase nunca', 'Raramente'],
    swot:'Busca por ambientes calmos e controlados'
  },
  {
    numeroTraco: 3,
    pergunta: 'Você tem alguma necessidade intensa de tocar certas texturas ou materiais como forma de conforto ou prazer sensorial?',
    explicacao: 'Sente vontade de tocar superfícies ou objetos com determinadas texturas que lhe causam bem-estar ou ajudam na autorregulação. Exemplos: passar a mão repetidamente em tecidos macios, esfregar os dedos em superfícies lisas, tocar o cabelo, objetos de borracha ou pelúcia, ou carregar consigo materiais com texturas agradáveis ao toque.',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Raramente', 'Ocasionalmente', 'Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    swot:'Desejo de sentir o toque de objetos com texturas específicas'
  },
  {
    numeroTraco: 4,
    pergunta: 'Você percebe que tende a repetir certas ações por bastante tempo, especialmente quando está tentando se acalmar ou manter o foco em algo?',
    explicacao: 'Repete determinadas ações por longos períodos para se acalmar, manter o foco ou organizar os pensamentos. Exemplos: balançar o corpo enquanto pensa, desenhar ou rabiscar repetidamente, organizar objetos de forma específica, assistir ao mesmo vídeo ou ouvir a mesma música diversas vezes, girar objetos nas mãos ou repetir mentalmente uma sequência de palavras ou números.',
    tracoNeutro: ['Quase nunca', 'Raramente'],
    tracoOportunidade: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre'],
    swot:'Tendência a repetir ações/movimentos ou atividades para manter o foco'
  },
  {
    numeroTraco: 5,
    pergunta: 'Você percebe que tende ou tem mania de repetir certos rituais antes fazer algo, uma ação ou atitude?',
    explicacao: 'Confere várias vezes se portas estão trancadas, reler mensagens antes de enviar, revisar o mesmo documento repetidamente, reorganizar objetos que já estavam em ordem, refazer tarefas simples para garantir que ficaram "do jeito certo" ou seguir sempre a mesma sequência de ações ao iniciar o dia.',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Raramente', 'Ocasionalmente'],
    tracoFraqueza: ['Muito frequentemente', 'Quase Sempre'],
    swot:'Repetição de rituais'
  },
  {
    numeroTraco: 6,
    pergunta: 'Você sente necessidade de repetir certas ações, rotinas ou etapas, sempre na mesma ordem, ou do mesmo jeito?',
    explicacao: 'Sente-se mais confortável quando segue hábitos previsíveis e ambientes conhecidos, podendo se incomodar com mudanças inesperadas ou novas formas de fazer as coisas. Exemplos: preferir comer sempre os mesmos alimentos, ou ir nos mesmos restaurantes,  seguir a mesma rota para ir ao trabalho, organizar objetos de maneira específica, planejar o dia com antecedência e sentir desconforto quando há mudanças de última hora.',
    tracoNeutro: ['Quase nunca', 'Raramente'],
    tracoOportunidade: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre'],
    swot:'Inflexibilidade com ações, rotinas e hábitos'
  },
  {
    numeroTraco: 7,
    pergunta: 'Você acredita que seus interesses são significantemente diferentes dos de outras pessoas?',
    explicacao: 'Demonstra grande interesse por temas ou atividades pouco comuns entre os colegas ou familiares. Exemplos: gostar intensamente de assuntos específicos como política, religião, jogos,  linguística, tecnologia, animais, e ter dificuldade em participar de conversas sobre temas mais populares entre o grupo.',
    tracoNeutro: ['Quase nunca', 'Raramente'],
    tracoOportunidade: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre'],
    swot:'Interesse em conversas sobre assuntos complexos'
  },
  {
    numeroTraco: 8,
    pergunta: 'Você tem interesses profundos e especializados em temas específicos?',
    explicacao: 'Dedica bastante tempo e atenção a um assunto ou área de interesse, buscando aprender e dominar todos os detalhes sobre ele. Exemplos: estudar intensamente um tema como história antiga, programação, botânica, mitologia ou um artista específico, acumular livros, vídeos e materiais sobre o tema e gostar de conversar longamente sobre ele.',
    tracoNeutro: ['Quase nunca', 'Raramente'],
    tracoOportunidade: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre'],
    swot:'Interesses específicos'
  },
  {
    numeroTraco: 9,
    pergunta: 'Você prefere se engajar socialmente apenas com pessoas conhecidas ou de confiança?',
    explicacao: 'Engaja-se com mais facilidade em conversas e atividades quando está entre pessoas familiares, demonstrando menor interesse ou iniciativa em interações com desconhecidos ou em grupos grandes. Exemplos: falar pouco em ambientes novos, demorar para se entrosar com colegas de trabalho ou estudo, evitar interações com pessoas que acabou de conhecer e participar mais ativamente apenas quando se sente à vontade com o grupo.',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre', 'Raramente'],
    swot:'Seletividade social'
  },
  {
    numeroTraco: 10,
    pergunta: 'Você se relaciona com mais facilidade com pessoas de faixas etárias diferentes da sua?',
    explicacao: 'Interage com mais naturalidade e interesse com pessoas mais velhas ou mais novas, tendo menor afinidade com indivíduos da própria faixa etária. Exemplos: criar laços próximos com professores, mentores ou colegas mais velhos, sentir-se à vontade em conversas com crianças ou adolescentes, e ter dificuldade em se conectar com pessoas da mesma idade em contextos sociais ou profissionais.',
    tracoNeutro: ['Quase nunca', 'Raramente'],
    tracoOportunidade: ['Ocasionalmente'],
    tracoFraqueza: ['Muito frequentemente', 'Quase Sempre'],
    swot:'Mais facilidade de se relacionar com pessoas de diferente faixas etárias'
  },
  {
    numeroTraco: 11,
    pergunta: 'Você interage e trata pessoas de diferentes grupos ou status da mesma forma sem se importar com hierarquia?',
    explicacao: 'Relaciona-se de forma direta e espontânea com todos, sem perceber diferenças de posição, autoridade ou status em contextos sociais ou profissionais. Exemplos: falar com chefes, professores ou superiores da mesma forma que com colegas, tratar pessoas mais velhas e mais jovens com o mesmo nível de informalidade',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Raramente', 'Ocasionalmente'],
    tracoFraqueza: ['Muito frequentemente', 'Quase Sempre'],
    swot:'Tratamento igualitário independente de hierarquias'
  },
  {
    numeroTraco: 12,
    pergunta: 'Você tende a dar respostas longas e detalhadas para mostrar  o raciocínio bem estruturado?',
    explicacao: 'Explica ideias de forma minuciosa, acrescentando muitos detalhes para que o raciocínio fique completo. Exemplos: responder perguntas  com explicações cheias de exemplos e justificativas, descrever todas as etapas de um processo ao contar algo, ou sentir necessidade de contextualizar demais antes de chegar ao ponto principal.',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Raramente', 'Ocasionalmente'],
    tracoFraqueza: ['Muito frequentemente', 'Quase Sempre'],
    swot:'Respostas detalhadas e bem estruturadas'
  },
  {
    numeroTraco: 13,
    pergunta: 'Você usa palavras mais formais ou rebuscadas em situações cotidianas?',
    explicacao: 'Fala de maneira elaborada ou com vocabulário incomum para o contexto, expressando-se com frases mais formais, rebuscadas ou com referências culturais e literárias. Exemplos: usar expressões antigas ou sofisticadas em conversas informais, citar trechos de livros ou filmes espontaneamente, ou empregar palavras pouco usadas no dia a dia para descrever algo.',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Raramente', 'Ocasionalmente'],
    tracoFraqueza: ['Muito frequentemente', 'Quase Sempre'],
    swot:'Uso de palavras rebuscadas'
  },
  {
    numeroTraco: 14,
    pergunta: 'Você sente uma necessidade intensa de buscar lógica, verdade ou explicações para tudo?',
    explicacao: 'Dedica bastante tempo tentando compreender o sentido das coisas, buscando coerência e respostas completas, mesmo em situações em que o assunto já poderia ser encerrado. Exemplos: fazer muitas perguntas para entender cada detalhe de algo, insistir em esclarecer pontos pequenos de uma conversa, sentir desconforto quando algo parece incoerente ou sem fundamento, e gastar tempo e energia tentando chegar à explicação mais precisa possível.',
    tracoNeutro: [],
    tracoOportunidade: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase nunca', 'Raramente', 'Quase Sempre'],
    swot:'Tendência de buscar a lógica, verdade ou explicações para tudo'
  },
  {
    numeroTraco: 15,
    pergunta: 'Você tende a seguir regras de forma rígida e com pouca flexibilidade?',
    explicacao: 'Segue princípios, rotinas ou orientações de maneira consistente e literal, tendo dificuldade em adaptar-se quando as circunstâncias mudam ou quando outros agem de forma diferente. Exemplos: insistir em cumprir horários e procedimentos exatamente como foram definidos, sentir desconforto quando alguém desvia de uma regra combinada, ou recusar exceções mesmo em situações simples, como mudar um plano de última hora.',
    tracoNeutro: ['Quase nunca'],
    tracoOportunidade: ['Raramente', 'Ocasionalmente'],
    tracoFraqueza: ['Muito frequentemente', 'Quase Sempre'],
    swot:'Rigidez ao seguir instruções e regras'
  },
  {
    numeroTraco: 16,
    pergunta: 'Você tem dificuldade de ser pontual em compromissos ou na entrega de atividades ou tarefas? Ou de calcular o tempo ideal para cada tarefa ou chegar nos lugares?',
    explicacao: 'Tem dificuldade de ser pontual em compromissos, ou chega em cima da hora. Tem dificuldade de entregar tarefas/atividades dentro do prazo. Tem dificuldade de calcular quanto tempo leva para fazer cada coisa ou chegar nos lugares.',
    tracoNeutro: ['Quase nunca', 'Raramente'],
    tracoOportunidade: [],
    tracoFraqueza: ['Ocasionalmente', 'Muito frequentemente', 'Quase Sempre'],
    swot:'Pontualidade ou gestão do tempo'
  },
];

/**
 * Seed de Fraquezas e Oportunidades
 */
async function seedFraquezasOportunidades() {
  console.log('🌱 Iniciando seed de Fraquezas e Oportunidades...');

  let created = 0;
  let updated = 0;
  let tracosCreated = 0;

  // Fazer upsert de cada registro (criar ou atualizar baseado no numeroTraco)
  for (const registro of FRAQUEZAS_OPORTUNIDADES) {
    const existing = await prisma.fraquezasOportunidades.findFirst({
      where: { numeroTraco: registro.numeroTraco },
      include: {
        tracoNeutro: true,
        tracoOportunidade: true,
        tracoFraqueza: true,
      },
    });

    const dataFraqueza = {
      numeroTraco: registro.numeroTraco,
      pergunta: registro.pergunta,
      explicacao: registro.explicacao,
      swot: registro.swot || '',
    };

    let fraquezaOportunidade;
    if (existing) {
      fraquezaOportunidade = await prisma.fraquezasOportunidades.update({
        where: { id: existing.id },
        data: dataFraqueza,
      });
      updated++;

      // Deletar traços existentes para recriar
      await prisma.tracoNeutroFO.deleteMany({
        where: { fraquezasOportunidadesId: existing.id },
      });
      await prisma.tracoOportunidadeFO.deleteMany({
        where: { fraquezasOportunidadesId: existing.id },
      });
      await prisma.tracoFraquezaFO.deleteMany({
        where: { fraquezasOportunidadesId: existing.id },
      });
    } else {
      fraquezaOportunidade = await prisma.fraquezasOportunidades.create({
        data: dataFraqueza,
      });
      created++;
    }

    // Criar traços neutros
    if (registro.tracoNeutro && registro.tracoNeutro.length > 0) {
      await prisma.tracoNeutroFO.createMany({
        data: registro.tracoNeutro.map((valor) => ({
          valor,
          fraquezasOportunidadesId: fraquezaOportunidade.id,
        })),
      });
      tracosCreated += registro.tracoNeutro.length;
    }

    // Criar traços de oportunidade
    if (registro.tracoOportunidade && registro.tracoOportunidade.length > 0) {
      await prisma.tracoOportunidadeFO.createMany({
        data: registro.tracoOportunidade.map((valor) => ({
          valor,
          fraquezasOportunidadesId: fraquezaOportunidade.id,
        })),
      });
      tracosCreated += registro.tracoOportunidade.length;
    }

    // Criar traços de fraqueza
    if (registro.tracoFraqueza && registro.tracoFraqueza.length > 0) {
      await prisma.tracoFraquezaFO.createMany({
        data: registro.tracoFraqueza.map((valor) => ({
          valor,
          fraquezasOportunidadesId: fraquezaOportunidade.id,
        })),
      });
      tracosCreated += registro.tracoFraqueza.length;
    }
  }

  console.log(
    `✅ Fraquezas e Oportunidades: ${created} registro(s) criado(s), ${updated} registro(s) atualizado(s), ${tracosCreated} traço(s) criado(s).`
  );
}

/**
 * Seed de Forças
 * Popula a tabela com os dados iniciais e seus traços relacionados
 */
const FORCAS: Array<{
  numeroTraco: number;
  pergunta: string;
  exemplo: string;
  swot: string;
  tracoNeutro?: string[];
  tracoForca?: string[];
  tracoFraqueza?: string[];
  tracoOportunidade?: string[];
}> = [
  {
    numeroTraco: 1,
    pergunta: 'Você percebe com facilidade elementos sutis em objetos, pessoas, sons ou situações, observando aspectos que costumam passar despercebidos por outras pessoas?',
    exemplo: 'Exemplos: notar pequenas diferenças em um texto, perceber variações de cor ou forma em um design, identificar mudanças sutis no tom de voz de um colega, ajustar algo fora do lugar em casa, ou perceber detalhes em uma conversa ou apresentação que outros não notaram.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Atenção aos detalhes'
  },
  {
    numeroTraco: 2,
    pergunta: 'Você pensa de forma estruturada, analítica e baseada em relações de causa e efeito? Tende a identificar padrões, inconsistências e soluções com rapidez e precisão?',
    exemplo: 'Exemplos: resolve problemas complexos de forma objetiva, detecta falhas lógicas em argumentos, propõe soluções práticas em situações confusas, organiza informações de modo sistemático em projetos da faculdade ou no trabalho, e preferi explicações racionais em vez de interpretações subjetivas.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Raciocínio Lógico'
  },
  {
    numeroTraco: 3,
    pergunta: 'Você organiza informações e ideias de forma estruturada, buscando entender como as partes se conectam dentro de um todo? Compreende bem sistemas, processos e relações com profundidade e clareza?',
    exemplo: 'Exemplos: planeja tarefas em etapas lógicas, criarmétodos para executar rotinas, entender o funcionamento de máquinas, softwares ou processos de trabalho, mapeia causas e consequências em projetos acadêmicos ou profissionais, e identificaa padrões que ajudam a otimizar resultados.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Pensamento Sistemático'
  },
  {
    numeroTraco: 4,
    pergunta: 'Você aplica o raciocínio de forma objetiva e funcional, identificando rapidamente soluções para situações concretas do dia a dia?',
    exemplo: 'Exemplos: encontra maneiras criativas de consertar algo em casa, ajustar processos de trabalho para ganhar tempo, ajudar colegas a resolver imprevistos de forma lógica, cria estratégias simples para lidar com desafios acadêmicos ou encontra alternativas práticas diante de um imprevisto familiar.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Resolução prática de problemas'
  },
  {
    numeroTraco: 5,
    pergunta: 'Você analisa informações de forma profunda e precisa, identificando conexões complexas, padrões e causas subjacentes em dados ou situações?',
    exemplo: 'Exemplos: cruza informações para chegar a conclusões sólidas em um relatório, interpreta resultados de pesquisas de forma crítica, encontraa relações sutis entre variáveis em projetos acadêmicos, ou identifica inconsistências e padrões em grandes volumes de dados no trabalho.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Habilidades analíticas avançadas'
  },
  {
    numeroTraco: 6,
    pergunta: 'Você consegue mudar de perspectiva com facilidade e adaptar seu pensamento quando surgem novas informações ou situações inesperadas? Gosta de explorar diferentes possibilidades antes de tomar uma decisão ou de ajustar seus planos conforme o contexto muda?',
    exemplo: 'Exemplos: adaptar-se rapidamente a mudanças no trabalho ou na faculdade, encontrar novos caminhos para resolver um problema, compreender pontos de vista diferentes durante uma discussão, ajustar a linguagem conforme o público ou revisar uma ideia antiga à luz de novos dados.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Flexibilidade cognitiva avançada'
  },
  {
    numeroTraco: 7,
    pergunta: 'Você sente prazer em repetir uma atividade até dominá-la completamente? Gosta de treinar, revisar ou refazer algo várias vezes para alcançar precisão e consistência?',
    exemplo: 'Exemplos: praticar um instrumento musical até o movimento sair perfeito, revisar apresentações até que fiquem no formato ideal, aprimorar uma habilidade manual ou intelectual com constância, ou seguir uma rotina de estudos repetitiva para consolidar o aprendizado.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Excelência na repetição de tarefas ou atividades específicas'
  },
  {
    numeroTraco: 8,
    pergunta: 'Você percebe com facilidade quando algo não está de acordo, mesmo em detalhes que passam despercebidos pelos outros? Nota inconsistências, falhas ou desvios em dados, sistemas ou situações e sente vontade de ajustar ou corrigir?',
    exemplo: 'Exemplos: identificar erros em planilhas ou relatórios no trabalho, perceber incoerências em argumentos durante reuniões, notar padrões incorretos em procedimentos, ou detectar detalhes fora do lugar em tarefas domésticas, acadêmicas ou criativas.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Detecção de erros em processos, informações ou padrões'
  },
  {
    numeroTraco: 9,
    pergunta: 'Você consegue se concentrar com facilidade em uma atividade até concluí-la?',
    exemplo: 'Exemplos: manter a atenção em um projeto por horas concluir atividades com alto nível de qualidade.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Raramente'],
    swot:'Foco em tarefas'
  },
  {
    numeroTraco: 10,
    pergunta: 'Você costuma se envolver intensamente em um interesse ou atividade a ponto de perder a noção do tempo? Sente-se completamente absorvido pelo que está fazendo, com grande capacidade de concentração e produtividade quando o tema desperta seu interesse?',
    exemplo: 'Exemplos: mergulhar por horas em um projeto no trabalho ou na faculdade, estudar profundamente um tema até dominar os detalhes, dedicar-se intensamente a um hobby criativo, ou focar de forma contínua em resolver um problema complexo sem se distrair.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: [],
    swot:'Hiperfoco'
  },
  {
    numeroTraco: 11,
    pergunta: 'Você consegue manter o foco em uma tarefa por longos períodos, mesmo quando há barulho, distrações ou pressão? Percebe que, quando se envolve em algo que considera importante, o resto do ambiente parece “desaparecer” e sua atenção fica totalmente voltada para aquilo?',
    exemplo: 'Exemplos: estudar intensamente para uma prova sem se distrair, concentrar-se por horas em um projeto no trabalho, permanecer atento durante uma reunião longa ou se dedicar a atividades manuais detalhadas como bordado, reparo de eletrônicos ou auditoria de dados.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Raramente'],
    swot:'Concentração excepcional'
  },
  {
    numeroTraco: 12,
    pergunta: 'Você costuma se lembrar com facilidade de informações, conversas ou detalhes que a maioria das pessoas esqueceria? Consegue guardar na memória fatos, nomes, datas, rotinas ou procedimentos com muita precisão, mesmo depois de muito tempo?',
    exemplo: 'Exemplos: recordar o conteúdo de uma reunião sem precisar anotar, lembrar de detalhes de histórias ou acontecimentos familiares, guardar sequências e procedimentos técnicos com exatidão, ou relembrar conversas e aprendizados com clareza.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: [],
    swot:'Memória aprimorada'
  },
  {
    numeroTraco: 13,
    pergunta: 'Você costuma cumprir horários e compromissos com precisão, chegando nos lugares antes do combinado ou entregando tarefas dentro do prazo? A previsibilidade e o respeito ao tempo te ajudam a manter o controle e a sentir segurança na rotina?',
    exemplo: 'Exemplos: chegar pontualmente a reuniões ou encontros, organizar o dia para evitar atrasos, lembrar de compromissos com antecedência, e sentir desconforto quando os outros se atrasam ou quando o planejamento é alterado de última hora.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Pontualidade'
  },
  {
    numeroTraco: 14,
    pergunta: 'Você costuma se manter firme em uma atividade, tema ou meta por longos períodos, mesmo quando surgem obstáculos ou cansaço? Consegue manter o foco e o interesse em algo que considera importante, sem desistir com facilidade?',
    exemplo: 'Exemplos: continuar estudando ou trabalhando em um projeto até alcançar o resultado desejado, investir tempo em aprimorar uma habilidade específica, demonstrar comprometimento constante em tarefas profissionais ou acadêmicas, ou permanecer engajado em um tema de interesse por anos.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Dedicação'
  },
  {
    numeroTraco: 15,
    pergunta: 'Você costuma ser visto como alguém em quem as pessoas podem confiar para cumprir o que promete? Mantém um desempenho constante, mesmo em tarefas repetitivas ou detalhadas, e prefere entregar resultados com consistência e precisão?',
    exemplo: 'Exemplos: cumprir prazos de forma estável no trabalho ou na faculdade, manter a mesma qualidade em tarefas que exigem atenção contínua, ser lembrado por colegas e familiares como alguém responsável e previsível, ou ser procurado para atividades que exigem cuidado e constância.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Confiabilidade'
  },
  {
    numeroTraco: 16,
    pergunta: 'Você sente uma determinação intensa quando está envolvido em algo que realmente desperta o seu interesse? Quando se depara com desafios, tende a insistir até encontrar uma solução ou alcançar o resultado desejado, sem desistir facilmente?',
    exemplo: 'Exemplos: manter-se firme em um projeto complexo, estudar um tema difícil até compreendê-lo completamente, continuar praticando uma habilidade mesmo após erros repetidos ou insistir em concluir uma tarefa importante apesar do cansaço.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: [],
    swot:'Força de vontade'
  },
  {
    numeroTraco: 17,
    pergunta: 'Você costuma mergulhar profundamente em temas ou atividades que despertam sua curiosidade, aprendendo tudo o que pode sobre eles? Esses interesses te motivam a pesquisar, praticar e desenvolver habilidades de forma intensa e autônoma?',
    exemplo: 'Exemplos: dedicar-se por longos períodos a um assunto acadêmico, profissional ou pessoal, estudar um tema até dominar detalhes técnicos, aplicar o conhecimento adquirido em projetos pessoais ou de trabalho, ou transformar um interesse em uma área de especialização.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: [],
    swot:'Interesses específicos'
  },
  {
    numeroTraco: 18,
    pergunta: 'Você percebe sons, cores, texturas, cheiros ou movimentos com mais nitidez do que as pessoas ao seu redor? Essa sensibilidade aguçada faz com que você perceba detalhes e variações sutis no ambiente que outros nem sempre notam?',
    exemplo: 'Exemplos: identificar pequenas mudanças de luz ou som, perceber odores ou texturas de forma intensa, notar padrões visuais em obras de arte, natureza ou experimentos científicos, ou ajustar-se rapidamente a alterações no ambiente.',
    tracoNeutro: ['Nunca', 'Raramente', 'Ocasionalmente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: [],
    swot:'Consciência sensorial'
  },
  {
    numeroTraco: 19,
    pergunta: 'Você percebe e lembra de detalhes visuais com facilidade, conseguindo reter imagens, cores, formas ou padrões por muito tempo? Sua memória visual te ajuda a compreender e reproduzir com precisão o que observa?',
    exemplo: 'Exemplos: lembrar o layout de um ambiente após vê-lo uma única vez, identificar rapidamente mudanças sutis em apresentações ou gráficos, visualizar soluções de design ou estrutura antes de executá-las, e descrever lugares, objetos ou cenas com alto nível de detalhe.',
    tracoNeutro: ['Nunca', 'Raramente', 'Ocasionalmente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: [],
    swot:'Percepção visual aprimorada'
  },
  {
    numeroTraco: 20,
    pergunta: 'Você percebe que certos movimentos repetitivos ou hábitos sensoriais te ajudam a manter o foco, o equilíbrio emocional ou a concentração?',
    exemplo: 'Exemplos: balançar o corpo, bater o pé, girar objetos nas mãos, repetir sons ou palavras para se acalmar, buscar texturas específicas para aliviar tensão, ou se isolar brevemente quando o ambiente fica barulhento ou confuso.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Facilidade em se autoregular via esteriotipias'
  },
  {
    numeroTraco: 21,
    pergunta: 'Você costuma imaginar o futuro com otimismo e agir para torná-lo melhor? Mesmo diante de dificuldades, consegue manter o foco nos seus objetivos e encontrar novas formas de seguir em frente?',
    exemplo: 'Exemplos: continuar investindo em um projeto ou sonho mesmo após contratempos, buscar oportunidades de crescimento em situações difíceis, enxergar desafios como temporários.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Esperança'
  },
  {
    numeroTraco: 22,
    pergunta: 'Você costuma se envolver nas atividades com energia, curiosidade e vontade genuína de participar? Quando algo te interessa, sente-se motivado a viver a experiência de forma intensa e completa, colocando dedicação e emoção no que faz?',
    exemplo: 'Exemplos: começar o dia com disposição para novos desafios, participar de projetos com entusiasmo contagiante, envolver-se de corpo e alma em hobbies ou causas pessoais, e demonstrar alegria e vitalidade ao compartilhar ideias ou conquistas.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Entusiasmo'
  },
  {
    numeroTraco: 23,
    pergunta: 'Você costuma agir e se comunicar de forma genuína, mesmo quando isso não é o mais conveniente socialmente? Sente-se mais confortável sendo quem realmente é, mantendo seus valores e opiniões mesmo diante de pressões externas para se ajustar?',
    exemplo: 'Exemplos: expressar opiniões sinceras em reuniões, mesmo quando o grupo pensa diferente; recusar-se a participar de comportamentos que considera artificiais ou desonestos; vestir-se ou se comportar de um modo que reflita sua identidade pessoal; ou manter coerência entre o que pensa, sente e faz em diferentes contextos da vida.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Autenticidade'
  },
  {
    numeroTraco: 24,
    pergunta: 'Você sente um impulso constante de explorar, questionar e compreender o mundo com mais profundidade? Tem interesse genuíno em descobrir como as coisas funcionam, investigar novos temas e aprender por conta própria, indo além do que é esperado?',
    exemplo: 'Exemplos: pesquisar espontaneamente sobre assuntos que despertam interesse, fazer perguntas detalhadas para entender um fenômeno, buscar leituras e cursos por curiosidade pessoal, ou se envolver em projetos que exigem investigação e aprendizado contínuo.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Curiosidade'
  },
  {
    numeroTraco: 25,
    pergunta: 'Você costuma ter ideias originais ou enxergar soluções diferentes das mais comuns? Gosta de pensar de forma independente, combinando elementos que outras pessoas talvez não conectassem?',
    exemplo: 'Exemplos: propor abordagens inovadoras no trabalho, desenvolver soluções criativas para conflitos ou desafios práticos, expressar-se por meio da escrita, design, arte ou tecnologia, ou sugerir ideias pouco convencionais que tragam novos olhares para um problema.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Criatividade'
  },
  {
    numeroTraco: 26,
    pergunta: 'Você costuma reparar em como as pessoas se comportam, no clima de um ambiente ou na forma como as situações se desenrolam ao seu redor? Observa expressões, gestos, posturas e dinâmicas sem necessariamente participar da conversa?',
    exemplo: 'Exemplos: perceber quando o humor de alguém muda mesmo sem palavras, notar a maneira como as pessoas interagem em uma reunião, observar como um local funciona antes de agir, captar sinais sutis de desconforto ou entusiasmo em um grupo, ou lembrar detalhes sobre como algo foi organizado ou conduzido em diferentes contextos.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Alta capacidade de observação'
  },
  {
    numeroTraco: 27,
    pergunta: 'Você costuma ter opiniões ou pensar de forma muito diferente das pessoas? Encontrar soluções ou ideias diferentes das mais comuns, mesmo quando todos parecem pensar do mesmo jeito? Prefere explorar caminhos alternativos e criar novas possibilidades em vez de seguir fórmulas prontas?',
    exemplo: 'Exemplos: sugerir abordagens originais em projetos de trabalho ou estudo, encontrar usos inesperados para objetos ou recursos, propor soluções criativas para problemas do cotidiano, ou combinar ideias de áreas diferentes para criar algo novo.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Pensamento divergente'
  },
  {
    numeroTraco: 28,
    pergunta: 'Você sente prazer genuíno em aprender coisas novas, especialmente quando o tema desperta seu interesse? Busca conhecimento por conta própria, dedicando tempo e energia para entender profundamente o que te fascina, mesmo sem precisar de motivação externa?',
    exemplo: 'Exemplos: estudar um assunto muito além do exigido na faculdade ou no trabalho, explorar diferentes fontes para compreender um tema em profundidade, aprender sozinho sobre áreas que despertam curiosidade, ou revisitar temas favoritos apenas pelo prazer de aprender.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Paixão por aprender'
  },
  {
    numeroTraco: 29,
    pergunta: 'Você costuma enxergar situações, problemas ou ideias de um jeito diferente das outras pessoas? Ao refletir sobre algo, tende a perceber conexões ou significados que não são imediatamente visíveis para os demais?',
    exemplo: 'Exemplos: propor interpretações inesperadas em discussões de grupo, sugerir soluções criativas para desafios profissionais, enxergar sentido em padrões ou temas que outros ignoram, ou oferecer leituras inovadoras sobre temas sociais, artísticos ou científicos.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Interpretações originais e perspectivas únicas'
  },
  {
    numeroTraco: 30,
    pergunta: 'Você costuma dizer o que realmente pensa? Prefere ser sincero a adotar discursos ou atitudes apenas para agradar os outros?',
    exemplo: 'Exemplos: expressar opiniões com franqueza em situações sociais ou profissionais, admitir erros sem tentar se justificar, recusar-se a agir de forma estratégica para obter vantagem pessoal, ou manter a transparência em relacionamentos e decisões, mesmo quando o esperado seria omitir ou suavizar a verdade.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Honestidade'
  },
  {
    numeroTraco: 31,
    pergunta: 'Você tende a tratar todas as pessoas da mesma forma, independentemente de posição social, cargo ou status? Sente-se mais confortável quando as decisões e interações são baseadas em princípios de equidade, e não em favoritismos ou aparências?',
    exemplo: 'Exemplos: defender colegas que foram tratados injustamente, discordar de regras ou práticas que considera desiguais, evitar fazer distinções entre superiores e subordinados, ou agir com coerência mesmo quando ninguém está observando.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Justiça e imparcialidade'
  },
  {
    numeroTraco: 32,
    pergunta: 'Você tende a refletir profundamente sobre o que é certo ou errado antes de tomar decisões? Costuma seguir princípios claros de justiça e coerência, mesmo quando isso não é o caminho mais fácil ou popular?',
    exemplo: 'Exemplos: defender uma posição ética mesmo sob pressão social, analisar cuidadosamente as consequências morais de suas ações, orientar decisões profissionais por critérios de integridade, ou ser visto por colegas e familiares como alguém de juízo ponderado e confiável.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: ['Raramente'],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Raciocínio ético'
  },
  {
    numeroTraco: 33,
    pergunta: 'Você se sente incomodado ao perceber desigualdades ou situações em que alguém é tratado de forma injusta? Costuma agir ou se posicionar para promover equidade e inclusão, mesmo quando isso não lhe traz benefício direto?',
    exemplo: 'Exemplos: defender colegas marginalizados, questionar práticas discriminatórias em ambientes acadêmicos ou profissionais, engajar-se em causas sociais, ou propor soluções que garantam igualdade de oportunidades para todos.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente'],
    tracoFraqueza: ['Quase sempre'],
    tracoOportunidade: [],
    swot:'Orientação para a justiça social'
  },
  {
    numeroTraco: 34,
    pergunta: 'Você sente emoções intensas diante de situações que envolvem injustiça, sofrimento ou causas que considera importantes? Percebe que certas experiências ou temas éticos o afetam mais profundamente do que às pessoas ao seu redor?',
    exemplo: 'Exemplos: comover-se intensamente com notícias de injustiça social, sentir forte empatia por pessoas em situações de vulnerabilidade, envolver-se emocionalmente em causas morais ou ambientais, ou reagir com profunda sensibilidade a situações de conflito interpessoal.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Ocasionalmente'],
    tracoFraqueza: ['Muito frequentemente', 'Quase Sempre'],
    tracoOportunidade: [],
    swot:'Resonância emocional profunda'
  },
  {
    numeroTraco: 35,
    pergunta: 'Você costuma basear suas decisões em valores e regras que considera justos, mesmo quando isso o coloca em desacordo com a maioria? Percebe que tende a seguir seus princípios com consistência, guiando suas ações por lógica e coerência moral, mais do que por convenções sociais?',
    exemplo: 'Exemplos: manter uma postura ética mesmo sob pressão, recusar-se a agir contra suas convicções, ser visto como uma pessoa confiável em decisões complexas no trabalho ou na família, ou defender a aplicação justa de regras e normas institucionais.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Forte adesão aos próprios princípios'
  },
  {
    numeroTraco: 36,
    pergunta: 'Você costuma manter vínculos duradouros e compromissos firmes com as pessoas de quem gosta ou com as causas em que acredita? Considera-se alguém que valoriza a confiança mútua e que permanece fiel mesmo quando as circunstâncias se tornam difíceis?',
    exemplo: 'Exemplos: manter amizades ou relacionamentos por muitos anos, apoiar colegas em momentos de dificuldade, continuar acreditando em projetos ou ideais mesmo quando outros desistem, ou demonstrar constância e confiabilidade em vínculos familiares e profissionais.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Lealdade'
  },
  {
    numeroTraco: 37,
    pergunta: 'Você sente uma conexão especial com animais, percebendo com facilidade seus estados emocionais e reagindo a eles com cuidado e afeto? A convivência com animais traz sensação de calma, confiança ou compreensão mútua, diferente das interações humanas mais complexas?',
    exemplo: 'Exemplos: buscar a companhia de animais em momentos de estresse, demonstrar preocupação com o bem-estar deles, perceber sinais sutis de desconforto ou alegria, envolver-se em causas de proteção animal, ou encontrar nos animais uma forma de companhia segura e autêntica.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Empatia por animais'
  },
  {
    numeroTraco: 38,
    pergunta: 'Você sente uma conexão imediata com outras pessoas autistas, mesmo sem precisar explicar muito sobre si? Percebe que compreende com facilidade o que o outro sente em situações de sobrecarga, exclusão ou mal-entendidos, justamente por já ter vivido experiências parecidas?',
    exemplo: 'Exemplos: apoiar colegas autistas em momentos de estresse sensorial ou social, sentir alívio ao compartilhar espaços onde não é necessário mascarar comportamentos, criar laços de confiança baseados em compreensão mútua, ou participar de comunidades neurodivergentes com sentimento de pertencimento genuíno.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Empatia por pares autistas'
  },
  {
    numeroTraco: 39,
    pergunta: 'Você demonstra carinho e preocupação genuína com familiares e pessoas próximas, mesmo que nem sempre expresse isso de forma tradicional? Percebe que costuma oferecer apoio constante, conforto e atenção aos que ama, especialmente em momentos em que eles precisam de estabilidade emocional?',
    exemplo: 'Exemplos: lembrar-se de detalhes importantes da rotina dos familiares, oferecer ajuda prática em vez de palavras, acompanhar de perto o bem-estar de quem está passando por dificuldades, ou demonstrar afeto por meio de gestos sutis, como preparar algo que o outro gosta ou simplesmente estar presente.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Afetividade e cuidado com a família'
  },
  {
    numeroTraco: 40,
    pergunta: 'Você percebe que cria laços muito fortes com certas pessoas que te entendem de verdade e oferecem o tipo de apoio que você precisa? Costuma se conectar intensamente com quem demonstra empatia, paciência ou segurança, como um familiar, amigo próximo, professor, colega de trabalho, chefe ou parceiro amoroso? Esses vínculos, por serem tão significativos, acabam ocupando um espaço importante na sua vida emocional.',
    exemplo: 'Exemplos: manter contato constante com um professor ou mentor que te inspira, sentir forte apego a um amigo de longa data, confiar profundamente em um chefe que te compreende, ou dedicar tempo e energia a um relacionamento afetivo no qual se sente seguro.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Vínculos profundos e intensos com pessoas específicas'
  },
  {
    numeroTraco: 41,
    pergunta: 'Você sente com facilidade o que as outras pessoas estão sentindo — como se captasse a emoção delas com intensidade? Percebe que, quando alguém está triste, nervoso ou injustiçado, isso te afeta profundamente, despertando em você vontade de confortar ou ajudar? Essa sensibilidade pode se manifestar em várias situações, como em conversas com familiares, colegas, alunos ou até desconhecidos, quando você percebe sutis mudanças de tom, expressão ou energia.',
    exemplo: 'Exemplos: ficar emocionalmente abalado ao ver alguém sofrer, oferecer apoio espontâneo a um amigo em crise, sentir desconforto em ambientes onde há conflito, ou se emocionar com histórias de injustiça ou superação.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Compreensão empática e viva das experiências dos outros'
  },
  {
    numeroTraco: 42,
    pergunta: 'Você se considera uma pessoa de mente aberta, capaz de aceitar e respeitar maneiras diferentes de pensar, viver ou sentir? Quando alguém tem um comportamento, aparência ou estilo de vida que foge do padrão, você tende a reagir com curiosidade e empatia, em vez de julgamento?',
    exemplo: 'Exemplos: acolher opiniões opostas sem se sentir ameaçado, respeitar diferentes orientações sexuais e identidades de gênero, conviver bem com pessoas de culturas ou estilos de vida distintos, e buscar entender antes de criticar.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Ocasionalmente'],
    swot:'Mente aberta'
  },
  {
    numeroTraco: 43,
    pergunta: 'Você se sente mais à vontade e produtivo quando trabalha em grupos menores, onde há clareza, propósito comum e respeito mútuo? Prefere colaborar com pessoas que compartilham interesses semelhantes ou que valorizam profundidade e comprometimento, em vez de grandes equipes com muita troca superficial?',
    exemplo: 'Exemplos: participar ativamente em projetos com poucas pessoas e metas bem definidas, sentir satisfação em contribuir para grupos que valorizam precisão e cooperação, ou se destacar quando o ambiente é organizado e as funções são claras.',
    tracoNeutro: ['Nunca'],
    tracoForca: ['Ocasionalmente', 'Muito frequentemente', 'Quase Sempre'],
    tracoFraqueza: [],
    tracoOportunidade: ['Raramente'],
    swot:'Colaboração em grupos pequenos e focados'
  },
  {
    numeroTraco: 44,
    pergunta: 'Você costuma agir de acordo com o que acredita ser certo, mesmo quando as outras pessoas pensam diferente ou tentam te convencer do contrário? Tende a seguir seus próprios valores e lógica interna, questionando regras ou decisões que não parecem coerentes ou justas?',
    exemplo: 'Exemplos: questionar regras que parecem inconsistentes, manter sua opinião mesmo diante da pressão de um grupo, recusar comportamentos de exclusão ou fofoca, ou seguir princípios éticos pessoais no trabalho ou nos estudos, mesmo quando isso não é o mais popular.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Não se deixar influenciar com facilidade'
  },
  {
    numeroTraco: 45,
    pergunta: 'Você se sente profundamente tocado por momentos de beleza, harmonia ou perfeição — seja em uma obra de arte, uma paisagem, uma música, uma ideia bem estruturada ou até em pequenos detalhes do cotidiano? Costuma se encantar com o talento, a precisão ou a elegância nas coisas que observa e valoriza a sensação de equilíbrio e sentido que elas trazem?',
    exemplo: 'Exemplos: admirar o modo como a luz muda ao longo do dia, emocionar-se com uma composição musical ou uma pintura, sentir prazer em ver um trabalho bem feito, ou apreciar a ordem e a simetria de um ambiente organizado.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Apreciação da beleza e da excelência'
  },
  {
    numeroTraco: 46,
    pergunta: 'Você gosta de fazer as coisas do seu jeito, sem depender muito dos outros? Sente-se mais confortável quando pode decidir sozinho como realizar uma tarefa, organizar seu tempo ou resolver um problema? Às vezes, pode até se sentir incomodado quando alguém tenta te orientar demais ou controlar o que você faz.',
    exemplo: 'Exemplos: preferir trabalhar sozinho em vez de em grupo, insistir em resolver um problema sem ajuda, sentir satisfação em concluir tarefas de forma autônoma, ou resistir a instruções muito detalhadas quando já sabe o que fazer.',
    tracoNeutro: ['Nunca', 'Raramente'],
    tracoForca: ['Muito frequentemente', 'Ocasionalmente'],
    tracoFraqueza: ['Quase Sempre'],
    tracoOportunidade: [],
    swot:'Amor pela independência'
  },
];

/**
 * Seed de Forças
 */
async function seedForcas() {
  console.log('🌱 Iniciando seed de Forças...');

  let created = 0;
  let updated = 0;
  let tracosCreated = 0;

  // Fazer upsert de cada registro (criar ou atualizar baseado no numeroTraco)
  for (const registro of FORCAS) {
    const existing = await prisma.forcas.findFirst({
      where: { numeroTraco: registro.numeroTraco },
      include: {
        tracoNeutro: true,
        tracoForca: true,
        tracoFraqueza: true,
        tracoOportunidade: true,
      },
    });

    const dataForca = {
      numeroTraco: registro.numeroTraco,
      pergunta: registro.pergunta,
      exemplo: registro.exemplo,
      swot: registro.swot || '',
    };

    let forca;
    if (existing) {
      forca = await prisma.forcas.update({
        where: { id: existing.id },
        data: dataForca,
      });
      updated++;

      // Deletar traços existentes para recriar
      await prisma.tracoNeutroF.deleteMany({
        where: { forcasId: existing.id },
      });
      await prisma.tracoForcaF.deleteMany({
        where: { forcasId: existing.id },
      });
      await prisma.tracoFraquezaF.deleteMany({
        where: { forcasId: existing.id },
      });
      await prisma.tracoOportunidadeF.deleteMany({
        where: { forcasId: existing.id },
      });
    } else {
      forca = await prisma.forcas.create({
        data: dataForca,
      });
      created++;
    }

    // Criar traços neutros
    if (registro.tracoNeutro && registro.tracoNeutro.length > 0) {
      await prisma.tracoNeutroF.createMany({
        data: registro.tracoNeutro.map((valor) => ({
          valor,
          forcasId: forca.id,
        })),
      });
      tracosCreated += registro.tracoNeutro.length;
    }

    // Criar traços de força
    if (registro.tracoForca && registro.tracoForca.length > 0) {
      await prisma.tracoForcaF.createMany({
        data: registro.tracoForca.map((valor) => ({
          valor,
          forcasId: forca.id,
        })),
      });
      tracosCreated += registro.tracoForca.length;
    }

    // Criar traços de fraqueza
    if (registro.tracoFraqueza && registro.tracoFraqueza.length > 0) {
      await prisma.tracoFraquezaF.createMany({
        data: registro.tracoFraqueza.map((valor) => ({
          valor,
          forcasId: forca.id,
        })),
      });
      tracosCreated += registro.tracoFraqueza.length;
    }

    // Criar traços de oportunidade
    if (registro.tracoOportunidade && registro.tracoOportunidade.length > 0) {
      await prisma.tracoOportunidadeF.createMany({
        data: registro.tracoOportunidade.map((valor) => ({
          valor,
          forcasId: forca.id,
        })),
      });
      tracosCreated += registro.tracoOportunidade.length;
    }
  }

  console.log(
    `✅ Forças: ${created} registro(s) criado(s), ${updated} registro(s) atualizado(s), ${tracosCreated} traço(s) criado(s).`
  );
}

/**
 * Função principal do seed
 * Executa todos os seeds em sequência
 */
async function main() {
  try {
    console.log('🚀 Iniciando processo de seed...\n');

    // Executar todos os seeds
    await seedFraquezasAmeacasSh();
    await seedFraquezasAmeacasCh();
    await seedHistoriasSociais();
    await seedFraquezasOportunidades();
    await seedForcas();

    console.log('\n✨ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o seed
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

