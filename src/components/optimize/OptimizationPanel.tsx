'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button, Card, Badge, ProgressBar } from '@/components/ui';
import { optimizeProfile } from '@/lib/optimizer';
import {
  Target,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

export function OptimizationPanel() {
  const { state, dispatch } = useApp();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const optimization = state.optimization;
  const jd = state.jobSource?.parsed;

  const handleOptimize = () => {
    if (!jd) return;
    setIsOptimizing(true);
    // Simulate processing delay for UX
    setTimeout(() => {
      const result = optimizeProfile(state.profile, jd);
      dispatch({ type: 'SET_OPTIMIZATION', payload: result });
      setIsOptimizing(false);
    }, 800);
  };

  const handleApply = () => {
    dispatch({ type: 'APPLY_OPTIMIZATION' });
  };

  if (!jd) {
    return (
      <Card className="text-center py-12">
        <Target size={48} className="mx-auto mb-4 text-[var(--color-text-muted)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No Job Description</h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Go to the Intake tab and parse a job description first.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">{jd.title}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {jd.company} {jd.location && `| ${jd.location}`}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{jd.experienceLevel}</p>
          </div>
          <Button onClick={handleOptimize} disabled={isOptimizing}>
            {isOptimizing ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" /> Optimizing...
              </>
            ) : (
              <>
                <Sparkles size={14} className="mr-2" /> Run Optimization
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Optimization Results */}
      {optimization && (
        <>
          {/* Match Score */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={20} className="text-[var(--color-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Match Score</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-[var(--color-primary)]">
                {optimization.matchScore}%
              </div>
              <div className="flex-1">
                <ProgressBar
                  value={optimization.matchScore}
                  color={optimization.matchScore >= 70 ? 'success' : optimization.matchScore >= 40 ? 'warning' : 'error'}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              {optimization.keywordMatches.filter((m) => m.matched).length} of {optimization.keywordMatches.length} keywords matched
            </p>
          </Card>

          {/* Keyword Matches */}
          <Card>
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">Keyword Analysis</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {optimization.keywordMatches.map((match, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-2 rounded text-xs"
                  style={{
                    backgroundColor: match.matched
                      ? 'var(--color-success)'
                      : 'var(--color-error)',
                    opacity: 0.08,
                  }}
                >
                  <div className="flex items-center gap-2">
                    {match.matched ? (
                      <CheckCircle2 size={14} className="text-[var(--color-success)]" />
                    ) : (
                      <XCircle size={14} className="text-[var(--color-error)]" />
                    )}
                    <span className="text-[var(--color-text)] font-medium">{match.keyword}</span>
                    <Badge variant={match.category === 'required' ? 'error' : match.category === 'preferred' ? 'warning' : 'default'}>
                      {match.category}
                    </Badge>
                  </div>
                  {match.matched && (
                    <span className="text-[var(--color-text-muted)]">{match.injectedInto.length} match(es)</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Gaps */}
          {optimization.gaps.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-[var(--color-warning)]" />
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Missing Keywords ({optimization.gaps.length})</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {optimization.gaps.map((gap, i) => (
                  <Badge key={i} variant="warning">{gap}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {optimization.recommendations.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-[var(--color-accent)]" />
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {optimization.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                    <ArrowRight size={12} className="mt-0.5 text-[var(--color-accent)] flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Apply Button */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">Apply Optimizations</h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Update your profile with optimized keywords and summary
                </p>
              </div>
              <Button onClick={handleApply} variant="primary">
                Apply to Profile <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
