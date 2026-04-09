// ══════════════════════════════
//  STATE
// ══════════════════════════════
const DAY_KEYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const TODAY_IDX = (() => { const d = new Date().getDay(); return d===0?6:d-1; })();
const EMOJIS = ['💻','📚','💪','🎯','✍️','🏃','💧','🧘','🔥','⚡','🧠','📝','🎨','🤸','🎵','💼','📊','🚀'];
const CAT_COLORS = { Career:'var(--accent)', Learning:'var(--purple)', Health:'var(--accent2)', Mindset:'var(--accent3)', Productivity:'var(--danger)', Other:'var(--muted)' };
const SKILL_CAT_COLORS = { Technical:'var(--accent)', Domain:'var(--accent2)', 'Soft Skills':'var(--accent3)', Tools:'var(--purple)', Languages:'var(--danger)' };

let habits = load('ft_habits', [
  {id:1,name:'Apply to 3 Jobs',emoji:'💼',cat:'Career',time:'Morning',done:false,streak:5,w:[1,1,1,1,1,0,0]},
  {id:2,name:'LeetCode / DSA',emoji:'💻',cat:'Learning',time:'Afternoon',done:false,streak:3,w:[1,0,1,1,0,0,0]},
  {id:3,name:'Read Tech Blog',emoji:'📚',cat:'Learning',time:'Evening',done:true,streak:7,w:[1,1,1,1,1,1,0]},
  {id:4,name:'Exercise 30 min',emoji:'💪',cat:'Health',time:'Morning',done:false,streak:2,w:[1,1,0,0,0,0,0]},
  {id:5,name:'Review Resume',emoji:'📝',cat:'Career',time:'Evening',done:false,streak:1,w:[0,1,0,1,0,0,0]},
]);
let jobs = load('ft_jobs', [
  {id:1,company:'Infosys',role:'Systems Engineer',date:'2025-03-01',status:'interview',notes:'Naukri'},
  {id:2,company:'TCS',role:'Associate',date:'2025-03-05',status:'applied',notes:'Campus drive'},
  {id:3,company:'Wipro',role:'Project Engineer',date:'2025-02-28',status:'rejected',notes:'LinkedIn'},
]);
let skills = load('ft_skills', [
  {id:1,name:'Java',cat:'Technical',pct:70},
  {id:2,name:'SQL',cat:'Technical',pct:60},
  {id:3,name:'Communication',cat:'Soft Skills',pct:75},
  {id:4,name:'MS Excel',cat:'Tools',pct:55},
]);
let tasks = load('ft_tasks', []);
let goals = load('ft_goals', [
  {id:1,name:'Land first job in 60 days',date:'2025-05-01',cat:'Career',done:false},
  {id:2,name:'Complete DSA course',date:'2025-04-15',cat:'Learning',done:false},
]);
let notes = load('ft_notes', []);
let weekData = load('ft_week', {Mon:80,Tue:60,Wed:100,Thu:40,Fri:70,Sat:50,Sun:0});
let streak = load('ft_streak', 4);
let pomoSessions = load('ft_pomo', {count:0, mins:0, log:[]});
let selectedEmoji = '💻';
let habitFilter = 'all';
let habitCatFilter = 'all';
let currentPage = 'dashboard';
let pomoInterval = null;
let pomoRunning = false;
let pomoSeconds = 25*60;
let pomoTotal = 25*60;
let pomoMode = 'focus';
let currentQ = '';
let savedAnswers = load('ft_answers', {});

function load(k, def) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save() {
  localStorage.setItem('ft_habits', JSON.stringify(habits));
  localStorage.setItem('ft_jobs', JSON.stringify(jobs));
  localStorage.setItem('ft_skills', JSON.stringify(skills));
  localStorage.setItem('ft_tasks', JSON.stringify(tasks));
  localStorage.setItem('ft_goals', JSON.stringify(goals));
  localStorage.setItem('ft_notes', JSON.stringify(notes));
  localStorage.setItem('ft_week', JSON.stringify(weekData));
  localStorage.setItem('ft_streak', JSON.stringify(streak));
  localStorage.setItem('ft_pomo', JSON.stringify(pomoSessions));
  localStorage.setItem('ft_answers', JSON.stringify(savedAnswers));
}

// ══════════════════════════════
//  INIT
// ══════════════════════════════
document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
document.getElementById('h-emoji-row').innerHTML = EMOJIS.map(e=>`<div class="e-btn${e===selectedEmoji?' sel':''}" onclick="selEmoji('${e}',this)">${e}</div>`).join('');

function selEmoji(e,el){ selectedEmoji=e; document.querySelectorAll('.e-btn').forEach(b=>b.classList.remove('sel')); el.classList.add('sel'); }

// ══════════════════════════════
//  NAVIGATION
// ══════════════════════════════
const PAGE_TITLES = {dashboard:'Overview',habits:'Habits',focus:'Focus Timer',jobs:'Job Tracker',skills:'Skills',resume:'Resume Prep',interview:'Interview Prep',notes:'Daily Notes',goals:'Goals'};
const PAGE_CTA = {habits:['+ Add Habit','openHabitModal()'],jobs:['+ Add Application','openJobModal()'],skills:['+ Add Skill','openSkillModal()'],goals:['+ Add Goal','openGoalModal()']};

function goPage(p, el) {
  document.querySelectorAll('[id^="page-"]').forEach(d=>d.style.display='none');
  document.getElementById('page-'+p).style.display='';
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.getElementById('topbar-title').textContent = PAGE_TITLES[p] || p;
  const cta = PAGE_CTA[p];
  const ctaBtn = document.getElementById('topbar-cta');
  if (cta) { ctaBtn.textContent = cta[0]; ctaBtn.setAttribute('onclick', cta[1]); ctaBtn.style.display=''; }
  else { ctaBtn.style.display='none'; }
  currentPage = p;
  closeSidebar();
  renderPage(p);
}

function switchSection(sec, el) {
  document.querySelectorAll('[id^="section-"]').forEach(s=>s.style.display='none');
  document.getElementById('section-'+sec).style.display='';
  document.querySelectorAll('.ios-tab').forEach(t=>t.classList.remove('active'));
  if (el) el.classList.add('active');
  if (sec === 'home') { goPage('dashboard'); }
  else if (sec === 'dashboard') { goPage('dashboard'); }
  else if (sec === 'career') { goPage('jobs'); }
  else if (sec === 'workflow') { goPage('notes'); }
}

function renderPage(p) {
  if (p==='dashboard') renderDashboard();
  else if (p==='habits') renderHabitsPage();
  else if (p==='jobs') renderJobsPage();
  else if (p==='skills') renderSkillsPage();
  else if (p==='resume') renderResumePage();
  else if (p==='interview') renderInterviewPage();
  else if (p==='notes') renderNotesPage();
  else if (p==='goals') renderGoalsPage();
  updateKPIs();
}

// ══════════════════════════════
//  KPIs
// ══════════════════════════════
function updateKPIs() {
  const done = habits.filter(h=>h.done).length;
  const total = habits.length;
  const pct = total ? Math.round(done/total*100) : 0;
  weekData[DAY_KEYS[TODAY_IDX]] = pct; save();

  document.getElementById('k-done').textContent = done;
  document.getElementById('k-pct').textContent = pct+'% of habits';
  document.getElementById('k-streak').textContent = streak;
  document.getElementById('s-streak').textContent = streak;
  document.getElementById('k-jobs').textContent = jobs.filter(j=>j.status==='applied'||j.status==='interview'||j.status==='offer').length;
  document.getElementById('k-interviews').textContent = jobs.filter(j=>j.status==='interview').length + ' interviews';
  document.getElementById('k-skills').textContent = skills.length;
  const avgSk = skills.length ? Math.round(skills.reduce((a,s)=>a+s.pct,0)/skills.length) : 0;
  document.getElementById('k-avg-skill').textContent = 'avg '+avgSk+'%';
  document.getElementById('nb-habits').textContent = total - done;
  document.getElementById('nb-jobs').textContent = jobs.filter(j=>j.status==='interview').length;
}

// ══════════════════════════════
//  DASHBOARD
// ══════════════════════════════
function renderDashboard() {
  renderWeekGrid();
  // dash habits (top 4)
  const dh = document.getElementById('dash-habits');
  const show = habits.slice(0,4);
  dh.innerHTML = show.length ? show.map(h=>habitRowHTML(h,true)).join('') :
    `<div class="empty"><div class="empty-icon">✅</div>No habits yet</div>`;
  // jobs
  const djl = document.getElementById('dash-jobs-list');
  const showJ = jobs.slice(-3).reverse();
  djl.innerHTML = showJ.length ? showJ.map(j=>`
    <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border)">
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${j.company}</div>
        <div style="font-size:11px;color:var(--muted)">${j.role}</div>
      </div>
      <div class="status-badge s-${j.status}"><div class="status-dot"></div>${cap(j.status)}</div>
    </div>`).join('') : `<div class="empty"><div class="empty-icon">💼</div>No applications yet</div>`;
  // skills
  const dsl = document.getElementById('dash-skills-list');
  dsl.innerHTML = skills.slice(0,4).map(s=>`
    <div class="skill-item">
      <div class="skill-top"><span class="skill-name">${s.name}</span><span class="skill-pct" style="color:${SKILL_CAT_COLORS[s.cat]||'var(--accent)'}">${s.pct}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${s.pct}%;background:${SKILL_CAT_COLORS[s.cat]||'var(--accent)'}"></div></div>
    </div>`).join('') || `<div class="empty"><div class="empty-icon">🧠</div>No skills yet</div>`;
  // tasks
  renderDashTasks();
}

function renderDashTasks() {
  const dt = document.getElementById('dash-tasks');
  const show = tasks.slice(-5).reverse();
  dt.innerHTML = show.length ? show.map(t=>`
    <div class="checklist-item ${t.done?'done':''}" onclick="toggleTask(${t.id})">
      <div class="cl-check">${t.done?'✓':''}</div>
      <span class="cl-text">${t.text}</span>
    </div>`).join('') : `<div class="empty"><div class="empty-icon">📋</div>No tasks yet<br><small>Add in Notes tab</small></div>`;
}

function renderWeekGrid() {
  const g = document.getElementById('week-grid');
  g.innerHTML = DAY_KEYS.map((d,i)=>{
    const v = weekData[d]||0;
    const isToday = i===TODAY_IDX;
    const fill = isToday ? 'var(--accent3)' : 'var(--accent)';
    return `<div class="w-day ${isToday?'today':''}">
      <div class="w-label">${d}</div>
      <div class="w-bar"><div class="w-fill" style="height:${v}%;background:${fill}"></div></div>
      <div class="w-pct">${v}%</div>
    </div>`;
  }).join('');
}

// ══════════════════════════════
//  HABITS
// ══════════════════════════════
function habitRowHTML(h, compact=false) {
  const dots = h.w.map((f,i)=>`<div class="wd ${f?'f':''} ${i===TODAY_IDX?'t':''}"></div>`).join('');
  return `<div class="habit-row ${h.done?'done':''}" onclick="toggleHabit(${h.id})" style="animation-delay:0s">
    <div class="habit-check">${h.done?'✓':''}</div>
    <span class="habit-emoji">${h.emoji}</span>
    <div class="habit-info">
      <div class="habit-title">${h.name}</div>
      <div class="habit-meta">${h.cat} · ${h.time}</div>
    </div>
    <div class="habit-right">
      ${!compact?`<div class="week-dots">${dots}</div>`:''}
      <div class="habit-streak">🔥${h.streak}</div>
      <button class="del-btn" onclick="delHabit(event,${h.id})">×</button>
    </div>
  </div>`;
}

function renderHabitsPage() {
  let filtered = habits;
  if (habitCatFilter!=='all') filtered=filtered.filter(h=>h.cat===habitCatFilter);
  if (habitFilter==='pending') filtered=filtered.filter(h=>!h.done);
  if (habitFilter==='done') filtered=filtered.filter(h=>h.done);

  document.getElementById('main-habits').innerHTML = filtered.length
    ? filtered.map(h=>habitRowHTML(h)).join('')
    : `<div class="empty"><div class="empty-icon">${habitFilter==='done'?'✅':'📋'}</div>${habitFilter==='done'?'No completed habits yet':'No habits found'}</div>`;

  const done=habits.filter(h=>h.done).length, total=habits.length;
  const pct=total?Math.round(done/total*100):0;
  document.getElementById('habit-prog').style.width=pct+'%';
  document.getElementById('habit-prog-label').textContent=`${done} of ${total} habits done`;
  document.getElementById('habit-prog-pct').textContent=pct+'%';

  // category filter pills
  const cats=['all',...new Set(habits.map(h=>h.cat))];
  document.getElementById('cat-filter').innerHTML=cats.map(c=>`
    <div onclick="setCatFilter('${c}',this)" style="padding:5px 13px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid ${c===habitCatFilter?'var(--accent)':'var(--border)'};background:${c===habitCatFilter?'var(--accent-light)':'transparent'};color:${c===habitCatFilter?'var(--accent)':'var(--muted)'};">${c==='all'?'All':c}</div>`).join('');
}

function setCatFilter(c,el){habitCatFilter=c;renderHabitsPage();}
function filterHabits(f,el){habitFilter=f;document.querySelectorAll('.page-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');renderHabitsPage();}

function toggleHabit(id) {
  const h=habits.find(x=>x.id===id); if(!h) return;
  h.done=!h.done;
  if(h.done){ h.streak++; h.w[TODAY_IDX]=1; showToast('✅ '+h.name+' done!'); }
  else { h.w[TODAY_IDX]=0; }
  const allDone=habits.every(x=>x.done);
  if(allDone&&habits.length){ streak++; showToast('🔥 All done! Streak: '+streak); }
  save(); updateKPIs();
  if(currentPage==='habits') renderHabitsPage();
  if(currentPage==='dashboard') renderDashboard();
}

function delHabit(e,id){ e.stopPropagation(); habits=habits.filter(h=>h.id!==id); save(); updateKPIs(); renderPage(currentPage); showToast('Habit removed'); }
function openHabitModal(){ document.getElementById('habitModal').classList.add('open'); }
function saveHabit(){
  const name=document.getElementById('h-name').value.trim(); if(!name) return;
  habits.push({id:Date.now(),name,emoji:selectedEmoji,cat:document.getElementById('h-cat').value,time:document.getElementById('h-time').value,done:false,streak:0,w:[0,0,0,0,0,0,0]});
  save(); closeModal('habitModal'); updateKPIs(); renderPage(currentPage); showToast('🎯 Habit added!');
  document.getElementById('h-name').value='';
}

// ══════════════════════════════
//  JOBS
// ══════════════════════════════
function renderJobsPage(){
  const counts={applied:0,interview:0,offer:0,rejected:0,wishlist:0};
  jobs.forEach(j=>{ if(counts[j.status]!==undefined) counts[j.status]++; });
  ['applied','interview','offer','rejected','wishlist'].forEach(s=>{ document.getElementById('jk-'+s).textContent=counts[s]; });
  document.getElementById('job-tbody').innerHTML = jobs.length
    ? jobs.map(j=>`<tr>
        <td><strong>${j.company}</strong></td>
        <td>${j.role}</td>
        <td style="color:var(--muted);font-size:12px">${j.date}</td>
        <td><span class="status-badge s-${j.status}"><div class="status-dot"></div>${cap(j.status)}</span></td>
        <td style="color:var(--muted);font-size:12px">${j.notes||'—'}</td>
        <td><button class="del-btn" onclick="delJob(${j.id})">×</button></td>
      </tr>`).join('')
    : `<tr><td colspan="6"><div class="empty"><div class="empty-icon">💼</div>No applications yet</div></td></tr>`;
}
function openJobModal(){ document.getElementById('j-date').value=new Date().toISOString().split('T')[0]; document.getElementById('jobModal').classList.add('open'); }
function saveJob(){
  const company=document.getElementById('j-company').value.trim(),role=document.getElementById('j-role').value.trim();
  if(!company||!role) return;
  jobs.push({id:Date.now(),company,role,date:document.getElementById('j-date').value,status:document.getElementById('j-status').value,notes:document.getElementById('j-notes').value});
  save(); closeModal('jobModal'); updateKPIs(); renderJobsPage(); showToast('💼 Application saved!');
  ['j-company','j-role','j-notes'].forEach(i=>document.getElementById(i).value='');
}
function delJob(id){ jobs=jobs.filter(j=>j.id!==id); save(); updateKPIs(); renderJobsPage(); showToast('Removed'); }

// ══════════════════════════════
//  SKILLS
// ══════════════════════════════
function renderSkillsPage(){
  document.getElementById('skills-list').innerHTML = skills.length
    ? skills.map(s=>`<div class="skill-item">
        <div class="skill-top">
          <span class="skill-name">${s.name} <span style="font-size:10px;color:var(--muted);font-weight:400">${s.cat}</span></span>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="skill-pct" style="color:${SKILL_CAT_COLORS[s.cat]||'var(--accent)'}">${s.pct}%</span>
            <button class="del-btn" onclick="delSkill(${s.id})">×</button>
          </div>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${s.pct}%;background:${SKILL_CAT_COLORS[s.cat]||'var(--accent)'}"></div></div>
      </div>`).join('')
    : `<div class="empty"><div class="empty-icon">🧠</div>Add your first skill</div>`;
  // cat breakdown
  const cats={};
  skills.forEach(s=>{ if(!cats[s.cat])cats[s.cat]={count:0,avg:0,total:0}; cats[s.cat].count++; cats[s.cat].total+=s.pct; });
  Object.keys(cats).forEach(c=>cats[c].avg=Math.round(cats[c].total/cats[c].count));
  document.getElementById('skill-cats-list').innerHTML = Object.entries(cats).map(([c,v])=>`
    <div class="skill-item">
      <div class="skill-top"><span class="skill-name">${c}</span><span style="font-size:12px;color:var(--muted)">${v.count} skills · avg ${v.avg}%</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${v.avg}%;background:${SKILL_CAT_COLORS[c]||'var(--accent)'}"></div></div>
    </div>`).join('') || `<div class="empty">No categories yet</div>`;
}
function openSkillModal(){ document.getElementById('skillModal').classList.add('open'); }
function saveSkill(){
  const name=document.getElementById('sk-name').value.trim(), pct=parseInt(document.getElementById('sk-pct').value)||0;
  if(!name) return;
  skills.push({id:Date.now(),name,cat:document.getElementById('sk-cat').value,pct:Math.min(100,Math.max(0,pct))});
  save(); closeModal('skillModal'); updateKPIs(); renderSkillsPage(); showToast('🧠 Skill added!');
  document.getElementById('sk-name').value=''; document.getElementById('sk-pct').value='';
}
function delSkill(id){ skills=skills.filter(s=>s.id!==id); save(); updateKPIs(); renderSkillsPage(); }

// ══════════════════════════════
//  RESUME
// ══════════════════════════════
const RESUME_CHECKLIST = [
  {t:'Contact info (name, phone, email, LinkedIn, GitHub)',cat:'Essential'},
  {t:'Professional summary / objective (2–3 lines)',cat:'Essential'},
  {t:'Education section with GPA if above 7.5',cat:'Essential'},
  {t:'Skills section (Technical + Soft)',cat:'Essential'},
  {t:'Projects (2–3 with tech stack + impact)',cat:'Essential'},
  {t:'Internships / Certifications (if any)',cat:'Important'},
  {t:'Achievements / Awards / Hackathons',cat:'Bonus'},
  {t:'Clean single-page format (ATS friendly)',cat:'Essential'},
  {t:'No spelling / grammar errors',cat:'Essential'},
  {t:'Consistent formatting (font, spacing)',cat:'Important'},
  {t:'Quantify results ("Improved X by Y%")',cat:'Important'},
  {t:'Tailored keywords for JD',cat:'Pro Tip'},
];
const RESUME_TIPS = [
  {t:'Use action verbs to start every bullet point',d:'"Developed", "Designed", "Implemented", "Optimised"'},
  {t:'Keep resume to 1 page as a fresher',d:'Recruiters spend avg 6 seconds — make it count'},
  {t:'Add GitHub / portfolio link',d:'Shows real work beyond the degree'},
  {t:'Use ATS-friendly templates',d:'Avoid tables, images — plain text columns work best'},
  {t:'Quantify your projects',d:'"Built REST API serving 500 requests/sec" > "Built REST API"'},
  {t:'Include relevant certifications',d:'Coursera, NPTEL, Google, AWS, etc. carry weight'},
];
let resumeChecks = load('ft_resume_checks', RESUME_CHECKLIST.map((_,i)=>({id:i,done:false})));
function renderResumePage(){
  document.getElementById('resume-checklist').innerHTML = RESUME_CHECKLIST.map((item,i)=>{
    const ch = resumeChecks[i]||{done:false};
    const catColor = item.cat==='Essential'?'var(--danger)':item.cat==='Important'?'var(--accent3)':item.cat==='Bonus'?'var(--accent2)':'var(--purple)';
    return `<div class="checklist-item ${ch.done?'done':''}" onclick="toggleResume(${i})">
      <div class="cl-check">${ch.done?'✓':''}</div>
      <span class="cl-text">${item.t}</span>
      <span class="cl-badge" style="background:${catColor}22;color:${catColor}">${item.cat}</span>
    </div>`;
  }).join('');
  document.getElementById('resume-tips').innerHTML = RESUME_TIPS.map(tip=>`
    <div class="tl-item">
      <div class="tl-dot" style="background:var(--accent)"></div>
      <div class="tl-title">${tip.t}</div>
      <div class="tl-time">${tip.d}</div>
    </div>`).join('');
}
function toggleResume(i){ resumeChecks[i].done=!resumeChecks[i].done; localStorage.setItem('ft_resume_checks',JSON.stringify(resumeChecks)); renderResumePage(); showToast(resumeChecks[i].done?'✅ Checked!':'Unchecked'); }

// ══════════════════════════════
//  INTERVIEW
// ══════════════════════════════
const IQ = [
  {q:'Tell me about yourself',cat:'HR'},
  {q:'Why do you want this job?',cat:'HR'},
  {q:'What are your strengths and weaknesses?',cat:'HR'},
  {q:'Where do you see yourself in 5 years?',cat:'HR'},
  {q:'Why should we hire you?',cat:'HR'},
  {q:'Describe a challenging project you worked on',cat:'Behavioural'},
  {q:'How do you handle tight deadlines?',cat:'Behavioural'},
  {q:'Give an example of teamwork',cat:'Behavioural'},
  {q:'Explain OOP concepts',cat:'Technical'},
  {q:'What is the difference between SQL and NoSQL?',cat:'Technical'},
  {q:'What is time complexity? Explain Big O',cat:'Technical'},
  {q:'Explain REST API basics',cat:'Technical'},
  {q:'What is version control / Git?',cat:'Technical'},
  {q:'Describe your final year project',cat:'Technical'},
  {q:'What do you know about our company?',cat:'Research'},
];
function renderInterviewPage(){
  document.getElementById('interview-list').innerHTML = IQ.map((q,i)=>{
    const answered = !!savedAnswers[q.q];
    const catColor = q.cat==='HR'?'var(--accent)':q.cat==='Behavioural'?'var(--accent3)':q.cat==='Technical'?'var(--purple)':'var(--accent2)';
    return `<div class="checklist-item ${answered?'done':''}" onclick="setPracticeQ('${q.q.replace(/'/g,"\\'")}')">
      <div class="cl-check" style="border-color:${catColor}">${answered?'✓':''}</div>
      <span class="cl-text">${q.q}</span>
      <span class="cl-badge" style="background:${catColor}22;color:${catColor}">${q.cat}</span>
    </div>`;
  }).join('');
}
function setPracticeQ(q){ currentQ=q; document.getElementById('practice-q').textContent='Q: '+q; document.getElementById('practice-ans').value=savedAnswers[q]||''; showSavedAns(); }
function saveAnswer(){ if(!currentQ) return; savedAnswers[currentQ]=document.getElementById('practice-ans').value; save(); showToast('💾 Answer saved!'); renderInterviewPage(); showSavedAns(); }
function showSavedAns(){ const el=document.getElementById('saved-ans'); el.innerHTML=savedAnswers[currentQ]?`<div style="background:var(--accent2-light);border:1px solid #d1fae5;border-radius:9px;padding:10px 12px;font-size:12px;color:var(--accent2)">✅ Answer saved</div>`:''; }

// ══════════════════════════════
//  NOTES + TASKS
// ══════════════════════════════
function renderNotesPage(){
  const nl=document.getElementById('notes-list');
  nl.innerHTML=notes.length?notes.slice().reverse().map(n=>`
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:11px;color:var(--muted)">${n.date}</span>
        <button class="del-btn" onclick="delNote(${n.id})" style="font-size:14px">×</button>
      </div>
      <div style="font-size:13px;white-space:pre-wrap">${n.text}</div>
    </div>`).join('')
    :`<div class="empty"><div class="empty-icon">📝</div>No notes yet. Click "+ Note"</div>`;
  renderTasksList();
}
function addNote(){
  const text=prompt('Write your note:'); if(!text) return;
  notes.push({id:Date.now(),text,date:new Date().toLocaleString()}); save(); renderNotesPage(); showToast('📝 Note added!');
}
function delNote(id){ notes=notes.filter(n=>n.id!==id); save(); renderNotesPage(); }
function renderTasksList(){
  const tl=document.getElementById('tasks-list');
  tl.innerHTML=tasks.length?tasks.map(t=>`
    <div class="checklist-item ${t.done?'done':''}" onclick="toggleTask(${t.id})">
      <div class="cl-check">${t.done?'✓':''}</div>
      <span class="cl-text">${t.text}</span>
      <button class="del-btn" onclick="delTask(event,${t.id})">×</button>
    </div>`).join('')
    :`<div class="empty" style="padding:20px">No tasks yet</div>`;
}
function addTask(){ const v=document.getElementById('task-input').value.trim(); if(!v) return; tasks.push({id:Date.now(),text:v,done:false}); save(); document.getElementById('task-input').value=''; renderTasksList(); if(currentPage==='dashboard') renderDashTasks(); }
function toggleTask(id){ const t=tasks.find(x=>x.id===id); if(t){ t.done=!t.done; save(); renderTasksList(); if(currentPage==='dashboard') renderDashTasks(); } }
function delTask(e,id){ e.stopPropagation(); tasks=tasks.filter(t=>t.id!==id); save(); renderTasksList(); }

// ══════════════════════════════
//  GOALS
// ══════════════════════════════
const PLAN = [
  {d:'Week 1', t:'Polish resume, create LinkedIn, apply to 10+ roles'},
  {d:'Week 2', t:'LeetCode easy problems daily, research companies'},
  {d:'Week 3', t:'Mock interviews, cold outreach to employees on LinkedIn'},
  {d:'Week 4', t:'Follow up applications, prepare STAR answers'},
  {d:'Month 2', t:'Expand search, attend job fairs / hackathons'},
];
function renderGoalsPage(){
  document.getElementById('goals-list').innerHTML=goals.length?goals.map(g=>{
    const days=Math.ceil((new Date(g.date)-new Date())/(1000*60*60*24));
    const catColor=g.cat==='Career'?'var(--accent)':g.cat==='Learning'?'var(--purple)':g.cat==='Health'?'var(--accent2)':'var(--accent3)';
    return `<div class="habit-row ${g.done?'done':''}" onclick="toggleGoal(${g.id})" style="animation:none">
      <div class="habit-check">${g.done?'✓':''}</div>
      <div class="habit-info">
        <div class="habit-title">${g.name}</div>
        <div class="habit-meta">${g.cat} · Due ${g.date} · <span style="color:${days<0?'var(--danger)':'var(--muted)'}">${days<0?'Overdue':days+' days left'}</span></div>
      </div>
      <button class="del-btn" onclick="delGoal(event,${g.id})">×</button>
    </div>`;
  }).join('') : `<div class="empty"><div class="empty-icon">🏆</div>Set your first goal!</div>`;
  document.getElementById('plan-list').innerHTML=PLAN.map(p=>`
    <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:12px">
      <div style="font-size:12px;font-weight:700;color:var(--accent);min-width:60px">${p.d}</div>
      <div style="font-size:13px">${p.t}</div>
    </div>`).join('');
}
function openGoalModal(){ document.getElementById('g-date').value=new Date(Date.now()+30*86400000).toISOString().split('T')[0]; document.getElementById('goalModal').classList.add('open'); }
function saveGoal(){ const name=document.getElementById('g-name').value.trim(); if(!name) return; goals.push({id:Date.now(),name,date:document.getElementById('g-date').value,cat:document.getElementById('g-cat').value,done:false}); save(); closeModal('goalModal'); renderGoalsPage(); showToast('🏆 Goal added!'); document.getElementById('g-name').value=''; }
function toggleGoal(id){ const g=goals.find(x=>x.id===id); if(g){ g.done=!g.done; save(); renderGoalsPage(); showToast(g.done?'🎉 Goal achieved!':'Goal reopened'); } }
function delGoal(e,id){ e.stopPropagation(); goals=goals.filter(g=>g.id!==id); save(); renderGoalsPage(); }

// ══════════════════════════════
//  POMODORO
// ══════════════════════════════
const POMO_MODES = { focus:25*60, short:5*60, long:15*60 };
function setPomoMode(m,el){ pomoMode=m; pomoSeconds=POMO_MODES[m]; pomoTotal=POMO_MODES[m]; resetPomo(); document.querySelectorAll('.pomo-btn-mode').forEach(b=>b.classList.remove('active')); el.classList.add('active'); document.getElementById('pomo-phase-label').textContent=m==='focus'?'Focus':m==='short'?'Short Break':'Long Break'; }
function togglePomo(){
  if(pomoRunning){ clearInterval(pomoInterval); pomoRunning=false; document.getElementById('pomo-btn').textContent='▶ Resume'; }
  else { pomoRunning=true; document.getElementById('pomo-btn').textContent='⏸ Pause'; pomoInterval=setInterval(tickPomo,1000); }
}
function tickPomo(){
  if(pomoSeconds<=0){ clearInterval(pomoInterval); pomoRunning=false; document.getElementById('pomo-btn').textContent='▶ Start';
    if(pomoMode==='focus'){ pomoSessions.count++; pomoSessions.mins+=25; const task=document.getElementById('focus-task').value||'Focus session'; pomoSessions.log.unshift({t:task,at:new Date().toLocaleTimeString()}); save(); updatePomoStats(); showToast('🎉 Focus session done! +25 mins'); }
    pomoSeconds=pomoTotal; updatePomoDisplay(); return;
  }
  pomoSeconds--; updatePomoDisplay();
}
function updatePomoDisplay(){
  const m=Math.floor(pomoSeconds/60), s=pomoSeconds%60;
  document.getElementById('pomo-display').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  const circ=345.4, offset=circ*(1-pomoSeconds/pomoTotal);
  const ring=document.getElementById('pomo-ring');
  ring.style.strokeDashoffset=circ-offset;
  ring.style.stroke=pomoMode==='focus'?'var(--accent)':pomoMode==='short'?'var(--accent2)':'var(--accent3)';
}
function resetPomo(){ clearInterval(pomoInterval); pomoRunning=false; pomoSeconds=POMO_MODES[pomoMode]||25*60; pomoTotal=pomoSeconds; document.getElementById('pomo-btn').textContent='▶ Start'; updatePomoDisplay(); }
function updatePomoStats(){
  document.getElementById('pomo-count').textContent=pomoSessions.count;
  document.getElementById('pomo-mins').textContent=pomoSessions.mins;
  const log=document.getElementById('pomo-log');
  log.innerHTML=pomoSessions.log.slice(0,8).map(l=>`
    <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">
      <span style="font-size:15px">🎯</span>
      <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.t}</div><div style="font-size:10px;color:var(--muted)">${l.at}</div></div>
      <span style="font-size:11px;font-weight:700;color:var(--accent2)">25m</span>
    </div>`).join('') || `<div class="empty" style="padding:20px">No sessions yet</div>`;
}

// ══════════════════════════════
//  HELPERS
// ══════════════════════════════
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function showToast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2300); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sOverlay').classList.toggle('open'); }
function closeSidebar(){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('sOverlay').classList.remove('open'); }
document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{ if(e.target===o) o.classList.remove('open'); }));

// ══════════════════════════════
//  BOOT
// ══════════════════════════════
document.getElementById('topbar-cta').style.display='none'; // hide on dashboard
updateKPIs();
renderDashboard();
updatePomoStats();
updatePomoDisplay();

// ===== PWA INLINE SETUP =====
(function() {
  const ICON192 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAADtElEQVR4nO3dPY5cRRSA0RrkJTghcmRnxLAJYjISexs4IWEHJE4I2QkxZM4cgWRHbMAkHmkYWSPPz6uqN985kiPL7lL3/d59PWr1XDx/+f7jgKivVh8AVhIAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZD2ZPUB7urtm6fPVp+B/3vx6sO71We4rYuzfC+QgT+fMwSxfQAG//x2DmHbAAz+47NjCNsFYPAfv51C2OqnQIa/YafXeZsAdnpSON4ur/fyW6BdngjWWXlLtHQDGH7GWDsHywIw/Fy1ah62eQ8AKywJwNWfz1kxF9MDMPzcZPZ8TA3A8PMlZs6J9wCkTQvA1Z/bmDUvNgBpUwJw9ecuZsyNDUDa4QG4+nMfR8+PDUCaAEgTAGmHBuD+n4dw5BzZAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKSd8Rdlfz3G+GP1IW7h1zHGLzf8/c9jjB8nnWWl78cYf64+xHU2AGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApJ3xs0AP4Zsxxr+rD/HJT5/+PKTfxxjf3ePfvx5j/PZAZ9maDUCaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGnVzwL9NeEx/hljfDvhcbgHG4A0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANKqnwXa6XuBWMgGIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApJ3xqxH/HmM8W32Izf2w+gBnYQOQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBEDaoQG8ePXh3ZH/Pw1HzpENQJoASBMAaYcH4H0A93H0/NgApE0JwBbgLmbMjQ1A2rQAbAFuY9a82ACkTQ3AFuBLzJyT6RtABNxk9nwsuQUSAZ+zYi68ByBtWQC2AFetmoelG0AEjLF2Di6ev3z/cdWDX/X2zVO/9ytmhwvgNu8BdngymGeX13ubAMbY50nhWDu9ztvcAl3nlujx2WnwL20bwCUhnN+Og39p+wAuCeF8dh78S6cJ4DpB7OcMA3/daQOAh7DVT4FgNgGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEj7DwTlr2AlJd8qAAAAAElFTkSuQmCC';
  const ICON512 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAALVUlEQVR4nO3dva0e1xVA0UvjlaDAgANGlCPHBlyDu6BCqwU3oVSJWpAzF2DAsSMrU0xFboAOSOA9ko/k9zMzd2b2WgBT4gYH52zMB4IvXr1+83YAACm/m/0AAGB7AgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIepj9AOb75cdvXs5+A7C9b7/77dfZb2CeF69ev3k7+xGsz5EHriEOzk8AnJSDDyxJEJyPADgRRx/Yghg4BwFwcI4+MJMYOC4BcECOPrBHYuBYBMCBOPzAEQiBYxAAB+DwA0ckBPZNAOyYww+cgRDYJwGwQw4/cEZCYF8EwI44/ECBENgHAbADDj9QJATm8p8BTeb4A1X231y+AExi8AEe+RqwPV8AJnD8AT5kL25PAGzMkAM8z37clp8ANmKwAS7nJ4H1+QKwAccf4Dr25voEwMoMMcBt7M91CYAVGV6A+9ij6xEAKzG0AMuwT9chAFZgWAGWZa8uTwAszJACrMN+XZYAWJDhBFiXPbscAbAQQwmwDft2GQJgAYYRYFv27v0EwJ0MIcAc9u99BMAdDB/AXPbw7QTAjQwdwD7Yx7cRADcwbAD7Yi9fTwAAQJAAuJLKBNgn+/k6AuAKhgtg3+zpywmACxkqgGOwry8jAAAgSABcQE0CHIu9/XUC4CsMEcAx2d9fJgAAIEgAfIF6BDg2e/zzBAAABAmAz1CNAOdgnz9PAABAkAB4hloEOBd7/VMCAACCBMBHVCLAOdnvHxIAABAkAJ5QhwDnZs8/EgAAECQA3lOFAA32/TsCAACCBAAABAmA4XMQQI29LwAAIEkAAEBQPgB8BgJoqu//fAAAQJEAAICgdADUP/8A1JXvQDoAAKBKAABAkAAAgKBsAJR/9wHgUfUeZAMAAMoEAAAECQAACBIAABAkAAAgSAAAQFAyAKr/5AOA5xXvQjIAAKBOAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABA0MPsB7C6f48xfj/7ESzmP2OMvy78d/5rjPGHhf9O+Ng/xhh/m/0IHvkCAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABA0MPsB8AT348xfp79iKC/zH7Aiv44xvjn7Edc4U9jjP/NfgQNvgAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAg6GH2A+CJH97/4dHfxxg/zX4EcD6+AABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAEPQw+wHwxPdjjJ9nPwKgwBcAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEEPsx/A6v48+wEw0X/HGC9nPwL2yBcAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAICgZAN9+99uvs98AwH4U70IyAACgTgAAQJAAAIAgAQAAQQIAAIIEAAAEZQOg+E8+APhU9R5kAwAAygQAAAQJAAAISgdA9XcfAN4p34F0AABAlQAAgKB8AJQ//wCU1fd/PgAAoEgAAECQABg+AwHU2PsCAACSBAAABAmA93wOAmiw798RAAAQJACeUIUA52bPPxIAABAkAD6iDgHOyX7/kAAAgCAB8AyVCHAu9vqnBAAABAmAz1CLAOdgnz9PAABAkAD4AtUIcGz2+OcJAAAIEgBfoR4Bjsn+/jIBcAFDBHAs9vbXCQAACBIAF1KTAMdgX19GAFzBUAHsmz19OQFwJcMFsE/283UEAAAECYAbqEyAfbGXrycAbmTYAPbBPr6NALiDoQOYyx6+nQC4k+EDmMP+vY8AWIAhBNiWvXs/AbAQwwiwDft2GQJgQYYSYF327HIEwMIMJ8A67NdlCYAVGFKAZdmryxMAKzGsAMuwT9chAFZkaAHuY4+uRwCszPAC3Mb+XJcA2IAhBriOvbm+F69ev3k7+xElv/z4zcvZbwDYK4d/O74AbMxwAzzPftyWAJjAkAN8yF7cnp8AJvOTAFDm8M/jC8Bkhh+osv/m8gVgR3wNAAoc/n0QADskBIAzcvj3RQDsmBAAzsDh3ycBcABCADgih3/fBMCBCAHgCBz+YxAAByQEgD1y+I9FABycGABmcvSPSwCciBgAtuDon4MAOCkxACzJ0T8fARAhCIBrOPjnJwAQBxDlyLcJAAAI8p8BAUCQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEH/B9kuwGQpFCFWAAAAAElFTkSuQmCC';

  // Set apple touch icon
  const appleIcon = document.getElementById('apple-icon');
  if (appleIcon) appleIcon.href = ICON192;

  // Set banner icon
  const bannerIcon = document.getElementById('pwa-banner-icon');
  if (bannerIcon) bannerIcon.src = ICON192;

  // Inject manifest as blob
  const manifestData = '{\n  "name": "FreshTrack Pro",\n  "short_name": "FreshTrack",\n  "description": "Career & Habit OS for freshers",\n  "start_url": ".",\n  "display": "standalone",\n  "background_color": "#ffffff",\n  "theme_color": "#2563eb",\n  "orientation": "any",\n  "icons": [\n    {"src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAADtElEQVR4nO3dPY5cRRSA0RrkJTghcmRnxLAJYjISexs4IWEHJE4I2QkxZM4cgWRHbMAkHmkYWSPPz6uqN985kiPL7lL3/d59PWr1XDx/+f7jgKivVh8AVhIAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANIEQJoASBMAaQIgTQCkCYA0AZD2ZPUB7urtm6fPVp+B/3vx6sO71We4rYuzfC+QgT+fMwSxfQAG//x2DmHbAAz+47NjCNsFYPAfv51C2OqnQIa/YafXeZsAdnpSON4ur/fyW6BdngjWWXlLtHQDGH7GWDsHywIw/Fy1ah62eQ8AKywJwNWfz1kxF9MDMPzcZPZ8TA3A8PMlZs6J9wCkTQvA1Z/bmDUvNgBpUwJw9ecuZsyNDUDa4QG4+nMfR8+PDUCaAEgTAGmHBuD+n4dw5BzZAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKQJgDQBkCYA0gRAmgBIEwBpAiBNAKSd8Rdlfz3G+GP1IW7h1zHGLzf8/c9jjB8nnWWl78cYf64+xHU2AGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApJ3xs0AP4Zsxxr+rD/HJT5/+PKTfxxjf3ePfvx5j/PZAZ9maDUCaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGnVzwL9NeEx/hljfDvhcbgHG4A0AZAmANIEQJoASBMAaQIgTQCkCYA0AZAmANKqnwXa6XuBWMgGIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApJ3xqxH/HmM8W32Izf2w+gBnYQOQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBEDaoQG8ePXh3ZH/Pw1HzpENQJoASBMAaYcH4H0A93H0/NgApE0JwBbgLmbMjQ1A2rQAbAFuY9a82ACkTQ3AFuBLzJyT6RtABNxk9nwsuQUSAZ+zYi68ByBtWQC2AFetmoelG0AEjLF2Di6ev3z/cdWDX/X2zVO/9ytmhwvgNu8BdngymGeX13ubAMbY50nhWDu9ztvcAl3nlujx2WnwL20bwCUhnN+Og39p+wAuCeF8dh78S6cJ4DpB7OcMA3/daQOAh7DVT4FgNgGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEgTAGkCIE0ApAmANAGQJgDSBECaAEj7DwTlr2AlJd8qAAAAAElFTkSuQmCC", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},\n    {"src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAALVUlEQVR4nO3dva0e1xVA0UvjlaDAgANGlCPHBlyDu6BCqwU3oVSJWpAzF2DAsSMrU0xFboAOSOA9ko/k9zMzd2b2WgBT4gYH52zMB4IvXr1+83YAACm/m/0AAGB7AgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIepj9AOb75cdvXs5+A7C9b7/77dfZb2CeF69ev3k7+xGsz5EHriEOzk8AnJSDDyxJEJyPADgRRx/Yghg4BwFwcI4+MJMYOC4BcECOPrBHYuBYBMCBOPzAEQiBYxAAB+DwA0ckBPZNAOyYww+cgRDYJwGwQw4/cEZCYF8EwI44/ECBENgHAbADDj9QJATm8p8BTeb4A1X231y+AExi8AEe+RqwPV8AJnD8AT5kL25PAGzMkAM8z37clp8ANmKwAS7nJ4H1+QKwAccf4Dr25voEwMoMMcBt7M91CYAVGV6A+9ij6xEAKzG0AMuwT9chAFZgWAGWZa8uTwAszJACrMN+XZYAWJDhBFiXPbscAbAQQwmwDft2GQJgAYYRYFv27v0EwJ0MIcAc9u99BMAdDB/AXPbw7QTAjQwdwD7Yx7cRADcwbAD7Yi9fTwAAQJAAuJLKBNgn+/k6AuAKhgtg3+zpywmACxkqgGOwry8jAAAgSABcQE0CHIu9/XUC4CsMEcAx2d9fJgAAIEgAfIF6BDg2e/zzBAAABAmAz1CNAOdgnz9PAABAkAB4hloEOBd7/VMCAACCBMBHVCLAOdnvHxIAABAkAJ5QhwDnZs8/EgAAECQA3lOFAA32/TsCAACCBAAABAmA4XMQQI29LwAAIEkAAEBQPgB8BgJoqu//fAAAQJEAAICgdADUP/8A1JXvQDoAAKBKAABAkAAAgKBsAJR/9wHgUfUeZAMAAMoEAAAECQAACBIAABAkAAAgSAAAQFAyAKr/5AOA5xXvQjIAAKBOAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABA0MPsB7C6f48xfj/7ESzmP2OMvy78d/5rjPGHhf9O+Ng/xhh/m/0IHvkCAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABA0MPsB8AT348xfp79iKC/zH7Aiv44xvjn7Edc4U9jjP/NfgQNvgAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAg6GH2A+CJH97/4dHfxxg/zX4EcD6+AABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAEPQw+wHwxPdjjJ9nPwKgwBcAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEEPsx/A6v48+wEw0X/HGC9nPwL2yBcAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAICgZAN9+99uvs98AwH4U70IyAACgTgAAQJAAAIAgAQAAQQIAAIIEAAAEZQOg+E8+APhU9R5kAwAAygQAAAQJAAAISgdA9XcfAN4p34F0AABAlQAAgKB8AJQ//wCU1fd/PgAAoEgAAECQABg+AwHU2PsCAACSBAAABAmA93wOAmiw798RAAAQJACeUIUA52bPPxIAABAkAD6iDgHOyX7/kAAAgCAB8AyVCHAu9vqnBAAABAmAz1CLAOdgnz9PAABAkAD4AtUIcGz2+OcJAAAIEgBfoR4Bjsn+/jIBcAFDBHAs9vbXCQAACBIAF1KTAMdgX19GAFzBUAHsmz19OQFwJcMFsE/283UEAAAECYAbqEyAfbGXrycAbmTYAPbBPr6NALiDoQOYyx6+nQC4k+EDmMP+vY8AWIAhBNiWvXs/AbAQwwiwDft2GQJgQYYSYF327HIEwMIMJ8A67NdlCYAVGFKAZdmryxMAKzGsAMuwT9chAFZkaAHuY4+uRwCszPAC3Mb+XJcA2IAhBriOvbm+F69ev3k7+xElv/z4zcvZbwDYK4d/O74AbMxwAzzPftyWAJjAkAN8yF7cnp8AJvOTAFDm8M/jC8Bkhh+osv/m8gVgR3wNAAoc/n0QADskBIAzcvj3RQDsmBAAzsDh3ycBcABCADgih3/fBMCBCAHgCBz+YxAAByQEgD1y+I9FABycGABmcvSPSwCciBgAtuDon4MAOCkxACzJ0T8fARAhCIBrOPjnJwAQBxDlyLcJAAAI8p8BAUCQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEH/B9kuwGQpFCFWAAAAAElFTkSuQmCC", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}\n  ]\n}';
  // Replace data URI placeholders in manifest
  const manifestObj = JSON.parse(manifestData);
  manifestObj.icons[0].src = ICON192;
  manifestObj.icons[1].src = ICON512;
  const blob = new Blob([JSON.stringify(manifestObj)], {type:'application/manifest+json'});
  const manifestURL = URL.createObjectURL(blob);
  const manifestEl = document.getElementById('pwa-manifest');
  if (manifestEl) manifestEl.href = manifestURL;

  // Register inline service worker
  if ('serviceWorker' in navigator) {
    const swCode = "\nconst CACHE_NAME = 'freshtrack-v2';\nself.addEventListener('install', e => {\n  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['./'])));\n  self.skipWaiting();\n});\nself.addEventListener('activate', e => {\n  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));\n  self.clients.claim();\n});\nself.addEventListener('fetch', e => {\n  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));\n});\n";
    const swBlob = new Blob([swCode], {type:'text/javascript'});
    const swURL = URL.createObjectURL(swBlob);
    navigator.serviceWorker.register(swURL, {scope: './'} )
      .then(r => console.log('✅ FreshTrack SW ready'))
      .catch(e => console.log('SW note:', e));
  }
})();

// ===== PWA Install Prompt =====
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('pwa-banner');
  if (banner && !localStorage.getItem('pwa-dismissed')) {
    setTimeout(() => { banner.style.display = 'flex'; }, 2500);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('pwa-install-btn');
  const dismissBtn = document.getElementById('pwa-dismiss-btn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
      document.getElementById('pwa-banner').style.display = 'none';
    });
  }
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      document.getElementById('pwa-banner').style.display = 'none';
      localStorage.setItem('pwa-dismissed', '1');
    });
  }
});

// ===== Export / Import =====
function toggleSyncMenu() {
  const m = document.getElementById('sync-menu');
  m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', e => {
  const fab = document.getElementById('sync-fab');
  if (fab && !fab.contains(e.target)) {
    const m = document.getElementById('sync-menu');
    if (m) m.style.display = 'none';
  }
});

function exportData() {
  const keys = ['ft_habits','ft_jobs','ft_skills','ft_tasks','ft_goals','ft_notes','ft_week','ft_streak','ft_pomo','ft_answers','ft_resume_checks'];
  const data = {};
  keys.forEach(k => { const v = localStorage.getItem(k); if(v) data[k] = JSON.parse(v); });
  data._exported = new Date().toISOString();
  data._device = navigator.userAgent.includes('Android') ? 'Android' : 'Desktop';
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'freshtrack-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click(); URL.revokeObjectURL(url);
  document.getElementById('sync-menu').style.display = 'none';
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      const keys = ['ft_habits','ft_jobs','ft_skills','ft_tasks','ft_goals','ft_notes','ft_week','ft_streak','ft_pomo','ft_answers','ft_resume_checks'];
      let count = 0;
      keys.forEach(k => { if(data[k] !== undefined) { localStorage.setItem(k, JSON.stringify(data[k])); count++; } });
      alert('✅ Imported ' + count + ' sections! Reloading...');
      location.reload();
    } catch(err) { alert('❌ Invalid file. Use a FreshTrack export JSON.'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

