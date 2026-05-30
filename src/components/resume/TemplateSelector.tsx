'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui';
import { resumeTemplates } from '@/lib/resume-templates';
import type { ResumeTemplateId } from '@/types';
import {
  Briefcase,
  Shuffle,
  Layers,
  Minimize2,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

const templateIcons: Record<ResumeTemplateId, React.ReactNode> = {
  'classic-chronological': <Briefcase size={20} />,
  'hybrid-combination': <Shuffle size={20} />,
  'functional-skill-focused': <Layers size={20} />,
  'modern-minimalist': <Minimize2 size={20} />,
  'academic-technical': <GraduationCap size={20} />,
};

export function TemplateSelector() {
  const { state, dispatch } = useApp();
  const selected = state.customization.resumeTemplate;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Object.values(resumeTemplates).map((template) => {
        const isSelected = selected === template.id;
        return (
          <Card
            key={template.id}
            hover
            selected={isSelected}
            onClick={() => dispatch({ type: 'SET_RESUME_TEMPLATE', payload: template.id })}
            className="relative"
          >
            {isSelected && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
              </div>
            )}
            <div className="text-[var(--color-primary)] mb-2">
              {templateIcons[template.id]}
            </div>
            <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1">
              {template.name}
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] mb-2 line-clamp-2">
              {template.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <span className="px-1.5 py-0.5 bg-[var(--color-surface)] rounded text-[10px]">
                {template.maxPages} page{template.maxPages > 1 ? 's' : ''}
              </span>
              <span className="px-1.5 py-0.5 bg-[var(--color-surface)] rounded text-[10px]">
                {template.spacing}
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-accent)] mt-2">
              {template.targetAudience}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
