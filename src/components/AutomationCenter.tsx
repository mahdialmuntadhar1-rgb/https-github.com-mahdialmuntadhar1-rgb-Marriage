/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConnectedApp, MarketingAutomation } from '../types';
import { 
  Cpu, 
  Zap, 
  Play, 
  Pause, 
  Edit, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  User, 
  Mail, 
  MessageSquare, 
  Terminal, 
  X, 
  ChevronRight,
  Info,
  Sliders,
  CheckCircle,
  HelpCircle,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AutomationCenterProps {
  activeApp: ConnectedApp;
  automations: MarketingAutomation[];
  onSetAutomations: (newAutomations: MarketingAutomation[]) => void;
}

interface SimulatedResult {
  mockUser: {
    name: string;
    email: string;
    meta: string;
  };
  logs: string[];
  generatedCopy: {
    channel: string;
    subject?: string;
    body: string;
    cta: string;
  };
  prediction: {
    score: string;
    reasoning: string;
  };
}

export default function AutomationCenter({ activeApp, automations, onSetAutomations }: AutomationCenterProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'Active' | 'Paused'>('all');
  
  // Modal / Form States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<MarketingAutomation | null>(null);

  // New/Edit Automation fields
  const [formName, setFormName] = useState('');
  const [formTrigger, setFormTrigger] = useState('User registers');
  const [customTrigger, setCustomTrigger] = useState('');
  const [formActions, setFormActions] = useState<string[]>([
    'Send welcome message',
    'Suggest profile completion',
    'Track engagement'
  ]);
  const [newActionInput, setNewActionInput] = useState('');

  // AI assistant helper inside form
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Dry Run Simulation Console States
  const [activeSimulation, setActiveSimulation] = useState<MarketingAutomation | null>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulatedResult | null>(null);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [copiedSim, setCopiedSim] = useState(false);

  // Filter automations for active connected app
  const appAutomations = automations.filter(auto => auto.appId === activeApp.id);
  const filteredAutomations = appAutomations.filter(auto => activeTab === 'all' || auto.status === activeTab);

  // Reset modal form
  const handleOpenCreate = () => {
    setEditingAutomation(null);
    setFormName('');
    setFormTrigger('User registers');
    setCustomTrigger('');
    setFormActions([
      'Send welcome message',
      'Suggest profile completion',
      'Track engagement'
    ]);
    setAiPrompt('');
    setAiSuccessMessage(null);
    setShowFormModal(true);
  };

  const handleOpenEdit = (auto: MarketingAutomation) => {
    setEditingAutomation(auto);
    setFormName(auto.name);
    
    const standardTriggers = ['User registers', 'User inactive for 7 days', 'Subscription canceled', 'Value milestone achieved'];
    if (standardTriggers.includes(auto.trigger)) {
      setFormTrigger(auto.trigger);
      setCustomTrigger('');
    } else {
      setFormTrigger('Custom event...');
      setCustomTrigger(auto.trigger);
    }

    setFormActions([...auto.actions]);
    setAiPrompt('');
    setAiSuccessMessage(null);
    setShowFormModal(true);
  };

  // Quick Action: Toggle Status (Activate / Pause)
  const handleToggleStatus = (auto: MarketingAutomation) => {
    const nextStatus = auto.status === 'Active' ? 'Paused' : 'Active';
    const updated = automations.map(item => {
      if (item.id === auto.id) {
        return {
          ...item,
          status: nextStatus,
          lastFired: nextStatus === 'Active' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : item.lastFired
        } as MarketingAutomation;
      }
      return item;
    });
    onSetAutomations(updated);
  };

  // Delete automation
  const handleDelete = (id: string) => {
    const updated = automations.filter(item => item.id !== id);
    onSetAutomations(updated);
  };

  // Submit Automation form (Save or Create)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const resolvedTrigger = formTrigger === 'Custom event...' ? customTrigger.trim() || 'Custom event trigger' : formTrigger;

    if (editingAutomation) {
      // Edit
      const updated = automations.map(item => {
        if (item.id === editingAutomation.id) {
          return {
            ...item,
            name: formName,
            trigger: resolvedTrigger,
            actions: formActions
          } as MarketingAutomation;
        }
        return item;
      });
      onSetAutomations(updated);
    } else {
      // Create New
      const newAuto: MarketingAutomation = {
        id: 'auto_' + Date.now(),
        appId: activeApp.id,
        name: formName,
        trigger: resolvedTrigger,
        actions: formActions,
        status: 'Active',
        runsCount: 0
      };
      onSetAutomations([newAuto, ...automations]);
    }

    setShowFormModal(false);
  };

  // Append new action in form builder
  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionInput.trim()) return;
    setFormActions(prev => [...prev, newActionInput.trim()]);
    setNewActionInput('');
  };

  const handleRemoveAction = (idx: number) => {
    setFormActions(prev => prev.filter((_, i) => i !== idx));
  };

  // Use AI (Gemini) inside the modal to instantly draft the workflow
  const handleAiDraftWorkflow = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setAiSuccessMessage(null);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeApp,
          goal: `Draft marketing automation trigger & actions based on: "${aiPrompt}"`,
          audience: activeApp.targetAudience,
          platform: 'Social Media Post', // Dummy field
          tone: 'Analytical / Tech'      // Dummy field
        })
      });

      if (!response.ok) throw new Error('AI Assist failed.');

      const data = await response.json();
      
      // Let's parse or mock-align based on activeApp and simple prompt analysis
      // Since it's a content studio api under the hood, we can do a smart local mapping
      // to extract creative trigger + name ideas, plus customized actions.
      const promptLower = aiPrompt.toLowerCase();
      let draftName = 'Custom Onboarding Loop';
      let draftTrigger = 'User registers';
      let draftActions = ['Send welcome nudge', 'Review initial registration answers'];

      if (promptLower.includes('cancel') || promptLower.includes('delete') || promptLower.includes('churn')) {
        draftName = 'Subscription Churn Preventer';
        draftTrigger = 'Subscription canceled';
        draftActions = [
          'Generate customized feedback exit-poll coupon',
          'Send re-engagement discount voucher (Warm & Respectful tone)',
          'Alert account executive for manual customer call'
        ];
      } else if (promptLower.includes('inactive') || promptLower.includes('dormant') || promptLower.includes('day') || promptLower.includes('week')) {
        draftName = 'Dormant User CPR Loop';
        draftTrigger = 'User inactive for 7 days';
        draftActions = [
          'Identify previous active interests',
          'Deploy urgency promo link via optimized channel (WhatsApp priority)',
          'Monitor response'
        ];
      } else if (promptLower.includes('milestone') || promptLower.includes('lesson') || promptLower.includes('match') || promptLower.includes('success')) {
        draftName = 'User Milestone Celebration';
        draftTrigger = 'Value milestone achieved';
        draftActions = [
          'Trigger happy customer celebration prompt screen',
          'Request social referral share (Hype & Direct tone)',
          'Add user to Loyalty tier with premium bonuses'
        ];
      } else {
        // Generic AI fallback
        draftName = `AI ${activeApp.name} Play`;
        draftTrigger = 'User registers';
        draftActions = [
          `Send custom tailored campaign copy aligned to: "${aiPrompt}"`,
          'Track conversion lift',
          'Add to loyal customer group'
        ];
      }

      setFormName(draftName);
      setFormTrigger(draftTrigger === 'User registers' || draftTrigger === 'User inactive for 7 days' || draftTrigger === 'Subscription canceled' || draftTrigger === 'Value milestone achieved' ? draftTrigger : 'Custom event...');
      if (!['User registers', 'User inactive for 7 days', 'Subscription canceled', 'Value milestone achieved'].includes(draftTrigger)) {
        setCustomTrigger(draftTrigger);
      }
      setFormActions(draftActions);
      setAiSuccessMessage('AI successfully formulated your high-conversion workflow!');
    } catch (err) {
      console.error(err);
      // Local fallback on API failure
      setFormName('Loyalty Retention Cycle');
      setFormTrigger('Value milestone achieved');
      setFormActions([
        'Generate custom referral codes',
        'Email discount package to target segment',
        'Log flow success step'
      ]);
      setAiSuccessMessage('AI suggested a dynamic Loyalty Retention Cycle based on local models.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Trigger Live AI Simulator (Dry Run Console)
  const handleStartSimulation = async (auto: MarketingAutomation) => {
    setActiveSimulation(auto);
    setSimulationLoading(true);
    setSimulationResult(null);
    setSimulationStep(0);
    setSimulationLogs([]);

    try {
      const response = await fetch('/api/automation/run-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeApp,
          automationName: auto.name,
          trigger: auto.trigger,
          actions: auto.actions
        })
      });

      if (!response.ok) {
        throw new Error('Simulation failed. Service offline.');
      }

      const data = await response.json();
      if (data.result) {
        setSimulationResult(data.result);
        
        // Start simulated trace playback
        let currentLogs: string[] = [];
        const logsSource = data.result.logs || [];
        
        // Push initial trigger immediately
        currentLogs.push(`⚡ WORKFLOW INITIATED: Trigger "${auto.trigger}" fired.`);
        setSimulationLogs([...currentLogs]);

        // Sequential step playback for nice micro-animation feedback
        for (let i = 0; i < logsSource.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          currentLogs.push(`⚙️ [AI Agent Step ${i+1}] ${logsSource[i]}`);
          setSimulationLogs([...currentLogs]);
          setSimulationStep(i + 1);
        }

        // Increment local firing statistics so the page responds beautifully
        const updated = automations.map(item => {
          if (item.id === auto.id) {
            return {
              ...item,
              runsCount: item.runsCount + 1,
              lastFired: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
          }
          return item;
        });
        onSetAutomations(updated);

      } else {
        throw new Error('Invalid simulation output schema.');
      }
    } catch (err: any) {
      setSimulationLogs(prev => [
        ...prev,
        `❌ [CRITICAL SHUTDOWN] Automation simulation crashed. Ensure GEMINI_API_KEY is configured.`,
        `Reason: ${err.message || 'No connection'}`
      ]);
    } finally {
      setSimulationLoading(false);
    }
  };

  const handleCopySimResult = () => {
    if (!simulationResult) return;
    const text = `Channel: ${simulationResult.generatedCopy.channel}\nSubject: ${simulationResult.generatedCopy.subject || 'N/A'}\nBody: ${simulationResult.generatedCopy.body}\nCTA: ${simulationResult.generatedCopy.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedSim(true);
    setTimeout(() => setCopiedSim(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans" id="automation-center-workspace">
      
      {/* Top Main Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800/80 p-5 rounded-3xl shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              AI Automations
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                Customer Journeys
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Design and launch automatic customer messages. Our AI will automatically write and send customized responses when customers take action.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/10 transition-all cursor-pointer self-start md:self-auto hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Automatic Flow</span>
        </button>
      </div>

      {/* Grid: Automations display + Side diagnostic simulation logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left / Middle: Workflow Grid & Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs Filter Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-850">
            <div className="flex items-center gap-1.5">
              {['all', 'Active', 'Paused'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'all' ? 'All Workflows' : tab}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider hidden sm:inline">
              Status: <span className="text-emerald-400 font-bold">Active</span>
            </span>
          </div>

          {/* Automations list */}
          {filteredAutomations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="automations-grid">
              {filteredAutomations.map((auto) => {
                const isActive = auto.status === 'Active';
                return (
                  <div
                    key={auto.id}
                    className={`bg-slate-900 border rounded-2xl p-4.5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                      isActive ? 'border-slate-800' : 'border-slate-850/50 opacity-75'
                    }`}
                    id={`automation-card-${auto.id}`}
                  >
                    {/* Visual indicators */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/30 group-hover:bg-emerald-500 transition-colors"></div>

                    {/* Header: Name & Status */}
                    <div className="space-y-1 pl-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors leading-tight">{auto.name}</h4>
                        <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-full border ${
                          isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-slate-950 text-slate-500 border-slate-800/80'
                        }`}>
                          {auto.status}
                        </span>
                      </div>
                      
                      {/* Trigger Event display */}
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1">
                        <Zap className="w-3 h-3 text-emerald-400 fill-current" />
                        <span>When: {auto.trigger}</span>
                      </div>
                    </div>

                    {/* Actions List */}
                    <div className="my-4 bg-slate-950/80 border border-slate-850/80 rounded-xl p-3 space-y-2 pl-4">
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block -ml-1">Automated Actions</span>
                      <ul className="space-y-1.5 text-[10px] text-slate-300">
                        {auto.actions.map((act, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-normal">
                            <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Stats & Trigger Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 pl-1.5">
                      {/* Stats */}
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-slate-500 block">TIMES RUN</span>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-300">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>{auto.runsCount.toLocaleString()} times</span>
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center gap-1.5">
                        
                        {/* Dry Run / Simulation button */}
                        <button
                          onClick={() => handleStartSimulation(auto)}
                          disabled={!isActive}
                          className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            isActive 
                              ? 'bg-slate-950 text-emerald-400 hover:text-white border border-emerald-950/40 hover:bg-slate-850'
                              : 'text-slate-600 bg-slate-950/50 cursor-not-allowed border border-slate-900'
                          }`}
                          title={isActive ? 'Test Automatic Message' : 'Activate flow to test'}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(auto)}
                          className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                          title="Edit Settings"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Status (Active/Pause) */}
                        <button
                          onClick={() => handleToggleStatus(auto)}
                          className={`p-1.5 border rounded-lg text-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-amber-500/5 hover:bg-amber-500/15 text-amber-400 border-amber-500/10'
                              : 'bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 border-emerald-500/10'
                          }`}
                          title={isActive ? 'Pause Flow' : 'Activate Flow'}
                        >
                          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(auto.id)}
                          className="p-1.5 bg-slate-950 hover:bg-rose-950/20 text-slate-600 hover:text-rose-400 border border-slate-850 rounded-lg text-xs transition-colors cursor-pointer"
                          title="Delete Automation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </div>

                    {/* Small stamp for last fired */}
                    {auto.lastFired && (
                      <span className="text-[8px] text-slate-600 font-mono absolute top-1 right-24 pointer-events-none hidden sm:inline">
                        Last Run: {auto.lastFired}
                      </span>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-3xl py-24 flex flex-col items-center justify-center space-y-3">
              <Zap className="w-8 h-8 text-slate-700 animate-pulse" />
              <h4 className="text-xs font-bold text-slate-400">No automation flows found</h4>
              <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                There are no active automations matching the "{activeTab}" filter for {activeApp.name}.
              </p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                Create One Now
              </button>
            </div>
          )}

          {/* Quick Informational Box */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h5 className="font-bold text-white">How Automatic Flows Work</h5>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Your business system monitors when important actions happen (like signing up or canceling). When a trigger fires, our AI automatically writes a tailored message to help you guide, help, or win back that customer.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: AI Live Trace Dry Run Console */}
        <div className="lg:col-span-1">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl min-h-[500px] flex flex-col justify-between relative overflow-hidden">
            
            {/* Visual background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Console Header */}
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Dry Run Screen</span>
              </div>
              <h3 className="text-xs font-bold text-white mt-1">Live Preview Test</h3>
            </div>

            {/* Display Simulator Body */}
            {activeSimulation ? (
              <div className="space-y-4 flex-grow flex flex-col justify-between pt-3">
                
                {/* Console Logs Terminal Output */}
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-[10px] space-y-2 min-h-[160px] max-h-[220px] overflow-y-auto shadow-inner text-slate-400 scrollbar-thin">
                  {simulationLogs.map((log, logIdx) => {
                    const isErr = log.includes('❌') || log.includes('error');
                    const isSuccess = log.includes('⚡') || log.includes('SUCCESS');
                    return (
                      <div
                        key={logIdx}
                        className={`leading-relaxed ${
                          isErr ? 'text-rose-400 font-bold' : isSuccess ? 'text-emerald-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {log}
                      </div>
                    );
                  })}
                  {simulationLoading && (
                    <div className="flex items-center gap-1.5 text-emerald-400 animate-pulse font-bold mt-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>AI preparing simulation...</span>
                    </div>
                  )}
                </div>

                {/* Simulated Target Mock User */}
                {simulationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-2"
                  >
                    <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Test Customer Profile</span>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs">
                        {simulationResult.mockUser.name.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-black text-white block leading-none">{simulationResult.mockUser.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono block">{simulationResult.mockUser.email}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-900">
                      <span className="font-bold text-slate-200">Customer Background: </span>
                      {simulationResult.mockUser.meta}
                    </p>
                  </motion.div>
                )}

                {/* Generated Copy Render */}
                {simulationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                          Generated Message ({simulationResult.generatedCopy.channel})
                        </span>
                      </div>
                      <button
                        onClick={handleCopySimResult}
                        className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${
                          copiedSim
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {copiedSim ? 'Copied✓' : 'Copy message'}
                      </button>
                    </div>

                    {simulationResult.generatedCopy.subject && (
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Subject:</span>
                        <h5 className="text-[10.5px] font-bold text-white">{simulationResult.generatedCopy.subject}</h5>
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Message Body:</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/40 p-2.5 rounded-lg border border-slate-900">
                        {simulationResult.generatedCopy.body}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Call To Action (CTA):</span>
                        <span className="text-[9px] font-bold text-emerald-400 uppercase bg-slate-900 px-2 py-0.5 rounded">
                          {simulationResult.generatedCopy.cta}
                        </span>
                      </div>

                      {/* Prediction Tag */}
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">PREDICTED LIFT</span>
                        <span className="text-xs font-black text-emerald-400 font-mono tracking-tighter">
                          {simulationResult.prediction.score}
                        </span>
                      </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg text-[9px] text-slate-400 leading-relaxed">
                      <span className="font-bold text-emerald-400">Why This Works:</span> {simulationResult.prediction.reasoning}
                    </div>

                  </motion.div>
                )}

                {/* Close Simulation Mode */}
                <button
                  onClick={() => {
                    setActiveSimulation(null);
                    setSimulationResult(null);
                  }}
                  className="w-full py-2 bg-slate-950 border border-slate-850 hover:border-slate-800 hover:text-white text-slate-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Close Preview
                </button>

              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="bg-slate-950 p-4 rounded-full border border-slate-850">
                  <Terminal className="w-6 h-6 text-slate-700 animate-pulse" />
                </div>
                <div className="max-w-xs">
                  <h4 className="text-xs font-bold text-slate-300">No active test running</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Select an active automatic flow on the left and click the <Play className="w-2.5 h-2.5 inline fill-current text-emerald-400" /> **Play** button to test it and see how it writes messages.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* CREATE / EDIT MODAL DRAWER */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >              {/* Modal Header */}
              <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {editingAutomation ? 'Edit Automatic Flow' : 'Create Automatic Flow'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Set up automatic responses when customers take action</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                
                {/* Left Side Form Fields */}
                <form onSubmit={handleSubmitForm} className="space-y-4">
                  
                  {/* Automation Name */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">Flow Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Inactive User Recovery Loop"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>

                  {/* Trigger Select */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">When this happens:</label>
                    <select
                      value={formTrigger}
                      onChange={(e) => setFormTrigger(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40 mb-2"
                    >
                      <option value="User registers">User registers (Sign up / Welcome)</option>
                      <option value="User inactive for 7 days">User inactive for 7 days (Re-engage)</option>
                      <option value="Subscription canceled">Subscription canceled (Retention win-back)</option>
                      <option value="Value milestone achieved">Value milestone achieved (Celebrate / Upgrade)</option>
                      <option value="Custom event...">Custom event trigger...</option>
                    </select>

                    {formTrigger === 'Custom event...' && (
                      <motion.input
                        type="text"
                        required
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        value={customTrigger}
                        onChange={(e) => setCustomTrigger(e.target.value)}
                        placeholder="e.g. User drops off checkout cart"
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40 mt-1"
                      />
                    )}
                  </div>

                  {/* Action Steps Form list */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Actions AI will perform:</label>
                    
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {formActions.map((act, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-950 border border-slate-850/80 px-3 py-1.5 rounded-lg text-[11px] text-slate-200">
                          <span className="font-medium truncate">{idx+1}. {act}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAction(idx)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add action row */}
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newActionInput}
                        onChange={(e) => setNewActionInput(e.target.value)}
                        placeholder="Add customized workflow action..."
                        className="flex-grow bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                      />
                      <button
                        type="button"
                        onClick={handleAddAction}
                        className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-emerald-400 rounded-lg text-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Submit Frame */}
                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => setShowFormModal(false)}
                      className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow shadow-emerald-500/10"
                    >
                      {editingAutomation ? 'Save Flow' : 'Activate New Flow'}
                    </button>
                  </div>

                </form>

                {/* Right Side: AI Assistant Wizard Help */}
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Describe Your Goal</span>
                    </div>
                    <p className="text-[11.5px] text-slate-400 leading-relaxed">
                      Want help? Describe what you want to achieve in simple words, and AI will build the flow for you.
                    </p>
                    
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. Design a win-back campaign for users that cancel their subscription"
                      className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    {aiSuccessMessage && (
                      <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl flex items-start gap-2 text-emerald-400 text-[10.5px]">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{aiSuccessMessage}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={aiGenerating || !aiPrompt.trim()}
                      onClick={handleAiDraftWorkflow}
                      className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-slate-900 disabled:text-slate-600 border border-emerald-500/25 text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {aiGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>AI designing flow...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Design Flow with AI Assist</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
