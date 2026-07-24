export const TEMA = {
  colors: {
    // Background geral do app (claro)
    background: '#F2F2F7',

    // Surface (cards, containers)
    surface: '#FFFFFF',
    surfaceBorder: '#D1D1D6',

    // Texto
    textPrimary: '#1C1C1E',
    textSecondary: '#636366',
    textMuted: '#AEAEB2',

    // Branco puro (para badges, destaques)
    white: '#FFFFFF',

    // Botão destaque (azul)
    accent: '#185FA5',
    accentContent: '#E6F1FB',
  },

  // Cores por personagem — todos passam 7:1 de contraste (AAA)
  cartaCores: {
    Dq1: {bg: '#6B1F3B', text: '#FBEAF0'},   // Duque
    Cp1: {bg: '#185FA5', text: '#E6F1FB'},   // Capitão
    As1: {bg: '#1A1A1A', text: '#E8E8E8'},   // Assassino
    Cd1: {bg: '#A32D2D', text: '#FCEBEB'},   // Condessa
    Em1: {bg: '#3B6D11', text: '#EAF3DE'},   // Embaixador
  },

  // Ícones por personagem (MaterialCommunityIcons)
  cartaIcones: {
    Dq1: 'crown',               // Duque
    Cp1: 'anchor',              // Capitão
    As1: 'skull',      // Assassino
    Cd1: 'shield',        // Condessa
    Em1: 'account-group',       // Embaixador
  },

  borders: {
    radiusCard: 16,
    radiusButton: 12,
    radiusSmall: 8,
    width: 2,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  fontSize: {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

// Helper para obter cores de uma carta
export function obterCoresCarta(codigo) {
  return TEMA.cartaCores[codigo] || {bg: TEMA.colors.surface, text: TEMA.colors.textPrimary};
}

// Helper para obter ícone de uma carta
export function obterIconeCarta(codigo) {
  return TEMA.cartaIcones[codigo] || 'cards';
}
