import Tts from 'react-native-tts';

const CARTA_ASSASSINO = 'As1';
const CARTA_CONDESSA = 'Cd1';
const CARTA_CAPITAO = 'Cp1';
const CARTA_DUQUE = 'Dq1';
const CARTA_EMBAIXADOR = 'Em1';
const CARTA_AJUDA = 'Aj1';

export function dizerCartaNome(codigo) {
  let text = 'carta ';
  switch (codigo) {
    case CARTA_ASSASSINO:
      text += 'Assassino';
      break;
    case CARTA_CONDESSA:
      text += 'Condessa';
      break;
    case CARTA_CAPITAO:
      text += 'Capitão';
      break;
    case CARTA_EMBAIXADOR:
      text += 'Embaixador';
      break;
    case CARTA_DUQUE:
      text += 'Duque';
      break;
    case CARTA_AJUDA:
      return null;
    default:
      Tts.speak('LEIA UMA CARTA ANTES');
      return null;
  }
  Tts.speak(text);
}
export function dizerDescricao(cod) {
  switch (cod) {
    case CARTA_ASSASSINO:
      Tts.speak(
        'Pague três moedas para o Tesouro Central e tente assasinar outro jogador. Se for bem sucedido, aquele jogador perde imediatamente uma influência (Pode ser bloqueado pela Condessa)',
      );
      break;
    case CARTA_CONDESSA:
      Tts.speak('Bloqueie uma tentativa de assassinato contra você');
      break;
    case CARTA_CAPITAO:
      Tts.speak(
        'Pegue duas moedas de outro jogador. Se ele só tiver uma moeda, pegue apenas uma. (Pode ser bloqueado pelo Capitão ou Embaixador).',
      );
      break;
    case CARTA_EMBAIXADOR:
      Tts.speak(
        'Pegue duas cartas aleatórias do Baralho da Corte. Troque de zero a duas cartas, com as suas cartas viradas para baixo e devolva duas cartas para o Baralho da Corte.',
      );
      break;
    case CARTA_DUQUE:
      Tts.speak('Pegue três moedas do Tesouro Central');
      break;
    default:
      Tts.speak('LEIA UMA CARTA ANTES');
  }
}
export function dizerDetalhes(cod) {
  switch (cod) {
    case CARTA_ASSASSINO:
      Tts.speak(
        'Pague três moedas para o Tesouro Central e tente assasinar outro jogador.',
      );
      break;
    case CARTA_CONDESSA:
      Tts.speak(
        'O jogador que está sendo assassinado pode reivindicar a Condessa e bloquear o assassinato. O assassinato falha, mas a taxa paga pelo jogador para o Assassino permanece gasta.',
      );
      break;
    case CARTA_CAPITAO:
      Tts.speak(
        'O jogador que está sendo extorquido pode reinvidicar o Capitão e bloquear a extorsão. O jogador que tentava extorquir não recebe moedas neste turno.',
      );
      break;
    case CARTA_DUQUE:
      Tts.speak(
        'Qualquer jogador que reivindicar o Duque pode intervir em um jogador tentando receber ajuda externa. O jogador que tentava ganhar ajuda externa não recebe nenhuma moeda neste turno.',
      );
      break;
    case CARTA_EMBAIXADOR:
      Tts.speak(
        'O jogador que está sendo extorquido pode reinvidicar o Embaixador e bloquear a extorsão. O jogador que tentava extorquir não recebe moedas neste turno.',
      );
      break;
    default:
      Tts.speak('LEIA UMA CARTA ANTES');
  }
}
