'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui';
import { MinimalOnePage } from './MinimalOnePage';
import { PersistentSidebar } from './PersistentSidebar';
import { DesignForward } from './DesignForward';
import { TerminalCLI } from './TerminalCLI';
import { MultiPageBlog } from './MultiPageBlog';
import { PortfolioCustomizationPanel } from '@/components/customization/PortfolioCustomizationPanel';
import { downloadPortfolio, generatePortfolioHTML } from '@/lib/generate-portfolio-html';
import { Layout, CheckCircle2, Download, FileDown, ExternalLink } from 'lucide-react';
import type { PortfolioTemplateId } from '@/types';

const portfolioTemplates: { id: PortfolioTemplateId; name: string; description: string }[] = [
  { id: 'minimal-one-page', name: 'Minimal One-Page', description: 'Clean, single-scroll design with hero, about, skills, projects, and contact sections.' },
  { id: 'persistent-sidebar', name: 'Persistent Sidebar', description: 'Fixed sidebar navigation with scrollable content area. Great for detailed portfolios.' },
  { id: 'design-forward', name: 'Design Forward', description: 'Bold animations and visual effects. Showcases creativity and frontend mastery.' },
  { id: 'terminal-cli', name: 'Terminal CLI', description: 'Interactive command-line interface style. Perfect for backend/systems engineers.' },
  { id: 'multi-page-blog', name: 'Multi-Page Blog', description: 'Blog-style layout with MDX support. Ideal for engineering blogs + portfolio.' },
];

const templateComponents: Record<PortfolioTemplateId, React.ComponentType> = {
  'minimal-one-page': MinimalOnePage,
  'persistent-sidebar': PersistentSidebar,
  'design-forward': DesignForward,
  'terminal-cli': TerminalCLI,
  'multi-page-blog': MultiPageBlog,
};

export function PortfolioPreview() {
  const { state, dispatch } = useApp();
  const selected = state.customization.portfolioTemplate;
  const profile = state.optimization?.optimizedProfile || state.profile;
  const TemplateComponent = templateComponents[selected];

  const handleDownload = () => {
    downloadPortfolio(
      profile,
      selected,
      state.customization.theme,
      state.customization.font
    );
  };

  const handlePreviewInNewTab = () => {
    const html = generatePortfolioHTML(
      profile,
      selected,
      state.customization.theme,
      state.customization.font
    );
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Template Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {portfolioTemplates.map((t) => {
          const isSelected = selected === t.id;
          return (
            <Card
              key={t.id}
              hover
              selected={isSelected}
              onClick={() => dispatch({ type: 'SET_PORTFOLIO_TEMPLATE', payload: t.id })}
              className="relative"
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                </div>
              )}
              <div className="text-[var(--color-primary)] mb-2">
                <Layout size={20} />
              </div>
              <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">{t.name}</h4>
              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{t.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Portfolio Customization + Download */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <PortfolioCustomizationPanel />

          {/* Download Section */}
          <Card className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <FileDown size={16} style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-sm font-semibold">Download Portfolio</h3>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Download as a standalone HTML file you can host anywhere - GitHub Pages, Netlify, Vercel, or any web server.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 cursor-pointer"
                style={{ background: 'var(--gradient-button)', boxShadow: 'var(--glow)' }}
              >
                <Download size={16} /> Download HTML File
              </button>
              <button
                onClick={handlePreviewInNewTab}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all hover:opacity-80 cursor-pointer"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', background: 'var(--color-surface)' }}
              >
                <ExternalLink size={14} /> Preview in New Tab
              </button>
            </div>
            <div className="mt-3 p-2 rounded text-[10px]" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
              <strong>Tip:</strong> Customize colors and fonts above, then download. The HTML file includes all styles inline - no external dependencies needed.
            </div>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <Card className="!p-0 overflow-hidden">
            <div className="bg-[var(--color-background)] min-h-[600px]">
              {TemplateComponent && <TemplateComponent />}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
