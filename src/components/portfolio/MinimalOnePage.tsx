'use client';

import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import { GitFork, Link, Mail, MapPin, ExternalLink, ArrowDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function MinimalOnePage() {
  const { state } = useApp();
  const profile = state.optimization?.optimizedProfile || state.profile;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-text)' }}>
      {/* Hero */}
      <motion.section
        className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p variants={fadeUp} className="text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>
          {profile.personal.title}
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          {profile.personal.fullName}
        </motion.h1>
        <motion.p variants={fadeUp} className="max-w-2xl text-lg leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
          {profile.summary.split('.').slice(0, 2).join('.') + '.'}
        </motion.p>
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <a href={`mailto:${profile.personal.email}`} className="p-3 rounded-full border transition-colors hover:opacity-80" style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
            <Mail size={20} />
          </a>
          <a href={`https://${profile.personal.github}`} className="p-3 rounded-full border transition-colors hover:opacity-80" style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
            <GitFork size={20} />
          </a>
          <a href={`https://${profile.personal.linkedin}`} className="p-3 rounded-full border transition-colors hover:opacity-80" style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
            <Link size={20} />
          </a>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-12 animate-bounce">
          <ArrowDown size={24} style={{ color: 'var(--color-text-muted)' }} />
        </motion.div>
      </motion.section>

      {/* Skills */}
      <motion.section
        className="max-w-4xl mx-auto px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Skills & Technologies
        </motion.h2>
        <div className="space-y-6">
          {profile.skills.map((cat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, si) => (
                  <span
                    key={si}
                    className="px-3 py-1.5 text-sm rounded-full border transition-colors"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                      background: 'var(--color-surface)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        className="max-w-4xl mx-auto px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Experience
        </motion.h2>
        <div className="space-y-8">
          {profile.experience.map((exp, i) => (
            <motion.div key={exp.id} variants={fadeUp} className="relative pl-6 border-l-2" style={{ borderColor: 'var(--color-border)' }}>
              <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} />
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{exp.title}</h3>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>at {exp.company}</span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
                {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate} | {exp.location}
              </p>
              <ul className="space-y-1.5">
                {exp.bullets.map((bullet, bi) => (
                  <li key={bi} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section
        className="max-w-4xl mx-auto px-6 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.projects.map((proj) => (
            <motion.div
              key={proj.id}
              variants={fadeUp}
              className="p-5 rounded-xl border transition-all hover:shadow-lg"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold">{proj.name}</h3>
                <div className="flex gap-2">
                  {proj.github && (
                    <a href={`https://${proj.github}`} className="hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                      <GitFork size={16} />
                    </a>
                  )}
                  {proj.url && (
                    <a href={proj.url} className="hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
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
        className="max-w-4xl mx-auto px-6 py-16 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Get In Touch
        </motion.h2>
        <motion.p variants={fadeUp} className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
          {profile.personal.email}
        </motion.p>
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <MapPin size={14} />
          {profile.personal.location}
        </motion.div>
      </motion.section>
    </div>
  );
}
