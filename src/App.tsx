/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConnectedApp, Recommendation, GrowthTask, ChatMessage, AppMetrics, MarketingAutomation } from './types';
import { 
  INITIAL_APPS, 
  INITIAL_RECOMMENDATIONS, 
  INITIAL_TASKS, 
  INITIAL_CHAT,
  INITIAL_AUTOMATIONS
} from './data';
import AppSelector from './components/AppSelector';
import InteractiveCapabilitySimulator from './components/InteractiveCapabilitySimulator';
import { 
  Home,
  Layers,
  PenTool,
  Rocket,
  BarChart,
  Workflow,
  BookOpen,
  Briefcase,
  Database, 
  Globe, 
  Cpu, 
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Complete Information Architecture Definition
const NAVIGATION_CHANNELS = [
  {
    id: 'HOME',
    name: 'HOME (Command Center)',
    icon: Home,
    subSections: [
      { name: 'Daily Briefing', desc: 'Central priorities overview' },
      { name: "Today's Tasks", desc: 'Active action items list' },
      { name: 'Recent Projects', desc: 'Active workspace projects' },
      { name: 'Business Health Score', desc: 'KPI diagnostic scores' },
      { name: 'AI Recommendations', desc: 'Custom diagnostic plays' },
      { name: 'One-click Quick Actions', desc: 'Immediate campaign tasks' }
    ]
  },
  {
    id: 'BUILD',
    name: 'BUILD (No-Code Studio)',
    icon: Layers,
    subSections: [
      { name: 'Website Builder', desc: 'Landing page structure tool' },
      { name: 'Mobile App Builder', desc: 'Interactive phone design' },
      { name: 'AI App Builder', desc: 'Custom prompt & model tester' },
      { name: 'Landing Page Builder', desc: 'Lead generation templates' },
      { name: 'Database Builder', desc: 'Visual database schema' },
      { name: 'Workflow Builder', desc: 'Trigger-action logical maps' },
      { name: 'Automation Builder', desc: 'Dynamic campaign router' }
    ]
  },
  {
    id: 'CREATE',
    name: 'CREATE (Campaign Studio)',
    icon: PenTool,
    subSections: [
      { name: 'Content Studio', desc: 'Copywriting copy creator' },
      { name: 'Video Studio', desc: 'AI marketing scripts outline' },
      { name: 'Image Studio', desc: 'Promotional visual banners' },
      { name: 'Presentation Studio', desc: 'Pitch deck outline creator' },
      { name: 'Email Studio', desc: 'Newsletter sequence editor' },
      { name: 'Blog Studio', desc: 'SEO article outline composer' },
      { name: 'Ad Studio', desc: 'Multichannel copy variations' },
      { name: 'Social Studio', desc: 'Direct post formatting' },
      { name: 'Brand Kit', desc: 'Visual palette preferences' }
    ]
  },
  {
    id: 'LAUNCH',
    name: 'LAUNCH (Deploy Room)',
    icon: Rocket,
    subSections: [
      { name: 'Campaign Builder', desc: 'Consolidate launch folders' },
      { name: 'Product Launch Wizard', desc: 'Interactive launch guide' },
      { name: 'Social Publishing', desc: 'Queue scheduler calendar' },
      { name: 'Email Campaigns', desc: 'Dispatch segmentation lists' },
      { name: 'Meta Ads', desc: 'Simulated budget optimization' },
      { name: 'Google Ads', desc: 'Search keyword bid tuner' },
      { name: 'WhatsApp Campaigns', desc: 'Conversational drip rules' },
      { name: 'App Deployment', desc: 'Production container build' }
    ]
  },
  {
    id: 'ANALYZE',
    name: 'ANALYZE (Intelligence)',
    icon: BarChart,
    subSections: [
      { name: 'Business Dashboard', desc: 'Historical cohort charts' },
      { name: 'Growth Intelligence', desc: 'LTV/CAC diagnostics' },
      { name: 'Marketing Analytics', desc: 'Channel ROI scorecard' },
      { name: 'Competitor Analysis', desc: 'Competitive positioning matrix' },
      { name: 'SEO Analysis', desc: 'Ranking & index visibility' },
      { name: 'Revenue & Funnel', desc: 'Checkout conversion dropoffs' },
      { name: 'Customer Journey', desc: 'Chronological telemetry log' },
      { name: 'AI Recommendations & Forecasts', desc: 'Future predictive charts' }
    ]
  },
  {
    id: 'AUTOMATE',
    name: 'AUTOMATE (Outreach)',
    icon: Workflow,
    subSections: [
      { name: 'Workflow Automation', desc: 'Active hook logs' },
      { name: 'AI Employees/Agents', desc: 'Autonomous workforce chat' },
      { name: 'Scheduled Tasks', desc: 'Cron timeline manager' },
      { name: 'CRM Automation', desc: 'Deals pipeline kanban' },
      { name: 'Lead Generation', desc: 'Prospect directory scraper' },
      { name: 'Email Sequences', desc: 'Onboarding drip timelines' }
    ]
  },
  {
    id: 'KNOWLEDGE',
    name: 'KNOWLEDGE (Memory)',
    icon: BookOpen,
    subSections: [
      { name: 'Founder Memory', desc: 'Operational facts vault' },
      { name: 'Business Documents', desc: 'Document & PDF uploader' },
      { name: 'Playbooks & SOPs', desc: 'Standard operating rules' },
      { name: 'Research Notes', desc: 'Saved scratchpad ideas' },
      { name: 'Saved Conversations', desc: 'Diagnostics archive' }
    ]
  },
  {
    id: 'WORKSPACES',
    name: 'WORKSPACES',
    icon: Briefcase,
    subSections: [
      { name: 'Switch Workspace', desc: 'Change organization' },
      { name: 'Independent Memory', desc: 'Workspace settings' },
      { name: 'Add Organization', desc: 'Register new company' }
    ]
  }
];

export default function App() {
  // Global Workspace States
  const [apps, setApps] = useState<ConnectedApp[]>(INITIAL_APPS);
  const [activeAppId, setActiveAppId] = useState<string>('ai_growth_os'); // defaults to central OS
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>(INITIAL_RECOMMENDATIONS);
  const [tasks, setTasks] = useState<GrowthTask[]>(INITIAL_TASKS);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);
  const [automations, setAutomations] = useState<MarketingAutomation[]>(INITIAL_AUTOMATIONS);
  const [founderMode, setFounderMode] = useState<'beginner' | 'advanced'>('beginner');
  
  // Navigation States
  const [activeCategory, setActiveCategory] = useState<string>('HOME');
  const [activeSubSection, setActiveSubSection] = useState<string>('Daily Briefing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Prefilled marketing copy states
  const [prefilledGoal, setPrefilledGoal] = useState<string>('');
  const [prefilledTone, setPrefilledTone] = useState<string>('');

  const handlePrefillCampaign = (goal: string, tone: string) => {
    setPrefilledGoal(goal);
    setPrefilledTone(tone);
    // Switch to create panel
    setActiveCategory('CREATE');
    setActiveSubSection('Content Studio');
  };

  const handleClearPrefilled = () => {
    setPrefilledGoal('');
    setPrefilledTone('');
  };

  const activeApp = apps.find(a => a.id === activeAppId) || apps[0];

  // SWITCH APP
  const handleSelectApp = (id: string) => {
    setActiveAppId(id);
  };

  // UPDATE METRICS (Live Simulating and Saving)
  const handleUpdateMetrics = (newMetrics: AppMetrics) => {
    setApps(prevApps => 
      prevApps.map(app => 
        app.id === activeAppId 
          ? { ...app, metrics: newMetrics } 
          : app
      )
    );
  };

  // CONNECT NEW APP (Adding new Organization Workspace)
  const handleConnectApp = (newAppInfo: Omit<ConnectedApp, 'id' | 'connectedAt' | 'status' | 'metrics'>) => {
    const newId = newAppInfo.name.toLowerCase().replace(/\s+/g, '_');
    
    // Simulate smart metrics based on Business Model
    let simulatedMetrics: AppMetrics = {
      mrr: 15000,
      mau: 5000,
      churn: 4.5,
      arpu: 15,
      cac: 45,
      viralCo: 0.15
    };

    if (newAppInfo.businessModel === 'SaaS' || newAppInfo.businessModel === 'SaaS/B2B') {
      simulatedMetrics = { mrr: 85000, mau: 12000, churn: 2.2, arpu: 45, cac: 110, viralCo: 0.08 };
    } else if (newAppInfo.businessModel === 'Marketplace') {
      simulatedMetrics = { mrr: 32000, mau: 45000, churn: 6.0, arpu: 6, cac: 12, viralCo: 0.45 };
    } else if (newAppInfo.businessModel === 'Matchmaking') {
      simulatedMetrics = { mrr: 21000, mau: 65000, churn: 9.5, arpu: 14, cac: 28, viralCo: 0.22 };
    } else if (newAppInfo.businessModel === 'Education') {
      simulatedMetrics = { mrr: 45000, mau: 110000, churn: 3.1, arpu: 18, cac: 50, viralCo: 0.18 };
    }

    const newConnectedApp: ConnectedApp = {
      id: newId,
      name: newAppInfo.name,
      description: newAppInfo.description,
      targetAudience: newAppInfo.targetAudience,
      businessModel: newAppInfo.businessModel,
      metrics: simulatedMetrics,
      connectedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    // Seed default recommendations
    const defaultRecs: Recommendation[] = [
      {
        id: `${newId}_rec_default`,
        title: `Dynamic Pricing & Tier Optimization`,
        category: 'Monetization',
        impact: 'High',
        effort: 'Medium',
        metricImpact: '+25% ARPU Increase',
        description: `Bespoke initial diagnostic play for ${newAppInfo.name}. Introduce a tiered utility layout charging premiums for high-frequency value metrics.`,
        actionSteps: [
          'Audit current user value segments and define high-frequency features.',
          'Deploy two premium feature tiers and an automated paywall trigger.',
          'Optimize pricing thresholds with discount vouchers during checkout.'
        ],
        completed: false
      }
    ];

    // Seed initial coaching welcome message
    const defaultChat: ChatMessage[] = [
      {
        id: `chat_init_${newId}`,
        role: 'model',
        content: `Assalamu Alaikum and welcome! I've successfully connected ${newAppInfo.name} (${newAppInfo.businessModel}) to your Growth OS.\n\nI've auto-simulated a database snapshot showing your target MRR of $${simulatedMetrics.mrr.toLocaleString()} with ${simulatedMetrics.mau.toLocaleString()} active users. Let's run a full live AI diagnostic or design some marketing outreach copy!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setApps(prev => [...prev, newConnectedApp]);
    setRecommendations(prev => ({ ...prev, [newId]: defaultRecs }));
    setChatHistory(prev => ({ ...prev, [newId]: defaultChat }));
    setActiveAppId(newId);
    
    // Switch to home dashboard
    setActiveCategory('ANALYZE');
    setActiveSubSection('Business Dashboard');
  };

  // CHECKLIST ACTIONS
  const handleToggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  const handleAddTask = (
    title: string, 
    category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality', 
    priority: 'High' | 'Medium' | 'Low'
  ) => {
    const newTask: GrowthTask = {
      id: `task_${Date.now()}`,
      title,
      appId: activeAppId,
      category,
      completed: false,
      priority,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAdoptRecommendation = (
    title: string, 
    category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality' | 'Brand', 
    priority: 'High' | 'Medium' | 'Low'
  ) => {
    // Cast category to acceptable checklist category
    const checklistCategory = category === 'Brand' ? 'Acquisition' : category;
    handleAddTask(title, checklistCategory, priority);
  };

  const handleAddChatMessage = (newMsg: ChatMessage) => {
    setChatHistory(prev => ({
      ...prev,
      [activeAppId]: [...(prev[activeAppId] || []), newMsg]
    }));
  };

  const handleClearChatHistory = () => {
    setChatHistory(prev => ({
      ...prev,
      [activeAppId]: [
        {
          id: `chat_${Date.now()}`,
          role: 'model',
          content: `Chat history cleared. GrowthBrain AI Coach is ready for a fresh growth session!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="workspace-root">
      
      {/* Top Header - System Wide */}
      <header className="bg-slate-900/40 border-b border-slate-900 backdrop-blur-sm sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Cpu className="w-5 h-5 text-slate-950 font-extrabold stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display tracking-tight flex items-center gap-1.5">
              <span>AI Growth OS</span>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.5 rounded-full uppercase">SaaS v1.0</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Central Growth Intelligence Platform</p>
          </div>
        </div>

        {/* Global System Indicators */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium">Server Sync:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium">Organizations:</span>
            <span className="text-slate-200 font-bold bg-slate-800 px-2 py-0.5 rounded-md font-mono">{apps.length}</span>
          </div>

          {/* Founder Mode Toggle */}
          <div className="flex items-center gap-2 border-l border-slate-850 pl-4">
            <span className="text-[10px] font-mono text-slate-500 font-bold hidden xl:inline uppercase tracking-widest">FOUNDER MODE:</span>
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex gap-1">
              <button
                onClick={() => setFounderMode('beginner')}
                className={`px-3 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  founderMode === 'beginner'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                BEGINNER
              </button>
              <button
                onClick={() => setFounderMode('advanced')}
                className={`px-3 py-1 text-[9px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  founderMode === 'advanced'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                ADVANCED
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Workspace - Side-by-Side Grid Layout */}
      <div className="flex-grow flex flex-col md:flex-row relative">
        
        {/* Left Drawer / Sidebar */}
        <aside className={`
          fixed md:relative inset-y-0 left-0 z-30
          w-72 md:w-80 bg-slate-950 border-r border-slate-900/60 p-4 space-y-6 shrink-0
          transition-transform duration-300 transform
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto max-h-[calc(100vh-73px)] md:sticky md:top-[73px]
        `} id="sidebar-navigation">
          
          {/* Active Workspace / App Selector inside Sidebar */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Active Workspace</span>
            <AppSelector 
              apps={apps}
              activeAppId={activeAppId}
              onSelectApp={handleSelectApp}
              onConnectApp={handleConnectApp}
            />
          </div>

          {/* Navigation Channels Accordion */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-3 pl-1">OPERATING MODULES</span>
            
            {NAVIGATION_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              const isCategoryActive = activeCategory === channel.id;

              return (
                <div key={channel.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveCategory(channel.id);
                      // Default to first sub-section
                      if (channel.subSections.length > 0) {
                        setActiveSubSection(channel.subSections[0].name);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      isCategoryActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow shadow-emerald-500/5'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{channel.name}</span>
                    </div>
                    {channel.subSections.length > 0 && (
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isCategoryActive ? 'rotate-90 text-emerald-400' : 'text-slate-500'}`} />
                    )}
                  </button>

                  {/* Subsections list (Only expanded when active category matches) */}
                  <AnimatePresence initial={false}>
                    {isCategoryActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden pl-7 space-y-0.5"
                      >
                        {channel.subSections.map((sub) => {
                          const isSubActive = activeSubSection === sub.name;
                          return (
                            <button
                              key={sub.name}
                              onClick={() => {
                                setActiveSubSection(sub.name);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg transition-all block cursor-pointer ${
                                isSubActive
                                  ? 'text-white font-bold bg-slate-900 border border-slate-800'
                                  : 'text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">{sub.name}</span>
                                {isSubActive && <span className="h-1 w-1 bg-emerald-500 rounded-full shrink-0 ml-1.5"></span>}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick Stats footer inside sidebar */}
          <div className="pt-4 border-t border-slate-900/60 text-[10px] text-slate-500 font-mono space-y-1">
            <div>MRR: <span className="text-white font-bold">${activeApp.metrics.mrr.toLocaleString()}</span></div>
            <div>MAU: <span className="text-white font-bold">{activeApp.metrics.mau.toLocaleString()}</span></div>
            <div>Churn: <span className="text-white font-bold">{activeApp.metrics.churn}%</span></div>
          </div>
        </aside>

        {/* Content Canvas */}
        <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-5xl w-full mx-auto" id="main-content-pane">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + activeSubSection + activeAppId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              <InteractiveCapabilitySimulator
                activeCategory={activeCategory}
                activeSubSection={activeSubSection}
                activeApp={activeApp}
                apps={apps}
                recommendations={recommendations[activeAppId] || []}
                tasks={tasks}
                chatHistory={chatHistory[activeAppId] || []}
                automations={automations}
                founderMode={founderMode}
                onToggleFounderMode={(mode) => setFounderMode(mode)}
                onSelectApp={handleSelectApp}
                onConnectApp={handleConnectApp}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onSetRecommendations={(recs) => {
                  setRecommendations(prev => ({
                    ...prev,
                    [activeAppId]: recs
                  }));
                }}
                onAdoptAsTask={handleAdoptRecommendation}
                onAddChatMessage={handleAddChatMessage}
                onClearChatHistory={handleClearChatHistory}
                onSwitchTab={(tabId) => {
                  // Proxy legacy tab routing to modern structure
                  if (tabId === 'dashboard') {
                    setActiveCategory('ANALYZE');
                    setActiveSubSection('Business Dashboard');
                  } else if (tabId === 'marketing') {
                    setActiveCategory('CREATE');
                    setActiveSubSection('Content Studio');
                  } else if (tabId === 'chat') {
                    setActiveCategory('AUTOMATE');
                    setActiveSubSection('AI Employees/Agents');
                  } else {
                    setActiveCategory('HOME');
                    setActiveSubSection('Daily Briefing');
                  }
                }}
                onPrefillCampaign={handlePrefillCampaign}
                onUpdateMetrics={handleUpdateMetrics}
                onSetAutomations={setAutomations}
                prefilledGoal={prefilledGoal}
                prefilledTone={prefilledTone}
                onClearPrefilled={handleClearPrefilled}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Humble, Professional Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-6 text-center text-[11px] text-slate-500 font-mono tracking-wider">
        <div>AI GROWTH OPERATING SYSTEM © 2026. RUNNING SECURE SERVER-SIDE GEMINI API.</div>
      </footer>

    </div>
  );
}
