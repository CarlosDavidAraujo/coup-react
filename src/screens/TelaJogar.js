// import React from 'react';
// import {
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   BackHandler,
//   Vibration,
//   StatusBar,
//   AccessibilityInfo,
//   findNodeHandle,
// } from 'react-native';
// import Tts from 'react-native-tts';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {
//   CODIGO_CARTA,
//   dizerCartaNome,
//   dizerDescricao,
//   dizerDetalhes,
//   dizerResumoCarta,
//   obterNomeCarta,
//   normalizarCodigoCarta,
// } from '../helpers/Carta';
// import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
// import {extrairCodigoCarta, resetStackNavigation} from '../helpers/Auxiliar';
// import {TEMA, obterCoresCarta, obterIconeCarta} from '../helpers/Tema';

// const VIBRACAO_CARTA_VALIDA = 120;
// const VIBRACAO_CARTA_INVALIDA = [0, 80, 80, 180];

// class TelaJogar extends React.Component {
//   _willBlurSubscription;

//   constructor(props) {
//     super(props);
//     const cartaInicial = normalizarCodigoCarta(
//       props.navigation.getParam('cod'),
//     );

//     this.state = {
//       carta: cartaInicial,
//     };

//     Tts.stop();

//     if (cartaInicial) {
//       this.ttsTimeout = setTimeout(() => {
//         Tts.stop();
//         dizerResumoCarta(cartaInicial);
//       }, 600);
//     }

//     NfcManager.registerTagEvent();
//     NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
//       let message = extrairCodigoCarta(tag);

//       if (!message) {
//         Vibration.vibrate(VIBRACAO_CARTA_INVALIDA);
//         Tts.stop();
//         Tts.speak('Carta NFC não reconhecida.');
//         return;
//       }

//       if (message !== CODIGO_CARTA.AJUDA) {
//         Vibration.vibrate(VIBRACAO_CARTA_VALIDA);
//         this.setState({carta: message});
//         dizerResumoCarta(message);
//       } else {
//         Tts.stop();
//         Tts.speak('Carta de ajuda, leia outra carta.');
//       }
//     });
//   }

//   componentDidMount() {
//     this._willBlurSubscription = this.props.navigation.addListener(
//       'willBlur',
//       payload => {
//         if (this.ttsTimeout) {
//           clearTimeout(this.ttsTimeout);
//         }
//         BackHandler.removeEventListener(
//           'hardwareBackPress',
//           resetStackNavigation(this.props.navigation),
//           Tts.stop(),
//         );
//       },
//     );

//     this._didFocusSubscription = this.props.navigation.addListener(
//       'didFocus',
//       () => {
//         this.focarScanArea();
//       },
//     );

//     this.focusTimeout = setTimeout(() => {
//       this.focarScanArea();
//     }, 500);
//   }

//   focarScanArea = () => {
//     if (this.scanAreaRef) {
//       const reactTag = findNodeHandle(this.scanAreaRef);
//       if (reactTag) {
//         AccessibilityInfo.setAccessibilityFocus(reactTag);
//       }
//     }
//   };

//   componentWillUnmount() {
//     if (this.ttsTimeout) {
//       clearTimeout(this.ttsTimeout);
//     }
//     if (this.focusTimeout) {
//       clearTimeout(this.focusTimeout);
//     }
//     if (this._didFocusSubscription) {
//       this._didFocusSubscription.remove();
//     }
//     if (this._willBlurSubscription) {
//       this._willBlurSubscription.remove();
//     }
//     Tts.stop();
//   }

//   renderBuscando() {
//     return (
//       <View style={styles.contentArea}>
//         {/* Área tracejada de scan */}
//         <View
//           ref={ref => {
//             this.scanAreaRef = ref;
//           }}
//           accessible={true}
//           accessibilityLabel="Aproxime uma carta do celular"
//           style={styles.scanArea}>
//           <Icon
//             name="crosshairs-gps"
//             size={64}
//             color={TEMA.colors.textSecondary}
//           />
//           <Text style={styles.scanText}>
//             Aproxime uma carta do celular
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   renderCartaDetectada() {
//     const nomeCarta = obterNomeCarta(this.state.carta);
//     const cores = obterCoresCarta(this.state.carta);
//     const icone = obterIconeCarta(this.state.carta);

//     return (
//       <View style={styles.contentArea}>
//         <View
//           accessible={true}
//           accessibilityLiveRegion="polite"
//           accessibilityLabel={nomeCarta}
//           style={[styles.cartaCard, {backgroundColor: cores.bg}]}>

//           {/* Ícone do personagem */}
//           <Icon
//             name={icone}
//             size={56}
//             color={cores.text}
//             style={styles.cartaIcone}
//           />

//           {/* Nome do personagem */}
//           <Text style={[styles.cartaNome, {color: cores.text}]}>
//             {nomeCarta}
//           </Text>
//         </View>

//         {/* Botão destaque: O que a carta faz */}
//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityLabel="O que a carta faz"
//           style={styles.btnDestaque}
//           onPress={() => dizerDescricao(this.state.carta)}>
//           <Icon
//             name="volume-high"
//             size={24}
//             color={TEMA.colors.accentContent}
//             style={styles.btnIcon}
//           />
//           <Text style={styles.btnDestaqueText}>O que a carta faz</Text>
//         </TouchableOpacity>

//         {/* Botão secundário: Detalhar carta */}
//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityLabel="Detalhar carta"
//           style={styles.btnSecundario}
//           onPress={() => dizerDetalhes(this.state.carta)}>
//           <Icon
//             name="information-outline"
//             size={24}
//             color={TEMA.colors.textPrimary}
//             style={styles.btnIcon}
//           />
//           <Text style={styles.btnSecundarioText}>Detalhar carta</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   render() {
//     const temCarta = !!this.state.carta;

//     return (
//       <View style={styles.container}>
//         <StatusBar backgroundColor={TEMA.colors.background} barStyle="dark-content" />

//         {/* Header customizado */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             accessibilityRole="button"
//             accessibilityLabel="Voltar"
//             style={styles.backButton}
//             onPress={() => resetStackNavigation(this.props.navigation)}>
//             <Icon name="chevron-left" size={32} color={TEMA.colors.textPrimary} />
//           </TouchableOpacity>
//           <Text
//             accessibilityRole="header"
//             style={styles.headerTitle}>
//             Leitor
//           </Text>
//         </View>

//         {temCarta ? this.renderCartaDetectada() : this.renderBuscando()}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: TEMA.spacing.lg,
//     backgroundColor: TEMA.colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: TEMA.spacing.sm,
//   },
//   backButton: {
//     padding: TEMA.spacing.md,
//     marginRight: TEMA.spacing.xs,
//     marginLeft: -TEMA.spacing.md,
//   },
//   headerTitle: {
//     fontSize: TEMA.fontSize.lg,
//     fontWeight: 'bold',
//     color: TEMA.colors.textPrimary,
//   },
//   contentArea: {
//     flex: 1,
//     justifyContent: 'center',
//   },

//   // --- Estado: Buscando carta ---
//   scanArea: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: TEMA.colors.surfaceBorder,
//     borderStyle: 'dashed',
//     borderRadius: TEMA.borders.radiusCard,
//     marginBottom: TEMA.spacing.lg,
//   },
//   scanText: {
//     fontSize: TEMA.fontSize.lg,
//     color: TEMA.colors.textSecondary,
//     textAlign: 'center',
//     marginTop: TEMA.spacing.lg,
//     paddingHorizontal: TEMA.spacing.xl,
//   },

//   // --- Estado: Carta detectada ---
//   cartaCard: {
//     borderRadius: TEMA.borders.radiusCard,
//     paddingVertical: TEMA.spacing.xl,
//     paddingHorizontal: TEMA.spacing.lg,
//     alignItems: 'center',
//     marginBottom: TEMA.spacing.lg,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     borderRadius: TEMA.borders.radiusSmall,
//     paddingVertical: TEMA.spacing.xs,
//     paddingHorizontal: TEMA.spacing.sm,
//     marginBottom: TEMA.spacing.md,
//   },
//   badgeText: {
//     fontSize: TEMA.fontSize.sm,
//     color: TEMA.colors.textPrimary,
//     marginLeft: TEMA.spacing.xs,
//   },
//   cartaIcone: {
//     marginBottom: TEMA.spacing.sm,
//   },
//   cartaNome: {
//     fontSize: TEMA.fontSize.xxl,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },

//   // --- Botões ---
//   btnIcon: {
//     marginRight: TEMA.spacing.sm,
//   },
//   btnDestaque: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: TEMA.colors.accent,
//     borderRadius: TEMA.borders.radiusButton,
//     paddingVertical: TEMA.spacing.lg,
//     marginBottom: TEMA.spacing.sm,
//   },
//   btnDestaqueText: {
//     fontSize: TEMA.fontSize.lg,
//     fontWeight: 'bold',
//     color: TEMA.colors.accentContent,
//   },
//   btnSecundario: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: TEMA.colors.surface,
//     borderRadius: TEMA.borders.radiusButton,
//     borderWidth: TEMA.borders.width,
//     borderColor: TEMA.colors.surfaceBorder,
//     paddingVertical: TEMA.spacing.lg,
//     marginBottom: TEMA.spacing.sm,
//   },
//   btnSecundarioText: {
//     fontSize: TEMA.fontSize.lg,
//     fontWeight: 'bold',
//     color: TEMA.colors.textPrimary,
//   },

//   footerNote: {
//     fontSize: TEMA.fontSize.sm,
//     color: TEMA.colors.textMuted,
//     textAlign: 'center',
//     paddingBottom: TEMA.spacing.md,
//   },
// });

// export default TelaJogar;
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
  ScrollView,
} from 'react-native';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CODIGO_CARTA,
  dizerDescricao,
  dizerDetalhes,
  obterNomeCarta,
  normalizarCodigoCarta,
} from '../helpers/Carta';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import {extrairCodigoCarta, resetStackNavigation} from '../helpers/Auxiliar';
import {TEMA, obterCoresCarta, obterIconeCarta} from '../helpers/Tema';

const VIBRACAO_CARTA_VALIDA = 120;
const VIBRACAO_CARTA_INVALIDA = [0, 80, 80, 180];

// Dados da Carta de Ajuda (Resumo de Turno)
const ACOES_TURNO = [
  {
    id: 'renda',
    titulo: 'Renda',
    efeito: 'Receba 1 moeda.',
    observacao: 'Não pode ser bloqueado ou contestado.',
    icone: 'cash-plus',
  },
  {
    id: 'ajuda_externa',
    titulo: 'Ajuda Externa',
    efeito: 'Receba 2 moedas.',
    observacao: 'Pode ser bloqueado pelo Duque.',
    icone: 'hand-holding-usd',
  },
  {
    id: 'golpe_estado',
    titulo: 'Golpe de Estado',
    efeito: 'Pague 7 moedas e escolha um jogador que perderá uma de suas influências.',
    observacao: 'Não pode ser bloqueado ou contestado.',
    alertaEspecial: 'Se o jogador possuir 10+ moedas, deverá dar um Golpe de Estado.',
    icone: 'sword-cross',
  },
];

const PERSONAGENS_AJUDA = [
  {codigo: CODIGO_CARTA.DUQUE, nome: 'Duque', acao: 'Taxas: Receba 3 moedas.', bloqueio: 'Bloqueia Ajuda Externa.'},
  {codigo: CODIGO_CARTA.CAPITAO, nome: 'Capitão', acao: 'Extorsão: Pegue 2 moedas de outro jogador.', bloqueio: 'Bloqueia Extorsão.'},
  {codigo: CODIGO_CARTA.ASSASSINO, nome: 'Assassino', acao: 'Assassinar: Pague 3 moedas e elimine uma influência.', bloqueio: 'Nenhum.'},
  {codigo: CODIGO_CARTA.CONDESSA, nome: 'Condessa', acao: 'Nenhuma.', bloqueio: 'Bloqueia Assassinato.'},
  {codigo: CODIGO_CARTA.EMBAIXADOR, nome: 'Embaixador', acao: 'Trocar: Compre 2 cartas, escolha com quais ficar e devolva 2.', bloqueio: 'Bloqueia Extorsão.'},
];

class TelaJogar extends React.Component {
  _willBlurSubscription;
  _didFocusSubscription;

  constructor(props) {
    super(props);
    const cartaInicial = normalizarCodigoCarta(props.navigation.getParam('cod'));

    this.state = {
      carta: cartaInicial,
    };

    Tts.stop();

    if (cartaInicial) {
      this.ttsTimeout = setTimeout(() => {
        Tts.stop();
        this.falarEntradaCarta(cartaInicial);
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

      Vibration.vibrate(VIBRACAO_CARTA_VALIDA);
      this.setState({carta: message});
      this.falarEntradaCarta(message);
    });
  }

  falarEntradaCarta = carta => {
    Tts.stop();
    if (carta === CODIGO_CARTA.AJUDA) {
      Tts.speak('Carta de Ajuda e Resumo de Turno detectada.');
    } else {
      const nome = obterNomeCarta(carta);
      Tts.speak(`Carta detectada: ${nome}`);
    }
  };

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
      if (this.ttsTimeout) clearTimeout(this.ttsTimeout);
      BackHandler.removeEventListener('hardwareBackPress', resetStackNavigation(this.props.navigation));
      Tts.stop();
    });

    this._didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
      this.focarScanArea();
    });

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
    if (this.ttsTimeout) clearTimeout(this.ttsTimeout);
    if (this.focusTimeout) clearTimeout(this.focusTimeout);
    if (this._didFocusSubscription) this._didFocusSubscription.remove();
    if (this._willBlurSubscription) this._willBlurSubscription.remove();
    Tts.stop();
  }

  falarAcao = (titulo, efeito, obs) => {
    Tts.stop();
    Tts.speak(`${titulo}. ${efeito} ${obs || ''}`);
  };

  renderBuscando() {
    return (
      <View style={styles.contentArea}>
        <View
          ref={ref => (this.scanAreaRef = ref)}
          accessible={true}
          accessibilityLabel="Aproxime uma carta do celular"
          style={styles.scanArea}>
          <Icon name="crosshairs-gps" size={64} color={TEMA.colors.textSecondary} />
          <Text style={styles.scanText}>Aproxime uma carta do celular</Text>
        </View>
      </View>
    );
  }

  // --- RENDER DA CARTA DE AJUDA ---
  renderCartaAjuda() {
    return (
      <ScrollView contentContainerStyle={styles.scrollAjudaContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.secaoTitulo}>Resumo de Turno</Text>

        {ACOES_TURNO.map(acao => {
          const textoAcessibilidade = `${acao.titulo}. ${acao.efeito} ${acao.observacao} ${acao.alertaEspecial || ''}`;

          return (
            <TouchableOpacity
              key={acao.id}
              accessibilityRole="button"
              accessibilityLabel={textoAcessibilidade}
              style={styles.card}
              onPress={() => this.falarAcao(acao.titulo, acao.efeito, `${acao.observacao} ${acao.alertaEspecial || ''}`)}>
              <View style={styles.cardHeader}>
                <Icon name={acao.icone} size={22} color={TEMA.colors.primary || '#D32F2F'} style={styles.cardIcon} />
                <Text style={styles.cardTitulo}>{acao.titulo}</Text>
              </View>
              <Text style={styles.cardTexto}>{acao.efeito}</Text>
              <Text style={styles.cardObs}>{acao.observacao}</Text>

              {acao.alertaEspecial && (
                <View style={styles.alertaCardBox}>
                  <Text style={styles.alertaCardTexto}>{acao.alertaEspecial}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <Text style={[styles.secaoTitulo, {marginTop: TEMA.spacing.md}]}>Personagens e Contra-ações</Text>

        {PERSONAGENS_AJUDA.map(p => {
          const corTextoOpaca = TEMA.colors.textPrimary || '#212121';
          const iconeNome = obterIconeCarta ? obterIconeCarta(p.codigo) : 'account';

          return (
            <TouchableOpacity
              key={p.codigo}
              accessibilityRole="button"
              accessibilityLabel={`${p.nome}. Ação: ${p.acao}. Bloqueio: ${p.bloqueio}`}
              style={styles.card}
              onPress={() => this.falarAcao(p.nome, `Ação: ${p.acao}`, `Contra-ação: ${p.bloqueio}`)}>
              <View style={styles.cardHeader}>
                <Icon name={iconeNome} size={24} color={corTextoOpaca} style={styles.cardIcon} />
                <Text style={[styles.cardTitulo, {color: corTextoOpaca}]}>{p.nome}</Text>
              </View>

              <View style={styles.personagemDetalhe}>
                <Text style={styles.label}>Ação: </Text>
                <Text style={styles.cardTexto}>{p.acao}</Text>
              </View>

              <View style={styles.personagemDetalhe}>
                <Text style={styles.label}>Contra-ação: </Text>
                <Text style={styles.cardObs}>{p.bloqueio}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  // --- RENDER DE PERSONAGENS NORMAIS ---
  renderCartaPersonagem() {
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
          <Icon name={icone} size={56} color={cores.text} style={styles.cartaIcone} />
          <Text style={[styles.cartaNome, {color: cores.text}]}>{nomeCarta}</Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="O que a carta faz"
          style={styles.btnDestaque}
          onPress={() => dizerDescricao(this.state.carta)}>
          <Icon name="volume-high" size={24} color={TEMA.colors.accentContent} style={styles.btnIcon} />
          <Text style={styles.btnDestaqueText}>O que a carta faz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Detalhar carta"
          style={styles.btnSecundario}
          onPress={() => dizerDetalhes(this.state.carta)}>
          <Icon name="information-outline" size={24} color={TEMA.colors.textPrimary} style={styles.btnIcon} />
          <Text style={styles.btnSecundarioText}>Detalhar carta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderContent() {
    if (!this.state.carta) {
      return this.renderBuscando();
    }
    if (this.state.carta === CODIGO_CARTA.AJUDA) {
      return this.renderCartaAjuda();
    }
    return this.renderCartaPersonagem();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={TEMA.colors.background} barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
            onPress={() => resetStackNavigation(this.props.navigation)}>
            <Icon name="chevron-left" size={32} color={TEMA.colors.textPrimary} />
          </TouchableOpacity>
          <Text accessibilityRole="header" style={styles.headerTitle}>
            {this.state.carta === CODIGO_CARTA.AJUDA ? 'Resumo de Ações' : 'Leitor'}
          </Text>
        </View>

        {this.renderContent()}
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

  // --- Scan ---
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

  // --- Personagem Detectado ---
  cartaCard: {
    borderRadius: TEMA.borders.radiusCard,
    paddingVertical: TEMA.spacing.xl,
    paddingHorizontal: TEMA.spacing.lg,
    alignItems: 'center',
    marginBottom: TEMA.spacing.lg,
  },
  cartaIcone: {
    marginBottom: TEMA.spacing.sm,
  },
  cartaNome: {
    fontSize: TEMA.fontSize.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // --- Botões Personagem ---
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

  // --- Estilos da Carta de Ajuda ---
  scrollAjudaContent: {
    paddingBottom: TEMA.spacing.xl,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEMA.colors.textPrimary || '#212121',
    marginBottom: TEMA.spacing.sm,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: TEMA.borders?.radiusButton || 10,
    padding: TEMA.spacing.md || 14,
    marginBottom: TEMA.spacing.sm || 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardIcon: {
    marginRight: TEMA.spacing.sm || 8,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: TEMA.colors.textPrimary || '#212121',
  },
  cardTexto: {
    fontSize: 14,
    color: '#333333',
    flexShrink: 1,
  },
  cardObs: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666666',
    flexShrink: 1,
  },
  personagemDetalhe: {
    flexDirection: 'row',
    marginTop: 3,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
  },
  alertaCardBox: {
    marginTop: 12,
    padding: TEMA.spacing.sm || 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#E65100',
  },
  alertaCardTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    fontStyle: 'italic',
  },
});

export default TelaJogar;