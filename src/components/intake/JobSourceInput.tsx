'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Textarea, Input, Button, Card, Tabs } from '@/components/ui';
import { sampleJobDescription } from '@/lib/sample-data';
import { parseJobDescriptionText } from '@/lib/job-parser';
import { FileText, Globe, Zap, Loader2, CheckCircle2 } from 'lucide-react';

export function JobSourceInput() {
  const { state, dispatch } = useApp();
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleParse = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const content = inputType === 'text' ? textContent : urlContent;
      if (!content.trim()) {
        setErrorMsg('Please enter content to parse.');
        setStatus('error');
        return;
      }

      if (inputType === 'text') {
        const parsed = parseJobDescriptionText(content);
        dispatch({ type: 'SET_JOB_SOURCE', payload: { type: 'text', content, parsed } });
      } else {
        const res = await fetch('/api/parse-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'url', content: urlContent }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'Failed to parse URL');
          setStatus('error');
          return;
        }
        dispatch({ type: 'SET_JOB_SOURCE', payload: { type: 'url', content: urlContent, parsed: data.parsed } });
      }
      setStatus('success');
    } catch {
      setErrorMsg('An unexpected error occurred.');
      setStatus('error');
    }
  };

  const handleUseSample = () => {
    dispatch({
      type: 'SET_JOB_SOURCE',
      payload: {
        type: 'text',
        content: JSON.stringify(sampleJobDescription),
        parsed: sampleJobDescription,
      },
    });
    setStatus('success');
  };

  const tabItems = [
    { id: 'text', label: 'Paste Text', icon: <FileText size={14} /> },
    { id: 'url', label: 'From URL', icon: <Globe size={14} /> },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Job Description Source</h3>

        <Tabs
          tabs={tabItems}
          active={inputType}
          onChange={(id) => setInputType(id as 'text' | 'url')}
          className="mb-4"
        />

        {inputType === 'text' ? (
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={10}
            placeholder="Paste the full job description text here..."
            className="font-mono text-xs"
          />
        ) : (
          <Input
            label="Job Posting URL"
            value={urlContent}
            onChange={(e) => setUrlContent(e.target.value)}
            placeholder="https://company.com/careers/senior-engineer"
            type="url"
          />
        )}

        {errorMsg && (
          <p className="text-xs text-[var(--color-error)] mt-2">{errorMsg}</p>
        )}

        <div className="flex gap-3 mt-4">
          <Button onClick={handleParse} disabled={status === 'loading'}>
            {status === 'loading' ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" /> Parsing...
              </>
            ) : (
              'Parse Job Description'
            )}
          </Button>
          <Button variant="secondary" onClick={handleUseSample}>
            <Zap size={14} className="mr-2" /> Use Sample JD
          </Button>
        </div>

        {status === 'success' && state.jobSource?.parsed && (
          <div className="mt-4 p-3 bg-[var(--color-success)]/5 border border-[var(--color-success)]/20 rounded-[var(--radius)]">
            <div className="flex items-center gap-2 text-sm text-[var(--color-success)] mb-2">
              <CheckCircle2 size={16} />
              <span className="font-medium">Job description parsed successfully</span>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              <p><strong>Title:</strong> {state.jobSource.parsed.title}</p>
              <p><strong>Company:</strong> {state.jobSource.parsed.company || 'N/A'}</p>
              <p><strong>Keywords found:</strong> {state.jobSource.parsed.keywords.length}</p>
              <p><strong>Required skills:</strong> {state.jobSource.parsed.requiredSkills.length}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
