# Portfolio Engine

An automated career portfolio engine that optimizes your resume for ATS systems and generates interactive web portfolios. Built with Next.js 16, React 19, Tailwind CSS v4, and Framer Motion.

## Features

### Resume Builder
- **5 ATS-Friendly Resume Templates**
  - Classic Chronological (Senior roles)
  - Hybrid Combination (Career changers)
  - Functional Skill-Focused (Freelancers)
  - Modern Minimalist (Mid-level IC roles)
  - Academic Technical CV (Research & Deep Tech)
- **Download as TXT, Markdown, or PDF**
- **Copy to clipboard** with one click

### ATS Optimization
- Paste a job description text or URL
- Automatic keyword extraction and matching
- Match score with gap analysis
- Auto-inject missing keywords into your profile
- Recommendations for improving ATS compatibility

### Portfolio Generator
- **5 Interactive Portfolio Templates**
  - Minimal One-Page (single-scroll hero layout)
  - Persistent Sidebar (fixed nav + content area)
  - Design Forward (bold animations, gradients)
  - Terminal CLI (interactive command-line style)
  - Multi-Page Blog (MDX-style with blog posts)
- **Download as standalone HTML** - host anywhere (GitHub Pages, Netlify, Vercel)
- **Live customization** with theme, font, and layout controls

### Customization Panel
- **5 Color Themes:** Light, Dark, Retro, Cyberpunk, Aurora
- **5 Font Pairings:** Professional, Modern, Elegant, Technical, Creative
- **Font size and line height sliders**
- **Animation speed controls**
- Changes apply live to both resume and portfolio previews

### Data Intake
- Manual profile form with collapsible sections
- Upload existing resume (.txt, .pdf) for auto-fill
- Paste job description text or provide a URL
- Pre-loaded sample data for quick testing

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge |

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/ganesh12456/portfolio-maker.git
cd portfolio-maker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with AppProvider
│   ├── page.tsx                # Main app shell (4-tab navigation)
│   ├── globals.css             # Tailwind v4 + theme CSS variables
│   └── api/
│       └── parse-job/
│           └── route.ts        # JD parsing API endpoint
├── components/
│   ├── intake/
│   │   ├── ProfileForm.tsx     # Profile data input form
│   │   ├── JobSourceInput.tsx  # JD text/URL input
│   │   └── ResumeUpload.tsx    # Upload existing resume
│   ├── optimize/
│   │   └── OptimizationPanel.tsx
│   ├── resume/
│   │   ├── TemplateSelector.tsx
│   │   └── ResumePreview.tsx
│   ├── portfolio/
│   │   ├── PortfolioPreview.tsx
│   │   ├── MinimalOnePage.tsx
│   │   ├── PersistentSidebar.tsx
│   │   ├── DesignForward.tsx
│   │   ├── TerminalCLI.tsx
│   │   └── MultiPageBlog.tsx
│   ├── customization/
│   │   ├── CustomizationPanel.tsx
│   │   └── PortfolioCustomizationPanel.tsx
│   └── ui/
│       └── index.tsx           # Shared primitives
├── context/
│   └── AppContext.tsx           # React context + state management
├── lib/
│   ├── cn.ts                   # clsx + tailwind-merge
│   ├── themes.ts               # 5 theme configurations
│   ├── resume-templates.ts     # 5 ATS template definitions
│   ├── job-parser.ts           # JD text parsing engine
│   ├── optimizer.ts            # Keyword matching engine
│   ├── generate-portfolio-html.ts  # Standalone HTML generator
│   └── sample-data.ts          # Demo profile + job data
└── types/
    └── index.ts                # TypeScript type definitions
```

## Usage Flow

1. **Intake** - Fill your profile manually, upload an existing resume, or use sample data
2. **Add Target Job** - Paste a job description or provide a URL for ATS optimization
3. **Optimize** - Run keyword analysis to see match score and gaps
4. **Generate Resume** - Choose from 5 ATS templates, download as TXT/MD/PDF
5. **Build Portfolio** - Select a template, customize colors/fonts, download as standalone HTML

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### GitHub Pages / Netlify / Any Static Host
Download the portfolio as an HTML file from the Portfolio tab and upload it directly.

## License

MIT
