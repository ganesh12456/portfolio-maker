'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs } from '@/components/ui';
import { ProfileForm } from '@/components/intake/ProfileForm';
import { JobSourceInput } from '@/components/intake/JobSourceInput';
import { ResumeUpload } from '@/components/intake/ResumeUpload';
import { OptimizationPanel } from '@/components/optimize/OptimizationPanel';
import { TemplateSelector } from '@/components/resume/TemplateSelector';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';
import { CustomizationPanel } from '@/components/customization/CustomizationPanel';
import { getThemeCSS } from '@/lib/themes';
import { themes } from '@/lib/themes';
import { optimizeProfile } from '@/lib/optimizer';
import {
  User,
  Target,
  FileText,
  Globe,
  Rocket,
  ArrowRight,
  Sparkles,
  Zap,
  RefreshCw,
} from 'lucide-react';

const viewTabs = [
  { id: 'intake', label: 'Intake', icon: <User size={14} /> },
  { id: 'optimize', label: 'Optimize', icon: <Target size={14} /> },
  { id: 'resume', label: 'Resume', icon: <FileText size={14} /> },
  { id: 'portfolio', label: 'Portfolio', icon: <Globe size={14} /> },
];

function ThemeInitializer() {
  const { state } = useApp();
  React.useEffect(() => {
    const theme = themes[state.customization.theme];
    const css = getThemeCSS(theme);
    const root = document.documentElement;
    css.split('\n').forEach((line) => {
      const match = line.match(/--([\w-]+):\s*(.+);/);
      if (match) {
        root.style.setProperty(`--${match[1]}`, match[2].trim());
      }
    });
  }, [state.customization.theme]);
  return null;
}

export default function Home() {
  const { state, dispatch } = useApp();
  const activeView = state.activeView;
  const profile = state.profile;
  const jd = state.jobSource?.parsed;

  // Check if profile has minimum data for resume generation
  const hasProfileData =
    profile.personal.fullName.trim().length > 0 &&
    profile.summary.trim().length > 0 &&
    (profile.experience.length > 0 || profile.skills.length > 0);

  const handleInstantResume = () => {
    dispatch({ type: 'SET_VIEW', payload: 'resume' });
  };

  const handleATSResumeFromJD = () => {
    if (!jd) return;
    // Auto-optimize profile against JD
    const result = optimizeProfile(profile, jd);
    dispatch({ type: 'SET_OPTIMIZATION', payload: result });
    dispatch({ type: 'APPLY_OPTIMIZATION' });
    dispatch({ type: 'SET_VIEW', payload: 'resume' });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <ThemeInitializer />

      {/* Header */}
      <header className="border-b sticky top-0 z-40 backdrop-blur-md" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', opacity: 0.95 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-button)' }}>
              <Rocket size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">Portfolio Engine</h1>
              <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Career Portfolio Generator</p>
            </div>
          </div>
          <Tabs
            tabs={viewTabs}
            active={activeView}
            onChange={(id) => dispatch({ type: 'SET_VIEW', payload: id as typeof activeView })}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {activeView === 'intake' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Your Profile</h2>
                <ProfileForm />
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Target Job</h2>
                <JobSourceInput />
                <ResumeUpload />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Instant Resume from Profile */}
              {hasProfileData && (
                <div
                  className="flex items-center justify-between p-5 rounded-xl border"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--gradient-button)' }}
                    >
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Profile Ready</h3>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Generate an instant resume from your profile details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleInstantResume}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 cursor-pointer"
                    style={{ background: 'var(--gradient-button)', boxShadow: 'var(--glow)' }}
                  >
                    <Zap size={16} /> Instant Resume <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* ATS Resume from JD */}
              {jd && (
                <div
                  className="flex items-center justify-between p-5 rounded-xl border"
                  style={{
                    borderColor: hasProfileData ? 'var(--color-accent)' : 'var(--color-border)',
                    background: 'var(--color-surface)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}
                    >
                      <Target size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">
                        ATS Resume for {jd.title || 'Target Role'}
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {jd.company && `${jd.company} | `}
                        Auto-optimize your profile with {jd.keywords.length} job keywords
                        {jd.requiredSkills.length > 0 && ` (${jd.requiredSkills.length} required skills)`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleATSResumeFromJD}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
                  >
                    <Zap size={16} /> Create ATS Resume <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* No data hint */}
              {!hasProfileData && !jd && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl border text-center justify-center"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                >
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Fill in your profile details or upload a resume above to generate an instant resume.
                    Optionally add a job description for ATS-optimized output.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'optimize' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-bold mb-4">ATS Optimization</h2>
            <OptimizationPanel />
          </div>
        )}

        {activeView === 'resume' && (
          <div className="space-y-6">
            {/* Resume action bar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Your Resume</h2>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {state.optimization ? 'ATS-optimized for target role' : 'Generated from your profile'}
                </p>
              </div>
              <div className="flex gap-2">
                {jd && (
                  <button
                    onClick={handleATSResumeFromJD}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all hover:opacity-80 cursor-pointer"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', background: 'var(--color-surface)' }}
                  >
                    <RefreshCw size={14} /> Re-optimize for JD
                  </button>
                )}
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'intake' })}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80 cursor-pointer"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <ArrowRight size={14} className="rotate-180" /> Back to Intake
                </button>
              </div>
            </div>

            {/* Change Template */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <RefreshCw size={14} style={{ color: 'var(--color-primary)' }} />
                Change Resume Template
              </h3>
              <TemplateSelector />
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Preview</h3>
              <ResumePreview />
            </div>

            {/* Create Portfolio from Resume */}
            <div
              className="flex items-center justify-between p-5 rounded-xl border"
              style={{ borderColor: 'var(--color-accent)', background: 'var(--color-surface)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' }}
                >
                  <Globe size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Create Portfolio Website</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Generate an interactive web portfolio from this resume - download as HTML and host anywhere
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'portfolio' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}
              >
                <Globe size={16} /> Build Portfolio <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {activeView === 'portfolio' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold mb-4">Portfolio Templates</h2>
            <PortfolioPreview />
          </div>
        )}
      </main>

      {/* Customization Panel */}
      <CustomizationPanel />
    </div>
  );
}
