'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { themes, fontPresets } from '@/lib/themes';
import { getThemeCSS } from '@/lib/themes';
import { Card, Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { ThemeId } from '@/types';
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  ChevronRight,
  X,
  Sun,
  Moon,
  Monitor,
  Zap,
  Waves,
} from 'lucide-react';

const themeIcons: Record<ThemeId, React.ReactNode> = {
  light: <Sun size={16} />,
  dark: <Moon size={16} />,
  retro: <Monitor size={16} />,
  cyberpunk: <Zap size={16} />,
  aurora: <Waves size={16} />,
};

const fontPresetLabels: Record<string, string> = {
  professional: 'Professional (Inter)',
  modern: 'Modern (Space Grotesk)',
  elegant: 'Elegant (Playfair)',
  technical: 'Technical (JetBrains)',
  creative: 'Creative (Syne)',
};

type PanelTab = 'theme' | 'fonts' | 'layout' | 'animation';

export function CustomizationPanel() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('theme');
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

  const tabs: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'theme', label: 'Theme', icon: <Palette size={14} /> },
    { id: 'fonts', label: 'Fonts', icon: <Type size={14} /> },
    { id: 'layout', label: 'Layout', icon: <Layout size={14} /> },
    { id: 'animation', label: 'Motion', icon: <Sparkles size={14} /> },
  ];

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
        style={{
          background: 'var(--gradient-button)',
          color: 'white',
          boxShadow: 'var(--glow)',
        }}
      >
        <Palette size={20} />
      </button>

      {/* Panel overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="relative w-80 h-full overflow-y-auto border-l shadow-2xl"
            style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <h2 className="text-sm font-semibold">Customization</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 cursor-pointer hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer',
                    activeTab === tab.id
                      ? 'text-white'
                      : 'hover:opacity-80'
                  )}
                  style={{
                    background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : 'var(--color-text-muted)',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-4 space-y-4">
              {activeTab === 'theme' && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    Color Theme
                  </h3>
                  <div className="space-y-2">
                    {Object.values(themes).map((theme) => {
                      const isActive = customization.theme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => applyTheme(theme.id)}
                          className={cn(
                            'flex items-center gap-3 w-full p-3 rounded-lg border transition-all cursor-pointer text-left',
                            isActive && 'ring-2'
                          )}
                          style={{
                            borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                            background: 'var(--color-surface)',
                          }}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ color: theme.colors.primary }}>
                            {themeIcons[theme.id]}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{theme.name}</span>
                            <div className="flex gap-1 mt-1">
                              {Object.values(theme.colors).slice(0, 6).map((color, i) => (
                                <div key={i} className="w-4 h-4 rounded-full border" style={{ background: color, borderColor: 'var(--color-border)' }} />
                              ))}
                            </div>
                          </div>
                          {isActive && <ChevronRight size={14} style={{ color: 'var(--color-primary)' }} />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {activeTab === 'fonts' && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    Font Pairing
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(fontPresets).map(([key, font]) => {
                      const isActive = customization.font.heading === font.heading;
                      return (
                        <button
                          key={key}
                          onClick={() => dispatch({ type: 'SET_FONT', payload: font })}
                          className={cn(
                            'flex items-center gap-3 w-full p-3 rounded-lg border transition-all cursor-pointer text-left',
                            isActive && 'ring-2'
                          )}
                          style={{
                            borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                            background: 'var(--color-surface)',
                          }}
                        >
                          <Type size={16} style={{ color: 'var(--color-primary)' }} />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{fontPresetLabels[key] || key}</span>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                              {font.heading} / {font.body}
                            </p>
                          </div>
                          {isActive && <ChevronRight size={14} style={{ color: 'var(--color-primary)' }} />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                      Font Settings
                    </h3>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Scale: {customization.font.scale}x
                      </label>
                      <input
                        type="range"
                        min="0.8"
                        max="1.3"
                        step="0.05"
                        value={customization.font.scale}
                        onChange={(e) =>
                          dispatch({
                            type: 'SET_FONT',
                            payload: { ...customization.font, scale: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full mt-1 accent-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Line Height: {customization.font.lineHeight}
                      </label>
                      <input
                        type="range"
                        min="1.2"
                        max="2"
                        step="0.1"
                        value={customization.font.lineHeight}
                        onChange={(e) =>
                          dispatch({
                            type: 'SET_FONT',
                            payload: { ...customization.font, lineHeight: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full mt-1 accent-[var(--color-primary)]"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'layout' && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    Layout Settings
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Max Width</label>
                      <select
                        value={customization.layout.maxWidth}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_CUSTOMIZATION',
                            payload: { layout: { ...customization.layout, maxWidth: e.target.value } },
                          })
                        }
                        className="w-full mt-1 px-3 py-2 text-sm rounded-lg border"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        <option value="960px">960px (Narrow)</option>
                        <option value="1200px">1200px (Standard)</option>
                        <option value="1440px">1440px (Wide)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Spacing</label>
                      <div className="flex gap-2 mt-1">
                        {(['compact', 'standard', 'relaxed'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_CUSTOMIZATION',
                                payload: { layout: { ...customization.layout, spacing: s } },
                              })
                            }
                            className={cn('flex-1 py-1.5 text-xs rounded-lg border cursor-pointer capitalize', customization.layout.spacing === s ? 'ring-2' : '')}
                            style={{
                              background: 'var(--color-surface)',
                              borderColor: customization.layout.spacing === s ? 'var(--color-primary)' : 'var(--color-border)',
                              color: 'var(--color-text)',
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'animation' && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                    Animation Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Animations</span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CUSTOMIZATION',
                            payload: {
                              animations: { ...customization.animations, enabled: !customization.animations.enabled },
                            },
                          })
                        }
                        className="w-10 h-6 rounded-full relative transition-colors cursor-pointer"
                        style={{
                          background: customization.animations.enabled ? 'var(--color-primary)' : 'var(--color-border)',
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                          style={{ transform: customization.animations.enabled ? 'translateX(18px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Speed</label>
                      <div className="flex gap-2 mt-1">
                        {(['slow', 'normal', 'fast'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_CUSTOMIZATION',
                                payload: { animations: { ...customization.animations, speed: s } },
                              })
                            }
                            className={cn('flex-1 py-1.5 text-xs rounded-lg border cursor-pointer capitalize', customization.animations.speed === s ? 'ring-2' : '')}
                            style={{
                              background: 'var(--color-surface)',
                              borderColor: customization.animations.speed === s ? 'var(--color-primary)' : 'var(--color-border)',
                              color: 'var(--color-text)',
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reduced Motion</span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_CUSTOMIZATION',
                            payload: {
                              animations: { ...customization.animations, reducedMotion: !customization.animations.reducedMotion },
                            },
                          })
                        }
                        className="w-10 h-6 rounded-full relative transition-colors cursor-pointer"
                        style={{
                          background: customization.animations.reducedMotion ? 'var(--color-primary)' : 'var(--color-border)',
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                          style={{ transform: customization.animations.reducedMotion ? 'translateX(18px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
