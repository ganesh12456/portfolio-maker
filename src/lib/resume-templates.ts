import { ResumeTemplate, ResumeTemplateId, ResumeSection } from '@/types';

// ============================================================
// ATS RESUME TEMPLATE DEFINITIONS
// Pure text-based layouts - NO tables, columns, or graphics
// Optimized for Applicant Tracking System parser compatibility
// ============================================================

function createSection(
  id: string,
  title: string,
  type: ResumeSection['type'],
  order: number,
  format: ResumeSection['format'],
  options?: Partial<ResumeSection>
): ResumeSection {
  return { id, title, type, order, visible: true, format, ...options };
}

export const resumeTemplates: Record<ResumeTemplateId, ResumeTemplate> = {
  // ----------------------------------------------------------
  // TEMPLATE 1: Classic Chronological
  // Optimized for: Senior roles, management, leadership
  // Strategy: Reverse-chronological experience with achievement metrics
  // ----------------------------------------------------------
  'classic-chronological': {
    id: 'classic-chronological',
    name: 'Classic Chronological',
    description: 'Traditional reverse-chronological format emphasizing career progression and leadership impact. Best for candidates with steady career growth in senior/management roles.',
    targetAudience: 'Senior professionals, managers, directors, VPs',
    maxPages: 2,
    spacing: 'standard',
    fontSize: { name: 18, sectionTitle: 14, body: 11, small: 10 },
    sections: [
      createSection('header', 'HEADER', 'header', 0, 'paragraph'),
      createSection('summary', 'PROFESSIONAL SUMMARY', 'summary', 1, 'paragraph'),
      createSection('experience', 'PROFESSIONAL EXPERIENCE', 'experience', 2, 'timeline'),
      createSection('education', 'EDUCATION', 'education', 3, 'list'),
      createSection('skills', 'CORE COMPETENCIES', 'skills', 4, 'tags'),
      createSection('certifications', 'CERTIFICATIONS & LICENSES', 'certifications', 5, 'list'),
      createSection('achievements', 'KEY ACHIEVEMENTS', 'achievements', 6, 'list'),
    ],
  },

  // ----------------------------------------------------------
  // TEMPLATE 2: Hybrid / Combination
  // Optimized for: Career changers, diverse backgrounds
  // Strategy: Skills-first then chronological, bridging transferable skills
  // ----------------------------------------------------------
  'hybrid-combination': {
    id: 'hybrid-combination',
    name: 'Hybrid Combination',
    description: 'Combines functional skills grouping with chronological experience. Ideal for career changers who need to highlight transferable skills while showing work history.',
    targetAudience: 'Career changers, military transition, diverse backgrounds',
    maxPages: 2,
    spacing: 'standard',
    fontSize: { name: 18, sectionTitle: 14, body: 11, small: 10 },
    sections: [
      createSection('header', 'HEADER', 'header', 0, 'paragraph'),
      createSection('summary', 'PROFESSIONAL SUMMARY', 'summary', 1, 'paragraph'),
      createSection('skills', 'TRANSFERABLE SKILLS & COMPETENCIES', 'skills', 2, 'list'),
      createSection('experience', 'PROFESSIONAL EXPERIENCE', 'experience', 3, 'timeline'),
      createSection('projects', 'RELEVANT PROJECTS & ACHIEVEMENTS', 'projects', 4, 'list'),
      createSection('education', 'EDUCATION & TRAINING', 'education', 5, 'list'),
      createSection('certifications', 'CERTIFICATIONS', 'certifications', 6, 'list'),
    ],
  },

  // ----------------------------------------------------------
  // TEMPLATE 3: Functional / Skill-Focused
  // Optimized for: Freelancers, gig workers, contractors
  // Strategy: Skills and deliverables grouped by capability, not timeline
  // ----------------------------------------------------------
  'functional-skill-focused': {
    id: 'functional-skill-focused',
    name: 'Functional Skill-Focused',
    description: 'Organizes content by skill domains rather than chronology. Perfect for freelancers and gig workers who need to showcase diverse capabilities across multiple clients.',
    targetAudience: 'Freelancers, contractors, gig workers, consultants',
    maxPages: 2,
    spacing: 'compact',
    fontSize: { name: 18, sectionTitle: 14, body: 11, small: 10 },
    sections: [
      createSection('header', 'HEADER', 'header', 0, 'paragraph'),
      createSection('summary', 'PROFESSIONAL PROFILE', 'summary', 1, 'paragraph'),
      createSection('skills', 'CORE COMPETENCIES', 'skills', 2, 'tags', { maxItems: 20 }),
      createSection('projects', 'FEATURED PROJECTS & DELIVERABLES', 'projects', 3, 'list', { maxItems: 6 }),
      createSection('experience', 'CLIENT & CONTRACT HISTORY', 'experience', 4, 'timeline'),
      createSection('education', 'EDUCATION & CREDENTIALS', 'education', 5, 'list'),
      createSection('achievements', 'NOTABLE ACHIEVEMENTS', 'achievements', 6, 'list'),
    ],
  },

  // ----------------------------------------------------------
  // TEMPLATE 4: Modern Minimalist Single-Page
  // Optimized for: Mid-level engineers, IC roles
  // Strategy: Dense, scannable, one-page with keyword optimization
  // ----------------------------------------------------------
  'modern-minimalist': {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean single-page format with maximum information density. Uses concise bullets and strategic keyword placement for mid-level individual contributor roles.',
    targetAudience: 'Mid-level engineers, developers, analysts, IC roles',
    maxPages: 1,
    spacing: 'compact',
    fontSize: { name: 16, sectionTitle: 12, body: 10, small: 9 },
    sections: [
      createSection('header', 'HEADER', 'header', 0, 'paragraph'),
      createSection('summary', 'SUMMARY', 'summary', 1, 'paragraph'),
      createSection('skills', 'TECHNICAL SKILLS', 'skills', 2, 'tags', { maxItems: 15 }),
      createSection('experience', 'EXPERIENCE', 'experience', 3, 'timeline', { maxItems: 3 }),
      createSection('projects', 'KEY PROJECTS', 'projects', 4, 'list', { maxItems: 3 }),
      createSection('education', 'EDUCATION', 'education', 5, 'list'),
    ],
  },

  // ----------------------------------------------------------
  // TEMPLATE 5: Academic / Technical CV
  // Optimized for: Research, PhD, deep tech, scientific roles
  // Strategy: Comprehensive with publications, research, and technical depth
  // ----------------------------------------------------------
  'academic-technical': {
    id: 'academic-technical',
    name: 'Academic Technical CV',
    description: 'Comprehensive CV format for research and deep tech positions. Includes sections for publications, research contributions, grants, and technical depth.',
    targetAudience: 'Researchers, PhDs, scientists, professors, deep tech',
    maxPages: 4,
    spacing: 'relaxed',
    fontSize: { name: 18, sectionTitle: 14, body: 11, small: 10 },
    sections: [
      createSection('header', 'HEADER', 'header', 0, 'paragraph'),
      createSection('summary', 'RESEARCH INTERESTS & OBJECTIVES', 'summary', 1, 'paragraph'),
      createSection('education', 'EDUCATION', 'education', 2, 'list'),
      createSection('experience', 'RESEARCH & PROFESSIONAL EXPERIENCE', 'experience', 3, 'timeline'),
      createSection('projects', 'RESEARCH PROJECTS & CONTRIBUTIONS', 'projects', 4, 'list'),
      createSection('skills', 'TECHNICAL SKILLS & METHODOLOGIES', 'skills', 5, 'list'),
      createSection('achievements', 'PUBLICATIONS & PRESENTATIONS', 'achievements', 6, 'list'),
      createSection('certifications', 'GRANTS, AWARDS & HONORS', 'certifications', 7, 'list'),
    ],
  },
};

// ============================================================
// RESUME RENDERING FUNCTIONS
// Pure text output - no HTML, no graphics, ATS-safe
// ============================================================

export function renderResumeSection(
  section: ResumeSection,
  profile: Record<string, unknown>
): string {
  switch (section.type) {
    case 'header':
      return renderHeader(profile);
    case 'summary':
      return renderSummary(profile);
    case 'experience':
      return renderExperience(profile, section.maxItems);
    case 'education':
      return renderEducation(profile);
    case 'skills':
      return renderSkills(profile, section.maxItems);
    case 'projects':
      return renderProjects(profile, section.maxItems);
    case 'certifications':
      return renderCertifications(profile);
    case 'achievements':
      return renderAchievements(profile);
    default:
      return '';
  }
}

function renderHeader(profile: Record<string, unknown>): string {
  const p = profile.personal as Record<string, string>;
  const lines = [
    p.fullName.toUpperCase(),
    p.title,
    '',
    `${p.email} | ${p.phone} | ${p.location}`,
    [p.linkedin, p.github, p.website].filter(Boolean).join(' | '),
  ];
  return lines.join('\n');
}

function renderSummary(profile: Record<string, unknown>): string {
  return (profile.summary as string) || '';
}

function renderExperience(profile: Record<string, unknown>, maxItems?: number): string {
  const exp = profile.experience as Record<string, unknown>[];
  if (!exp?.length) return '';
  const items = maxItems ? exp.slice(0, maxItems) : exp;
  return items
    .map((job) => {
      const end = job.isCurrent ? 'Present' : job.endDate;
      const header = `${job.title} | ${job.company} | ${job.location}`;
      const dates = `${job.startDate} - ${end}`;
      const bullets = (job.bullets as string[]).map((b) => `• ${b}`).join('\n');
      return `${header}\n${dates}\n${bullets}`;
    })
    .join('\n\n');
}

function renderEducation(profile: Record<string, unknown>, maxItems?: number): string {
  const edu = profile.education as Record<string, unknown>[];
  if (!edu?.length) return '';
  const items = maxItems ? edu.slice(0, maxItems) : edu;
  return items
    .map((e) => {
      const line1 = `${e.degree} in ${e.field}`;
      const line2 = `${e.institution} | ${e.startDate} - ${e.endDate}`;
      const extras = [e.gpa && `GPA: ${e.gpa}`, e.honors && (e.honors as string[]).join(', ')]
        .filter(Boolean)
        .join(' | ');
      return extras ? `${line1}\n${line2}\n${extras}` : `${line1}\n${line2}`;
    })
    .join('\n\n');
}

function renderSkills(profile: Record<string, unknown>, maxItems?: number): string {
  const cats = profile.skills as Record<string, unknown>[];
  if (!cats?.length) return '';
  const allSkills = cats.flatMap((c) => c.skills as string[]);
  const skills = maxItems ? allSkills.slice(0, maxItems) : allSkills;
  return skills.join(' • ');
}

function renderProjects(profile: Record<string, unknown>, maxItems?: number): string {
  const proj = profile.projects as Record<string, unknown>[];
  if (!proj?.length) return '';
  const items = maxItems ? proj.slice(0, maxItems) : proj;
  return items
    .map((p) => {
      const tech = (p.technologies as string[]).join(', ');
      const highlights = (p.highlights as string[]).map((h) => `• ${h}`).join('\n');
      return `${p.name} [${tech}]\n${p.description}\n${highlights}`;
    })
    .join('\n\n');
}

function renderCertifications(profile: Record<string, unknown>): string {
  const certs = profile.certifications as Record<string, string>[];
  if (!certs?.length) return '';
  return certs.map((c) => `${c.name} - ${c.issuer} (${c.date})`).join('\n');
}

function renderAchievements(profile: Record<string, unknown>): string {
  const ach = profile.achievements as string[];
  if (!ach?.length) return '';
  return ach.map((a) => `• ${a}`).join('\n');
}
