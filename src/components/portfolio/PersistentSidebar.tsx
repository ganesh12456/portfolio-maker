'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GitFork, Link, Mail, MapPin, ExternalLink, User, Briefcase, Code, FolderOpen, MessageSquare } from 'lucide-react';

const sections = [
  { id: 'about', label: 'About', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'contact', label: 'Contact', icon: MessageSquare },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function PersistentSidebar() {
  const { state } = useApp();
  const profile = state.optimization?.optimizedProfile || state.profile;
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 border-r p-6 flex flex-col sticky top-0 h-screen"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
      >
        <div className="mb-8">
          <div
            className="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-xl font-bold"
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            {profile.personal.fullName.split(' ').map((n) => n[0]).join('')}
          </div>
          <h1 className="text-lg font-bold">{profile.personal.fullName}</h1>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{profile.personal.title}</p>
          <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <MapPin size={12} />
            {profile.personal.location}
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                style={{
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--color-text-muted)',
                }}
              >
                <Icon size={16} />
                {section.label}
              </button>
            );
          })}
        </nav>

        <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <a href={`mailto:${profile.personal.email}`} style={{ color: 'var(--color-text-muted)' }} className="hover:opacity-80">
            <Mail size={16} />
          </a>
          <a href={`https://${profile.personal.github}`} style={{ color: 'var(--color-text-muted)' }} className="hover:opacity-80">
            <GitFork size={16} />
          </a>
          <a href={`https://${profile.personal.linkedin}`} style={{ color: 'var(--color-text-muted)' }} className="hover:opacity-80">
            <Link size={16} />
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeSection === 'about' && (
            <motion.div key="about" initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-6">About Me</h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>{profile.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                  <h3 className="text-sm font-semibold mb-2">Education</h3>
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="mb-2">
                      <p className="text-sm font-medium">{edu.degree} in {edu.field}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{edu.institution} | {edu.startDate}-{edu.endDate}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                  <h3 className="text-sm font-semibold mb-2">Certifications</h3>
                  {profile.certifications.map((cert, i) => (
                    <p key={i} className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      {cert.name} - {cert.issuer}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'experience' && (
            <motion.div key="exp" initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-6">Experience</h2>
              <div className="space-y-6">
                {profile.experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'skills' && (
            <motion.div key="skills" initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-6">Skills</h2>
              <div className="space-y-6">
                {profile.skills.map((cat, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
                      {cat.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill, si) => (
                        <span key={si} className="px-3 py-1.5 text-sm rounded-full border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'projects' && (
            <motion.div key="projects" initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-6">Projects</h2>
              <div className="space-y-4">
                {profile.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{proj.name}</h3>
                      <div className="flex gap-2">
                        {proj.github && <a href={`https://${proj.github}`} style={{ color: 'var(--color-text-muted)' }}><GitFork size={16} /></a>}
                        {proj.url && <a href={proj.url} style={{ color: 'var(--color-text-muted)' }}><ExternalLink size={16} /></a>}
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t, i) => <Badge key={i}>{t}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div key="contact" initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-6">Contact</h2>
              <div className="space-y-3">
                <p className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                  <Mail size={16} /> {profile.personal.email}
                </p>
                <p className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                  <MapPin size={16} /> {profile.personal.location}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
