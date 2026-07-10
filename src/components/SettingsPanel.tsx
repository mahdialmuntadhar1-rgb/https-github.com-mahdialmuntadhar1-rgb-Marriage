/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConnectedApp } from '../types';
import { 
  User, 
  Users, 
  Layers, 
  Sparkles, 
  Cpu, 
  Link2, 
  ShieldCheck, 
  CreditCard, 
  Plus, 
  Trash2, 
  Lock, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  ChevronRight,
  Globe,
  Settings,
  HelpCircle,
  Eye,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsPanelProps {
  activeApp: ConnectedApp;
  apps: ConnectedApp[];
  onSelectApp: (id: string) => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Growth Lead' | 'Product Manager' | 'Marketing Specialist';
  avatar: string;
}

interface AutomationRule {
  id: string;
  name: string;
  triggerEvent: string;
  action: string;
  enabled: boolean;
}

export default function SettingsPanel({ activeApp, apps, onSelectApp }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<'account' | 'team' | 'apps' | 'ai' | 'automation' | 'api' | 'security' | 'billing'>('account');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // SECTION STATES
  // Account settings
  const [workspaceName, setWorkspaceName] = useState('Growth OS Primary Hub');
  const [userEmail, setUserEmail] = useState('shkar9441@gmail.com');
  const [userName, setUserName] = useState('Shkar Matrimonial Lead');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('GMT+3 (Baghdad Standard Time)');

  // Team Members
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Shkar', email: 'shkar9441@gmail.com', role: 'Owner', avatar: 'S' },
    { id: '2', name: 'Amina Al-Hassan', email: 'amina@growth-os.internal', role: 'Growth Lead', avatar: 'A' },
    { id: '3', name: 'Zaid Karim', email: 'zaid@growth-os.internal', role: 'Marketing Specialist', avatar: 'Z' }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Owner' | 'Growth Lead' | 'Product Manager' | 'Marketing Specialist'>('Marketing Specialist');

  // AI Preferences
  const [selectedModel, setSelectedModel] = useState('fast-balanced');
  const [reportDepth, setReportDepth] = useState<'summarized' | 'comprehensive' | 'hyper-detailed'>('comprehensive');
  const [geoPriority, setGeoPriority] = useState('Iraq (prioritize Baghdad, Basra, Erbil segments)');
  const [strictPrivacy, setStrictPrivacy] = useState(true);

  // Automation Rules
  const [rules, setRules] = useState<AutomationRule[]>([
    { id: '1', name: '10% Drop in Signups Alert', triggerEvent: 'Signups drop by 10% over 48 hours', action: 'Send urgent alert to Owner', enabled: true },
    { id: '2', name: 'New Milestone Content Suggestion', triggerEvent: 'Customer retention increases by over 12%', action: 'Auto-generate draft copy in Content Studio', enabled: true },
    { id: '3', name: 'Ad-Spend Conversion Watchdog', triggerEvent: 'Conversion drops under 4%', action: 'Pause secondary Meta campaigns', enabled: false }
  ]);

  // API Connections
  const [stripeConnected, setStripeConnected] = useState(true);
  const [metaConnected, setMetaConnected] = useState(true);
  const [customWebhookUrl, setCustomWebhookUrl] = useState('https://hooks.growth-os.com/v1/sync');
  
  // Save Notification Toast state
  const [showToast, setShowToast] = useState(false);

  const triggerSaveNotification = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;
    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      avatar: newMemberName.charAt(0).toUpperCase()
    };
    setTeam(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    triggerSaveNotification();
  };

  const handleDeleteTeamMember = (id: string) => {
    if (id === '1') return; // protect owner
    setTeam(prev => prev.filter(m => m.id !== id));
    triggerSaveNotification();
  };

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    triggerSaveNotification();
  };

  return (
    <div className="space-y-6 font-sans" id="settings-workspace">
      
      {/* Settings Toast Alerts */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-emerald-500 text-slate-950 px-4.5 py-2.5 rounded-xl font-bold font-mono text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Workspace preference updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title & Stats Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <Settings className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Workspace Settings & Admin Control
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Workspace Conf
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure basic account preferences, manage team access, adjust automatic rules, and check security.
            </p>
          </div>
        </div>

        {/* Keep it Simple - Advanced settings can be hidden toggle */}
        <button
          onClick={() => setShowAdvanced(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showAdvanced 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
              : 'bg-slate-950 border border-slate-850 text-slate-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}</span>
        </button>
      </div>

      {/* Grid structure: Left nav rails, Right detail frames */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Nav menu list */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-3 rounded-2.5xl space-y-1.5 shadow-md">
          <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block px-3 py-1.5">
            Admin Directory
          </span>

          {[
            { id: 'account', name: 'Account', icon: User, desc: 'Profile & workspace metrics' },
            { id: 'team', name: 'Team Members', icon: Users, desc: 'Workspace collaborators' },
            { id: 'apps', name: 'Connected Apps', icon: Layers, desc: 'Manage linked apps' },
            { id: 'ai', name: 'AI Preferences', icon: Sparkles, desc: 'AI helper preferences' },
            { id: 'automation', name: 'Automation Rules', icon: Cpu, desc: 'Alert rules & actions' },
            { id: 'api', name: 'API Connections', icon: Link2, desc: 'Linked platforms' },
            { id: 'security', name: 'Security', icon: ShieldCheck, desc: 'Safety & verification' },
            { id: 'billing', name: 'Billing', icon: CreditCard, desc: 'Subscription & limits' }
          ].map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`w-full flex items-center justify-between text-left p-3 rounded-xl transition-all cursor-pointer group ${
                  isSelected 
                    ? 'bg-emerald-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:bg-slate-950/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`} />
                  <div>
                    <span className="text-xs block font-bold leading-tight">{sec.name}</span>
                    <span className={`text-[9px] block font-mono mt-0.5 leading-none ${
                      isSelected ? 'text-slate-950/70 font-medium' : 'text-slate-500'
                    }`}>
                      {sec.desc}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                  isSelected ? 'text-slate-950 translate-x-0.5' : 'text-slate-600 group-hover:translate-x-0.5'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Right Detail Panels Area */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          
          {/* Section Header */}
          <div className="border-b border-slate-850 pb-4">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">SETTINGS CATEGORY</span>
            <h3 className="text-sm font-black text-white mt-1 capitalize flex items-center gap-2">
              {activeSection === 'api' ? 'Platform Connections & Integrations' : activeSection} Settings
            </h3>
          </div>

          {/* SECTION CONTENTS */}
          
          {/* 1. ACCOUNT */}
          {activeSection === 'account' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Workspace Display Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Default Currency Indicator</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="USD ($)">USD ($) - American Dollar</option>
                    <option value="IQD (ع.د)">IQD (ع.د) - Iraqi Dinar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Account Owner Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Primary Contact Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Local Timezone Configuration</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="GMT+3 (Baghdad Standard Time)">GMT+3 (Baghdad Standard Time)</option>
                  <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                  <option value="GMT+1 (Central European Time)">GMT+1 (Central European Time)</option>
                </select>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  These values modify diagnostic report templates, localization calculations, currency overlays, and scheduled dispatch notifications.
                </p>
              </div>

              <button
                onClick={triggerSaveNotification}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Save Profile Configuration
              </button>
            </div>
          )}

          {/* 2. TEAM MEMBERS */}
          {activeSection === 'team' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Currently Authorized Users ({team.length})</span>
                
                <div className="space-y-2">
                  {team.map((member) => (
                    <div key={member.id} className="bg-slate-950/60 border border-slate-850 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{member.name}</span>
                            <span className="text-[8px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.2 rounded-full">
                              {member.role}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{member.email}</span>
                        </div>
                      </div>

                      {member.role !== 'Owner' ? (
                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/5 border border-slate-800 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 px-2 uppercase font-bold">PRIMARY ACCOUNT</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Member Form */}
              <form onSubmit={handleAddTeamMember} className="border-t border-slate-850 pt-5 space-y-4">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Invite New Teammate</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. amina@firm.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 uppercase mb-1">Workspace Role</label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Growth Lead">Growth Lead</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Marketing Specialist">Marketing Specialist</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-950/80 border border-slate-850 text-emerald-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Send Workspace Invitation</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. CONNECTED APPS LIST */}
          {activeSection === 'apps' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Connected Apps Status</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apps.map((app) => {
                  const isCurrent = app.id === activeApp.id;
                  return (
                    <div key={app.id} className={`p-4 bg-slate-950/60 border rounded-2xl flex flex-col justify-between h-[130px] ${
                      isCurrent ? 'border-emerald-500/25' : 'border-slate-850'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{app.name}</h4>
                          <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                            ACTIVE SYNC
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{app.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[10px] text-slate-500 font-mono">
                        <span>Linked ID: app_{app.id}</span>
                        {isCurrent ? (
                          <span className="text-emerald-400 font-bold">Currently Inspected</span>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectApp(app.id);
                              triggerSaveNotification();
                            }}
                            className="text-slate-400 hover:text-white transition-all cursor-pointer"
                          >
                            Set Active app
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. AI PREFERENCES */}
          {activeSection === 'ai' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">AI Thinking Speed</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="fast-balanced">Fast & Balanced (Recommended)</option>
                    <option value="deep-thinker">Deep Thinker (Detailed insights)</option>
                    <option value="quick-check">Quick Checks Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Diagnostic Report Length</label>
                  <select
                    value={reportDepth}
                    onChange={(e) => setReportDepth(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="summarized">Summarized (Actionable, key pointers only)</option>
                    <option value="comprehensive">Comprehensive (Includes cohort tables, customer root causes)</option>
                    <option value="hyper-detailed">Hyper-Detailed (Full market analysis, growth plans)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Primary Segment Focus Range</label>
                <input
                  type="text"
                  value={geoPriority}
                  onChange={(e) => setGeoPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Privacy Shield</span>
                
                <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">PII Data Scrubbing Active</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">Growth OS automatically strips emails, clear passwords, and user addresses before data is sent to AI services.</p>
                    </div>
                  </div>

                  <div className="w-9 h-5 rounded-full bg-slate-900 border border-slate-800 relative p-0.5 flex transition-colors">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 translate-x-4" />
                  </div>
                </div>
              </div>

              <button
                onClick={triggerSaveNotification}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Apply AI Preferences
              </button>
            </div>
          )}

          {/* 5. AUTOMATION RULES */}
          {activeSection === 'automation' && (
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Automatic Event Helpers</span>
              
              <div className="space-y-2.5">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      rule.enabled ? 'bg-slate-950/60 border-emerald-500/25' : 'bg-slate-950/10 border-slate-850 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{rule.name}</h4>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase ${
                          rule.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'
                        }`}>
                          {rule.enabled ? 'Active' : 'Dormant'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Trigger: <code className="text-slate-300 font-mono">{rule.triggerEvent}</code>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Action: <code className="text-emerald-400 font-mono">{rule.action}</code>
                      </p>
                    </div>

                    <div
                      onClick={() => handleToggleRule(rule.id)}
                      className="w-9 h-5 rounded-full bg-slate-900 border border-slate-800 relative p-0.5 flex transition-colors cursor-pointer"
                    >
                      <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                        rule.enabled ? 'bg-emerald-500 translate-x-4' : 'bg-slate-600 translate-x-0'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. API CONNECTIONS */}
          {activeSection === 'api' && (
            <div className="space-y-5">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Platform Integrations</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Stripe Connected Card */}
                <div className={`p-4 bg-slate-950/60 border rounded-2xl flex flex-col justify-between h-[130px] ${
                  stripeConnected ? 'border-emerald-500/25' : 'border-slate-850'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Stripe Integration</span>
                      <span className="text-[8px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                        CONNECTED
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                      Syncs sales history, subscription status changes, and checkout activity.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                    <span className="text-[9px] font-mono text-slate-500">Last sync: 12m ago</span>
                    <button
                      onClick={() => {
                        setStripeConnected(prev => !prev);
                        triggerSaveNotification();
                      }}
                      className="text-[9.5px] font-mono text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                    >
                      {stripeConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>

                {/* Meta Ads API Connected Card */}
                <div className={`p-4 bg-slate-950/60 border rounded-2xl flex flex-col justify-between h-[130px] ${
                  metaConnected ? 'border-emerald-500/25' : 'border-slate-850'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Meta Marketing Graph</span>
                      <span className="text-[8px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                        CONNECTED
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                      Syncs advertising engagement rates and campaign conversion trends.
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                    <span className="text-[9px] font-mono text-slate-500">Last sync: 2h ago</span>
                    <button
                      onClick={() => {
                        setMetaConnected(prev => !prev);
                        triggerSaveNotification();
                      }}
                      className="text-[9.5px] font-mono text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                    >
                      {metaConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Keep it Simple - Advanced can be hidden */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-850 pt-4 space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Info className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Advanced Connection Link</span>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1">Custom Connection Destination URL</label>
                      <input
                        type="url"
                        value={customWebhookUrl}
                        onChange={(e) => setCustomWebhookUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 7. SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-5">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Security & Protection</span>

              <div className="space-y-3">
                <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Strict MFA Requirements</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">Require all team members to log in with secure verification codes.</p>
                    </div>
                  </div>

                  <div className="w-9 h-5 rounded-full bg-slate-900 border border-slate-800 relative p-0.5 flex transition-colors">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 translate-x-4" />
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Automatic Connection Timeout</h5>
                      <p className="text-[10px] text-slate-400 leading-normal">Invalidates stale dashboard cookies and browser sessions after 2 hours of inactivity.</p>
                    </div>
                  </div>

                  <div className="w-9 h-5 rounded-full bg-slate-900 border border-slate-800 relative p-0.5 flex transition-colors">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 translate-x-4" />
                  </div>
                </div>
              </div>

              {/* Hideable TLS details */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-850 pt-4 space-y-2 overflow-hidden text-[10px] font-mono text-slate-500 leading-relaxed"
                  >
                    <span className="font-bold text-slate-400">SECURITY CERTIFICATION:</span>
                    <p>ECDHE-RSA-AES128-GCM-SHA256 • Certificates updated automatically every 90 days. Next renewal: September 15, 2026.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 8. BILLING */}
          {activeSection === 'billing' && (
            <div className="space-y-5">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Subscription Plan</span>

              <div className="bg-gradient-to-tr from-slate-950 to-slate-900 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-mono font-black px-4.5 py-1.5 uppercase tracking-wider rounded-bl-2xl">
                  Growth OS Scale Tier
                </div>

                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">WORKSPACE PLAN</span>
                <h4 className="text-lg font-black text-white mt-1">Growth OS Enterprise Pro</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-md">Unlimited connected apps, custom visual integrations, instant sync, and full-spectrum custom business recommendations.</p>
                
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-2xl font-mono font-black text-emerald-400">$299</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">/ per month</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Upcoming Statements</span>
                
                <div className="bg-slate-950/40 border border-slate-850 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-white">Next Renewal Date: August 1, 2026</span>
                  </div>
                  <span className="font-mono text-emerald-400">$299.00 USD</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
