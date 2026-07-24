import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
  Vibration,
  StatusBar,
  AccessibilityInfo,
  findNodeHandle,
} from 'react-native';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CODIGO_CARTA,
  dizerCartaNome,
  dizerDescricao,
  dizerDetalhes,
  dizerResumoCarta,
  obterNomeCarta,
  normalizarCodigoCarta,
} from '../helpers/Carta';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import {extrairCodigoCarta, resetStackNavigation} from '../helpers/Auxiliar';
import {TEMA, obterCoresCarta, obterIconeCarta} from '../helpers/Tema';

const VIBRACAO_CARTA_VALIDA = 120;
const VIBRACAO_CARTA_INVALIDA = [0, 80, 80, 180];

class TelaJogar extends React.Component {
  _willBlurSubscription;

  constructor(props) {
    super(props);
    const cartaInicial = normalizarCodigoCarta(
      props.navigation.getParam('cod'),
    );

    this.state = {
      carta: cartaInicial,
    };

    Tts.stop();

    if (cartaInicial) {
      this.ttsTimeout = setTimeout(() => {
        Tts.stop();
        dizerResumoCarta(cartaInicial);
      }, 600);
    }

    NfcManager.registerTagEvent();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      let message = extrairCodigoCarta(tag);

      if (!message) {
        Vibration.vibrate(VIBRACAO_CARTA_INVALIDA);
        Tts.stop();
        Tts.speak('Carta NFC não reconhecida.');
        return;
      }

      if (message !== CODIGO_CARTA.AJUDA) {
        Vibration.vibrate(VIBRACAO_CARTA_VALIDA);
        this.setState({carta: message});
        dizerResumoCarta(message);
      } else {
        Tts.stop();
        Tts.speak('Carta de ajuda, leia outra carta.');
      }
    });
  }

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload => {
        if (this.ttsTimeout) {
          clearTimeout(this.ttsTimeout);
        }
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
        this.focarScanArea();
      },
    );

    this.focusTimeout = setTimeout(() => {
      this.focarScanArea();
    }, 500);
  }

  focarScanArea = () => {
    if (this.scanAreaRef) {
      const reactTag = findNodeHandle(this.scanAreaRef);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  };

  componentWillUnmount() {
    if (this.ttsTimeout) {
      clearTimeout(this.ttsTimeout);
    }
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

  renderBuscando() {
    return (
      <View style={styles.contentArea}>
        {/* Área tracejada de scan */}
        <View
          ref={ref => {
            this.scanAreaRef = ref;
          }}
          accessible={true}
          accessibilityLabel="Aproxime uma carta do celular"
          style={styles.scanArea}>
          <Icon
            name="crosshairs-gps"
            size={64}
            color={TEMA.colors.textSecondary}
          />
          <Text style={styles.scanText}>
            Aproxime uma carta do celular
          </Text>
        </View>
      </View>
    );
  }

  renderCartaDetectada() {
    const nomeCarta = obterNomeCarta(this.state.carta);
    const cores = obterCoresCarta(this.state.carta);
    const icone = obterIconeCarta(this.state.carta);

    return (
      <View style={styles.contentArea}>
        <View
          accessible={true}
          accessibilityLiveRegion="polite"
          accessibilityLabel={nomeCarta}
          style={[styles.cartaCard, {backgroundColor: cores.bg}]}>

          {/* Ícone do personagem */}
          <Icon
            name={icone}
            size={56}
            color={cores.text}
            style={styles.cartaIcone}
          />

          {/* Nome do personagem */}
          <Text style={[styles.cartaNome, {color: cores.text}]}>
            {nomeCarta}
          </Text>
        </View>

        {/* Botão destaque: O que a carta faz */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="O que a carta faz"
          style={styles.btnDestaque}
          onPress={() => dizerDescricao(this.state.carta)}>
          <Icon
            name="volume-high"
            size={24}
            color={TEMA.colors.accentContent}
            style={styles.btnIcon}
          />
          <Text style={styles.btnDestaqueText}>O que a carta faz</Text>
        </TouchableOpacity>

        {/* Botão secundário: Detalhar carta */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Detalhar carta"
          style={styles.btnSecundario}
          onPress={() => dizerDetalhes(this.state.carta)}>
          <Icon
            name="information-outline"
            size={24}
            color={TEMA.colors.textPrimary}
            style={styles.btnIcon}
          />
          <Text style={styles.btnSecundarioText}>Detalhar carta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const temCarta = !!this.state.carta;

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
            Leitor
          </Text>
        </View>

        {temCarta ? this.renderCartaDetectada() : this.renderBuscando()}
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
    marginBottom: TEMA.spacing.sm,
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
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },

  // --- Estado: Buscando carta ---
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TEMA.colors.surfaceBorder,
    borderStyle: 'dashed',
    borderRadius: TEMA.borders.radiusCard,
    marginBottom: TEMA.spacing.lg,
  },
  scanText: {
    fontSize: TEMA.fontSize.lg,
    color: TEMA.colors.textSecondary,
    textAlign: 'center',
    marginTop: TEMA.spacing.lg,
    paddingHorizontal: TEMA.spacing.xl,
  },

  // --- Estado: Carta detectada ---
  cartaCard: {
    borderRadius: TEMA.borders.radiusCard,
    paddingVertical: TEMA.spacing.xl,
    paddingHorizontal: TEMA.spacing.lg,
    alignItems: 'center',
    marginBottom: TEMA.spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: TEMA.borders.radiusSmall,
    paddingVertical: TEMA.spacing.xs,
    paddingHorizontal: TEMA.spacing.sm,
    marginBottom: TEMA.spacing.md,
  },
  badgeText: {
    fontSize: TEMA.fontSize.sm,
    color: TEMA.colors.textPrimary,
    marginLeft: TEMA.spacing.xs,
  },
  cartaIcone: {
    marginBottom: TEMA.spacing.sm,
  },
  cartaNome: {
    fontSize: TEMA.fontSize.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // --- Botões ---
  btnIcon: {
    marginRight: TEMA.spacing.sm,
  },
  btnDestaque: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEMA.colors.accent,
    borderRadius: TEMA.borders.radiusButton,
    paddingVertical: TEMA.spacing.lg,
    marginBottom: TEMA.spacing.sm,
  },
  btnDestaqueText: {
    fontSize: TEMA.fontSize.lg,
    fontWeight: 'bold',
    color: TEMA.colors.accentContent,
  },
  btnSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEMA.colors.surface,
    borderRadius: TEMA.borders.radiusButton,
    borderWidth: TEMA.borders.width,
    borderColor: TEMA.colors.surfaceBorder,
    paddingVertical: TEMA.spacing.lg,
    marginBottom: TEMA.spacing.sm,
  },
  btnSecundarioText: {
    fontSize: TEMA.fontSize.lg,
    fontWeight: 'bold',
    color: TEMA.colors.textPrimary,
  },

  footerNote: {
    fontSize: TEMA.fontSize.sm,
    color: TEMA.colors.textMuted,
    textAlign: 'center',
    paddingBottom: TEMA.spacing.md,
  },
});

export default TelaJogar;
