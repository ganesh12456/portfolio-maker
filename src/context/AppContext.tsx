'use client';

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  AppState,
  UserProfile,
  JobSource,
  JobDescription,
  OptimizationResult,
  CustomizationState,
  ThemeId,
  PortfolioTemplateId,
  ResumeTemplateId,
  FontConfig,
} from '@/types';
import { fontPresets } from '@/lib/themes';
import { sampleProfile } from '@/lib/sample-data';

const defaultCustomization: CustomizationState = {
  theme: 'dark',
  font: fontPresets.modern,
  layout: {
    maxWidth: '1200px',
    spacing: 'standard',
    gridColumns: 12,
    sectionOrder: ['hero', 'about', 'skills', 'experience', 'projects', 'contact'],
    sidebarWidth: '280px',
    headerHeight: '64px',
  },
  animations: {
    enabled: true,
    speed: 'normal',
    reducedMotion: false,
  },
  portfolioTemplate: 'minimal-one-page',
  resumeTemplate: 'classic-chronological',
};

const initialState: AppState = {
  profile: sampleProfile,
  jobSource: null,
  optimization: null,
  customization: defaultCustomization,
  activeView: 'intake',
  isProcessing: false,
};

// Action types
type AppAction =
  | { type: 'SET_VIEW'; payload: AppState['activeView'] }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<UserProfile['personal']> }
  | { type: 'SET_JOB_SOURCE'; payload: JobSource }
  | { type: 'SET_JOB_DESCRIPTION'; payload: JobDescription }
  | { type: 'SET_OPTIMIZATION'; payload: OptimizationResult }
  | { type: 'SET_THEME'; payload: ThemeId }
  | { type: 'SET_FONT'; payload: FontConfig }
  | { type: 'SET_PORTFOLIO_TEMPLATE'; payload: PortfolioTemplateId }
  | { type: 'SET_RESUME_TEMPLATE'; payload: ResumeTemplateId }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'UPDATE_CUSTOMIZATION'; payload: Partial<CustomizationState> }
  | { type: 'APPLY_OPTIMIZATION' }
  | { type: 'RESET' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_PERSONAL':
      return {
        ...state,
        profile: { ...state.profile, personal: { ...state.profile.personal, ...action.payload } },
      };
    case 'SET_JOB_SOURCE':
      return { ...state, jobSource: action.payload };
    case 'SET_JOB_DESCRIPTION':
      return {
        ...state,
        jobSource: state.jobSource
          ? { ...state.jobSource, parsed: action.payload }
          : { type: 'text', content: '', parsed: action.payload },
      };
    case 'SET_OPTIMIZATION':
      return { ...state, optimization: action.payload };
    case 'SET_THEME':
      return {
        ...state,
        customization: { ...state.customization, theme: action.payload },
      };
    case 'SET_FONT':
      return {
        ...state,
        customization: { ...state.customization, font: action.payload },
      };
    case 'SET_PORTFOLIO_TEMPLATE':
      return {
        ...state,
        customization: { ...state.customization, portfolioTemplate: action.payload },
      };
    case 'SET_RESUME_TEMPLATE':
      return {
        ...state,
        customization: { ...state.customization, resumeTemplate: action.payload },
      };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'UPDATE_CUSTOMIZATION':
      return {
        ...state,
        customization: { ...state.customization, ...action.payload },
      };
    case 'APPLY_OPTIMIZATION':
      if (!state.optimization) return state;
      return { ...state, profile: state.optimization.optimizedProfile };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
