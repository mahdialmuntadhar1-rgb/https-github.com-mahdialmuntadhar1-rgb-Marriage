/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ConnectedApp, ChatMessage, ChatMessageAction, AppMetrics } from '../types';
import { Send, Sparkles, RefreshCw, AlertCircle, Bot, User, Play, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface GrowthBrainChatProps {
  activeApp: ConnectedApp;
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  onClearChatHistory: () => void;
  onSwitchTab: (tabId: 'agenda' | 'dashboard' | 'recommendations' | 'marketing' | 'chat') => void;
  onAddTask: (title: string, category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality', priority: 'High' | 'Medium' | 'Low') => void;
  onPrefillCampaign: (goal: string, tone: string) => void;
  onUpdateMetrics: (newMetrics: AppMetrics) => void;
}

export default function GrowthBrainChat({ 
  activeApp, 
  chatHistory, 
  onAddChatMessage, 
  onClearChatHistory,
  onSwitchTab,
  onAddTask,
  onPrefillCampaign,
  onUpdateMetrics
}: GrowthBrainChatProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clickedActions, setClickedActions] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggestion prompt chips tailored specifically for founders
  const SUGGESTIONS = [
    { label: "Design a custom viral loop", prompt: "How can we design a high-converting organic viral loop for this business model?" },
    { label: "Analyze churn bottlenecks", prompt: "What are the most effective psychological and feature tactics to combat Churn Rate here?" },
    { label: "Boost customer LTV & ARPU", prompt: "Help me structure custom up-sells, premium plans, or bundles to optimize our LTV." },
    { label: "Construct a content marketing play", prompt: "Draft a high-impact organic content marketing strategy to decrease our CAC." }
  ];

  // Action Click Handler
  const handleActionClick = (action: ChatMessageAction, actionKey: string) => {
    setClickedActions(prev => ({ ...prev, [actionKey]: true }));

    switch (action.type) {
      case 'create_campaign':
      case 'generate_content':
        if (onPrefillCampaign) {
          onPrefillCampaign(
            action.payload?.goal || 'Scale user growth',
            action.payload?.tone || 'Empathetic & Warm'
          );
        }
        if (onSwitchTab) {
          onSwitchTab('marketing');
        }
        break;
      case 'improve_signup':
      case 'add_task':
        if (onAddTask) {
          onAddTask(
            action.payload?.title || action.label,
            action.payload?.category || 'Retention',
            action.payload?.priority || 'High'
          );
        }
        break;
      case 'update_metrics':
        if (onUpdateMetrics) {
          onUpdateMetrics({
            ...activeApp.metrics,
            ...action.payload
          });
        }
        break;
      case 'view_tab':
        if (onSwitchTab) {
          onSwitchTab(action.payload?.tabId || 'dashboard');
        }
        break;
      default:
        break;
    }
  };

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSubmit = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddChatMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      // Build full history payload for grounding
      const conversation = [...chatHistory, userMsg];

      const response = await fetch('/api/growth/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversation,
          activeApp,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to reach coach engine.');
      }

      const data = await response.json();
      if (data.reply) {
        const coachMsg: ChatMessage = {
          id: `chat_${Date.now() + 1}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: data.actions,
          report: data.report
        };
        onAddChatMessage(coachMsg);
      } else {
        throw new Error('Received invalid empty response from chat bot.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Growth Coach is offline. Please check your GEMINI_API_KEY config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans h-[calc(100vh-13rem)] min-h-[500px]" id="growth-chat-workspace">
      
      {/* Suggestions and Grounding Info (Left Panel) */}
      <div className="lg:col-span-1 flex flex-col justify-between space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Chat Assistant Info</h3>
            <h4 className="text-sm font-bold text-white mt-1">GrowthBrain Coach</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              An interactive consulting sandbox. GrowthBrain understands SaaS economics, user friction, Matchmaking virality loops, and Marketplace liquidity.
            </p>
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Grounding Context</span>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Active Connection:</span>
                <strong className="text-slate-200">{activeApp.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Business Model:</span>
                <strong className="text-slate-200">{activeApp.businessModel}</strong>
              </div>
              <div className="flex justify-between">
                <span>Current CAC:</span>
                <strong className="text-purple-400">${activeApp.metrics.cac}</strong>
              </div>
              <div className="flex justify-between">
                <span>Viral Coefficient K:</span>
                <strong className="text-yellow-400">{activeApp.metrics.viralCo}</strong>
              </div>
            </div>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={onClearChatHistory}
          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-slate-800/80 transition-all cursor-pointer"
        >
          Clear Chat History
        </button>
      </div>

      {/* Main Chat Messenger Console (Right Panel) */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col h-full overflow-hidden justify-between" id="chat-console-box">
        
        {/* Chat Header */}
        <div className="bg-slate-950/40 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
                <span>GrowthBrain AI Coach</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </h4>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Session Grounded & Live</p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
            Model: Gemini-3.5-Flash
          </div>
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4" id="chat-messages-feed">
          {chatHistory.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-[85%] ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                id={`chat-bubble-${msg.id}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isModel 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble Body */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isModel 
                      ? 'bg-slate-950 border border-slate-850/80 text-slate-300' 
                      : 'bg-emerald-500 text-slate-950 font-medium'
                  }`}>
                    {/* Preserve line breaks */}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {/* Interactive Diagnostic Report Card */}
                  {isModel && msg.report && (
                    <div className="mt-2.5 bg-slate-950 border border-slate-850 rounded-2xl p-4.5 space-y-3.5 shadow-xl max-w-lg" id={`chat-report-${msg.id}`}>
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-bold text-white font-display">{msg.report.title}</span>
                        </div>
                        <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.5 rounded uppercase">Diagnostics</span>
                      </div>

                      {/* Metric Chips Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {msg.report.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex flex-col justify-between">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{m.label}</span>
                            <div className="flex items-baseline justify-between mt-1.5">
                              <span className="text-sm font-black text-white">{m.value}</span>
                              <span className={`text-[9px] font-mono font-bold ${m.isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {m.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Key Discoveries / Findings */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono block">Data-Driven Insights</span>
                        <ul className="space-y-1 text-[11px] text-slate-300 pl-4 list-disc">
                          {msg.report.findings.map((f, fIdx) => (
                            <li key={fIdx} className="leading-relaxed">{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Interactive Recommended Actions Button Panel */}
                  {isModel && msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 space-y-1.5" id={`chat-actions-${msg.id}`}>
                      <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-widest block">Strategic Action Recommendations</span>
                      <div className="flex flex-wrap gap-2">
                        {msg.actions.map((act, actIdx) => {
                          const actionKey = `${msg.id}_${actIdx}`;
                          const isClicked = clickedActions[actionKey];
                          return (
                            <button
                              key={actIdx}
                              disabled={isClicked}
                              onClick={() => handleActionClick(act, actionKey)}
                              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                                isClicked
                                  ? 'bg-slate-900 text-slate-500 border border-slate-800/60 cursor-not-allowed'
                                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black hover:-translate-y-0.5 active:translate-y-0'
                              }`}
                            >
                              {isClicked ? (
                                <>
                                  <span>Action Executed</span>
                                  <span className="text-xs">✓</span>
                                </>
                              ) : (
                                <>
                                  {act.type === 'create_campaign' || act.type === 'generate_content' ? (
                                    <Sparkles className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                                  ) : act.type === 'improve_signup' || act.type === 'add_task' ? (
                                    <Play className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                                  ) : (
                                    <Bot className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                                  )}
                                  <span>{act.label}</span>
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span className={`block text-[8px] font-mono text-slate-600 ${isModel ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 max-w-[85%] mr-auto" id="chat-loading-placeholder">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span className="text-[11px] text-slate-500 font-mono uppercase tracking-widest">GrowthBrain formulating response...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-950/20 border border-rose-900/30 p-3.5 rounded-xl flex items-start gap-2 text-rose-400 text-xs" id="chat-error-panel">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Coach Communication Interrupted:</span> {error}
                <p className="mt-0.5 text-[9px] text-slate-500">Check that your workspace has internet connection and your Gemini API key is accurate.</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompt Chips & Chat Box (Bottom block) */}
        <div className="bg-slate-950/30 p-4 border-t border-slate-800/80 space-y-4">
          
          {/* Preset Prompts List */}
          {chatHistory.length <= 1 && !loading && (
            <div className="space-y-1.5" id="chat-suggestion-chips">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest block font-mono">Suggested Inquiries</span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(s.prompt)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl text-[10px] font-medium text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <Lightbulb className="w-3 h-3 text-emerald-400" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input Message */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask GrowthBrain about ${activeApp.name}'s CAC, referral loops, or virality tactics...`}
              className="flex-grow bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-850 disabled:text-slate-600 text-slate-950 font-bold rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
