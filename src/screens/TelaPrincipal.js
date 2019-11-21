import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import Tts from 'react-native-tts';
import {escutarLeituraNfc} from '../helpers/Auxiliar';

class TelaPrincipal extends React.Component {
  constructor(props) {
    super(props);
    Tts.setDefaultLanguage('pt-br');
    Tts.speak('Tela de menu Principal');
    escutarLeituraNfc(this.props.navigation);
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          autoFocus={true}
          style={[styles.jogarBtn, styles.btnStyle]}
          onPress={() => this.props.navigation.navigate('Jogar')}>
          <Text style={styles.textButton}>Jogar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ajudaBtn, styles.btnStyle]}
          onPress={() => this.props.navigation.navigate('Ajuda')}>
          <Text style={styles.textButton}>Ajuda </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    height: '48%',
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '2%',
    paddingTop: '23%',
  },
  textButton: {
    textAlign: 'center',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  jogarBtn: {
    backgroundColor: '#ca3027',
  },
  ajudaBtn: {
    backgroundColor: '#ef18cd',
  },
});

export default TelaPrincipal;
