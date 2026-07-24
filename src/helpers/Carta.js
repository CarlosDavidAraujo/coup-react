import Tts from 'react-native-tts';

export const CODIGO_CARTA = {
  ASSASSINO: 'As1',
  CONDESSA: 'Cd1',
  CAPITAO: 'Cp1',
  DUQUE: 'Dq1',
  EMBAIXADOR: 'Em1',
  AJUDA: 'Aj1',
};

const CARTAS = {
  [CODIGO_CARTA.ASSASSINO]: {
    codigo: CODIGO_CARTA.ASSASSINO,
    nome: 'Assassino',
    descricao:
      'Pague três moedas para o Tesouro Central e tente assassinar outro jogador.',
    detalhes:
      'Pague três moedas para o Tesouro Central e tente assassinar outro jogador. Se for bem sucedido, aquele jogador perde imediatamente uma influência. Pode ser bloqueado pela Condessa.',
  },
  [CODIGO_CARTA.CONDESSA]: {
    codigo: CODIGO_CARTA.CONDESSA,
    nome: 'Condessa',
    descricao: 'Bloqueie uma tentativa de assassinato contra você.',
    detalhes:
      'O jogador que está sendo assassinado pode reivindicar a Condessa e bloquear o assassinato. O assassinato falha, mas a taxa paga pelo jogador para o Assassino permanece gasta.',
  },
  [CODIGO_CARTA.CAPITAO]: {
    codigo: CODIGO_CARTA.CAPITAO,
    nome: 'Capitão',
    descricao:
      'Pegue duas moedas de outro jogador. Pode ser bloqueado pelo Capitão ou pelo Embaixador.',
    detalhes:
      'Pegue duas moedas de outro jogador. Se ele só tiver uma moeda, pegue apenas uma. O jogador que está sendo extorquido pode reivindicar o Capitão ou o Embaixador e bloquear a extorsão.',
  },
  [CODIGO_CARTA.DUQUE]: {
    codigo: CODIGO_CARTA.DUQUE,
    nome: 'Duque',
    descricao: 'Pegue três moedas do Tesouro Central.',
    detalhes:
      'Pegue três moedas do Tesouro Central. Qualquer jogador que reivindicar o Duque pode bloquear um jogador tentando receber ajuda externa.',
  },
  [CODIGO_CARTA.EMBAIXADOR]: {
    codigo: CODIGO_CARTA.EMBAIXADOR,
    nome: 'Embaixador',
    descricao:
      'Pegue duas cartas aleatórias do Baralho da Corte, troque até duas cartas e devolva duas cartas.',
    detalhes:
      'Pegue duas cartas aleatórias do Baralho da Corte. Troque de zero a duas cartas com as suas cartas viradas para baixo e devolva duas cartas para o Baralho da Corte. O Embaixador também pode bloquear extorsão.',
  },
  [CODIGO_CARTA.AJUDA]: {
    codigo: CODIGO_CARTA.AJUDA,
    nome: 'Ajuda',
    descricao: 'Abra a tela de ajuda para ouvir detalhes sobre cada carta.',
    detalhes: 'A tela de ajuda lista as cartas e explica a ação de cada uma.',
  },
};

const CODIGOS_NORMALIZADOS = {
  as1: CODIGO_CARTA.ASSASSINO,
  cd1: CODIGO_CARTA.CONDESSA,
  cp1: CODIGO_CARTA.CAPITAO,
  dq1: CODIGO_CARTA.DUQUE,
  em1: CODIGO_CARTA.EMBAIXADOR,
  aj1: CODIGO_CARTA.AJUDA,
};

export function normalizarCodigoCarta(valor) {
  const texto = String(valor || '').replace(/[^a-zA-Z0-9]/g, '');
  const match = texto.match(/(as1|cd1|cp1|dq1|em1|aj1)/i);

  if (!match) {
    return '';
  }

  return CODIGOS_NORMALIZADOS[match[1].toLowerCase()];
}

export function obterCarta(codigo) {
  return CARTAS[normalizarCodigoCarta(codigo)] || null;
}

export function obterNomeCarta(codigo) {
  const carta = obterCarta(codigo);
  return carta ? carta.nome : '';
}

export function obterDescricaoCarta(codigo) {
  const carta = obterCarta(codigo);
  return carta ? carta.descricao : '';
}

export function obterDetalhesCarta(codigo) {
  const carta = obterCarta(codigo);
  return carta ? carta.detalhes : '';
}

function falarOuPedirCarta(texto) {
  Tts.stop();

  if (!texto) {
    Tts.speak('Leia uma carta antes.');
    return null;
  }

  Tts.speak(texto);
  return texto;
}

export function dizerCartaNome(codigo) {
  return falarOuPedirCarta(obterNomeCarta(codigo));
}

export function dizerDescricao(codigo) {
  return falarOuPedirCarta(obterDescricaoCarta(codigo));
}

export function dizerDetalhes(codigo) {
  return falarOuPedirCarta(obterDetalhesCarta(codigo));
}

export function dizerResumoCarta(codigo) {
  const carta = obterCarta(codigo);
  Tts.stop();

  if (!carta) {
    Tts.speak('Leia uma carta antes.');
    return null;
  }

  Tts.speak(carta.nome);

  return carta;
}
