'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GitFork, Link, Mail, MapPin, ExternalLink, Calendar, ArrowLeft, BookOpen, Code, User, Briefcase, Menu, X } from 'lucide-react';

type Page = 'home' | 'about' | 'experience' | 'projects' | 'blog';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MultiPageBlog() {
  const { state } = useApp();
  const profile = state.optimization?.optimizedProfile || state.profile;
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <BookOpen size={16} /> },
    { id: 'about', label: 'About', icon: <User size={16} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Code size={16} /> },
    { id: 'blog', label: 'Blog', icon: <BookOpen size={16} /> },
  ];

  const blogPosts = profile.projects.map((proj, i) => ({
    title: `Building ${proj.name}: A Technical Deep Dive`,
    date: `2024-0${i + 1}`,
    excerpt: proj.description,
    content: proj.highlights.join('\n'),
    tags: proj.technologies,
  }));

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div key="home" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                {profile.personal.fullName}
              </h1>
              <p className="text-xl mb-2" style={{ color: 'var(--color-primary)' }}>{profile.personal.title}</p>
              <p className="max-w-2xl leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {profile.summary.split('.').slice(0, 3).join('.') + '.'}
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                Recent Posts
              </h2>
              <div className="space-y-4">
                {blogPosts.map((post, i) => (
                  <article
                    key={i}
                    onClick={() => { setSelectedPost(i); setCurrentPage('blog'); }}
                    className="p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{post.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag, ti) => <Badge key={ti}>{tag}</Badge>)}
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      case 'about':
        return (
          <motion.div key="about" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h1 variants={fadeUp} className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>About</motion.h1>
            <motion.div variants={fadeUp} className="prose max-w-none">
              <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>{profile.summary}</p>

              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-4 mb-8">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                    <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{edu.startDate} - {edu.endDate}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4">Certifications</h2>
              <ul className="space-y-2">
                {profile.certifications.map((cert, i) => (
                  <li key={i} className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div key="exp" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h1 variants={fadeUp} className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Experience</motion.h1>
            <div className="space-y-6">
              {profile.experience.map((exp) => (
                <motion.div key={exp.id} variants={fadeUp} className="p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{exp.company} | {exp.location}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--color-primary)', color: 'white', opacity: 0.9 }}>
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{b}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div key="projects" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h1 variants={fadeUp} className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Projects</motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((proj) => (
                <motion.div key={proj.id} variants={fadeUp} className="p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{proj.name}</h3>
                    <div className="flex gap-2">
                      {proj.github && <a href={`https://${proj.github}`} style={{ color: 'var(--color-text-muted)' }}><GitFork size={16} /></a>}
                      {proj.url && <a href={proj.url} style={{ color: 'var(--color-text-muted)' }}><ExternalLink size={16} /></a>}
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.technologies.map((t, i) => <Badge key={i}>{t}</Badge>)}
                  </div>
                  <ul className="space-y-1">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{h}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'blog':
        return (
          <motion.div key="blog" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {selectedPost !== null ? (
              <motion.article variants={fadeUp}>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-sm mb-6 cursor-pointer hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <ArrowLeft size={14} /> Back to posts
                </button>
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {blogPosts[selectedPost].title}
                </h1>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{blogPosts[selectedPost].date}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {blogPosts[selectedPost].tags.map((tag, i) => <Badge key={i}>{tag}</Badge>)}
                </div>
                <div className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-muted)' }}>
                  {blogPosts[selectedPost].content}
                </div>
              </motion.article>
            ) : (
              <motion.div variants={fadeUp}>
                <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Blog</h1>
                <div className="space-y-4">
                  {blogPosts.map((post, i) => (
                    <article
                      key={i}
                      onClick={() => setSelectedPost(i)}
                      className="p-5 rounded-xl border cursor-pointer transition-all hover:shadow-md"
                      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{post.date}</span>
                      </div>
                      <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                      <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag, ti) => <Badge key={ti}>{tag}</Badge>)}
                      </div>
                    </article>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      {/* Top navigation */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ borderColor: 'var(--color-border)', background: 'var(--color-background)', opacity: 0.95 }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => { setCurrentPage('home'); setSelectedPost(null); }} className="text-lg font-bold cursor-pointer" style={{ fontFamily: 'var(--font-heading)' }}>
            {profile.personal.fullName.split(' ')[0]}<span style={{ color: 'var(--color-primary)' }}>.dev</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); if (item.id !== 'blog') setSelectedPost(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer"
                style={{
                  color: currentPage === item.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  background: currentPage === item.id ? 'var(--color-surface)' : 'transparent',
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden cursor-pointer" style={{ color: 'var(--color-text)' }}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-2" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg cursor-pointer"
                style={{ color: currentPage === item.id ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 px-6 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
        <div className="flex justify-center gap-4 mb-4">
          <a href={`mailto:${profile.personal.email}`}><Mail size={16} /></a>
          <a href={`https://${profile.personal.github}`}><GitFork size={16} /></a>
          <a href={`https://${profile.personal.linkedin}`}><Link size={16} /></a>
        </div>
        <p className="flex items-center justify-center gap-1">
          <MapPin size={12} /> {profile.personal.location}
        </p>
      </footer>
    </div>
  );
}
