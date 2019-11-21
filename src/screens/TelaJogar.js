import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import Tts from 'react-native-tts';
import {dizerCartaNome, dizerDescricao, dizerDetalhes} from '../helpers/Carta';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import Ndef from '../../ndef-lib';
import {resetStackNavigation} from '../helpers/Auxiliar';


class TelaJogar extends React.Component {
  _willBlurSubscription;
  carta = '';
  constructor(props) {
    super(props);
    Tts.setDefaultLanguage('pt-br');
    Tts.speak('Tela ler informações das Cartas  ');

    if (props.navigation.getParam('cod', 'NO-CODE') !== 'NO-CODE') {
      this.carta = props.navigation.getParam('cod', 'NO-CODE');
    } else {
      Tts.speak('APROXIME O CELULAR DA CARTA QUE DESEJA LER');
    }
    NfcManager.registerTagEvent();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      let message = Ndef.stringify(tag.ndefMessage);
      message = message.slice(13, 16);
      dizerCartaNome(message);
      if (message !== 'Aj1') {
        this.carta = message;
      } else {
        Tts.speak("Carta de ajuda, leia outra carta.");
      }
    });
  }
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          resetStackNavigation(this.props.navigation),
          Tts.stop(),
        ),
    );
  }
  render() {
    return (
      <View accessible={true}>
        <TouchableOpacity
          style={[styles.nomeBtn, styles.btnStyle]}
          onPress={() => dizerCartaNome(this.carta)}>
          <Text style={styles.textButton}>Nome</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.descricaoBtn, styles.btnStyle]}
          onPress={() => dizerDescricao(this.carta)}>
          <Text style={styles.textButton}>Descrição</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.detalhesBtn, styles.btnStyle]}
          onPress={() => dizerDetalhes(this.carta)}>
          <Text style={styles.textButton}>Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    height: '31%',
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '3%',
    paddingTop: '13%',
  },
  textButton: {
    textAlign: 'center',
    top: '-10%',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  nomeBtn: {
    backgroundColor: '#ca3027',
  },
  descricaoBtn: {
    backgroundColor: '#ef18cd',
  },
  detalhesBtn: {
    backgroundColor: '#4120de',
  },
});
export default TelaJogar;
