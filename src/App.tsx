/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import MetricsDashboard from './components/MetricsDashboard';
import BusinessIntelligenceCenter from './components/BusinessIntelligenceCenter';
import ConnectedAppsMarketplace from './components/ConnectedAppsMarketplace';
import SettingsPanel from './components/SettingsPanel';
import DailyAgenda from './components/DailyAgenda';
import AiRecommendations from './components/AiRecommendations';
import ContentStudio from './components/ContentStudio';
import GrowthBrainChat from './components/GrowthBrainChat';
import AutomationCenter from './components/AutomationCenter';
import { 
  Sliders, 
  ClipboardList, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  Database, 
  Globe, 
  Cpu, 
  Zap,
  Bot,
  BarChart3,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global Workspace States
  const [apps, setApps] = useState<ConnectedApp[]>(INITIAL_APPS);
  const [activeAppId, setActiveAppId] = useState<string>('zawaj');
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>(INITIAL_RECOMMENDATIONS);
  const [tasks, setTasks] = useState<GrowthTask[]>(INITIAL_TASKS);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT);
  const [automations, setAutomations] = useState<MarketingAutomation[]>(INITIAL_AUTOMATIONS);
  
  // Starting on 'agenda' so the founder instantly sees "what needs attention today"
  const [activeTab, setActiveTab] = useState<'agenda' | 'dashboard' | 'recommendations' | 'marketing' | 'chat' | 'automation' | 'connections' | 'settings'>('agenda');

  // Prefilled marketing copy states from the AI Coach
  const [prefilledGoal, setPrefilledGoal] = useState<string>('');
  const [prefilledTone, setPrefilledTone] = useState<string>('');

  const handlePrefillCampaign = (goal: string, tone: string) => {
    setPrefilledGoal(goal);
    setPrefilledTone(tone);
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

  // CONNECT NEW APP
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

    // Seed default recommendations for the newly connected app
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

    // Update global states
    setApps(prev => [...prev, newConnectedApp]);
    setRecommendations(prev => ({ ...prev, [newId]: defaultRecs }));
    setChatHistory(prev => ({ ...prev, [newId]: defaultChat }));
    setActiveAppId(newId);
    
    // Switch to dashboard tab so they see simulated metrics
    setActiveTab('dashboard');
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
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // ADOPT RECOMMENDATION AS ACTIVE TASK
  const handleAdoptRecommendation = (
    title: string, 
    category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality', 
    priority: 'High' | 'Medium' | 'Low'
  ) => {
    handleAddTask(title, category, priority);
  };

  // CHAT ACTIONS
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
      
      {/* Top Professional Header Navigation */}
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
            <span className="text-slate-400 font-medium">Server Sync Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium">Connected Databases:</span>
            <span className="text-slate-200 font-bold bg-slate-800 px-2 py-0.5 rounded-md font-mono">{apps.length}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Row 1: Active App Switcher Indicator */}
        <AppSelector 
          apps={apps}
          activeAppId={activeAppId}
          onSelectApp={handleSelectApp}
          onConnectApp={handleConnectApp}
        />

        {/* Row 2: Navigation Tabs for Platform Features */}
        <div className="flex items-center border-b border-slate-900 pb-px overflow-x-auto gap-2" id="nav-tabs-rail">
          {[
            { id: 'agenda', name: 'Focus Agenda', icon: ClipboardList, desc: "What needs attention today" },
            { id: 'dashboard', name: 'BI Center', icon: BarChart3, desc: "AI Powered Analytics" },
            { id: 'recommendations', name: 'AI Recommendations', icon: Sparkles, desc: "Diagnostics plays" },
            { id: 'automation', name: 'Automation Center', icon: Cpu, desc: "AI trigger workflows" },
            { id: 'marketing', name: 'Content Studio', icon: FileText, desc: "Generate marketing copy" },
            { id: 'chat', name: 'AI Growth Coach', icon: MessageSquare, desc: "Dialogue consulting" },
            { id: 'connections', name: 'Connected Apps', icon: Globe, desc: "SaaS Database Sync" },
            { id: 'settings', name: 'Settings', icon: Settings, desc: "Workspace Controls" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-trigger-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <span className="block leading-none">{tab.name}</span>
                  <span className="hidden sm:block text-[9px] text-slate-500 font-normal mt-0.5">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Row 3: Render Active Tab Canvas */}
        <div className="min-h-[450px]" id="tab-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeAppId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'agenda' && (
                <DailyAgenda
                  activeApp={activeApp}
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}

              {activeTab === 'dashboard' && (
                <BusinessIntelligenceCenter
                  activeApp={activeApp}
                />
              )}

              {activeTab === 'recommendations' && (
                <AiRecommendations
                  activeApp={activeApp}
                  recommendations={recommendations[activeAppId] || []}
                  onSetRecommendations={(recs) => {
                    setRecommendations(prev => ({
                      ...prev,
                      [activeAppId]: recs
                    }));
                  }}
                  onAdoptAsTask={handleAdoptRecommendation}
                />
              )}

              {activeTab === 'marketing' && (
                <ContentStudio
                  activeApp={activeApp}
                  prefilledGoal={prefilledGoal}
                  prefilledTone={prefilledTone}
                  onClearPrefilled={handleClearPrefilled}
                />
              )}

              {activeTab === 'chat' && (
                <GrowthBrainChat
                  activeApp={activeApp}
                  chatHistory={chatHistory[activeAppId] || []}
                  onAddChatMessage={handleAddChatMessage}
                  onClearChatHistory={handleClearChatHistory}
                  onSwitchTab={setActiveTab}
                  onAddTask={handleAddTask}
                  onPrefillCampaign={handlePrefillCampaign}
                  onUpdateMetrics={handleUpdateMetrics}
                />
              )}

              {activeTab === 'automation' && (
                <AutomationCenter
                  activeApp={activeApp}
                  automations={automations}
                  onSetAutomations={setAutomations}
                />
              )}

              {activeTab === 'connections' && (
                <ConnectedAppsMarketplace
                  apps={apps}
                  activeAppId={activeAppId}
                  onSelectApp={handleSelectApp}
                  onConnectApp={handleConnectApp}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPanel
                  activeApp={activeApp}
                  apps={apps}
                  onSelectApp={handleSelectApp}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>


      </main>

      {/* Humble, Professional Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-6 text-center text-[11px] text-slate-500 font-mono tracking-wider">
        <div>AI GROWTH OPERATING SYSTEM © 2026. RUNNING SECURE SERVER-SIDE GEMINI API.</div>
      </footer>

    </div>
  );
}

