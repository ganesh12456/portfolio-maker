// ============================================================
// CAREER PORTFOLIO ENGINE - Core Type Definitions
// ============================================================

// === SECTION 1: User Profile Data Model ===

export interface UserProfile {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  languages: Language[];
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  bullets: string[];
  keywords: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  highlights: string[];
  keywords: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
  expiryDate?: string;
}

export interface Language {
  language: string;
  proficiency: 'native' | 'fluent' | 'professional' | 'conversational' | 'basic';
}

// === SECTION 2: Job Source Data Model ===

export interface JobSource {
  type: 'text' | 'url';
  content: string;
  parsed: JobDescription | null;
}

export interface JobDescription {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string;
  industry: string;
}

export interface KeywordMatch {
  keyword: string;
  frequency: number;
  category: 'required' | 'preferred' | 'nice-to-have';
  matched: boolean;
  injectedInto: string[];
}

export interface OptimizationResult {
  originalProfile: UserProfile;
  optimizedProfile: UserProfile;
  keywordMatches: KeywordMatch[];
  matchScore: number;
  gaps: string[];
  recommendations: string[];
}

// === SECTION 3: ATS Resume Template Schemas ===

export type ResumeTemplateId =
  | 'classic-chronological'
  | 'hybrid-combination'
  | 'functional-skill-focused'
  | 'modern-minimalist'
  | 'academic-technical';

export interface ResumeSection {
  id: string;
  title: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'achievements' | 'custom';
  order: number;
  visible: boolean;
  maxItems?: number;
  format: 'list' | 'paragraph' | 'tags' | 'timeline';
}

export interface ResumeTemplate {
  id: ResumeTemplateId;
  name: string;
  description: string;
  targetAudience: string;
  sections: ResumeSection[];
  maxPages: number;
  spacing: 'compact' | 'standard' | 'relaxed';
  fontSize: {
    name: number;
    sectionTitle: number;
    body: number;
    small: number;
  };
}

// === SECTION 4: Portfolio Template Schemas ===

export type PortfolioTemplateId =
  | 'minimal-one-page'
  | 'persistent-sidebar'
  | 'design-forward'
  | 'terminal-cli'
  | 'multi-page-blog';

export interface PortfolioSection {
  id: string;
  title: string;
  component: string;
  order: number;
  visible: boolean;
  animation: AnimationConfig;
}

export interface AnimationConfig {
  type: 'fade' | 'slide' | 'scale' | 'stagger' | 'none';
  duration: number;
  delay: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export interface PortfolioTemplate {
  id: PortfolioTemplateId;
  name: string;
  description: string;
  layout: 'single-page' | 'sidebar' | 'multi-page';
  sections: PortfolioSection[];
  navigation: NavigationConfig;
}

export interface NavigationConfig {
  type: 'scroll' | 'sidebar' | 'topbar' | 'command-palette';
  position: 'fixed' | 'sticky' | 'static';
  style: 'minimal' | 'pill' | 'underline' | 'dots';
}

// === SECTION 5: Customization Panel State ===

export type ThemeId = 'light' | 'dark' | 'retro' | 'cyberpunk' | 'aurora';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
  };
  effects: {
    borderRadius: string;
    shadow: string;
    glow: string;
    blur: string;
  };
}

export interface FontConfig {
  heading: string;
  body: string;
  mono: string;
  scale: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface LayoutConfig {
  maxWidth: string;
  spacing: 'compact' | 'standard' | 'relaxed';
  gridColumns: number;
  sectionOrder: string[];
  sidebarWidth: string;
  headerHeight: string;
}

export interface CustomizationState {
  theme: ThemeId;
  font: FontConfig;
  layout: LayoutConfig;
  animations: {
    enabled: boolean;
    speed: 'slow' | 'normal' | 'fast';
    reducedMotion: boolean;
  };
  portfolioTemplate: PortfolioTemplateId;
  resumeTemplate: ResumeTemplateId;
}

// === SECTION 6: Application State ===

export interface AppState {
  profile: UserProfile;
  jobSource: JobSource | null;
  optimization: OptimizationResult | null;
  customization: CustomizationState;
  activeView: 'intake' | 'optimize' | 'resume' | 'portfolio';
  isProcessing: boolean;
}
