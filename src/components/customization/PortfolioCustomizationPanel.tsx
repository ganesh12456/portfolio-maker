'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { themes, fontPresets } from '@/lib/themes';
import { getThemeCSS } from '@/lib/themes';
import { Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { ThemeId } from '@/types';
import {
  Palette,
  Type,
  Sun,
  Moon,
  Monitor,
  Zap,
  Waves,
  ChevronRight,
} from 'lucide-react';

const themeIcons: Record<ThemeId, React.ReactNode> = {
  light: <Sun size={14} />,
  dark: <Moon size={14} />,
  retro: <Monitor size={14} />,
  cyberpunk: <Zap size={14} />,
  aurora: <Waves size={14} />,
};

const fontLabels: Record<string, string> = {
  professional: 'Professional',
  modern: 'Modern',
  elegant: 'Elegant',
  technical: 'Technical',
  creative: 'Creative',
};

export function PortfolioCustomizationPanel() {
  const { state, dispatch } = useApp();
  const customization = state.customization;

  const applyTheme = (themeId: ThemeId) => {
    dispatch({ type: 'SET_THEME', payload: themeId });
    const theme = themes[themeId];
    const css = getThemeCSS(theme);
    const root = document.documentElement;
    css.split('\n').forEach((line) => {
      const match = line.match(/--([\w-]+):\s*(.+);/);
      if (match) {
        root.style.setProperty(`--${match[1]}`, match[2].trim());
      }
    });
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Palette size={16} style={{ color: 'var(--color-primary)' }} />
        <h3 className="text-sm font-semibold">Portfolio Customization</h3>
      </div>

      {/* Theme */}
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          <Palette size={12} className="inline mr-1" /> Color Theme
        </label>
        <div className="grid grid-cols-5 gap-2">
          {Object.values(themes).map((theme) => {
            const isActive = customization.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => applyTheme(theme.id)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg border transition-all cursor-pointer',
                  isActive && 'ring-2'
                )}
                style={{
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  background: 'var(--color-surface)',
                }}
              >
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: theme.colors.primary }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: theme.colors.secondary }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: theme.colors.accent }} />
                </div>
                <span className="text-[10px]" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Pairing */}
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          <Type size={12} className="inline mr-1" /> Font Pairing
        </label>
        <div className="space-y-1.5">
          {Object.entries(fontPresets).map(([key, font]) => {
            const isActive = customization.font.heading === font.heading;
            return (
              <button
                key={key}
                onClick={() => dispatch({ type: 'SET_FONT', payload: font })}
                className={cn(
                  'flex items-center gap-2 w-full p-2 rounded-lg border transition-all cursor-pointer text-left',
                  isActive && 'ring-2'
                )}
                style={{
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  background: 'var(--color-surface)',
                }}
              >
                <Type size={14} style={{ color: 'var(--color-primary)' }} />
                <div className="flex-1">
                  <span className="text-xs font-medium">{fontLabels[key] || key}</span>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    {font.heading} / {font.body}
                  </p>
                </div>
                {isActive && <ChevronRight size={12} style={{ color: 'var(--color-primary)' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Scale */}
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Font Size: {customization.font.scale}x
        </label>
        <input
          type="range"
          min="0.8"
          max="1.3"
          step="0.05"
          value={customization.font.scale}
          onChange={(e) =>
            dispatch({ type: 'SET_FONT', payload: { ...customization.font, scale: parseFloat(e.target.value) } })
          }
          className="w-full accent-[var(--color-primary)]"
        />
      </div>

      {/* Line Height */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Line Height: {customization.font.lineHeight}
        </label>
        <input
          type="range"
          min="1.2"
          max="2"
          step="0.1"
          value={customization.font.lineHeight}
          onChange={(e) =>
            dispatch({ type: 'SET_FONT', payload: { ...customization.font, lineHeight: parseFloat(e.target.value) } })
          }
          className="w-full accent-[var(--color-primary)]"
        />
      </div>
    </Card>
  );
}
