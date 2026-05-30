'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { resumeTemplates, renderResumeSection } from '@/lib/resume-templates';
import { Card } from '@/components/ui';
import { FileText, Copy, Download, FileDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';

export function ResumePreview() {
  const { state } = useApp();
  const templateId = state.customization.resumeTemplate;
  const template = resumeTemplates[templateId];
  const profile = state.optimization?.optimizedProfile || state.profile;
  const [copied, setCopied] = useState(false);

  const renderedText = useMemo(() => {
    if (!template) return '';
    const sections = template.sections
      .filter((s) => s.visible)
      .sort((a, b) => a.order - b.order);
    return sections
      .map((section) => renderResumeSection(section, profile as unknown as Record<string, unknown>))
      .filter(Boolean)
      .join('\n\n');
  }, [template, profile]);

  const fileName = profile.personal.fullName.replace(/\s+/g, '_') || 'Resume';

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, name: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    downloadFile(renderedText, `${fileName}_Resume.txt`, 'text/plain');
  };

  const handleDownloadMarkdown = () => {
    const sections = template!.sections
      .filter((s) => s.visible)
      .sort((a, b) => a.order - b.order);

    let md = `# ${profile.personal.fullName}\n`;
    md += `**${profile.personal.title}**\n\n`;
    md += `${profile.personal.email} | ${profile.personal.phone} | ${profile.personal.location}\n`;
    if (profile.personal.linkedin) md += `LinkedIn: ${profile.personal.linkedin} | `;
    if (profile.personal.github) md += `GitHub: ${profile.personal.github}`;
    md += '\n\n---\n\n';

    for (const section of sections) {
      if (section.type === 'header') continue;
      const text = renderResumeSection(section, profile as unknown as Record<string, unknown>);
      if (!text) continue;
      md += `## ${section.title}\n\n`;
      md += text.split('\n').map((line) => {
        if (line.startsWith('•')) return `- ${line.slice(1).trim()}`;
        return line;
      }).join('\n');
      md += '\n\n';
    }

    downloadFile(md, `${fileName}_Resume.md`, 'text/markdown');
  };

  const handleDownloadPdf = () => {
    // Generate a printable HTML page that opens in a new tab for PDF saving
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${profile.personal.fullName} - Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a1a;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 50px;
  }
  h1 { font-size: 22pt; margin-bottom: 4px; color: #0f172a; }
  h2 { font-size: 13pt; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2563eb; padding-bottom: 4px; margin: 20px 0 10px; color: #2563eb; }
  .subtitle { font-size: 12pt; color: #475569; margin-bottom: 4px; }
  .contact { font-size: 9pt; color: #64748b; margin-bottom: 16px; }
  .contact a { color: #2563eb; text-decoration: none; }
  p, li { font-size: 10.5pt; color: #334155; margin-bottom: 4px; }
  ul { padding-left: 18px; }
  .entry { margin-bottom: 12px; }
  .entry-header { font-weight: 600; font-size: 11pt; }
  .entry-sub { font-size: 9.5pt; color: #64748b; }
  .skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag { background: #eff6ff; color: #1d4ed8; padding: 2px 10px; border-radius: 12px; font-size: 9pt; border: 1px solid #bfdbfe; }
  @media print {
    body { padding: 20px 30px; }
    @page { margin: 0.5in; }
  }
</style>
</head>
<body>
<h1>${profile.personal.fullName}</h1>
<p class="subtitle">${profile.personal.title}</p>
<p class="contact">
  ${profile.personal.email} | ${profile.personal.phone} | ${profile.personal.location}
  ${profile.personal.linkedin ? `| <a href="https://${profile.personal.linkedin}">${profile.personal.linkedin}</a>` : ''}
  ${profile.personal.github ? `| <a href="https://${profile.personal.github}">${profile.personal.github}</a>` : ''}
</p>

${template!.sections
  .filter((s) => s.visible && s.type !== 'header')
  .sort((a, b) => a.order - b.order)
  .map((section) => {
    const text = renderResumeSection(section, profile as unknown as Record<string, unknown>);
    if (!text) return '';
    if (section.type === 'summary') {
      return `<h2>${section.title}</h2><p>${text}</p>`;
    }
    if (section.type === 'skills') {
      const skills = text.split(' • ').filter(Boolean);
      return `<h2>${section.title}</h2><div class="skills">${skills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}</div>`;
    }
    const blocks = text.split('\n\n');
    return `<h2>${section.title}</h2>${blocks.map((block) => {
      const lines = block.split('\n');
      const firstLine = lines[0];
      const rest = lines.slice(1);
      if (firstLine.includes(' | ') && rest.length > 0) {
        const parts = firstLine.split(' | ');
        return `<div class="entry"><span class="entry-header">${parts[0]}</span> <span class="entry-sub">${parts.slice(1).join(' | ')}</span><ul>${rest.filter((l) => l.startsWith('•')).map((l) => `<li>${l.slice(1).trim()}</li>`).join('')}</ul></div>`;
      }
      return `<p>${block.replace(/• /g, '').replace(/\n/g, '<br>')}</p>`;
    }).join('')}`;
  })
  .filter(Boolean)
  .join('\n')}

<script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (!template) {
    return (
      <Card className="text-center py-12">
        <FileText size={48} className="mx-auto mb-4 text-[var(--color-text-muted)]" />
        <p className="text-sm text-[var(--color-text-muted)]">Select a resume template</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Template Info Bar + Download Options */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">{template.name}</h3>
            <p className="text-xs text-[var(--color-text-muted)]">{template.targetAudience}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <CheckCircle2 size={14} className="mr-1 text-[var(--color-success)]" /> : <Copy size={14} className="mr-1" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>
        </div>

        {/* Download Buttons Row */}
        <div
          className="flex flex-wrap gap-2 p-3 rounded-lg border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
        >
          <div className="flex items-center gap-2 mr-2">
            <FileDown size={16} style={{ color: 'var(--color-primary)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>DOWNLOAD AS</span>
          </div>
          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all hover:opacity-80 cursor-pointer"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
          >
            <Download size={12} /> .TXT
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all hover:opacity-80 cursor-pointer"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}
          >
            <Download size={12} /> .MD
          </button>
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-white transition-all hover:opacity-90 cursor-pointer"
            style={{ background: 'var(--gradient-button)' }}
          >
            <Download size={12} /> Save as PDF
          </button>
        </div>
      </Card>

      {/* ATS-Safe Preview */}
      <Card className="!p-0 overflow-hidden">
        <div className="bg-white text-gray-900 p-6 sm:p-8 font-mono text-xs leading-relaxed whitespace-pre-wrap min-h-[400px]">
          {renderedText}
        </div>
      </Card>

      {/* Section Order Info */}
      <Card>
        <h4 className="text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Section Order</h4>
        <div className="flex flex-wrap gap-2">
          {template.sections
            .filter((s) => s.visible)
            .sort((a, b) => a.order - b.order)
            .map((section, i) => (
              <span
                key={section.id}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)]"
              >
                <span className="text-[var(--color-primary)] font-bold">{i + 1}</span>
                <span className="text-[var(--color-text)]">{section.title}</span>
              </span>
            ))}
        </div>
      </Card>
    </div>
  );
}
