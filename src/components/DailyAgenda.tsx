/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConnectedApp, GrowthTask } from '../types';
import { CheckCircle2, Circle, AlertTriangle, Lightbulb, ClipboardList, Plus, Calendar, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyAgendaProps {
  activeApp: ConnectedApp;
  tasks: GrowthTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality', priority: 'High' | 'Medium' | 'Low') => void;
  onDeleteTask: (id: string) => void;
}

export default function DailyAgenda({ activeApp, tasks, onToggleTask, onAddTask, onDeleteTask }: DailyAgendaProps) {
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState<'Acquisition' | 'Retention' | 'Monetization' | 'Virality'>('Acquisition');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter tasks specific to the active connected app
  const appTasks = tasks.filter(t => t.appId === activeApp.id);
  const pendingTasks = appTasks.filter(t => !t.completed);
  const completedTasks = appTasks.filter(t => t.completed);

  // Dynamic alerts based on app metric diagnostics
  const getDynamicAlerts = () => {
    const alerts = [];
    const metrics = activeApp.metrics;

    if (metrics.churn > 5) {
      alerts.push({
        id: 'alert_churn',
        type: 'critical',
        title: 'High Churn Leak',
        message: `Current Churn is ${metrics.churn}%. AI suggests implementing customer retention loops or user feedback triggers immediately.`
      });
    }

    if (metrics.viralCo < 0.2) {
      alerts.push({
        id: 'alert_viral',
        type: 'warning',
        title: 'Inactive Organic Growth',
        message: `Viral K-factor is low (${metrics.viralCo}). You are over-relying on paid search. Standardize user-share templates.`
      });
    }

    if (metrics.cac > metrics.arpu * 4) {
      alerts.push({
        id: 'alert_cac',
        type: 'warning',
        title: 'Unbalanced Unit Economics',
        message: `CAC ($${metrics.cac}) is high compared to ARPU ($${metrics.arpu}). Seek organic viral referrals or elevate premium pricing.`
      });
    }

    // Default encouragement if healthy
    if (alerts.length === 0) {
      alerts.push({
        id: 'alert_success',
        type: 'success',
        title: 'Economics Balanced',
        message: 'LTV to CAC ratio is exceptional! Today is optimized for aggressive scaling and viral expansion loops.'
      });
    }

    return alerts;
  };

  const activeAlerts = getDynamicAlerts();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, category, priority);
    setNewTitle('');
    setShowAddForm(false);
  };

  // Generate a custom AI daily briefing text matching Chunk 3 specifications
  const getAiDailyBriefing = () => {
    if (activeApp.id === 'zawaj') {
      return {
        greeting: "Good morning, Founder.",
        insights: "Your Zawaj platform's viral referral loop grew 12% this week. However, profile completion decreased by 4% among new users during Wali (Guardian) registration.",
        recommendation: "Launch Wali onboarding guide template copy in Content Studio to improve trust."
      };
    } else if (activeApp.id === 'eduquest') {
      return {
        greeting: "Good morning, Founder.",
        insights: "EduQuest math quest streaks are up 8% since Monday! STEM lesson completion is strong, but inactive alerts triggered for the weekend cohort.",
        recommendation: "Activate the 'Re-engage Inactive' channel campaign in Content Studio now."
      };
    } else {
      return {
        greeting: "Good morning, Founder.",
        insights: `Your ${activeApp.name} platform is steady. Active subscription conversion is healthy at $${activeApp.metrics.arpu}/user, but organic K-coefficient (${activeApp.metrics.viralCo}) is flat.`,
        recommendation: "Generate a custom referral campaign inside Content Studio to trigger virality."
      };
    }
  };

  const briefing = getAiDailyBriefing();

  return (
    <div className="space-y-6" id="daily-agenda-workspace">
      
      {/* CHUNK 3: AI Daily Briefing Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden" id="ai-daily-briefing-banner">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
              ✨ AI Daily Briefing
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight font-display">{briefing.greeting}</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl font-sans">
              {briefing.insights}
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl md:max-w-xs shrink-0 space-y-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest block">Recommended Play</span>
            <p className="text-xs font-semibold text-white leading-tight">{briefing.recommendation}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts & Critical Notifications Center */}
      <div className="lg:col-span-1 space-y-4" id="ai-alert-center">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Growth Brain Alerts</h3>
        
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all ${
                alert.type === 'critical'
                  ? 'bg-rose-950/20 border-rose-900/30 text-rose-300'
                  : alert.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-900/30 text-amber-300'
                  : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
              }`}
              id={`alert-node-${alert.id}`}
            >
              <div className="flex items-start gap-3">
                {alert.type === 'critical' || alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                ) : (
                  <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                )}
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-white">{alert.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Context Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <ClipboardList className="w-4 h-4" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Demographic Anchor</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI is optimizing all generated copy and recommendations specifically targeting:
            <strong className="block text-slate-200 mt-1">{activeApp.targetAudience}</strong>
          </p>
        </div>
      </div>

      {/* Main Checklist / Task Center */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6" id="daily-checklist-container">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-emerald-400" />
              Your Action Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">High-impact tasks generated by AI matching active growth experiments.</p>
          </div>

          <button
            id="agenda-add-task-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700/60 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Add Task Collapsible Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleFormSubmit}
              className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-4 overflow-hidden"
              id="add-task-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Test referral pricing page flow..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Acquisition">Acquisition</option>
                    <option value="Retention">Retention</option>
                    <option value="Monetization">Monetization</option>
                    <option value="Virality">Virality</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-4">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Priority:</span>
                  <div className="flex gap-2">
                    {['High', 'Medium', 'Low'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p as any)}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                          priority === p
                            ? 'bg-emerald-500 text-slate-950 font-extrabold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Checklist Queue */}
        <div className="space-y-6" id="tasks-queue-center">
          
          {/* CHUNK 3: Priority Actions Cards Grid */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <span>Today's Focus (By Priority)</span>
              <span className="bg-slate-800 text-slate-300 text-[8px] px-1.5 py-0.5 rounded-full font-mono">{pendingTasks.length}</span>
            </h4>

            {pendingTasks.length === 0 ? (
              <div className="bg-slate-950/35 border border-slate-800/40 rounded-2xl p-6 text-center text-slate-500 text-xs py-10">
                🎉 Awesome! All pending growth plays are executed today. Connect other apps or generate more recommendations to scale further.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* High Priority Lane */}
                <div className="bg-slate-950/20 border border-rose-950/30 rounded-2xl p-4 flex flex-col justify-between" id="priority-lane-high">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/10 px-2 py-0.5 rounded uppercase">
                        High Priority
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {pendingTasks.filter(t => t.priority === 'High').length} left
                      </span>
                    </div>
                    {pendingTasks.filter(t => t.priority === 'High').length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic py-4">All clear. Onboarding pathways are healthy.</p>
                    ) : (
                      <div className="space-y-2">
                        {pendingTasks.filter(t => t.priority === 'High').map((task) => (
                          <div
                            key={task.id}
                            className="group bg-slate-900 border border-slate-800 hover:border-rose-900/40 rounded-xl p-3 flex flex-col justify-between gap-2.5 transition-all"
                            id={`task-node-${task.id}`}
                          >
                            <span className="text-xs text-slate-200 font-medium leading-normal">{task.title}</span>
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/50">
                              <span className="text-[8px] font-mono bg-slate-950 text-slate-500 px-1 py-0.5 rounded">
                                {task.category}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => onToggleTask(task.id)}
                                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                  title="Complete"
                                >
                                  <Circle className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Execute</span>
                                </button>
                                <button
                                  onClick={() => onDeleteTask(task.id)}
                                  className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                                  title="Delete task"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Medium Priority Lane */}
                <div className="bg-slate-950/20 border border-amber-950/30 rounded-2xl p-4 flex flex-col justify-between" id="priority-lane-medium">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/10 px-2 py-0.5 rounded uppercase">
                        Medium Priority
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {pendingTasks.filter(t => t.priority === 'Medium').length} left
                      </span>
                    </div>
                    {pendingTasks.filter(t => t.priority === 'Medium').length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic py-4">All clear. Standard plays are operating.</p>
                    ) : (
                      <div className="space-y-2">
                        {pendingTasks.filter(t => t.priority === 'Medium').map((task) => (
                          <div
                            key={task.id}
                            className="group bg-slate-900 border border-slate-800 hover:border-amber-900/40 rounded-xl p-3 flex flex-col justify-between gap-2.5 transition-all"
                            id={`task-node-${task.id}`}
                          >
                            <span className="text-xs text-slate-200 font-medium leading-normal">{task.title}</span>
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/50">
                              <span className="text-[8px] font-mono bg-slate-950 text-slate-500 px-1 py-0.5 rounded">
                                {task.category}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => onToggleTask(task.id)}
                                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                  title="Complete"
                                >
                                  <Circle className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Execute</span>
                                </button>
                                <button
                                  onClick={() => onDeleteTask(task.id)}
                                  className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                                  title="Delete task"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Low Priority Lane */}
                <div className="bg-slate-950/20 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between" id="priority-lane-low">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700/50 px-2 py-0.5 rounded uppercase">
                        Low Priority
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {pendingTasks.filter(t => t.priority === 'Low').length} left
                      </span>
                    </div>
                    {pendingTasks.filter(t => t.priority === 'Low').length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic py-4">No secondary recommendations.</p>
                    ) : (
                      <div className="space-y-2">
                        {pendingTasks.filter(t => t.priority === 'Low').map((task) => (
                          <div
                            key={task.id}
                            className="group bg-slate-900 border border-slate-800 hover:border-slate-700/60 rounded-xl p-3 flex flex-col justify-between gap-2.5 transition-all"
                            id={`task-node-${task.id}`}
                          >
                            <span className="text-xs text-slate-200 font-medium leading-normal">{task.title}</span>
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/50">
                              <span className="text-[8px] font-mono bg-slate-950 text-slate-500 px-1 py-0.5 rounded">
                                {task.category}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => onToggleTask(task.id)}
                                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                                  title="Complete"
                                >
                                  <Circle className="w-3.5 h-3.5" />
                                  <span className="text-[10px]">Execute</span>
                                </button>
                                <button
                                  onClick={() => onDeleteTask(task.id)}
                                  className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                                  title="Delete task"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800/40">
              <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <span>Executed Plays</span>
                <span className="bg-slate-800 text-slate-400 text-[8px] px-1.5 py-0.5 rounded-full font-mono">{completedTasks.length}</span>
              </h4>

              <div className="space-y-1.5 opacity-60">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-950/20 border border-slate-800/20 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="text-emerald-500 cursor-pointer shrink-0"
                        title="Re-activate Task"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <div>
                        <span className="text-xs text-slate-400 line-through">{task.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] font-mono text-slate-600">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
    </div>
  );
}
