/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { ConnectedApp, BusinessModelType, AppMetrics } from '../types';
import { 
  AppWindow, 
  Layers, 
  CheckCircle2, 
  Plus, 
  Database, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Activity, 
  RefreshCw, 
  UserCheck, 
  BarChart3, 
  FileText, 
  Send, 
  Check, 
  Smartphone, 
  Lock, 
  Terminal,
  Clock,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConnectedAppsMarketplaceProps {
  apps: ConnectedApp[];
  activeAppId: string;
  onSelectApp: (id: string) => void;
  onConnectApp: (newApp: Omit<ConnectedApp, 'id' | 'connectedAt' | 'status' | 'metrics'>) => void;
}

// Available platform integrations templates
interface IntegrationTemplate {
  id: string;
  name: string;
  category: string;
  businessModel: BusinessModelType;
  description: string;
  icon: React.ComponentType<any>;
  defaultCapabilities: string[];
}

const INTEGRATION_TEMPLATES: IntegrationTemplate[] = [
  {
    id: 'postgres_db',
    name: 'Custom PostgreSQL Database',
    category: 'Database',
    businessModel: 'SaaS',
    description: 'Connect direct read-replicas of your product tables to parse active cohort logs.',
    icon: Database,
    defaultCapabilities: ['Users', 'Analytics', 'Retention Logs']
  },
  {
    id: 'supabase_app',
    name: 'Supabase Project',
    category: 'Backend',
    businessModel: 'Mobile App',
    description: 'Sync postgres tables, edge functions telemetry, and auth tables instantly.',
    icon: Layers,
    defaultCapabilities: ['Users', 'Analytics', 'Content']
  },
  {
    id: 'firebase_app',
    name: 'Firebase Firestore',
    category: 'Backend',
    businessModel: 'SaaS',
    description: 'Stream live collection documents to feed the AI diagnostic intelligence engine.',
    icon: AppWindow,
    defaultCapabilities: ['Users', 'Analytics', 'Campaigns']
  },
  {
    id: 'custom_api',
    name: 'Custom REST Endpoint',
    category: 'API Integration',
    businessModel: 'SaaS/B2B',
    description: 'Trigger periodic webhooks to pull active client usage data.',
    icon: Terminal,
    defaultCapabilities: ['Users', 'Analytics', 'Content', 'Campaigns']
  }
];

export default function ConnectedAppsMarketplace({
  apps,
  activeAppId,
  onSelectApp,
  onConnectApp
}: ConnectedAppsMarketplaceProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Wizard Input States
  const [selectedTemplate, setSelectedTemplate] = useState<string>('postgres_db');
  const [customAppName, setCustomAppName] = useState('');
  const [customAppDesc, setCustomAppDesc] = useState('');
  const [customAppAudience, setCustomAppAudience] = useState('');
  const [customAppModel, setCustomAppModel] = useState<BusinessModelType>('SaaS');
  
  // Auth Inputs
  const [dbHost, setDbHost] = useState('db.growth-os.internal');
  const [dbPort, setDbPort] = useState('5432');
  const [dbName, setDbName] = useState('production_metrics');
  const [dbUser, setDbUser] = useState('growth_read_only');
  const [dbPass, setDbPass] = useState('••••••••••••••••');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'failed'>('idle');

  // Permission Scopes
  const [permissions, setPermissions] = useState({
    users: true,
    analytics: true,
    content: true,
    campaigns: true
  });

  // AI Services activation
  const [aiServices, setAiServices] = useState({
    diagnostics: true,
    smsAlerts: true,
    contentSync: true
  });

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestResult('idle');
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult('success');
    }, 1200);
  };

  const handleFinishWizard = () => {
    const finalName = customAppName || (INTEGRATION_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'New App');
    const finalDesc = customAppDesc || 'Synced workspace processing custom user events and telemetry streams.';
    const finalAudience = customAppAudience || 'Active premium subscribers and newly registered checkout prospects.';
    
    onConnectApp({
      name: finalName,
      description: finalDesc,
      targetAudience: finalAudience,
      businessModel: customAppModel
    });

    // Reset wizard
    setShowWizard(false);
    setWizardStep(1);
    setCustomAppName('');
    setCustomAppDesc('');
    setCustomAppAudience('');
    setCustomAppModel('SaaS');
    setTestResult('idle');
  };

  // List of hardcoded/predefined capabilities for preset cards as per User specification
  const getAppCapabilities = (appId: string) => {
    switch (appId) {
      case 'zawaj':
        return ['Users', 'Analytics', 'Content', 'Campaigns'];
      case 'eduquest':
        return ['Users', 'Analytics', 'Parent Dashboards', 'Telemetry'];
      case 'localcart':
        return ['Users', 'Analytics', 'Vendor Listings', 'Order Flows'];
      case 'taskpulse':
        return ['Users', 'Analytics', 'Slack Transcripts', 'Sprint Tasks'];
      default:
        // Build dynamic list based on selected permissions
        const caps = [];
        if (permissions.users) caps.push('Users');
        if (permissions.analytics) caps.push('Analytics');
        if (permissions.content) caps.push('Content');
        if (permissions.campaigns) caps.push('Campaigns');
        return caps.length > 0 ? caps : ['Users', 'Analytics'];
    }
  };

  return (
    <div className="space-y-6 font-sans" id="apps-marketplace-workspace">
      
      {/* Title & Stats Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <Layers className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Connected Applications Marketplace
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Multi-Tenant Sync
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect external app stores, live PostgreSQL clusters, or third-party CRM systems. Route data scopes into the AI Growth Engine.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowWizard(true);
            setWizardStep(1);
          }}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer self-start md:self-auto hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showWizard ? (
          /* SECTION 1: CONNECTED APPS GRID */
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                Currently Synced Applications ({apps.length})
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>All pipelines operational</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {apps.map((app) => {
                const isActive = app.id === activeAppId;
                const capabilities = getAppCapabilities(app.id);

                return (
                  <div
                    key={app.id}
                    className={`bg-slate-900 border rounded-2xl p-5.5 transition-all flex flex-col justify-between h-[230px] relative overflow-hidden group ${
                      isActive 
                        ? 'border-emerald-500/40 ring-1 ring-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                        : 'border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    {/* Glowing background hint */}
                    {isActive && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    )}

                    {/* Card Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center border ${
                            isActive 
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}>
                            <AppWindow className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white tracking-tight">{app.name}</h3>
                            <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 mt-0.5 inline-block">
                              {app.businessModel}
                            </span>
                          </div>
                        </div>

                        {/* Status Marker */}
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Connected</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11.5px] text-slate-400 mt-3.5 line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>
                    </div>

                    {/* Capabilities Tags & Interaction */}
                    <div className="mt-4 pt-4 border-t border-slate-850/80 flex flex-col gap-3">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1.5">Active Sync Scopes:</span>
                        <div className="flex flex-wrap gap-1">
                          {capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="text-[9px] font-mono bg-slate-950 text-slate-300 border border-slate-850 px-2 py-0.5 rounded-md"
                            >
                              • {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] font-mono text-slate-500">
                          Connected {app.connectedAt}
                        </span>
                        
                        {isActive ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ACTIVE ENVIRONMENT</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectApp(app.id)}
                            className="text-[10px] font-bold text-slate-400 hover:text-white px-3 py-1 bg-slate-950 hover:bg-slate-950/80 border border-slate-850 rounded-lg transition-all cursor-pointer hover:border-slate-700"
                          >
                            Switch to this App
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Empty state disclaimer */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 flex items-start gap-3.5">
              <Lock className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-300 block mb-0.5">TLS 1.3 Encryption active for all connected datastores</span>
                Growth OS secures all tenant datastores in fully isolated Docker micro-sandboxes. We only retrieve non-PII diagnostic metrics such as event logs, retention frequencies, and checkout dropout timelines.
              </div>
            </div>
          </motion.div>
        ) : (
          /* SECTION 2: INTERACTIVE 4-STEP WIZARD */
          <motion.div
            key="wizard-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Wizard Header Status Bar */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-white tracking-tight">SaaS Application Connection Wizard</h3>
                <p className="text-slate-400 text-xs mt-1">Provision a secure growth pipeline in less than two minutes.</p>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer self-start md:self-auto"
              >
                ✕ Cancel Wizard
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-4 border-b border-slate-850 bg-slate-950/25">
              {[
                { step: 1, name: '1. Select App' },
                { step: 2, name: '2. Authenticate' },
                { step: 3, name: '3. Scope Permissions' },
                { step: 4, name: '4. AI Activation' }
              ].map((s) => {
                const isCurrent = wizardStep === s.step;
                const isPassed = wizardStep > s.step;
                return (
                  <div
                    key={s.step}
                    className={`py-3 text-center text-[10px] font-mono font-bold tracking-wider transition-all border-b-2 ${
                      isCurrent 
                        ? 'border-emerald-500 text-emerald-400 bg-slate-950/40' 
                        : isPassed 
                        ? 'border-emerald-500/30 text-emerald-500/60' 
                        : 'border-transparent text-slate-600'
                    }`}
                  >
                    {s.name}
                  </div>
                );
              })}
            </div>

            {/* Wizard Form Viewports */}
            <div className="p-6 min-h-[300px]">
              
              {/* STEP 1: CHOOSE APPLICATION */}
              {wizardStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-emerald-400">Step 1: Choose Datastore Template</h4>
                    <p className="text-xs text-slate-400">Select one of our secure, native platform templates or register a custom API webhook endpoint.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {INTEGRATION_TEMPLATES.map((tpl) => {
                      const Icon = tpl.icon;
                      const isSelected = selectedTemplate === tpl.id;
                      return (
                        <div
                          key={tpl.id}
                          onClick={() => {
                            setSelectedTemplate(tpl.id);
                            // Autofill custom models as default
                            setCustomAppName(tpl.name);
                            setCustomAppModel(tpl.businessModel);
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 relative ${
                            isSelected 
                              ? 'bg-slate-950/60 border-emerald-500/40 ring-1 ring-emerald-500/10' 
                              : 'bg-slate-950/20 border-slate-850 hover:border-slate-800'
                          }`}
                        >
                          <div className={`p-2 rounded-lg border ${
                            isSelected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{tpl.name}</span>
                              <span className="text-[8px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                {tpl.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{tpl.description}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-850 pt-5 space-y-4">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Custom Product Identification:</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Custom App Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. MySaaS, FinTechHub"
                          value={customAppName}
                          onChange={(e) => setCustomAppName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Business Category</label>
                        <select
                          value={customAppModel}
                          onChange={(e) => setCustomAppModel(e.target.value as BusinessModelType)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                        >
                          <option value="SaaS">SaaS (Recurring)</option>
                          <option value="Marketplace">Marketplace (P2P)</option>
                          <option value="Matchmaking">Matchmaking (Privacy)</option>
                          <option value="Education">Education (Gamified)</option>
                          <option value="SaaS/B2B">SaaS / B2B Enterprise</option>
                          <option value="Mobile App">Mobile App / Utility</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">One-Line Pitch</label>
                        <input
                          type="text"
                          placeholder="Describe what your app does in a brief sentence..."
                          value={customAppDesc}
                          onChange={(e) => setCustomAppDesc(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Target Demographic</label>
                        <input
                          type="text"
                          placeholder="e.g. Single developers, tech savvy moms..."
                          value={customAppAudience}
                          onChange={(e) => setCustomAppAudience(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: AUTHENTICATE API / DATABASE */}
              {wizardStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-emerald-400">Step 2: Authenticate Datastore Pipeline</h4>
                    <p className="text-xs text-slate-400">Configure read-only credentials to verify secure socket tunnel handshake with your backend database cluster.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Database Cluster Host</label>
                          <input
                            type="text"
                            value={dbHost}
                            onChange={(e) => setDbHost(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Port</label>
                          <input
                            type="text"
                            value={dbPort}
                            onChange={(e) => setDbPort(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Database Name</label>
                          <input
                            type="text"
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Read User</label>
                          <input
                            type="text"
                            value={dbUser}
                            onChange={(e) => setDbUser(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Password / API Secret</label>
                        <div className="relative">
                          <input
                            type="password"
                            value={dbPass}
                            onChange={(e) => setDbPass(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white font-mono"
                          />
                          <Key className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Connection Diagnostics</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed">Ensure IP whitelisting is toggled. Growth OS connects from static CIDR range <code className="text-emerald-400 font-mono bg-slate-950 px-1 rounded">34.120.44.0/24</code>.</p>
                      </div>

                      <div className="pt-4 space-y-2">
                        <button
                          type="button"
                          onClick={handleTestConnection}
                          disabled={testingConnection}
                          className="w-full py-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          {testingConnection ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                              <span>Handshaking...</span>
                            </>
                          ) : (
                            <>
                              <Activity className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Test API connection</span>
                            </>
                          )}
                        </button>

                        <AnimatePresence>
                          {testResult === 'success' && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1.5 rounded-md text-center"
                            >
                              ✓ TLS 1.3 Handshake verified!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SELECT PERMISSIONS */}
              {wizardStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-emerald-400">Step 3: Define Sync Scope Scopes</h4>
                    <p className="text-xs text-slate-400">Authorize specific query operations. Disable scopes you wish to restrict from the diagnostic pipelines.</p>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      {
                        key: 'users',
                        title: 'Users & Profile Data',
                        desc: 'Read core user demographics, sign up stamps, and verified status configurations.',
                        icon: UserCheck
                      },
                      {
                        key: 'analytics',
                        title: 'Cohort & Telemetry Logs',
                        desc: 'Analyze page views, feature interactions, and chronological metric milestones.',
                        icon: BarChart3
                      },
                      {
                        key: 'content',
                        title: 'Content Studio Hooks',
                        desc: 'Permit direct injection of generated copy and social banners into draft channels.',
                        icon: FileText
                      },
                      {
                        key: 'campaigns',
                        title: 'Automated Campaigns Dispatch',
                        desc: 'Authorize trigger triggers to automatically push SMS alerts or WhatsApp nudges.',
                        icon: Send
                      }
                    ].map((scope) => {
                      const Icon = scope.icon;
                      const isEnabled = (permissions as any)[scope.key];
                      return (
                        <div
                          key={scope.key}
                          onClick={() => setPermissions(prev => ({ ...prev, [scope.key]: !isEnabled }))}
                          className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isEnabled 
                              ? 'bg-slate-950/60 border-emerald-500/25' 
                              : 'bg-slate-950/10 border-slate-850 opacity-60 hover:opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`p-2 rounded-lg ${
                              isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{scope.title}</h5>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{scope.desc}</p>
                            </div>
                          </div>

                          <div className="w-9 h-5 rounded-full bg-slate-900 border border-slate-800 relative p-0.5 flex transition-colors">
                            <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                              isEnabled ? 'bg-emerald-500 translate-x-4' : 'bg-slate-600 translate-x-0'
                            }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ACTIVATE AI SERVICES */}
              {wizardStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-emerald-400">Step 4: Activate Intelligent Agents</h4>
                    <p className="text-xs text-slate-400">Configure deep neural layers. Activated agents run background scans to alert you of funnel blockages.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        key: 'diagnostics',
                        title: 'Gemini Diagnostics',
                        desc: 'Drafts periodic executive packets scanning MRR trails and regional anomalies.',
                        icon: Sparkles
                      },
                      {
                        key: 'smsAlerts',
                        title: 'Funnel Risk Alerts',
                        desc: 'Detects sudden sign up drops or active subscription checkout dropouts.',
                        icon: ShieldCheck
                      },
                      {
                        key: 'contentSync',
                        title: 'Aesthetic Content Sync',
                        desc: 'Syncs draft copies directly with marketing templates based on audience insights.',
                        icon: Layers
                      }
                    ].map((agent) => {
                      const Icon = agent.icon;
                      const isEnabled = (aiServices as any)[agent.key];
                      return (
                        <div
                          key={agent.key}
                          onClick={() => setAiServices(prev => ({ ...prev, [agent.key]: !isEnabled }))}
                          className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all h-[150px] relative ${
                            isEnabled 
                              ? 'bg-slate-950/60 border-emerald-500/25' 
                              : 'bg-slate-950/10 border-slate-850 opacity-60 hover:opacity-80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${
                              isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="w-9 h-5 rounded-full bg-slate-900 border border-slate-800 relative p-0.5 flex transition-colors">
                              <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                                isEnabled ? 'bg-emerald-500 translate-x-4' : 'bg-slate-600 translate-x-0'
                              }`} />
                            </div>
                          </div>

                          <div className="mt-3">
                            <h5 className="text-xs font-bold text-white leading-tight">{agent.title}</h5>
                            <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">{agent.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-2xl p-4.5 flex items-start gap-3 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5 animate-pulse" />
                    <div className="text-[11.5px] leading-relaxed">
                      <span className="font-bold block mb-0.5 text-white">Bootstrap Parameters Configured</span>
                      By clicking activate, Growth OS will securely handshake with your postgres database, compile schemas, and index demographic tables (such as regional user densities) to feed custom AI suggestions.
                    </div>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Wizard Navigation Footer */}
            <div className="p-4 border-t border-slate-850 bg-slate-950/30 flex items-center justify-between">
              <div>
                {wizardStep > 1 ? (
                  <button
                    onClick={() => setWizardStep(prev => (prev - 1) as any)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}
              </div>

              <div>
                {wizardStep < 4 ? (
                  <button
                    onClick={() => setWizardStep(prev => (prev + 1) as any)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishWizard}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Activate Connection & Sync</span>
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
