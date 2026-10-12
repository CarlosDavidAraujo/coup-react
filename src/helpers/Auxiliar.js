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
      try {
        if (registro.payload && registro.payload.length > 0) {
          let textoDescodificado = Ndef.text.decodePayload(registro.payload);
          if (textoDescodificado) {
            textos.push(textoDescodificado);
          }
        }
      } catch (e) {
   
      }

      textos.push(...extrairTextosDoRegistro(registro));
    });
  }

  const textoBruto = textos.join(' ').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  return normalizarCodigoCarta(textoBruto);
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
      
      if (message === CODIGO_CARTA.AJUDA) {
        navigation.navigate('Jogar', {cod: message});
      } else {
        dizerResumoCarta(message);
      }
      return;
    }

    Vibration.vibrate(VIBRACAO_CARTA_VALIDA);
    if (message !== CODIGO_CARTA.AJUDA) {
      navigation.navigate('Jogar', {cod: message});
    } else {
      navigation.navigate('Jogar', {cod: message});
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
                  