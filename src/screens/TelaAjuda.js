import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import {dizerDetalhes} from '../helpers/Carta';
import Tts from 'react-native-tts';
import {escutarLeituraNfc, resetStackNavigation} from '../helpers/Auxiliar';

class TelaAjuda extends React.Component {
  _willBlurSubscription;
  constructor(props) {
    super(props);
    Tts.setDefaultLanguage('pt-br');
    Tts.speak('Entenda a ação de cada carta');
    Tts.speak('Tela de ajuda');
    Tts.speak('Aproxime o celular da carta que deseja ler');
    escutarLeituraNfc(this.props.navigation);
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
          style={[styles.btnStyle, styles.assassinoBtn]}
          onPress={() => dizerDetalhes('As1')}>
          <Text style={styles.textButton}>Assassino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnStyle, styles.capitaoBtn]}
          onPress={() => dizerDetalhes('Cp1')}>
          <Text style={styles.textButton}>Capitão</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnStyle, styles.condessaBtn]}
          onPress={() => dizerDetalhes('Cd1')}>
          <Text style={styles.textButton}>Condessa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnStyle, styles.duqueBtn]}
          onPress={() => dizerDetalhes('Dq1')}>
          <Text style={styles.textButton}>Duque</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnStyle, styles.embaixadorBtn]}
          onPress={() => dizerDetalhes('Em1')}>
          <Text style={styles.textButton}>Embaixador</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnStyle, styles.voltarBtn]}
          onPress={() => resetStackNavigation(this.props.navigation)}>
          <Text style={styles.textButton}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    height: '15%',
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '2%',
  },
  textButton: {
    textAlign: 'center',
    top: '-5%',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  assassinoBtn: {
    backgroundColor: '#f03800',
  },
  capitaoBtn: {
    backgroundColor: '#ac00b2',
  },
  duqueBtn: {
    backgroundColor: '#f80060',
  },
  condessaBtn: {
    backgroundColor: '#5427b7',
  },
  embaixadorBtn: {
    backgroundColor: '#00bcd5',
  },
  voltarBtn: {
    backgroundColor: '#009c87',
  },
});

export default TelaAjuda;
