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
  ScrollView,
} from 'react-native';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {escutarLeituraNfc, resetStackNavigation} from '../helpers/Auxiliar';
import {TEMA, obterCoresCarta, obterIconeCarta} from '../helpers/Tema';
import {CODIGO_CARTA} from '../helpers/Carta';


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

const PERSONAGENS = [
  {
    codigo: CODIGO_CARTA.DUQUE,
    nome: 'Duque',
    acao: 'Taxas: Receba 3 moedas.',
    bloqueio: 'Bloqueia Ajuda Externa.',
  },
  {
    codigo: CODIGO_CARTA.CAPITAO,
    nome: 'Capitão',
    acao: 'Extorsão: Pegue 2 moedas de outro jogador.',
    bloqueio: 'Bloqueia Extorsão.',
  },
  {
    codigo: CODIGO_CARTA.ASSASSINO,
    nome: 'Assassino',
    acao: 'Assassinar: Pague 3 moedas e elimine uma influência de um jogador.',
    bloqueio: 'Nenhum.',
  },
  {
    codigo: CODIGO_CARTA.CONDESSA,
    nome: 'Condessa',
    acao: 'Nenhuma.',
    bloqueio: 'Bloqueia Assassinato.',
  },
  {
    codigo: CODIGO_CARTA.EMBAIXADOR,
    nome: 'Embaixador',
    acao: 'Trocar: Compre 2 cartas do baralho, escolha com quais ficar e devolva 2.',
    bloqueio: 'Bloqueia Extorsão.',
  },
];

class TelaAjuda extends React.Component {
  _willBlurSubscription;
  _didFocusSubscription;

  constructor(props) {
  super(props);
  
  Tts.getInitStatus()
    .then(() => {
      Tts.stop();
    })
    .catch(err => {
     
      if (err.code === 'no_engine') {
        Tts.requestInstallEngine();
      }
    });

  escutarLeituraNfc(this.props.navigation);
}

  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          resetStackNavigation(this.props.navigation),
        );
        Tts.stop();
      },
    );

    this._didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      () => {
        this.focarPrimeiraAcao();
      },
    );

    this.focusTimeout = setTimeout(() => {
      this.focarPrimeiraAcao();
    }, 500);
  }

  focarPrimeiraAcao = () => {
    if (this.primeiraAcaoRef) {
      const reactTag = findNodeHandle(this.primeiraAcaoRef);
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

  falarAcao = (titulo, efeito, obs) => {
    Tts.stop();
    const texto = `${titulo}. ${efeito} ${obs || ''}`;
    Tts.speak(texto);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={TEMA.colors.background} barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
            onPress={() => resetStackNavigation(this.props.navigation)}>
            <Icon name="chevron-left" size={32} color={TEMA.colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text accessibilityRole="header" style={styles.headerTitle}>
              Resumo de Ações
            </Text>
            <Text style={styles.headerSubtitle}>
              Ações gerais e papéis de cada personagem.
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEÇÃO 1: Ações Gerais */}
          <Text style={styles.secaoTitulo}>Ações Gerais de Turno</Text>
          {ACOES_TURNO.map((acao, index) => {
            const textoAcessibilidade = `${acao.titulo}. ${acao.efeito} ${acao.observacao} ${acao.alertaEspecial ? acao.alertaEspecial : ''}`;
                    return (
              <TouchableOpacity
                key={acao.id}
                ref={ref => {
                  if (index === 0) this.primeiraAcaoRef = ref;
                }}
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

                {/* Alerta especial dentro do card (ex: Golpe de Estado) */}
                {acao.alertaEspecial && (
                  <View style={styles.alertaCardBox}>
                    <Text style={styles.alertaCardTexto}>
                      {acao.alertaEspecial}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* SEÇÃO 2: Ações de Personagem */}
          <Text style={[styles.secaoTitulo, {marginTop: TEMA.spacing.lg}]}>
            Ações e Bloqueios de Personagens
          </Text>

          {PERSONAGENS.map(p => {
          const cores = obterCoresCarta ? obterCoresCarta(p.codigo) : {bg: '#F5F5F5', text: '#212121'};
          const iconeNome = obterIconeCarta ? obterIconeCarta(p.codigo) : 'account';

          return (
            <TouchableOpacity
              key={p.codigo}
              accessibilityRole="button"
              accessibilityLabel={`${p.nome}. Ação: ${p.acao}. Bloqueio: ${p.bloqueio}`}
              style={[styles.card, {borderLeftWidth: 0, borderWidth: 0}]}
              onPress={() => this.falarAcao(p.nome, `Ação: ${p.acao}`, `Contra-ação: ${p.bloqueio}`)}>
              
              <View style={styles.cardHeader}>
                <Icon name={iconeNome} size={24} color={TEMA.colors.primary || '#212121'} style={styles.cardIcon} />
                <Text style={[styles.cardTitulo, {color: TEMA.colors.primary || '#212121'}]}>
                  {p.nome}
                </Text>
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
              </View>
            );
          }
        }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: TEMA.spacing.lg,
    paddingTop: TEMA.spacing.lg,
    backgroundColor: TEMA.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: TEMA.spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  backButton: {
    padding: TEMA.spacing.sm,
    marginRight: TEMA.spacing.xs,
  },
  headerTitle: {
    fontSize: TEMA.fontSize.lg || 22,
    fontWeight: 'bold',
    color: TEMA.colors.textPrimary || '#212121',
  },
  headerSubtitle: {
    fontSize: TEMA.fontSize.sm || 14,
    color: TEMA.colors.textMuted || '#666',
  },
  scrollContent: {
    paddingBottom: TEMA.spacing.lg,
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
    opacity: 1,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: TEMA.colors.textPrimary || '#212121',
    opacity: 1,
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
    marginTop: 16,
    padding: TEMA.spacing.sm || 8,
    backgroundColor: '#f5f4f3',
  },
  alertaCardTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#52504e',
    fontStyle: 'italic',
  },
});

export default TelaAjuda;