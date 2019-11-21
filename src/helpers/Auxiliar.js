import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import Ndef from '../../ndef-lib';
import {dizerCartaNome} from './Carta';
import {NavigationActions, StackActions} from 'react-navigation';

export function escutarLeituraNfc(navigation) {
  let routeName = navigation.state.routeName;
  NfcManager.registerTagEvent();
  NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
    let message = Ndef.stringify(tag.ndefMessage);
    message = message.slice(13, 16);
    dizerCartaNome(message);
    if (routeName === 'Principal') {
      if (message !== 'Aj1') {
        navigation.navigate('Jogar', {cod: message});
      } else {
        navigation.navigate('Ajuda', {cod: message});
      }
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
