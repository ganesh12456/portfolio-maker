import type { UserProfile, ThemeConfig, FontConfig, PortfolioTemplateId } from '@/types';
import { themes } from '@/lib/themes';

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getThemeVars(theme: ThemeConfig): string {
  return `
    --bg: ${theme.colors.background};
    --surface: ${theme.colors.surface};
    --primary: ${theme.colors.primary};
    --secondary: ${theme.colors.secondary};
    --accent: ${theme.colors.accent};
    --text: ${theme.colors.text};
    --text-muted: ${theme.colors.textMuted};
    --border: ${theme.colors.border};
    --radius: ${theme.effects.borderRadius};
    --shadow: ${theme.effects.shadow};
    --glow: ${theme.effects.glow};
    --gradient-hero: ${theme.gradients.hero};
    --gradient-button: ${theme.gradients.button};
  `;
}

function getFontVars(font: FontConfig): string {
  return `
    --font-heading: '${font.heading}', system-ui, sans-serif;
    --font-body: '${font.body}', system-ui, sans-serif;
    --font-mono: '${font.mono}', monospace;
    --font-scale: ${font.scale};
    --line-height: ${font.lineHeight};
    --letter-spacing: ${font.letterSpacing}em;
  `;
}

function skillsSection(profile: UserProfile): string {
  return profile.skills.map((cat) => `
    <div class="skill-group">
      <h3 class="skill-category">${escapeHtml(cat.category)}</h3>
      <div class="skill-tags">
        ${cat.skills.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function experienceSection(profile: UserProfile): string {
  return profile.experience.map((exp) => `
    <div class="timeline-entry">
      <div class="timeline-dot"></div>
      <div class="entry-content">
        <div class="entry-header">
          <h3>${escapeHtml(exp.title)}</h3>
          <span class="badge">${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate || ''}</span>
        </div>
        <p class="entry-company">${escapeHtml(exp.company)} &middot; ${escapeHtml(exp.location)}</p>
        <ul>${exp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
      </div>
    </div>
  `).join('');
}

function projectsSection(profile: UserProfile): string {
  return profile.projects.map((proj) => `
    <div class="project-card">
      <div class="project-accent"></div>
      <h3>${escapeHtml(proj.name)}</h3>
      <p>${escapeHtml(proj.description)}</p>
      <div class="skill-tags">${proj.technologies.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <ul>${proj.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
      <div class="project-links">
        ${proj.url ? `<a href="${escapeHtml(proj.url)}" target="_blank">Live Demo</a>` : ''}
        ${proj.github ? `<a href="https://${escapeHtml(proj.github)}" target="_blank">GitHub</a>` : ''}
      </div>
    </div>
  `).join('');
}

function contactSection(profile: UserProfile): string {
  return `
    <div class="contact-grid">
      <a href="mailto:${escapeHtml(profile.personal.email)}" class="contact-item">${escapeHtml(profile.personal.email)}</a>
      ${profile.personal.phone ? `<a href="tel:${escapeHtml(profile.personal.phone)}" class="contact-item">${escapeHtml(profile.personal.phone)}</a>` : ''}
      ${profile.personal.linkedin ? `<a href="https://${escapeHtml(profile.personal.linkedin)}" target="_blank" class="contact-item">LinkedIn</a>` : ''}
      ${profile.personal.github ? `<a href="https://${escapeHtml(profile.personal.github)}" target="_blank" class="contact-item">GitHub</a>` : ''}
      ${profile.personal.website ? `<a href="https://${escapeHtml(profile.personal.website)}" target="_blank" class="contact-item">Website</a>` : ''}
    </div>
    <p class="location">${escapeHtml(profile.personal.location)}</p>
  `;
}

function generateMinimal(profile: UserProfile, theme: ThemeConfig, font: FontConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(profile.personal.fullName)} - Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=${font.heading.replace(/ /g, '+')}&family=${font.body.replace(/ /g, '+')}&family=${font.mono.replace(/ /g, '+')}&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{${getThemeVars(theme)}${getFontVars(font)}}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:calc(16px * var(--font-scale));line-height:var(--line-height);letter-spacing:var(--letter-spacing)}
.hero{min-height:90vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem}
.hero .overline{text-transform:uppercase;letter-spacing:.2em;font-size:.8rem;color:var(--text-muted);margin-bottom:1rem}
.hero h1{font-family:var(--font-heading);font-size:clamp(2.5rem,7vw,5rem);font-weight:800;margin-bottom:1.5rem}
.hero h1 span{color:var(--primary)}
.hero p{max-width:600px;color:var(--text-muted);font-size:1.1rem;margin-bottom:2rem}
.social-links{display:flex;gap:1rem}
.social-links a{width:48px;height:48px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--primary);text-decoration:none;font-size:1.2rem;transition:.2s}
.social-links a:hover{background:var(--primary);color:var(--bg);border-color:var(--primary)}
section{max-width:900px;margin:0 auto;padding:4rem 1.5rem}
section h2{font-family:var(--font-heading);font-size:1.8rem;margin-bottom:2rem}
.skill-group{margin-bottom:1.5rem}
.skill-category{text-transform:uppercase;letter-spacing:.1em;font-size:.75rem;color:var(--text-muted);margin-bottom:.75rem}
.skill-tags{display:flex;flex-wrap:wrap;gap:.5rem}
.tag{padding:.4rem 1rem;border:1px solid var(--border);border-radius:999px;font-size:.85rem;transition:.2s}
.tag:hover{border-color:var(--primary);color:var(--primary)}
.timeline{position:relative;padding-left:2rem}
.timeline::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--border)}
.timeline-entry{position:relative;margin-bottom:2rem}
.timeline-dot{position:absolute;left:-2.35rem;top:.35rem;width:10px;height:10px;border-radius:50%;background:var(--primary)}
.entry-header{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.entry-header h3{font-size:1.1rem}
.badge{font-size:.7rem;padding:.2rem .7rem;border-radius:999px;background:var(--primary);color:white;opacity:.9}
.entry-company{color:var(--primary);font-size:.85rem;margin:.25rem 0 .75rem}
.entry-content ul{list-style:none;padding:0}
.entry-content li{color:var(--text-muted);font-size:.9rem;margin-bottom:.4rem;padding-left:1rem;position:relative}
.entry-content li::before{content:'▸';position:absolute;left:0;color:var(--primary)}
.project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
.project-card{border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;position:relative;overflow:hidden;transition:.2s}
.project-card:hover{transform:translateY(-4px);box-shadow:var(--glow)}
.project-accent{position:absolute;top:0;left:0;right:0;height:3px;background:var(--gradient-button)}
.project-card h3{font-size:1rem;margin-bottom:.5rem}
.project-card p{color:var(--text-muted);font-size:.85rem;margin-bottom:1rem}
.project-card ul{list-style:none;padding:0;margin-bottom:1rem}
.project-card li{color:var(--text-muted);font-size:.8rem;margin-bottom:.3rem}
.project-links{display:flex;gap:1rem}
.project-links a{color:var(--primary);text-decoration:none;font-size:.85rem;font-weight:600}
.contact-grid{display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:1rem}
.contact-item{padding:.6rem 1.2rem;border:1px solid var(--border);border-radius:var(--radius);color:var(--text);text-decoration:none;font-size:.9rem;transition:.2s}
.contact-item:hover{border-color:var(--primary);color:var(--primary)}
.location{color:var(--text-muted);font-size:.85rem;text-align:center}
footer{text-align:center;padding:2rem;color:var(--text-muted);font-size:.8rem;border-top:1px solid var(--border);margin-top:2rem}
</style>
</head>
<body>
<div class="hero">
  <p class="overline">${escapeHtml(profile.personal.title)}</p>
  <h1>${escapeHtml(profile.personal.fullName).split(' ').map((w, i) => i === 1 ? `<span>${escapeHtml(w)}</span>` : escapeHtml(w)).join(' ')}</h1>
  <p>${escapeHtml(profile.summary.split('.').slice(0, 2).join('.') + '.')}</p>
  <div class="social-links">
    <a href="mailto:${escapeHtml(profile.personal.email)}" title="Email">&#9993;</a>
    ${profile.personal.github ? `<a href="https://${escapeHtml(profile.personal.github)}" target="_blank" title="GitHub">&#128187;</a>` : ''}
    ${profile.personal.linkedin ? `<a href="https://${escapeHtml(profile.personal.linkedin)}" target="_blank" title="LinkedIn">in</a>` : ''}
  </div>
</div>
<section>
  <h2>Skills & Technologies</h2>
  ${skillsSection(profile)}
</section>
<section>
  <h2>Experience</h2>
  <div class="timeline">${experienceSection(profile)}</div>
</section>
<section>
  <h2>Projects</h2>
  <div class="project-grid">${projectsSection(profile)}</div>
</section>
<section>
  <h2>Get In Touch</h2>
  ${contactSection(profile)}
</section>
<footer>&copy; ${new Date().getFullYear()} ${escapeHtml(profile.personal.fullName)}. All rights reserved.</footer>
</body>
</html>`;
}

function generateSidebar(profile: UserProfile, theme: ThemeConfig, font: FontConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(profile.personal.fullName)} - Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=${font.heading.replace(/ /g, '+')}&family=${font.body.replace(/ /g, '+')}&family=${font.mono.replace(/ /g, '+')}&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{${getThemeVars(theme)}${getFontVars(font)}}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:calc(16px * var(--font-scale));line-height:var(--line-height)}
.layout{display:flex;min-height:100vh}
.sidebar{width:260px;background:var(--surface);border-right:1px solid var(--border);padding:2rem;position:fixed;height:100vh;display:flex;flex-direction:column}
.avatar{width:64px;height:64px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:1.2rem;margin-bottom:1rem}
.sidebar h1{font-family:var(--font-heading);font-size:1.1rem}
.sidebar .title{color:var(--text-muted);font-size:.8rem;margin-bottom:2rem}
.sidebar nav a{display:flex;align-items:center;gap:.75rem;padding:.5rem .75rem;border-radius:8px;color:var(--text-muted);text-decoration:none;font-size:.85rem;margin-bottom:.25rem;transition:.2s}
.sidebar nav a:hover,nav a.active{background:var(--primary);color:white}
.sidebar-footer{margin-top:auto;display:flex;gap:1rem;padding-top:1rem;border-top:1px solid var(--border)}
.sidebar-footer a{color:var(--text-muted);text-decoration:none;font-size:.8rem}
.main{margin-left:260px;flex:1;padding:2.5rem}
.section{margin-bottom:3rem}
.section h2{font-family:var(--font-heading);font-size:1.5rem;margin-bottom:1.5rem}
.card{border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem;background:var(--surface);transition:.2s}
.card:hover{border-color:var(--primary)}
.card h3{font-size:1rem;margin-bottom:.25rem}
.card .company{color:var(--primary);font-size:.85rem}
.card .date{color:var(--text-muted);font-size:.75rem;margin-bottom:.75rem}
.card ul{list-style:none;padding:0}
.card li{color:var(--text-muted);font-size:.85rem;margin-bottom:.35rem;padding-left:1rem;position:relative}
.card li::before{content:'▸';position:absolute;left:0;color:var(--primary)}
.skill-tags{display:flex;flex-wrap:wrap;gap:.5rem}
.tag{padding:.35rem .9rem;border:1px solid var(--border);border-radius:999px;font-size:.8rem}
.project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
.project-card{border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;background:var(--surface);transition:.2s}
.project-card:hover{transform:translateY(-2px)}
.project-card h3{font-size:.95rem;margin-bottom:.5rem}
.project-card p{color:var(--text-muted);font-size:.8rem;margin-bottom:.75rem}
.project-links a{color:var(--primary);text-decoration:none;font-size:.8rem;margin-right:1rem}
@media(max-width:768px){.sidebar{position:relative;width:100%;height:auto}.main{margin-left:0}.layout{flex-direction:column}}
</style>
</head>
<body>
<div class="layout">
<aside class="sidebar">
  <div class="avatar">${profile.personal.fullName.split(' ').map((n) => n[0]).join('')}</div>
  <h1>${escapeHtml(profile.personal.fullName)}</h1>
  <p class="title">${escapeHtml(profile.personal.title)}</p>
  <nav>
    <a href="#about" class="active">&#128100; About</a>
    <a href="#experience">&#128188; Experience</a>
    <a href="#skills">&#128187; Skills</a>
    <a href="#projects">&#128194; Projects</a>
    <a href="#contact">&#128231; Contact</a>
  </nav>
  <div class="sidebar-footer">
    ${profile.personal.github ? `<a href="https://${escapeHtml(profile.personal.github)}" target="_blank">GitHub</a>` : ''}
    ${profile.personal.linkedin ? `<a href="https://${escapeHtml(profile.personal.linkedin)}" target="_blank">LinkedIn</a>` : ''}
  </div>
</aside>
<main class="main">
  <div class="section" id="about">
    <h2>About</h2>
    <p style="color:var(--text-muted)">${escapeHtml(profile.summary)}</p>
  </div>
  <div class="section" id="experience">
    <h2>Experience</h2>
    ${profile.experience.map((exp) => `
    <div class="card">
      <h3>${escapeHtml(exp.title)}</h3>
      <p class="company">${escapeHtml(exp.company)}</p>
      <p class="date">${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate || ''}</p>
      <ul>${exp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
    </div>`).join('')}
  </div>
  <div class="section" id="skills">
    <h2>Skills</h2>
    ${profile.skills.map((cat) => `
    <div style="margin-bottom:1.5rem">
      <p style="text-transform:uppercase;letter-spacing:.1em;font-size:.7rem;color:var(--text-muted);margin-bottom:.5rem">${escapeHtml(cat.category)}</p>
      <div class="skill-tags">${cat.skills.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join('')}</div>
    </div>`).join('')}
  </div>
  <div class="section" id="projects">
    <h2>Projects</h2>
    <div class="project-grid">${profile.projects.map((proj) => `
      <div class="project-card">
        <h3>${escapeHtml(proj.name)}</h3>
        <p>${escapeHtml(proj.description)}</p>
        <div class="skill-tags" style="margin-bottom:.5rem">${proj.technologies.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
        <div class="project-links">
          ${proj.url ? `<a href="${escapeHtml(proj.url)}" target="_blank">Demo</a>` : ''}
          ${proj.github ? `<a href="https://${escapeHtml(proj.github)}" target="_blank">Code</a>` : ''}
        </div>
      </div>`).join('')}
    </div>
  </div>
  <div class="section" id="contact">
    <h2>Contact</h2>
    ${contactSection(profile)}
  </div>
</main>
</div>
</body>
</html>`;
}

function generateTerminal(profile: UserProfile, theme: ThemeConfig, font: FontConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(profile.personal.fullName)} - Terminal Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=${font.mono.replace(/ /g, '+')}&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:'${font.mono}',monospace}
.terminal{width:100%;max-width:800px;border-radius:12px;overflow:hidden;border:1px solid #333;background:#111}
.titlebar{display:flex;align-items:center;gap:8px;padding:12px 16px;background:#1a1a1a;border-bottom:1px solid #333}
.dot{width:12px;height:12px;border-radius:50%}
.dot-r{background:#ff5f56}.dot-y{background:#ffbd2e}.dot-g{background:#27c93f}
.titlebar span{margin-left:8px;color:#666;font-size:12px}
.body{padding:20px;color:#4ade80;font-size:14px;line-height:1.7;max-height:70vh;overflow-y:auto}
.prompt{color:#0ff}.cmd{color:#f0f}
.output{margin:8px 0 16px}
.output h2{color:#f0f;font-size:13px;margin:16px 0 8px;text-transform:uppercase;letter-spacing:1px}
.output p{color:#4ade80;font-size:13px}
.output ul{list-style:none;padding:0}
.output li{color:#4ade80;font-size:13px;padding-left:16px;position:relative}
.output li::before{content:'>';position:absolute;left:0;color:#0ff}
.tag{display:inline-block;padding:2px 10px;border:1px solid #333;border-radius:4px;margin:2px;font-size:12px;color:#4ade80}
.input-line{display:flex;align-items:center;gap:8px;margin-top:12px}
.input-line span{color:#f0f}
input{background:transparent;border:none;color:#4ade80;font-family:inherit;font-size:14px;flex:1;outline:none;caret-color:#4ade80}
.shortcuts{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;justify-content:center}
.shortcuts button{padding:4px 12px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#4ade80;font-family:inherit;font-size:12px;cursor:pointer}
.shortcuts button:hover{border-color:#4ade80}
</style>
</head>
<body>
<div class="terminal">
<div class="titlebar">
  <div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div>
  <span>portfolio@${escapeHtml(profile.personal.fullName.toLowerCase().replace(/\s/g, '-'))}</span>
</div>
<div class="body" id="output">
  <div class="output">
    <pre style="color:#4ade80">
 ____  _____ ____  ____  _  _____ _   _ _____
|  _ \\| ____|  _ \\|  _ \\| |/ /_ _| \\ | | ____|
| |_) |  _| | |_) | | | | ' / | ||  \\| |  _|
|  __/| |___|  _ &lt;| |_| | . \\ | || |\\  | |___
|_|   |_____|_| \\_\\____/|_|\\_\\___|_| \\_|_____|
    </pre>
    <p>Welcome, <strong>${escapeHtml(profile.personal.fullName)}</strong></p>
    <p>${escapeHtml(profile.personal.title)} | ${escapeHtml(profile.personal.location)}</p>
    <p style="color:#666;margin-top:8px">Type 'help' to see available commands.</p>
  </div>
</div>
</div>
<div class="shortcuts">
  <button onclick="run('about')">about</button>
  <button onclick="run('skills')">skills</button>
  <button onclick="run('experience')">experience</button>
  <button onclick="run('projects')">projects</button>
  <button onclick="run('contact')">contact</button>
</div>
<script>
const commands={
  help:'Commands: about, skills, experience, projects, contact, clear',
  about:\`<h2>About</h2><p>${escapeHtml(profile.summary)}</p>\`,
  skills:\`<h2>Skills</h2>${profile.skills.map((c) => `<p style="color:#0ff;margin-top:8px">${escapeHtml(c.category.toUpperCase())}</p><p>${c.skills.map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join(' ')}</p>`).join('')}\`,
  experience:\`<h2>Experience</h2>${profile.experience.map((e) => `<p><strong>${escapeHtml(e.title)}</strong> @ ${escapeHtml(e.company)}</p><p style="color:#666">${e.startDate} - ${e.isCurrent ? 'Present' : e.endDate || ''}</p><ul>${e.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`).join('')}\`,
  projects:\`<h2>Projects</h2>${profile.projects.map((p) => `<p><strong>${escapeHtml(p.name)}</strong></p><p>${escapeHtml(p.description)}</p><p>${p.technologies.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join(' ')}</p>`).join('')}\`,
  contact:\`<h2>Contact</h2><p>Email: ${escapeHtml(profile.personal.email)}</p>${profile.personal.github ? `<p>GitHub: ${escapeHtml(profile.personal.github)}</p>` : ''}${profile.personal.linkedin ? `<p>LinkedIn: ${escapeHtml(profile.personal.linkedin)}</p>` : ''}\`,
  clear:'__CLEAR__'
};
function run(cmd){
  const out=document.getElementById('output');
  if(cmd==='clear'){out.innerHTML='';return}
  const html=commands[cmd];
  if(!html){out.innerHTML+=\`<div class="output"><p style="color:#f00">Unknown: \${cmd}</p></div>\`;return}
  out.innerHTML+=\`<div class="output">\${html}</div>\`;
  out.scrollTop=out.scrollHeight;
}
</script>
</body>
</html>`;
}

function generateGeneric(profile: UserProfile, theme: ThemeConfig, font: FontConfig, templateId: PortfolioTemplateId): string {
  // Fallback for design-forward and multi-page-blog: uses minimal template structure
  if (templateId === 'multi-page-blog') return generateSidebar(profile, theme, font);
  return generateMinimal(profile, theme, font);
}

export function generatePortfolioHTML(
  profile: UserProfile,
  templateId: PortfolioTemplateId,
  themeId: string,
  font: FontConfig
): string {
  const theme = themes[themeId as keyof typeof themes] || themes.dark;

  switch (templateId) {
    case 'minimal-one-page':
      return generateMinimal(profile, theme, font);
    case 'persistent-sidebar':
      return generateSidebar(profile, theme, font);
    case 'terminal-cli':
      return generateTerminal(profile, theme, font);
    case 'design-forward':
    case 'multi-page-blog':
      return generateGeneric(profile, theme, font, templateId);
    default:
      return generateMinimal(profile, theme, font);
  }
}

export function downloadPortfolio(
  profile: UserProfile,
  templateId: PortfolioTemplateId,
  themeId: string,
  font: FontConfig
) {
  const html = generatePortfolioHTML(profile, templateId, themeId, font);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.personal.fullName.replace(/\s+/g, '_')}_Portfolio.html`;
  a.click();
  URL.revokeObjectURL(url);
}
