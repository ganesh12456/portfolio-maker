import type { UserProfile, JobDescription, KeywordMatch, OptimizationResult } from '@/types';

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function extractProfileKeywords(profile: UserProfile): Set<string> {
  const keywords = new Set<string>();
  // Skills
  for (const cat of profile.skills) {
    for (const s of cat.skills) keywords.add(normalize(s));
  }
  // Experience keywords & bullets
  for (const exp of profile.experience) {
    for (const kw of exp.keywords) keywords.add(normalize(kw));
    for (const b of exp.bullets) {
      const words = normalize(b).split(/\s+/);
      for (const w of words) keywords.add(w);
    }
  }
  // Projects
  for (const proj of profile.projects) {
    for (const kw of proj.keywords) keywords.add(normalize(kw));
    for (const t of proj.technologies) keywords.add(normalize(t));
  }
  // Summary
  const summaryWords = normalize(profile.summary).split(/\s+/);
  for (const w of summaryWords) keywords.add(w);
  return keywords;
}

function categorizeKeyword(keyword: string, jd: JobDescription): 'required' | 'preferred' | 'nice-to-have' {
  if (jd.requiredSkills.map(normalize).includes(normalize(keyword))) return 'required';
  if (jd.preferredSkills.map(normalize).includes(normalize(keyword))) return 'preferred';
  return 'nice-to-have';
}

function findKeywordInProfile(keyword: string, profile: UserProfile): string[] {
  const locations: string[] = [];
  const nk = normalize(keyword);

  // Check skills
  for (const cat of profile.skills) {
    if (cat.skills.map(normalize).includes(nk)) {
      locations.push(`skills/${cat.category}`);
    }
  }
  // Check experience
  for (const exp of profile.experience) {
    if (exp.keywords.map(normalize).includes(nk)) locations.push(`experience/${exp.company}`);
    for (const b of exp.bullets) {
      if (normalize(b).includes(nk)) {
        locations.push(`experience/${exp.company}/bullets`);
        break;
      }
    }
  }
  // Check projects
  for (const proj of profile.projects) {
    if (proj.keywords.map(normalize).includes(nk)) locations.push(`projects/${proj.name}`);
    if (proj.technologies.map(normalize).includes(nk)) locations.push(`projects/${proj.name}/tech`);
  }
  // Check summary
  if (normalize(profile.summary).includes(nk)) locations.push('summary');
  return locations;
}

function generateRecommendations(
  gaps: string[],
  profile: UserProfile,
  jd: JobDescription
): string[] {
  const recs: string[] = [];
  const required = jd.requiredSkills.map(normalize);
  const missingRequired = gaps.filter((g) => required.includes(normalize(g)));

  if (missingRequired.length > 0) {
    recs.push(
      `Add these required skills to your profile or experience bullets: ${missingRequired.join(', ')}`
    );
  }

  // Check if summary mentions key requirements
  const summaryLower = normalize(profile.summary);
  const missingFromSummary = jd.requiredSkills.filter((s) => !summaryLower.includes(normalize(s)));
  if (missingFromSummary.length > 0) {
    recs.push(
      `Consider mentioning these in your summary: ${missingFromSummary.slice(0, 5).join(', ')}`
    );
  }

  // Check experience bullets for metrics
  const hasMetrics = profile.experience.some((exp) =>
    exp.bullets.some((b) => /\d+%|\d+x|\$\d+|\d+[KMB]\+?/i.test(b))
  );
  if (!hasMetrics) {
    recs.push('Add quantifiable metrics (%, $, numbers) to your experience bullets for stronger impact.');
  }

  // Check for missing keywords in experience
  for (const kw of jd.keywords.slice(0, 10)) {
    const inExperience = profile.experience.some(
      (exp) =>
        exp.keywords.map(normalize).includes(normalize(kw)) ||
        exp.bullets.some((b) => normalize(b).includes(normalize(kw)))
    );
    if (!inExperience) {
      recs.push(`Consider adding "${kw}" to your most relevant experience bullets.`);
    }
  }

  return recs.slice(0, 10);
}

export function optimizeProfile(profile: UserProfile, jd: JobDescription): OptimizationResult {
  const profileKeywords = extractProfileKeywords(profile);
  const jdKeywords = jd.keywords;

  const matches: KeywordMatch[] = jdKeywords.map((keyword) => {
    const nk = normalize(keyword);
    const matched = profileKeywords.has(nk) || [...profileKeywords].some((pk) => pk.includes(nk) || nk.includes(pk));
    const locations = matched ? findKeywordInProfile(keyword, profile) : [];
    return {
      keyword,
      frequency: locations.length,
      category: categorizeKeyword(keyword, jd),
      matched,
      injectedInto: locations,
    };
  });

  const matchedCount = matches.filter((m) => m.matched).length;
  const matchScore = jdKeywords.length > 0 ? Math.round((matchedCount / jdKeywords.length) * 100) : 0;

  const gaps = matches.filter((m) => !m.matched).map((m) => m.keyword);

  // Generate optimized profile with gaps addressed in summary
  const optimizedProfile = JSON.parse(JSON.stringify(profile)) as UserProfile;
  const missingRequired = gaps.filter((g) =>
    jd.requiredSkills.map(normalize).includes(normalize(g))
  );
  if (missingRequired.length > 0) {
    const addition = missingRequired.slice(0, 5).join(', ');
    optimizedProfile.summary = `${profile.summary}\n\nAdditional expertise: ${addition}.`;
  }

  // Inject missing keywords into experience bullets where appropriate
  for (const match of matches) {
    if (!match.matched && match.category === 'required') {
      const mostRecentExp = optimizedProfile.experience[0];
      if (mostRecentExp) {
        mostRecentExp.keywords.push(match.keyword);
      }
    }
  }

  const recommendations = generateRecommendations(gaps, profile, jd);

  return {
    originalProfile: profile,
    optimizedProfile,
    keywordMatches: matches,
    matchScore,
    gaps,
    recommendations,
  };
}
