'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Button, Card } from '@/components/ui';
import { Upload, FileText, CheckCircle2, X, Loader2 } from 'lucide-react';
import { parseJobDescriptionText } from '@/lib/job-parser';
import type { UserProfile } from '@/types';

function parseResumeText(text: string): Partial<UserProfile> {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const profile: Partial<UserProfile> = {
    personal: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      portfolio: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
  };

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) profile.personal!.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,}/);
  if (phoneMatch) profile.personal!.phone = phoneMatch[0];

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) profile.personal!.linkedin = linkedinMatch[0];

  // Extract GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) profile.personal!.github = githubMatch[0];

  // Extract website
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.-]+(?:\/[\w.-]*)?/g);
  if (websiteMatch) {
    const nonSocial = websiteMatch.filter(
      (u) => !u.includes('linkedin') && !u.includes('github') && !u.includes('email')
    );
    if (nonSocial.length) profile.personal!.website = nonSocial[0];
  }

  // Name: usually first non-empty line
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 60 && !firstLine.includes('@')) {
      profile.personal!.fullName = firstLine;
    }
  }

  // Title: second line if short
  if (lines.length > 1) {
    const secondLine = lines[1];
    if (secondLine.length < 80 && !secondLine.includes('@')) {
      profile.personal!.title = secondLine;
    }
  }

  // Summary: look for summary/objective section
  const summaryIdx = lines.findIndex((l) =>
    /summary|objective|profile|about/i.test(l) && l.length < 30
  );
  if (summaryIdx !== -1) {
    const summaryLines: string[] = [];
    for (let i = summaryIdx + 1; i < lines.length; i++) {
      if (/^[A-Z\s]{3,}$/.test(lines[i]) || /^(experience|education|skills|projects)/i.test(lines[i])) break;
      summaryLines.push(lines[i]);
    }
    profile.summary = summaryLines.join(' ').slice(0, 500);
  }

  // Skills extraction
  const skillIdx = lines.findIndex((l) => /^skills|technical skills|competencies/i.test(l));
  if (skillIdx !== -1) {
    const skillLines: string[] = [];
    for (let i = skillIdx + 1; i < Math.min(skillIdx + 5, lines.length); i++) {
      if (/^[A-Z\s]{3,}$/.test(lines[i])) break;
      skillLines.push(lines[i]);
    }
    const allSkills = skillLines
      .join(',')
      .split(/[,|•·]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40);
    if (allSkills.length > 0) {
      profile.skills = [{ category: 'Technical Skills', skills: allSkills, proficiency: 'advanced' }];
    }
  }

  // Experience extraction
  const expIdx = lines.findIndex((l) => /^experience|work experience|employment/i.test(l));
  if (expIdx !== -1) {
    const expLines: string[] = [];
    for (let i = expIdx + 1; i < lines.length; i++) {
      if (/^(education|skills|projects|certifications|references)/i.test(lines[i])) break;
      expLines.push(lines[i]);
    }

    // Try to group into experience entries
    const entries: typeof profile.experience = [];
    let current: Record<string, unknown> | null = null;

    for (const line of expLines) {
      const dateMatch = line.match(/(20\d{2}|19\d{2})\s*[-–—]\s*(20\d{2}|19\d{2}|present|current)/i);
      if (dateMatch || /(?:at|@)\s+\w/i.test(line)) {
        if (current) entries.push(current as never);
        current = {
          id: `exp-${entries.length + 1}`,
          company: '',
          title: line.replace(/\d{4}\s*[-–—]\s*(?:present|current|\d{4})/i, '').trim(),
          location: '',
          startDate: dateMatch ? dateMatch[1] : '',
          endDate: dateMatch ? (dateMatch[2].toLowerCase().includes('present') ? null : dateMatch[2]) : null,
          isCurrent: dateMatch ? /present|current/i.test(dateMatch[2]) : false,
          bullets: [],
          keywords: [],
          achievements: [],
        };
      } else if (current && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
        (current.bullets as string[]).push(line.replace(/^[•\-*]\s*/, ''));
      }
    }
    if (current) entries.push(current as never);
    if (entries.length > 0) profile.experience = entries as typeof profile.experience;
  }

  // Education extraction
  const eduIdx = lines.findIndex((l) => /^education|academic/i.test(l));
  if (eduIdx !== -1) {
    const eduLines: string[] = [];
    for (let i = eduIdx + 1; i < Math.min(eduIdx + 6, lines.length); i++) {
      if (/^(experience|skills|projects|certifications)/i.test(lines[i])) break;
      eduLines.push(lines[i]);
    }
    if (eduLines.length > 0) {
      profile.education = [{
        id: 'edu-1',
        institution: eduLines[1] || eduLines[0],
        degree: eduLines[0],
        field: '',
        startDate: '',
        endDate: '',
      }];
    }
  }

  return profile;
}

export function ResumeUpload() {
  const { dispatch } = useApp();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file.name);
    setIsParsing(true);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        // For PDF, we'll read as text (basic extraction)
        const arrayBuffer = await file.arrayBuffer();
        const decoder = new TextDecoder();
        text = decoder.decode(arrayBuffer);
        // Strip binary garbage, keep readable text
        text = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
      } else {
        text = await file.text();
      }

      const extracted = parseResumeText(text);
      if (extracted.personal?.fullName) {
        dispatch({ type: 'SET_PROFILE', payload: { ...extracted, summary: extracted.summary || '' } as never });
      }
      setParsed(true);
    } catch {
      setParsed(false);
    } finally {
      setIsParsing(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setParsed(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Upload Existing Resume</h3>
      <p className="text-xs text-[var(--color-text-muted)] mb-3">
        Upload your current resume (.txt or .pdf) to auto-fill profile details
      </p>

      {!uploadedFile ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-[var(--color-primary)]"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
        >
          <Upload size={24} className="mb-2" style={{ color: 'var(--color-text-muted)' }} />
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Click to upload resume
          </span>
          <span className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            .txt or .pdf
          </span>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
          <FileText size={18} style={{ color: 'var(--color-primary)' }} />
          <div className="flex-1">
            <p className="text-sm font-medium">{uploadedFile}</p>
            {isParsing && <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Parsing resume...</p>}
            {parsed && (
              <div className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                <CheckCircle2 size={12} /> Resume parsed - profile auto-filled
              </div>
            )}
          </div>
          {isParsing ? (
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          ) : (
            <button onClick={handleRemove} className="cursor-pointer hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
