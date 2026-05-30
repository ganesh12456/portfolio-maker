import type { UserProfile, JobDescription } from '@/types';

export const sampleProfile: UserProfile = {
  personal: {
    fullName: 'Alexandra Chen',
    title: 'Senior Full-Stack Engineer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    github: 'github.com/alexchen',
    website: 'alexchen.dev',
    portfolio: 'alexchen.dev/portfolio',
  },
  summary:
    'Senior Full-Stack Engineer with 7+ years of experience building scalable web applications using React, Node.js, and cloud-native architectures. Led teams of 5-12 engineers to deliver products serving 2M+ users. Expert in TypeScript, system design, and performance optimization. Passionate about developer experience and building products that make a measurable impact.',
  experience: [
    {
      id: 'exp-1',
      company: 'Stripe',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: null,
      isCurrent: true,
      bullets: [
        'Led architecture redesign of the merchant dashboard, reducing page load time by 40% and increasing merchant engagement by 25%',
        'Built and maintained microservices handling 50K+ RPS using Node.js, Go, and PostgreSQL',
        'Mentored 4 junior engineers through code reviews, pair programming, and technical design sessions',
        'Implemented real-time analytics pipeline using Kafka and ClickHouse, processing 2TB of data daily',
      ],
      keywords: ['React', 'TypeScript', 'Node.js', 'Go', 'PostgreSQL', 'Kafka', 'microservices', 'system design'],
      achievements: [
        'Reduced dashboard load time by 40%',
        'Increased merchant engagement by 25%',
      ],
    },
    {
      id: 'exp-2',
      company: 'Airbnb',
      title: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2019-06',
      endDate: '2022-02',
      isCurrent: false,
      bullets: [
        'Developed the search and discovery feature serving 100M+ monthly active users using React and GraphQL',
        'Optimized database queries reducing API response times by 60%',
        'Built A/B testing framework that increased experiment velocity by 3x',
        'Contributed to the design system used across 200+ engineers',
      ],
      keywords: ['React', 'GraphQL', 'TypeScript', 'Redis', 'A/B testing', 'design system'],
      achievements: [
        'Served 100M+ monthly active users',
        'Reduced API response times by 60%',
      ],
    },
    {
      id: 'exp-3',
      company: 'Google',
      title: 'Software Engineer Intern',
      location: 'Mountain View, CA',
      startDate: '2018-05',
      endDate: '2018-08',
      isCurrent: false,
      bullets: [
        'Built internal tooling for the Cloud Platform team using Angular and Python',
        'Automated deployment pipeline reducing manual steps by 80%',
      ],
      keywords: ['Angular', 'Python', 'GCP', 'CI/CD'],
      achievements: ['Reduced manual deployment steps by 80%'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2017',
      endDate: '2019',
      gpa: '3.9',
      honors: ['Dean\'s List', 'Phi Beta Kappa'],
      relevantCoursework: ['Distributed Systems', 'Machine Learning', 'Database Systems'],
    },
    {
      id: 'edu-2',
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science',
      field: 'Electrical Engineering & Computer Science',
      startDate: '2013',
      endDate: '2017',
      gpa: '3.7',
    },
  ],
  skills: [
    {
      category: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'HTML', 'CSS'],
      proficiency: 'expert',
    },
    {
      category: 'Frontend',
      skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion', 'GraphQL'],
      proficiency: 'expert',
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Express', 'FastAPI', 'gRPC', 'REST APIs', 'WebSocket'],
      proficiency: 'expert',
    },
    {
      category: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'Redis', 'ClickHouse', 'DynamoDB'],
      proficiency: 'advanced',
    },
    {
      category: 'Cloud & DevOps',
      skills: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions'],
      proficiency: 'advanced',
    },
    {
      category: 'Tools & Practices',
      skills: ['Git', 'Agile/Scrum', 'TDD', 'System Design', 'Code Review', 'Technical Writing'],
      proficiency: 'expert',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OpenMetrics Dashboard',
      description: 'Open-source real-time metrics visualization platform with pluggable data sources and custom alerting.',
      technologies: ['React', 'TypeScript', 'D3.js', 'Go', 'PostgreSQL'],
      url: 'https://openmetrics.dev',
      github: 'https://github.com/alexchen/openmetrics',
      highlights: [
        '2.5K GitHub stars, adopted by 50+ companies',
        'Sub-second query latency on 10M+ data points',
        'Plugin architecture supporting 15+ data source integrations',
      ],
      keywords: ['React', 'D3.js', 'Go', 'open-source', 'real-time', 'visualization'],
    },
    {
      id: 'proj-2',
      name: 'DevFlow CLI',
      description: 'AI-powered development workflow automation tool that integrates with GitHub, Jira, and Slack.',
      technologies: ['Node.js', 'TypeScript', 'OpenAI API', 'GitHub API'],
      github: 'https://github.com/alexchen/devflow',
      highlights: [
        '1.2K GitHub stars, 5K+ weekly downloads',
        'Automates PR creation, code review summaries, and sprint reports',
        'Used by engineering teams at 3 YC startups',
      ],
      keywords: ['Node.js', 'CLI', 'AI', 'automation', 'developer tools', 'open-source'],
    },
  ],
  certifications: [
    {
      name: 'AWS Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      url: 'https://aws.amazon.com/certification',
    },
    {
      name: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      date: '2022-01',
    },
  ],
  achievements: [
    'Speaker at React Conf 2024: "Building Design Systems at Scale"',
    'Published article in IEEE Software: "Micro-Frontend Architecture Patterns"',
    'Hackathon Grand Prize Winner - TechCrunch Disrupt 2023',
    'Open-source contributor with 5K+ GitHub stars across projects',
  ],
  languages: [
    { language: 'English', proficiency: 'native' },
    { language: 'Mandarin', proficiency: 'fluent' },
    { language: 'Spanish', proficiency: 'conversational' },
  ],
};

export const sampleJobDescription: JobDescription = {
  title: 'Senior Frontend Engineer',
  company: 'Notion',
  location: 'San Francisco, CA (Hybrid)',
  description:
    'We are looking for a Senior Frontend Engineer to help build the next generation of productivity tools. You will work on complex UI challenges, performance optimization, and building delightful user experiences that millions of people rely on every day.',
  requirements: [
    '5+ years of professional software engineering experience',
    'Deep expertise in React, TypeScript, and modern frontend architecture',
    'Experience with performance optimization and web vitals',
    'Strong understanding of accessibility standards (WCAG)',
    'Experience building and maintaining design systems',
    'Track record of mentoring junior engineers',
  ],
  responsibilities: [
    'Architect and build complex, interactive UI components',
    'Drive performance optimization initiatives across the product',
    'Contribute to and maintain the design system',
    'Mentor junior engineers and conduct thorough code reviews',
    'Collaborate with design and product teams to ship features',
    'Participate in technical planning and architecture decisions',
  ],
  keywords: [
    'React', 'TypeScript', 'JavaScript', 'performance optimization', 'design systems',
    'accessibility', 'WCAG', 'frontend architecture', 'web vitals', 'component library',
    'CSS', 'HTML', 'testing', 'Jest', 'Playwright', 'Storybook', 'Figma',
    'mentoring', 'code review', 'agile', 'cross-functional collaboration',
  ],
  requiredSkills: [
    'React', 'TypeScript', 'JavaScript', 'CSS', 'HTML',
    'performance optimization', 'design systems', 'accessibility',
    'testing', 'code review', 'mentoring',
  ],
  preferredSkills: [
    'Next.js', 'Framer Motion', 'Storybook', 'Playwright', 'Figma',
    'Web Workers', 'Service Workers', 'WebSocket', 'GraphQL',
    'Turborepo', 'monorepo', 'CI/CD',
  ],
  experienceLevel: 'Senior (5+ years)',
  industry: 'SaaS / Productivity',
};
