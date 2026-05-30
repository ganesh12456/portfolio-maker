'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Input, Textarea, Button, Card } from '@/components/ui';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export function ProfileForm() {
  const { state, dispatch } = useApp();
  const profile = state.profile;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
    projects: false,
  });

  const toggleSection = (key: string) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const updatePersonal = (field: string, value: string) =>
    dispatch({ type: 'UPDATE_PERSONAL', payload: { [field]: value } });

  const updateSummary = (value: string) =>
    dispatch({ type: 'SET_PROFILE', payload: { ...profile, summary: value } });

  return (
    <div className="space-y-4">
      {/* Personal Info */}
      <Card className="!p-0">
        <button
          onClick={() => toggleSection('personal')}
          className="flex items-center justify-between w-full p-4 cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Personal Information</h3>
          {openSections.personal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.personal && (
          <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Full Name" value={profile.personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} />
            <Input label="Title" value={profile.personal.title} onChange={(e) => updatePersonal('title', e.target.value)} />
            <Input label="Email" type="email" value={profile.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} />
            <Input label="Phone" value={profile.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
            <Input label="Location" value={profile.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} />
            <Input label="LinkedIn" value={profile.personal.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
            <Input label="GitHub" value={profile.personal.github} onChange={(e) => updatePersonal('github', e.target.value)} />
            <Input label="Website" value={profile.personal.website} onChange={(e) => updatePersonal('website', e.target.value)} />
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card className="!p-0">
        <button
          onClick={() => toggleSection('summary')}
          className="flex items-center justify-between w-full p-4 cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Professional Summary</h3>
          {openSections.summary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.summary && (
          <div className="px-4 pb-4">
            <Textarea
              value={profile.summary}
              onChange={(e) => updateSummary(e.target.value)}
              rows={4}
              placeholder="A brief professional summary highlighting your key strengths and career goals..."
            />
          </div>
        )}
      </Card>

      {/* Experience */}
      <Card className="!p-0">
        <button
          onClick={() => toggleSection('experience')}
          className="flex items-center justify-between w-full p-4 cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Experience ({profile.experience.length})</h3>
          {openSections.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.experience && (
          <div className="px-4 pb-4 space-y-3">
            {profile.experience.map((exp, i) => (
              <Card key={exp.id} className="!p-3 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input label="Company" value={exp.company} onChange={(e) => {
                    const updated = [...profile.experience];
                    updated[i] = { ...exp, company: e.target.value };
                    dispatch({ type: 'SET_PROFILE', payload: { ...profile, experience: updated } });
                  }} />
                  <Input label="Title" value={exp.title} onChange={(e) => {
                    const updated = [...profile.experience];
                    updated[i] = { ...exp, title: e.target.value };
                    dispatch({ type: 'SET_PROFILE', payload: { ...profile, experience: updated } });
                  }} />
                  <Input label="Start Date" value={exp.startDate} onChange={(e) => {
                    const updated = [...profile.experience];
                    updated[i] = { ...exp, startDate: e.target.value };
                    dispatch({ type: 'SET_PROFILE', payload: { ...profile, experience: updated } });
                  }} />
                  <Input label="End Date" value={exp.endDate || ''} placeholder="Present" onChange={(e) => {
                    const updated = [...profile.experience];
                    updated[i] = { ...exp, endDate: e.target.value || null };
                    dispatch({ type: 'SET_PROFILE', payload: { ...profile, experience: updated } });
                  }} />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-text)]">Bullets</label>
                  {exp.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex gap-2 mt-1">
                      <input
                        className="flex-1 px-3 py-1.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-[var(--radius)] outline-none focus:border-[var(--color-primary)]"
                        value={bullet}
                        onChange={(e) => {
                          const updated = [...profile.experience];
                          const newBullets = [...exp.bullets];
                          newBullets[bi] = e.target.value;
                          updated[i] = { ...exp, bullets: newBullets };
                          dispatch({ type: 'SET_PROFILE', payload: { ...profile, experience: updated } });
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = [...profile.experience];
                          const newBullets = exp.bullets.filter((_, idx) => idx !== bi);
                          updated[i] = { ...exp, bullets: newBullets };
                          dispatch({ type: 'SET_PROFILE', payload: { ...profile, experience: updated } });
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const updated = [...profile.experience];
                      updated[i] = { ...exp, bullets: [...exp.bullets, ''] };
                      dispatch({ type: 'SET_PROFILE', payload: { ...profile, experience: updated } });
                    }}
                  >
                    <Plus size={14} /> Add Bullet
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Skills */}
      <Card className="!p-0">
        <button
          onClick={() => toggleSection('skills')}
          className="flex items-center justify-between w-full p-4 cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Skills ({profile.skills.length} categories)</h3>
          {openSections.skills ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSections.skills && (
          <div className="px-4 pb-4 space-y-3">
            {profile.skills.map((cat, i) => (
              <Card key={i} className="!p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    label="Category"
                    value={cat.category}
                    onChange={(e) => {
                      const updated = [...profile.skills];
                      updated[i] = { ...cat, category: e.target.value };
                      dispatch({ type: 'SET_PROFILE', payload: { ...profile, skills: updated } });
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, si) => (
                    <span key={si} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">
                      {skill}
                      <button
                        onClick={() => {
                          const updated = [...profile.skills];
                          updated[i] = { ...cat, skills: cat.skills.filter((_, idx) => idx !== si) };
                          dispatch({ type: 'SET_PROFILE', payload: { ...profile, skills: updated } });
                        }}
                        className="cursor-pointer hover:text-[var(--color-error)]"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
