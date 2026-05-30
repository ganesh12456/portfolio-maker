import { ThemeConfig, ThemeId, FontConfig } from '@/types';

export const themes: Record<ThemeId, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#06b6d4',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      button: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    effects: {
      borderRadius: '12px',
      shadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
      glow: '0 0 20px rgba(102,126,234,0.3)',
      blur: 'blur(8px)',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      card: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      button: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    },
    effects: {
      borderRadius: '12px',
      shadow: '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.2)',
      glow: '0 0 20px rgba(59,130,246,0.4)',
      blur: 'blur(8px)',
    },
  },
  retro: {
    id: 'retro',
    name: 'Retro',
    colors: {
      background: '#fdf6e3',
      surface: '#eee8d5',
      primary: '#cb4b16',
      secondary: '#6c71c4',
      accent: '#2aa198',
      text: '#586e75',
      textMuted: '#93a1a1',
      border: '#d33682',
      success: '#859900',
      warning: '#b58900',
      error: '#dc322f',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #fdf6e3 0%, #eee8d5 100%)',
      card: 'linear-gradient(135deg, #fdf6e3 0%, #eee8d5 100%)',
      button: 'linear-gradient(135deg, #cb4b16 0%, #d33682 100%)',
    },
    effects: {
      borderRadius: '4px',
      shadow: '4px 4px 0px rgba(0,0,0,0.2)',
      glow: '0 0 10px rgba(203,75,22,0.3)',
      blur: 'none',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      background: '#0a0a0a',
      surface: '#1a1a1a',
      primary: '#f0f',
      secondary: '#0ff',
      accent: '#ff0',
      text: '#e0e0e0',
      textMuted: '#888',
      border: '#333',
      success: '#0f0',
      warning: '#ff0',
      error: '#f00',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a1a2e 100%)',
      card: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
      button: 'linear-gradient(135deg, #f0f 0%, #0ff 100%)',
    },
    effects: {
      borderRadius: '0px',
      shadow: '0 0 10px rgba(255,0,255,0.3), 0 0 20px rgba(0,255,255,0.2)',
      glow: '0 0 20px rgba(255,0,255,0.5)',
      blur: 'blur(4px)',
    },
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    colors: {
      background: '#0c1222',
      surface: '#1a2332',
      primary: '#4ade80',
      secondary: '#22d3ee',
      accent: '#a78bfa',
      text: '#e2e8f0',
      textMuted: '#94a3b8',
      border: '#2d3a4a',
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0c1222 0%, #1a2332 30%, #0d2137 60%, #162a3a 100%)',
      card: 'linear-gradient(135deg, #1a2332 0%, #0c1222 100%)',
      button: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #a78bfa 100%)',
    },
    effects: {
      borderRadius: '16px',
      shadow: '0 4px 30px rgba(74,222,128,0.1)',
      glow: '0 0 30px rgba(74,222,128,0.2)',
      blur: 'blur(12px)',
    },
  },
};

export const fontPresets: Record<string, FontConfig> = {
  professional: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono',
    scale: 1,
    lineHeight: 1.6,
    letterSpacing: 0,
  },
  modern: {
    heading: 'Space Grotesk',
    body: 'DM Sans',
    mono: 'Fira Code',
    scale: 1,
    lineHeight: 1.5,
    letterSpacing: -0.02,
  },
  elegant: {
    heading: 'Playfair Display',
    body: 'Source Sans Pro',
    mono: 'IBM Plex Mono',
    scale: 1.05,
    lineHeight: 1.7,
    letterSpacing: 0.01,
  },
  technical: {
    heading: 'JetBrains Mono',
    body: 'JetBrains Mono',
    mono: 'JetBrains Mono',
    scale: 0.95,
    lineHeight: 1.5,
    letterSpacing: 0,
  },
  creative: {
    heading: 'Syne',
    body: 'General Sans',
    mono: 'Space Mono',
    scale: 1,
    lineHeight: 1.6,
    letterSpacing: 0.02,
  },
};

export function getThemeCSS(theme: ThemeConfig): string {
  return `
    --color-bg: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-accent: ${theme.colors.accent};
    --color-text: ${theme.colors.text};
    --color-text-muted: ${theme.colors.textMuted};
    --color-border: ${theme.colors.border};
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-error: ${theme.colors.error};
    --gradient-hero: ${theme.gradients.hero};
    --gradient-card: ${theme.gradients.card};
    --gradient-button: ${theme.gradients.button};
    --radius: ${theme.effects.borderRadius};
    --shadow: ${theme.effects.shadow};
    --glow: ${theme.effects.glow};
  `;
}
