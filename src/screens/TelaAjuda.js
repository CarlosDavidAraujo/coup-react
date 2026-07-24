import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
  StatusBar,
  AccessibilityInfo,
  findNodeHandle,
} from 'react-native';
import {CODIGO_CARTA, dizerDetalhes} from '../helpers/Carta';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {escutarLeituraNfc, resetStackNavigation} from '../helpers/Auxiliar';
import {TEMA, obterCoresCarta, obterIconeCarta} from '../helpers/Tema';

const CARTAS_AJUDA = [
  {codigo: CODIGO_CARTA.DUQUE, nome: 'Duque'},
  {codigo: CODIGO_CARTA.CAPITAO, nome: 'Capitão'},
  {codigo: CODIGO_CARTA.ASSASSINO, nome: 'Assassino'},
  {codigo: CODIGO_CARTA.CONDESSA, nome: 'Condessa'},
  {codigo: CODIGO_CARTA.EMBAIXADOR, nome: 'Embaixador'},
];

class TelaAjuda extends React.Component {
  _willBlurSubscription;

  constructor(props) {
    super(props);
    Tts.stop();
    escutarLeituraNfc(this.props.navigation);
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          resetStackNavigation(this.props.navigation),
          Tts.stop(),
        );
      },
    );

    this._didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      () => {
        this.focarDuque();
      },
    );

    this.focusTimeout = setTimeout(() => {
      this.focarDuque();
    }, 500);
  }

  focarDuque = () => {
    if (this.duqueRef) {
      const reactTag = findNodeHandle(this.duqueRef);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  };

  componentWillUnmount() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
    }
    if (this._didFocusSubscription) {
      this._didFocusSubscription.remove();
    }
    if (this._willBlurSubscription) {
      this._willBlurSubscription.remove();
    }
    Tts.stop();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={TEMA.colors.background} barStyle="dark-content" />

        {/* Header customizado */}
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
            onPress={() => resetStackNavigation(this.props.navigation)}>
            <Icon name="chevron-left" size={32} color={TEMA.colors.textPrimary} />
          </TouchableOpacity>
          <Text
            accessibilityRole="header"
            style={styles.headerTitle}>
            Ajuda
          </Text>
        </View>

        {/* Lista de cartas */}
        <View style={styles.cardList}>
          {CARTAS_AJUDA.map(carta => {
             const cores = obterCoresCarta(carta.codigo);
             const icone = obterIconeCarta(carta.codigo);

             return (
               <TouchableOpacity
                 key={carta.codigo}
                 ref={ref => {
                   if (carta.codigo === CODIGO_CARTA.DUQUE) {
                     this.duqueRef = ref;
                   }
                 }}
                 accessibilityRole="button"
                 accessibilityLabel={`Detalhes de ${carta.nome}`}
                 style={[styles.cartaBtn, {backgroundColor: cores.bg}]}
                 onPress={() => dizerDetalhes(carta.codigo)}>
                 <Icon
                   name={icone}
                   size={24}
                   color={cores.text}
                   style={styles.cartaIcon}
                 />
                 <Text style={[styles.cartaNome, {color: cores.text}]}>
                  {carta.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: TEMA.spacing.lg,
    backgroundColor: TEMA.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: TEMA.spacing.md,
  },
  backButton: {
    padding: TEMA.spacing.md,
    marginRight: TEMA.spacing.xs,
    marginLeft: -TEMA.spacing.md,
  },
  headerTitle: {
    fontSize: TEMA.fontSize.lg,
    fontWeight: 'bold',
    color: TEMA.colors.textPrimary,
  },
  cardList: {
    flex: 1,
    justifyContent: 'center',
  },
  cartaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: TEMA.borders.radiusButton,
    paddingVertical: TEMA.spacing.lg,
    paddingHorizontal: TEMA.spacing.lg,
    marginBottom: TEMA.spacing.sm,
  },
  cartaIcon: {
    marginRight: TEMA.spacing.md,
  },
  cartaNome: {
    fontSize: TEMA.fontSize.lg,
    fontWeight: 'bold',
  },
  footerNote: {
    fontSize: TEMA.fontSize.sm,
    color: TEMA.colors.textMuted,
    textAlign: 'center',
    marginTop: TEMA.spacing.md,
    paddingBottom: TEMA.spacing.md,
  },
});

export default TelaAjuda;
