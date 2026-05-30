import type { JobDescription } from '@/types';

// Common tech skills dictionary for keyword extraction
const TECH_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'go', 'golang', 'rust', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'remix', 'astro',
  'node.js', 'express', 'fastapi', 'django', 'flask', 'spring', 'rails',
  'graphql', 'rest', 'rest api', 'grpc', 'websocket',
  'postgresql', 'mysql', 'mongodb', 'redis', 'dynamodb', 'elasticsearch', 'clickhouse', 'sqlite',
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'github actions',
  'git', 'linux', 'bash', 'shell',
  'html', 'css', 'sass', 'tailwind', 'tailwind css', 'styled-components',
  'jest', 'playwright', 'cypress', 'testing library', 'vitest',
  'figma', 'sketch', 'storybook',
  'agile', 'scrum', 'jira',
  'machine learning', 'ai', 'llm', 'openai', 'tensorflow', 'pytorch',
  'microservices', 'monorepo', 'turborepo', 'system design',
  'accessibility', 'wcag', 'performance optimization', 'seo',
  'webpack', 'vite', 'esbuild', 'rollup',
  'kafka', 'rabbitmq', 'celery',
  'stripe', 'twilio', 'sendgrid',
];

const ACTION_VERBS = [
  'built', 'developed', 'designed', 'implemented', 'led', 'managed', 'created', 'launched',
  'optimized', 'improved', 'reduced', 'increased', 'automated', 'migrated', 'scaled',
  'architected', 'established', 'delivered', 'drove', 'spearheaded', 'pioneered',
  'mentored', 'trained', 'collaborated', 'partnered', 'coordinated',
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s/+#.]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractKeywords(text: string): string[] {
  const normalized = normalize(text);
  const found: string[] = [];
  for (const skill of TECH_SKILLS) {
    const pattern = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b${pattern}\\b`, 'i').test(normalized)) {
      found.push(skill);
    }
  }
  return [...new Set(found)];
}

function extractRequirements(text: string): string[] {
  const lines = text.split('\n');
  const reqs: string[] = [];
  const markers = ['require', 'qualif', 'must have', 'minimum', 'should have', 'looking for', 'you have', 'you bring'];
  for (const line of lines) {
    const trimmed = line.replace(/^[\s\-*•]+/, '').trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (markers.some((m) => lower.includes(m)) || /^\d+\+?\s*years?/.test(lower)) {
      reqs.push(trimmed);
    }
  }
  // Also extract bullet points under requirements-like headers
  const sections = text.split(/\n\s*\n/);
  for (const section of sections) {
    const header = section.split('\n')[0]?.toLowerCase() || '';
    if (header.includes('require') || header.includes('qualif') || header.includes('what you')) {
      const bullets = section.split('\n').slice(1).filter((l) => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*'));
      reqs.push(...bullets.map((b) => b.replace(/^[\s\-*•]+/, '').trim()));
    }
  }
  return [...new Set(reqs)];
}

function extractResponsibilities(text: string): string[] {
  const lines = text.split('\n');
  const resps: string[] = [];
  const markers = ['responsib', 'you will', 'you\'ll', 'what you\'ll do', 'role', 'day to day', 'duties'];
  const sections = text.split(/\n\s*\n/);
  for (const section of sections) {
    const header = section.split('\n')[0]?.toLowerCase() || '';
    if (markers.some((m) => header.includes(m))) {
      const bullets = section.split('\n').slice(1).filter((l) => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*'));
      resps.push(...bullets.map((b) => b.replace(/^[\s\-*•]+/, '').trim()));
    }
  }
  // Fallback: extract action-verb bullets
  if (resps.length === 0) {
    for (const line of lines) {
      const trimmed = line.replace(/^[\s\-*•]+/, '').trim().toLowerCase();
      if (ACTION_VERBS.some((v) => trimmed.startsWith(v))) {
        resps.push(line.replace(/^[\s\-*•]+/, '').trim());
      }
    }
  }
  return [...new Set(resps)];
}

function extractTitle(text: string): string {
  const firstLine = text.split('\n').find((l) => l.trim().length > 0)?.trim() || '';
  // Common patterns: "Job Title - Company" or "Job Title at Company"
  const dashMatch = firstLine.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (dashMatch) return dashMatch[1].trim();
  const atMatch = firstLine.match(/^(.+?)\s+at\s+(.+)$/i);
  if (atMatch) return atMatch[1].trim();
  return firstLine.slice(0, 100);
}

function extractCompany(text: string): string {
  const firstLine = text.split('\n').find((l) => l.trim().length > 0)?.trim() || '';
  const dashMatch = firstLine.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (dashMatch) return dashMatch[2].trim();
  const atMatch = firstLine.match(/^(.+?)\s+at\s+(.+)$/i);
  if (atMatch) return atMatch[2].trim();
  // Look for "Company:" pattern
  const companyLine = text.split('\n').find((l) => /company[:\s]/i.test(l));
  if (companyLine) return companyLine.replace(/company[:\s]*/i, '').trim();
  return '';
}

function extractLocation(text: string): string {
  const locLine = text.split('\n').find((l) => /location[:\s]/i.test(l));
  if (locLine) return locLine.replace(/location[:\s]*/i, '').trim();
  // Common patterns
  const remoteMatch = text.match(/(remote|hybrid|on-site|onsite)/i);
  const cityMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2})/);
  if (cityMatch) return cityMatch[1];
  if (remoteMatch) return remoteMatch[1];
  return '';
}

function extractExperienceLevel(text: string): string {
  const patterns = [
    /(\d+\+?\s*years?\s*(?:of\s+)?(?:experience|exp))/i,
    /(senior|sr\.?|lead|principal|staff|junior|jr\.?|mid-level|entry-level)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1];
  }
  return 'Not specified';
}

function categorizeSkills(keywords: string[], text: string): { required: string[]; preferred: string[] } {
  const lower = text.toLowerCase();
  const required: string[] = [];
  const preferred: string[] = [];
  const preferredMarkers = ['nice to have', 'preferred', 'bonus', 'plus', 'ideally', 'advantageous'];
  const requiredMarkers = ['required', 'must have', 'minimum', 'essential', 'mandatory', 'strong'];

  for (const kw of keywords) {
    // Find context around the keyword
    const idx = lower.indexOf(kw);
    if (idx === -1) {
      required.push(kw);
      continue;
    }
    const context = lower.slice(Math.max(0, idx - 100), idx + kw.length + 100);
    if (preferredMarkers.some((m) => context.includes(m))) {
      preferred.push(kw);
    } else {
      required.push(kw);
    }
  }
  return { required, preferred };
}

export function parseJobDescriptionText(text: string): JobDescription {
  const keywords = extractKeywords(text);
  const { required, preferred } = categorizeSkills(keywords, text);

  return {
    title: extractTitle(text),
    company: extractCompany(text),
    location: extractLocation(text),
    description: text.slice(0, 500),
    requirements: extractRequirements(text),
    responsibilities: extractResponsibilities(text),
    keywords,
    requiredSkills: required,
    preferredSkills: preferred,
    experienceLevel: extractExperienceLevel(text),
    industry: '',
  };
}
