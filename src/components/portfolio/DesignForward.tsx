'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GitFork, Link, Mail, ArrowRight, Sparkles, Zap, Code2, Rocket } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function DesignForward() {
  const { state } = useApp();
  const profile = state.optimization?.optimizedProfile || state.profile;

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      {/* Hero with gradient */}
      <motion.section
        className="relative min-h-[80vh] flex items-center justify-center px-6"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient-hero)' }} />
        <div className="relative text-center max-w-4xl">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
            <Sparkles size={14} /> Available for opportunities
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {profile.personal.fullName.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? '' : ''} style={i === 1 ? { color: 'var(--color-primary)' } : {}}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-muted)' }}>
            {profile.personal.title}
          </motion.p>
          <motion.div variants={fadeUp} className="flex justify-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-transform hover:scale-105"
              style={{ background: 'var(--gradient-button)' }}
            >
              View Projects <ArrowRight size={16} />
            </a>
            <a
              href={`mailto:${profile.personal.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium border transition-transform hover:scale-105"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              Contact Me
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        className="max-w-5xl mx-auto px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Years Experience', value: '7+', icon: Zap },
            { label: 'Projects Built', value: `${profile.projects.length * 10}+`, icon: Code2 },
            { label: 'Technologies', value: `${profile.skills.reduce((a, c) => a + c.skills.length, 0)}`, icon: Rocket },
            { label: 'Certifications', value: `${profile.certifications.length}`, icon: Sparkles },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="text-center p-6 rounded-2xl border"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              <stat.icon size={24} className="mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Skills with animated tags */}
      <motion.section
        className="max-w-5xl mx-auto px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          Technical Arsenal
        </motion.h2>
        <div className="space-y-6">
          {profile.skills.map((cat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, si) => (
                  <motion.span
                    key={si}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 text-sm rounded-xl border cursor-default transition-shadow"
                    style={{
                      borderColor: 'var(--color-border)',
                      background: 'var(--color-surface)',
                      boxShadow: 'var(--shadow)',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        className="max-w-5xl mx-auto px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Journey
        </motion.h2>
        <div className="space-y-6">
          {profile.experience.map((exp, i) => (
            <motion.div
              key={exp.id}
              variants={fadeUp}
              whileHover={{ x: 8 }}
              className="p-6 rounded-2xl border"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold">{exp.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-primary)' }}>{exp.company}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--color-primary)', color: 'white', opacity: 0.9 }}>
                  {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
              </div>
              <ul className="space-y-2">
                {exp.bullets.map((b, bi) => (
                  <li key={bi} className="text-sm flex items-start gap-2" style={{ color: 'var(--color-text-muted)' }}>
                    <span style={{ color: 'var(--color-primary)' }}>&#9656;</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section
        id="projects"
        className="max-w-5xl mx-auto px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Featured Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.projects.map((proj) => (
            <motion.div
              key={proj.id}
              variants={scaleIn}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border overflow-hidden relative"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'var(--gradient-button)' }} />
              <h3 className="text-lg font-bold mb-2">{proj.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.technologies.map((t, i) => (
                  <Badge key={i}>{t}</Badge>
                ))}
              </div>
              <ul className="space-y-1">
                {proj.highlights.map((h, i) => (
                  <li key={i} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{h}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        className="max-w-5xl mx-auto px-6 py-16 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.h2 variants={fadeUp} className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Let&apos;s Build Something Amazing
        </motion.h2>
        <motion.p variants={fadeUp} className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          {profile.personal.email} | {profile.personal.location}
        </motion.p>
        <motion.div variants={fadeUp} className="flex justify-center gap-4">
          <a href={`mailto:${profile.personal.email}`} className="p-3 rounded-full border" style={{ borderColor: 'var(--color-border)' }}>
            <Mail size={20} style={{ color: 'var(--color-primary)' }} />
          </a>
          <a href={`https://${profile.personal.github}`} className="p-3 rounded-full border" style={{ borderColor: 'var(--color-border)' }}>
            <GitFork size={20} style={{ color: 'var(--color-primary)' }} />
          </a>
          <a href={`https://${profile.personal.linkedin}`} className="p-3 rounded-full border" style={{ borderColor: 'var(--color-border)' }}>
            <Link size={20} style={{ color: 'var(--color-primary)' }} />
          </a>
        </motion.div>
      </motion.section>
    </div>
  );
}
