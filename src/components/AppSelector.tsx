/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConnectedApp, BusinessModelType } from '../types';
import { Plus, AppWindow, Radio, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppSelectorProps {
  apps: ConnectedApp[];
  activeAppId: string;
  onSelectApp: (id: string) => void;
  onConnectApp: (newApp: Omit<ConnectedApp, 'id' | 'connectedAt' | 'status' | 'metrics'>) => void;
}

export default function AppSelector({ apps, activeAppId, onSelectApp, onConnectApp }: AppSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [businessModel, setBusinessModel] = useState<BusinessModelType>('SaaS');

  const activeApp = apps.find(a => a.id === activeAppId) || apps[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !targetAudience) return;

    onConnectApp({
      name,
      description,
      targetAudience,
      businessModel,
    });

    // Reset Form
    setName('');
    setDescription('');
    setTargetAudience('');
    setBusinessModel('SaaS');
    setIsOpen(false);
  };

  return (
    <div className="relative" id="app-selector-container">
      {/* Active App Header Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <AppWindow className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest">Active Business</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{activeApp.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* List connected apps quick switchers */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-800/80 rounded-xl">
            {apps.map((app) => {
              const isActive = app.id === activeAppId;
              return (
                <button
                  key={app.id}
                  id={`quick-app-${app.id}`}
                  onClick={() => onSelectApp(app.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  {app.name}
                </button>
              );
            })}
          </div>

          <button
            id="connect-app-trigger"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Business</span>
          </button>
        </div>
      </div>

      {/* Connect New App Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" id="connect-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Add New Business idea</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Let our AI build custom metrics and copy plans for your product.</p>
                </div>
                <button
                  id="close-connect-modal"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg text-sm transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Business / App Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zawaj, EduQuest, MySaaS"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">How you charge</label>
                    <select
                      value={businessModel}
                      onChange={(e) => setBusinessModel(e.target.value as BusinessModelType)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                    >
                      <option value="SaaS">Subscription Plan</option>
                      <option value="Marketplace">Marketplace (P2P)</option>
                      <option value="Matchmaking">Premium matchmaking</option>
                      <option value="Education">Course fees / Gamified</option>
                      <option value="SaaS/B2B">Enterprise B2B billing</option>
                      <option value="Mobile App">Free app with ads/addons</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">AI Insight Engine Mode</label>
                    <div className="w-full bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-emerald-400 flex items-center gap-2 font-mono">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Smart Business Scan</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">What does this business sell or offer?</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what your product does, its main value, and how it helps customers..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Who is your ideal customer?</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Young professionals looking for relationships, parents needing tutoring..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Build My AI growth Dashboard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
