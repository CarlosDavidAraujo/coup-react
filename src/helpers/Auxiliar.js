import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import {Vibration} from 'react-native';
import Tts from 'react-native-tts';
import Ndef from '../../ndef-lib';
import {CODIGO_CARTA, dizerResumoCarta, normalizarCodigoCarta} from './Carta';
import {NavigationActions, StackActions} from 'react-navigation';

const VIBRACAO_CARTA_VALIDA = 120;
const VIBRACAO_CARTA_INVALIDA = [0, 80, 80, 180];

function bytesParaTexto(bytes) {
  if (typeof bytes === 'string') {
    return bytes;
  }

  if (!Array.isArray(bytes)) {
    return '';
  }

  return bytes.map(byte => String.fromCharCode(byte)).join('');
}

function extrairTextosDoRegistro(registro) {
  const textos = [];
  const tipo = bytesParaTexto(registro.type);

  if (registro.value) {
    textos.push(registro.value);
  }

  if (Array.isArray(registro.payload)) {
    if (tipo === Ndef.RTD_TEXT) {
      textos.push(Ndef.text.decodePayload(registro.payload));
    }

    textos.push(bytesParaTexto(registro.payload));
  }

  return textos;
}

export function extrairCodigoCarta(tag) {
  const textos = [];

  if (tag && Array.isArray(tag.ndefMessage)) {
    tag.ndefMessage.forEach(registro => {
      textos.push(...extrairTextosDoRegistro(registro));
    });

    textos.push(Ndef.stringify(tag.ndefMessage));
  }

  return normalizarCodigoCarta(textos.join('\n'));
}

export function escutarLeituraNfc(navigation) {
  let routeName = navigation.state.routeName;
  NfcManager.registerTagEvent();
  NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
    let message = extrairCodigoCarta(tag);
    if (!message) {
      Vibration.vibrate(VIBRACAO_CARTA_INVALIDA);
      Tts.stop();
      Tts.speak('Carta NFC não reconhecida.');
      return;
    }

    if (routeName !== 'Principal') {
      Vibration.vibrate(VIBRACAO_CARTA_VALIDA);
      dizerResumoCarta(message);
      return;
    }

    if (message !== CODIGO_CARTA.AJUDA) {
      Vibration.vibrate(VIBRACAO_CARTA_VALIDA);
      navigation.navigate('Jogar', {cod: message});
    } else {
      Vibration.vibrate(VIBRACAO_CARTA_VALIDA);
      navigation.navigate('Ajuda', {cod: message});
    }
  });
}

export function resetStackNavigation(navigation) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'Principal'})],
  });
  navigation.dispatch(resetAction);
}
                  