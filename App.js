import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import TelaPrincipal from './src/screens/TelaPrincipal';
import TelaAjuda from './src/screens/TelaAjuda';
import TelaJogar from './src/screens/TelaJogar';

const navigator = createStackNavigator(
  {
    Principal: {
      screen: TelaPrincipal,
      navigationOptions: {
        title: 'Tela de Menu Principal',
      },
    },
    Ajuda: {
      screen: TelaAjuda,
      navigationOptions: {
        title: 'Tela de Ajuda',
        headerLeft: null,
      },
    },
    Jogar: {
      screen: TelaJogar,
      navigationOptions: {
        title: 'Tela Ler Informação das cartas',
        headerLeft: null,
      },
    },
  },
  {
    initialRouteName: 'Principal',
    defaultNavigationOptions: {
      title: 'App',
      headerStyle: {
        backgroundColor: '#1957e0',
      },
      headerTintColor: 'white',
    },
  },
);

export default createAppContainer(navigator);
