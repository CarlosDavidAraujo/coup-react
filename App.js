import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import TelaPrincipal from './src/screens/TelaPrincipal';
import TelaAjuda from './src/screens/TelaAjuda';
import TelaJogar from './src/screens/TelaJogar';
import {TEMA} from './src/helpers/Tema';
import Tts from 'react-native-tts';

// Inicializa o TTS de forma segura esperando o motor nativo carregar
Tts.getInitStatus()
  .then(() => {
    return Tts.setDefaultLanguage('pt-br');
  })
  .catch(err => {
    console.warn('Falha ao inicializar motor ou idioma do TTS:', err);
  });

const navigator = createStackNavigator(
  {
    Principal: {
      screen: TelaPrincipal,
    },
    Ajuda: {
      screen: TelaAjuda,
    },
    Jogar: {
      screen: TelaJogar,
    },
  },
  {
    initialRouteName: 'Principal',
    defaultNavigationOptions: {
      headerShown: false,
    },
    cardStyle: {
      backgroundColor: TEMA.colors.background,
    },
  },
);

export default createAppContainer(navigator);
