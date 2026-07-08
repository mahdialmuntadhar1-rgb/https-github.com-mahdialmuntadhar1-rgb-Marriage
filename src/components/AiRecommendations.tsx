/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConnectedApp, Recommendation } from '../types';
import { Sparkles, Play, RefreshCw, AlertCircle, ChevronDown, ChevronUp, Check, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiRecommendationsProps {
  activeApp: ConnectedApp;
  recommendations: Recommendation[];
  onSetRecommendations: (recs: Recommendation[]) => void;
  onAdoptAsTask: (title: string, category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality', priority: 'High' | 'Medium' | 'Low') => void;
}

export default function AiRecommendations({ activeApp, recommendations, onSetRecommendations, onAdoptAsTask }: AiRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  const [adoptedIds, setAdoptedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRecId(expandedRecId === id ? null : id);
  };

  const handleAdopt = (rec: Recommendation) => {
    // Map category safely
    let taskCat: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality' = 'Acquisition';
    if (['Acquisition', 'Retention', 'Monetization', 'Virality'].includes(rec.category)) {
      taskCat = rec.category as any;
    }

    onAdoptAsTask(rec.title, taskCat, rec.impact === 'High' ? 'High' : 'Medium');
    setAdoptedIds({ ...adoptedIds, [rec.id]: true });

    // Toast feedback or quick self-clearing check
    setTimeout(() => {
      setAdoptedIds(prev => ({ ...prev, [rec.id]: false }));
    }, 3000);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/growth/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activeApp }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to communicate with growth engine.');
      }

      const data = await response.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        onSetRecommendations(data.recommendations);
        if (data.recommendations.length > 0) {
          setExpandedRecId(data.recommendations[0].id);
        }
      } else {
        throw new Error('Received unexpected output format from growth engine.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Server connection timed out. Please verify your GEMINI_API_KEY in secrets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans" id="ai-recommendations-workspace">
      
      {/* Run Diagnostics Trigger Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="space-y-1 md:max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI GROWTH INTEL v2.5</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Run Live AI Strategic Diagnostics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Query the Gemini 3.5 diagnostic core. We feed your active metrics (ARPU, Churn, Virality) and product demographics into our strategist, producing bespoke growth recommendations.
          </p>
        </div>

        <button
          id="run-diagnostics-btn"
          disabled={loading}
          onClick={runDiagnostics}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer disabled:cursor-not-allowed text-sm whitespace-nowrap"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Bottlenecks...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Diagnose & Recommend</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-2xl flex items-start gap-3 text-rose-300 text-xs" id="recommendations-error">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Diagnostic Interrupted:</span> {error}
            <p className="mt-1 text-[10px] text-slate-500">Ensure your workspace is connected and your Gemini API key is configured in Settings &gt; Secrets.</p>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-3" id="recommendations-queue">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Bespoke Playbooks ({recommendations.length})</h4>
        
        {recommendations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 space-y-4">
            <Zap className="w-8 h-8 text-slate-700 mx-auto" />
            <div className="max-w-md mx-auto">
              <h5 className="font-bold text-white text-sm">No Active Playbooks Loaded</h5>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Run the Diagnostics above or select another connected application to load instant strategic growth plays.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const isExpanded = expandedRecId === rec.id;
              const isAdopted = adoptedIds[rec.id];

              return (
                <div
                  key={rec.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
                    isExpanded ? 'border-slate-700 ring-1 ring-slate-800' : 'border-slate-800/80 hover:border-slate-700/60'
                  }`}
                  id={`rec-node-${rec.id}`}
                >
                  {/* Collapsible Header */}
                  <div
                    onClick={() => toggleExpand(rec.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none bg-slate-900/40 hover:bg-slate-950/25 transition-all"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Category Badge */}
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                        rec.category === 'Acquisition' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        rec.category === 'Retention' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        rec.category === 'Monetization' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        rec.category === 'Virality' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {rec.category}
                      </span>

                      {/* Title */}
                      <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{rec.title}</h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden md:inline-flex text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                        {rec.metricImpact}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-800/80 bg-slate-950/40 p-5 space-y-4 text-xs"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Left Column: Description & Metadata */}
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Strategic Assessment</span>
                              <p className="text-slate-300 leading-relaxed mt-1">{rec.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                                <span className="text-[9px] font-semibold text-slate-500 uppercase">Impact Level</span>
                                <span className="block text-white font-bold mt-0.5">{rec.impact}</span>
                              </div>
                              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                                <span className="text-[9px] font-semibold text-slate-500 uppercase">Implementation Effort</span>
                                <span className="block text-white font-bold mt-0.5">{rec.effort}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Steps to execute & Adoption */}
                          <div className="space-y-4 bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl flex flex-col justify-between">
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Action Steps (0/3)</span>
                              <ul className="space-y-2 text-[11px] text-slate-400">
                                {rec.actionSteps.map((step, idx) => (
                                  <li key={idx} className="flex gap-2 leading-relaxed">
                                    <span className="text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              id={`adopt-rec-${rec.id}`}
                              disabled={isAdopted}
                              onClick={() => handleAdopt(rec)}
                              className={`w-full py-2.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                isAdopted
                                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow shadow-emerald-500/20'
                                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:bg-slate-700'
                              }`}
                            >
                              {isAdopted ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Adopted as Active Task</span>
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Adopt into Today's Agenda</span>
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
