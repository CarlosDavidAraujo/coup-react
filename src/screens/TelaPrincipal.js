import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View, StatusBar} from 'react-native';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {escutarLeituraNfc} from '../helpers/Auxiliar';
import {TEMA} from '../helpers/Tema';

class TelaPrincipal extends React.Component {
  constructor(props) {
    super(props);
    Tts.stop();
    escutarLeituraNfc(this.props.navigation);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={TEMA.colors.background} barStyle="dark-content" />

        {/* Card central com logo — agrupado para TalkBack ler como um único elemento */}
        <View
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Coup Acessível"
          style={styles.logoCard}>
          <Icon
            name="cards-playing-outline"
            size={64}
            color={TEMA.colors.textPrimary}
            style={styles.logoIcon}
          />
          <Text style={styles.logoTitle}>Coup</Text>
          <Text style={styles.logoSubtitle}>Acessível</Text>
        </View>

        {/* Botão Jogar */}
        <TouchableOpacity
          autoFocus={true}
          accessibilityRole="button"
          accessibilityLabel="Jogar"
          style={styles.btnStyle}
          onPress={() => this.props.navigation.navigate('Jogar')}>
          <Icon
            name="play-circle-outline"
            size={28}
            color={TEMA.colors.textPrimary}
            style={styles.btnIcon}
          />
          <Text style={styles.textButton}>Jogar</Text>
        </TouchableOpacity>

        {/* Botão Ajuda */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Ajuda"
          style={styles.btnStyle}
          onPress={() => this.props.navigation.navigate('Ajuda')}>
          <Icon
            name="help-circle-outline"
            size={28}
            color={TEMA.colors.textPrimary}
            style={styles.btnIcon}
          />
          <Text style={styles.textButton}>Ajuda</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: TEMA.spacing.lg,
    backgroundColor: TEMA.colors.background,
    justifyContent: 'center',
  },
  logoCard: {
    backgroundColor: TEMA.colors.surface,
    borderRadius: TEMA.borders.radiusCard,
    paddingVertical: TEMA.spacing.xl,
    paddingHorizontal: TEMA.spacing.lg,
    alignItems: 'center',
    marginBottom: TEMA.spacing.lg,
  },
  logoIcon: {
    marginBottom: TEMA.spacing.sm,
  },
  logoTitle: {
    fontSize: TEMA.fontSize.xxl,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: TEMA.colors.textPrimary,
  },
  logoSubtitle: {
    fontSize: TEMA.fontSize.md,
    color: TEMA.colors.textSecondary,
    marginTop: TEMA.spacing.xs,
  },
  btnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEMA.colors.surface,
    borderRadius: TEMA.borders.radiusButton,
    borderWidth: TEMA.borders.width,
    borderColor: TEMA.colors.surfaceBorder,
    paddingVertical: TEMA.spacing.lg,
    marginBottom: TEMA.spacing.md,
  },
  btnIcon: {
    marginRight: TEMA.spacing.sm,
  },
  textButton: {
    fontSize: TEMA.fontSize.xl,
    fontWeight: 'bold',
    color: TEMA.colors.textPrimary,
  },
  footerNote: {
    fontSize: TEMA.fontSize.sm,
    color: TEMA.colors.textMuted,
    textAlign: 'center',
    marginTop: TEMA.spacing.md,
  },
});

export default TelaPrincipal;
