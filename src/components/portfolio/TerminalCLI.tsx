'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';

function TypingText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse">_</span>}
    </span>
  );
}

export function TerminalCLI() {
  const { state } = useApp();
  const profile = state.optimization?.optimizedProfile || state.profile;
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, () => string> = {
    help: () => [
      'Available commands:',
      '  about      - View professional summary',
      '  skills     - List technical skills',
      '  experience - Show work experience',
      '  projects   - List featured projects',
      '  education  - Show education background',
      '  contact    - Display contact information',
      '  clear      - Clear terminal',
      '  help       - Show this help message',
    ].join('\n'),

    about: () => [
      `> ${profile.personal.fullName}`,
      `> ${profile.personal.title}`,
      `> ${profile.personal.location}`,
      '',
      profile.summary,
    ].join('\n'),

    skills: () =>
      profile.skills
        .map((cat) => [
          `\n[${cat.category.toUpperCase()}] (${cat.proficiency})`,
          cat.skills.map((s) => `  ├─ ${s}`).join('\n'),
        ].join('\n'))
        .join('\n'),

    experience: () =>
      profile.experience
        .map(
          (exp) =>
            `\n> ${exp.title} @ ${exp.company}\n  ${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate} | ${exp.location}\n${exp.bullets.map((b) => `  • ${b}`).join('\n')}`
        )
        .join('\n'),

    projects: () =>
      profile.projects
        .map(
          (proj) =>
            `\n> ${proj.name}\n  ${proj.description}\n  Tech: ${proj.technologies.join(', ')}\n${proj.highlights.map((h) => `  ★ ${h}`).join('\n')}`
        )
        .join('\n'),

    education: () =>
      profile.education
        .map(
          (edu) =>
            `\n> ${edu.degree} in ${edu.field}\n  ${edu.institution} | ${edu.startDate}-${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`
        )
        .join('\n'),

    contact: () =>
      [
        `Email:    ${profile.personal.email}`,
        `Phone:    ${profile.personal.phone}`,
        `GitHub:   ${profile.personal.github}`,
        `LinkedIn: ${profile.personal.linkedin}`,
        `Website:  ${profile.personal.website}`,
        `Location: ${profile.personal.location}`,
      ].join('\n'),

    clear: () => '__CLEAR__',
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const handler = commands[trimmed];
    if (handler) {
      const output = handler();
      if (output === '__CLEAR__') {
        setHistory([]);
        return;
      }
      setHistory((h) => [...h, { cmd: trimmed, output }]);
    } else {
      setHistory((h) => [
        ...h,
        {
          cmd: trimmed,
          output: `Command not found: ${trimmed}. Type 'help' for available commands.`,
        },
      ]);
    }
  };

  useEffect(() => {
    // Show welcome message
    setHistory([
      {
        cmd: 'welcome',
        output: [
          '╔══════════════════════════════════════════════════╗',
          '║          PORTFOLIO ENGINE v1.0.0                ║',
          '║          Terminal Interface                      ║',
          '╚══════════════════════════════════════════════════╝',
          '',
          `Welcome, ${profile.personal.fullName}`,
          `Role: ${profile.personal.title}`,
          '',
          "Type 'help' to see available commands.",
        ].join('\n'),
      },
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8"
      style={{ background: '#0a0a0a' }}
    >
      <div
        className="max-w-4xl mx-auto rounded-lg overflow-hidden border"
        style={{ borderColor: '#333', background: '#111' }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs font-mono" style={{ color: '#666' }}>
            portfolio@{profile.personal.fullName.toLowerCase().replace(/\s/g, '-')}:~
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="p-4 font-mono text-sm leading-relaxed h-[500px] overflow-y-auto"
          style={{ color: '#4ade80' }}
        >
          {history.map((entry, i) => (
            <div key={i} className="mb-3">
              {entry.cmd !== 'welcome' && (
                <div className="flex items-center gap-2" style={{ color: '#0ff' }}>
                  <span style={{ color: '#f0f' }}>$</span>
                  <span>{entry.cmd}</span>
                </div>
              )}
              <pre className="whitespace-pre-wrap mt-1" style={{ color: '#4ade80', fontSize: '13px' }}>
                {i === history.length - 1 ? <TypingText text={entry.output} speed={15} /> : entry.output}
              </pre>
            </div>
          ))}

          {/* Input line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span style={{ color: '#f0f' }}>$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none font-mono text-sm"
              style={{ color: '#4ade80', caretColor: '#4ade80' }}
              autoFocus
              placeholder="type a command..."
            />
          </form>
        </div>
      </div>

      {/* Quick commands */}
      <div className="max-w-4xl mx-auto mt-4 flex flex-wrap gap-2">
        {Object.keys(commands).filter((c) => c !== 'clear').map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-3 py-1 text-xs font-mono rounded border cursor-pointer transition-colors hover:opacity-80"
            style={{ borderColor: '#333', color: '#4ade80', background: '#1a1a1a' }}
          >
            {cmd}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
