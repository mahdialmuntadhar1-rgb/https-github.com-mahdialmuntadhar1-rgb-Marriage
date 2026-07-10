/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConnectedApp, AppMetrics } from '../types';
import { 
  Mail, 
  Share2, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Play, 
  Flame, 
  Heart, 
  Cpu, 
  Smile, 
  Calendar, 
  Plus, 
  Trash2, 
  Filter, 
  Languages, 
  MessageSquare, 
  Megaphone, 
  FileText, 
  Smartphone, 
  ArrowRight,
  Globe,
  Sliders,
  CheckCircle,
  Clock,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContentStudioProps {
  activeApp: ConnectedApp;
  prefilledGoal?: string;
  prefilledTone?: string;
  onClearPrefilled?: () => void;
}

interface CalendarItem {
  id: string;
  appId: string;
  platform: 'Social Media Post' | 'Blog Article' | 'Email Campaign' | 'WhatsApp Message' | 'Advertisement Copy';
  headline: string;
  body: string;
  cta: string;
  status: 'Scheduled' | 'Draft' | 'Published';
  publishDate: string;
  publishTime: string;
}

const DEFAULT_CALENDAR_ITEMS: CalendarItem[] = [
  // Zawaj Seed Content
  {
    id: 'cal_zawaj_1',
    appId: 'zawaj',
    platform: 'Blog Article',
    headline: 'The Sacred Role of Wali (Guardians) in Safe Modern Matchmaking',
    body: 'How active parental and family involvement improves communication quality, prevents shallow scrolling anxiety, and builds long-term matrimonial trust inside high-integrity digital spaces.',
    cta: 'Read Complete Guide',
    status: 'Published',
    publishDate: '2026-07-06',
    publishTime: '09:00 AM'
  },
  {
    id: 'cal_zawaj_2',
    appId: 'zawaj',
    platform: 'Social Media Post',
    headline: 'How to introduce compatibility values on a first conversation 💍',
    body: 'Matchmaking succeeds when built on clear values, not superficial swipe decks. Share this respectful guide with family and close single friends seeking a blessed, verified matrimonial path.',
    cta: 'Share Resource Link',
    status: 'Scheduled',
    publishDate: '2026-07-09',
    publishTime: '02:30 PM'
  },
  {
    id: 'cal_zawaj_3',
    appId: 'zawaj',
    platform: 'Email Campaign',
    headline: 'Eid Matrimonial Celebrations & Respectful Matching Success Stories',
    body: 'We are celebrating 14 verified couple unions this quarter. Read how their family-centric matchmaking values led to high-trust matches.',
    cta: 'View Marriage Diaries',
    status: 'Draft',
    publishDate: '2026-07-14',
    publishTime: '11:00 AM'
  },

  // EduQuest Seed Content
  {
    id: 'cal_eduquest_1',
    appId: 'eduquest',
    platform: 'Social Media Post',
    headline: 'Why 10 minutes of daily math gamification beats 3 hours of textbook cramming 🚀',
    body: 'Continuous short learning trails build cognitive retention 2.5x higher. EduQuest makes math feel like an outer space odyssey, reducing student homework frustration entirely.',
    cta: 'Claim 14-Day Free Trial',
    status: 'Published',
    publishDate: '2026-07-05',
    publishTime: '08:00 AM'
  },
  {
    id: 'cal_eduquest_2',
    appId: 'eduquest',
    platform: 'Email Campaign',
    headline: 'Parent Progress Dashboard: See your child\'s math growth in real time',
    body: 'Introducing your child\'s detailed learning checkpoints. Discover strengths in spatial reasoning, algebra, and logic puzzles instantly.',
    cta: 'Open Parent Dashboard',
    status: 'Scheduled',
    publishDate: '2026-07-10',
    publishTime: '04:00 PM'
  },

  // LocalCart Seed Content
  {
    id: 'cal_localcart_1',
    appId: 'localcart',
    platform: 'WhatsApp Message',
    headline: '🥐 Hot artisanal sourdough baked fresh near you!',
    body: 'Support your local micro-bakers this summer. Artisan Bakers Hub has just restocked 12 loaves of freshly ground whole wheat sourdough. Claim yours now with local pickup.',
    cta: 'Order Fresh Bakery',
    status: 'Scheduled',
    publishDate: '2026-07-09',
    publishTime: '10:00 AM'
  },

  // TaskPulse Seed Content
  {
    id: 'cal_taskpulse_1',
    appId: 'taskpulse',
    platform: 'Social Media Post',
    headline: 'Reducing team meetings with automated Slack updates ⚡',
    body: 'Constant status queries kill engineering flow. See how TaskPulse integrates directly with workspace environments to keep stakeholders aligned without meeting fatigue.',
    cta: 'Explore Slack Integrations',
    status: 'Published',
    publishDate: '2026-07-07',
    publishTime: '03:15 PM'
  }
];

export default function ContentStudio({ activeApp, prefilledGoal, prefilledTone, onClearPrefilled }: ContentStudioProps) {
  // Global View Sub-tabs
  const [currentView, setCurrentView] = useState<'generator' | 'calendar'>('generator');

  // Interactive Calendar State
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>(() => {
    const saved = localStorage.getItem('growth_os_calendar');
    return saved ? JSON.parse(saved) : DEFAULT_CALENDAR_ITEMS;
  });

  // Calendar status filters
  const [calendarFilter, setCalendarFilter] = useState<'All' | 'Scheduled' | 'Draft' | 'Published'>('All');

  // Generator Fields
  const [goal, setGoal] = useState('Launch Viral Referral Program');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<'Social Media Post' | 'Blog Article' | 'Email Campaign' | 'WhatsApp Message' | 'Advertisement Copy'>('Social Media Post');
  const [tone, setTone] = useState('Hype & Direct');

  // Generator Output Preview
  const [generatedContent, setGeneratedContent] = useState<{
    headline: string;
    body: string;
    cta: string;
    meta?: { subject?: string; hashtags?: string[]; estimatedTime?: string };
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Advanced Operations
  const [improvePrompt, setImprovePrompt] = useState('');
  const [showImproveForm, setShowImproveForm] = useState(false);
  const [showTranslateList, setShowTranslateList] = useState(false);
  const [showSchedulingForm, setShowSchedulingForm] = useState(false);

  // Scheduling Form Inputs
  const [scheduledDate, setScheduledDate] = useState('2026-07-09');
  const [scheduledTime, setScheduledTime] = useState('09:00 AM');

  // Sync initial audience based on active app
  useEffect(() => {
    if (activeApp) {
      setAudience(activeApp.targetAudience);
      // Clean up previous generation state
      setGeneratedContent(null);
      setError(null);
    }
  }, [activeApp]);

  // Handle external prefill from Growth Advisor Chat
  useEffect(() => {
    if (prefilledGoal) {
      setGoal(prefilledGoal);
      setCurrentView('generator');
    }
    if (prefilledTone) {
      setTone(prefilledTone);
    }
    if (prefilledGoal || prefilledTone) {
      // Clear after read to prevent infinite loop
      if (onClearPrefilled) {
        onClearPrefilled();
      }
    }
  }, [prefilledGoal, prefilledTone, onClearPrefilled]);

  // Persist calendar to local storage
  useEffect(() => {
    localStorage.setItem('growth_os_calendar', JSON.stringify(calendarItems));
  }, [calendarItems]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Brand New Content Generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeApp,
          goal,
          audience,
          platform,
          tone
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to communicate with content generator.');
      }

      const data = await response.json();
      if (data.content) {
        setGeneratedContent(data.content);
        // Reset sub forms
        setShowImproveForm(false);
        setShowTranslateList(false);
        setShowSchedulingForm(false);
      } else {
        throw new Error('Received invalid output structure from copywriter engine.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation timed out. Please check your system configuration.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Improve Existing Copy with custom instruction
  const handleImprove = async (instruction: string) => {
    if (!generatedContent) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeApp,
          goal,
          audience,
          platform,
          tone,
          instruction,
          currentCopy: generatedContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve copy.');
      }

      const data = await response.json();
      if (data.content) {
        setGeneratedContent(data.content);
        setImprovePrompt('');
        setShowImproveForm(false);
      }
    } catch (err: any) {
      setError(err.message || 'Improvement failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Translate Copy to another language
  const handleTranslate = async (lang: string) => {
    if (!generatedContent) return;
    setShowTranslateList(false);
    await handleImprove(`Translate the entire text perfectly into standard ${lang}. Keep the tone and format exactly identical.`);
  };

  // 4. Commit generated copy to local Content Calendar
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedContent) return;

    const newItem: CalendarItem = {
      id: 'cal_' + Date.now(),
      appId: activeApp.id,
      platform,
      headline: generatedContent.headline,
      body: generatedContent.body,
      cta: generatedContent.cta,
      status: 'Scheduled',
      publishDate: scheduledDate,
      publishTime: scheduledTime
    };

    setCalendarItems(prev => [newItem, ...prev]);
    setShowSchedulingForm(false);
    
    // Smoothly redirect founder to the calendar view to celebrate their planned success!
    setCurrentView('calendar');
  };

  // Delete from calendar
  const handleDeleteCalendarItem = (itemId: string) => {
    setCalendarItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Instantly toggle status of calendar items
  const handleToggleStatus = (itemId: string, newStatus: 'Scheduled' | 'Draft' | 'Published') => {
    setCalendarItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  // Get active items in calendar
  const filteredCalendarItems = calendarItems
    .filter(item => item.appId === activeApp.id)
    .filter(item => calendarFilter === 'All' || item.status === calendarFilter);

  // Platform styling / icons mapper
  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'Social Media Post': return <Share2 className="w-4 h-4 text-sky-400" />;
      case 'Blog Article': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'Email Campaign': return <Mail className="w-4 h-4 text-amber-400" />;
      case 'WhatsApp Message': return <MessageSquare className="w-4 h-4 text-green-400" />;
      case 'Advertisement Copy': return <Megaphone className="w-4 h-4 text-rose-400" />;
      default: return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 font-sans" id="content-intelligence-workspace">
      
      {/* Top Header & Sub-tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800/80 p-5 rounded-3xl shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              AI Content Studio
              <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-slate-700/60">
                Campaign Builder
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Draft, translate, and schedule multi-channel marketing campaigns aligned with your ideal customer goals.
            </p>
          </div>
        </div>

        {/* Navigation Switch */}
        <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl max-w-xs self-start md:self-auto">
          <button
            onClick={() => setCurrentView('generator')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentView === 'generator'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Write Campaign</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              currentView === 'calendar'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Campaign Schedule ({calendarItems.filter(i => i.appId === activeApp.id).length})</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'generator' ? (
          <motion.div
            key="generator-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            {/* Left Column: Dashboard cards & Generator Inputs */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* CONTENT DASHBOARD CARDS: Select Platform Options */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Dashboard Fast-lane</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">Choose Content Format</h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Social Media Post', desc: 'Scroll-stopping high-conversion social copy', icon: Share2, bg: 'text-sky-400 bg-sky-500/10' },
                    { id: 'Blog Article', desc: 'Structured value-first educational content', icon: FileText, bg: 'text-emerald-400 bg-emerald-500/10' },
                    { id: 'Email Campaign', desc: 'Engaging subject line & persuasive hook', icon: Mail, bg: 'text-amber-400 bg-amber-500/10' },
                    { id: 'WhatsApp Message', desc: 'High-urgency friendly conversational notification', icon: MessageSquare, bg: 'text-green-400 bg-green-500/10' },
                    { id: 'Advertisement Copy', desc: 'High-impact product-promise marketing copy', icon: Megaphone, bg: 'text-rose-400 bg-rose-500/10' },
                  ].map((option) => {
                    const isSelected = platform === option.id;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setPlatform(option.id as any)}
                        className={`group p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-950 border-emerald-500/30 shadow-inner'
                            : 'bg-slate-950/40 border-slate-850 hover:bg-slate-950 hover:border-slate-800'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${option.bg} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                              {option.id}
                            </span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                          </div>
                          <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors leading-normal">
                            {option.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GENERATOR INPUT FORM */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4.5 shadow-xl">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Campaign Settings</span>
                  <h3 className="text-xs font-bold text-white mt-0.5">Define Your Message</h3>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  
                  {/* Campaign Goal */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">Campaign Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                    >
                      <option value="Launch Viral Referral Program">Launch Viral Referral Program</option>
                      <option value="Re-engage Inactive Users">Re-engage Inactive Users</option>
                      <option value="Promote Premium Subscription">Promote Premium Subscription</option>
                      <option value="Boost Holiday Flash Sale">Boost Holiday Flash Sale</option>
                      <option value="Beta Tester Recruitment">Beta Tester Recruitment</option>
                      <option value="How can I increase registrations?">Increase Registrations Play</option>
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">Your Ideal Customer</label>
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="e.g. Busy parents seeking high-quality math learning"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                    />
                  </div>

                  {/* Copywriting Tone */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">Brand Tone & Voice</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Hype & Direct', icon: Flame },
                        { name: 'Warm & Respectful', icon: Heart },
                        { name: 'Analytical / Tech', icon: Cpu },
                        { name: 'Casual / Friendly', icon: Smile },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isSelected = tone === t.name;
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => setTone(t.name)}
                            className={`flex items-center gap-1.5 p-2 rounded-xl border text-left text-[11px] font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Writing campaign...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Write My Campaign Now</span>
                      </>
                    )}
                  </button>

                </form>

                {error && (
                  <div className="bg-rose-950/20 border border-rose-900/30 p-3.5 rounded-xl flex items-start gap-2.5 text-rose-300 text-[11px] leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Oops, writing campaign failed:</span> {error}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Columns: Preview Panel & Deep Actions */}
            <div className="xl:col-span-2 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between min-h-[500px] shadow-xl relative overflow-hidden">
                
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top status of selected platform preview */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-855">
                      {getPlatformIcon(platform)}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Live Production Mockup</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{platform} Preview</h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    Brand: <span className="text-emerald-400 font-bold">{activeApp.name}</span>
                  </span>
                </div>

                {/* Body Content Preview Box */}
                {generatedContent ? (
                  <div className="space-y-5 flex-grow flex flex-col justify-between pt-5">
                    
                    {/* Simulated Screen Body */}
                    <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl relative">
                      
                      {/* Browser header */}
                      <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/50 flex items-center justify-between">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500/40"></span>
                          <span className="w-2 h-2 rounded-full bg-amber-500/40"></span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500/40"></span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 tracking-wider">
                          {platform === 'Email Campaign' ? 'Subject / Headline View' : 'Channel Visual Render'}
                        </span>
                        {generatedContent.meta?.estimatedTime && (
                          <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-600" />
                            {generatedContent.meta.estimatedTime}
                          </span>
                        )}
                      </div>

                      {/* Content Box */}
                      <div className="p-5.5 space-y-4">
                        
                        {/* Display Subject if email */}
                        {platform === 'Email Campaign' && (
                          <div className="border-b border-slate-900 pb-3">
                            <span className="text-[9px] font-mono text-slate-600 uppercase font-bold tracking-wider">Email Subject Line:</span>
                            <h5 className="text-xs font-bold text-amber-400 mt-1 leading-normal">
                              {generatedContent.meta?.subject || generatedContent.headline}
                            </h5>
                          </div>
                        )}

                        {/* Title Hook */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-slate-600 uppercase font-bold tracking-wider block">
                            {platform === 'Email Campaign' ? 'Newsletter Header:' : 'Headline Hook:'}
                          </span>
                          <h4 className="text-xs font-black text-white leading-normal tracking-tight">
                            {generatedContent.headline}
                          </h4>
                        </div>

                        {/* Text Body */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-slate-600 uppercase font-bold tracking-wider block">Core Copywriter Text:</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/30 p-3.5 rounded-xl border border-slate-900/50">
                            {generatedContent.body}
                          </p>
                        </div>

                        {/* Call to action (CTA) */}
                        <div className="pt-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="text-[9px] font-mono text-slate-600 uppercase font-bold tracking-wider block">Call to Action:</span>
                            <div className="mt-1 px-4 py-1.5 bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-bold rounded-lg inline-block uppercase tracking-wider">
                              {generatedContent.cta}
                            </div>
                          </div>

                          {/* Hashtags display if social */}
                          {generatedContent.meta?.hashtags && generatedContent.meta.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {generatedContent.meta.hashtags.map((h, hIdx) => (
                                <span key={hIdx} className="text-[9px] font-mono text-sky-400 bg-sky-400/5 border border-sky-400/10 px-1.5 py-0.5 rounded">
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>

                    </div>

                    {/* INTERACTIVE ACTIONS PANEL: Improve, Translate, Schedule, Regenerate */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                          Advanced Decisive Actions
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {/* Regenerate */}
                          <button
                            onClick={() => handleGenerate()}
                            disabled={loading}
                            className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-400 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Regenerate with same parameters"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Regenerate</span>
                          </button>

                          {/* Improve Toggle */}
                          <button
                            onClick={() => {
                              setShowImproveForm(!showImproveForm);
                              setShowTranslateList(false);
                              setShowSchedulingForm(false);
                            }}
                            className={`px-3 py-2 border rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                              showImproveForm
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Improve</span>
                          </button>

                          {/* Translate Toggle */}
                          <button
                            onClick={() => {
                              setShowTranslateList(!showTranslateList);
                              setShowImproveForm(false);
                              setShowSchedulingForm(false);
                            }}
                            className={`px-3 py-2 border rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                              showTranslateList
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <Languages className="w-3.5 h-3.5" />
                            <span>Translate</span>
                          </button>

                          {/* Copy clipboard */}
                          <button
                            onClick={() => {
                              const fullText = `Headline: ${generatedContent.headline}\n\n${generatedContent.body}\n\nCTA: ${generatedContent.cta}`;
                              handleCopy(fullText);
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              copied 
                                ? 'bg-emerald-500 text-slate-950' 
                                : 'bg-slate-850 text-slate-300 hover:text-white border border-slate-750'
                            }`}
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                          </button>

                          {/* Schedule Launch */}
                          <button
                            onClick={() => {
                              setShowSchedulingForm(!showSchedulingForm);
                              setShowImproveForm(false);
                              setShowTranslateList(false);
                            }}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow shadow-emerald-500/10"
                          >
                            <Calendar className="w-3.5 h-3.5 text-slate-950" />
                            <span>Schedule Launch</span>
                          </button>
                        </div>
                      </div>

                      {/* Sub-form: Custom Improvement Prompt */}
                      {showImproveForm && (
                        <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex items-center gap-2 animate-fadeIn">
                          <input
                            type="text"
                            value={improvePrompt}
                            onChange={(e) => setImprovePrompt(e.target.value)}
                            placeholder="e.g. Make it punchier, add more dramatic wedding emojis..."
                            className="flex-grow bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                          />
                          <button
                            disabled={!improvePrompt.trim() || loading}
                            onClick={() => handleImprove(improvePrompt)}
                            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-850 disabled:text-slate-500 text-slate-950 font-black rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
                          >
                            Apply Refinement
                          </button>
                        </div>
                      )}

                      {/* Sub-form: Translation Selection */}
                      {showTranslateList && (
                        <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-2 animate-fadeIn">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Target Localization Language</span>
                          <div className="flex flex-wrap gap-2">
                            {['Arabic (العربية)', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)', 'Malay (Bahasa Melayu)'].map((lang) => (
                              <button
                                key={lang}
                                onClick={() => handleTranslate(lang)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-200 font-bold hover:text-white cursor-pointer"
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-form: Scheduling Calendar Input */}
                      {showSchedulingForm && (
                        <form onSubmit={handleScheduleSubmit} className="bg-slate-950 border border-emerald-950/40 rounded-2xl p-4.5 space-y-3.5 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Confirm Scheduling Parameters</span>
                            <span className="text-[10px] text-slate-500">Adds immediately to Content Calendar</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Publish Date</label>
                              <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Publish Time</label>
                              <input
                                type="text"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                placeholder="e.g. 10:00 AM"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1.5">
                            <button
                              type="button"
                              onClick={() => setShowSchedulingForm(false)}
                              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition-all cursor-pointer"
                            >
                              Confirm and Schedule
                            </button>
                          </div>
                        </form>
                      )}

                    </div>

                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center p-10 text-center space-y-4">
                    <div className="bg-slate-950 p-4.5 rounded-full border border-slate-850">
                      <Sparkles className="w-8 h-8 text-slate-700" />
                    </div>
                    <div className="max-w-md">
                      <h4 className="text-xs font-bold text-slate-300">Choose formatting and click "Write Campaign"</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Our AI will review your ideal customer goals to write high-converting copy in your voice.
                      </p>
                    </div>

                    <button
                      onClick={() => handleGenerate()}
                      disabled={loading}
                      className="px-4.5 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer mt-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Writing your campaign content...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                          <span>Write My {platform} Now</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="calendar-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6"
          >
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Social & Editorial Content Calendar
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Coordinate, filter, and schedule launch parameters for your pending growth copy assets.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded-xl overflow-x-auto self-start sm:self-auto">
                {['All', 'Scheduled', 'Draft', 'Published'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setCalendarFilter(status as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      calendarFilter === status
                        ? 'bg-emerald-500 text-slate-950 font-black shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar list or empty state */}
            {filteredCalendarItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="calendar-grid">
                {filteredCalendarItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5 space-y-4 flex flex-col justify-between hover:border-slate-800 transition-all shadow-md group relative"
                    id={`calendar-item-${item.id}`}
                  >
                    
                    {/* Header: Platform type & status badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(item.platform)}
                        <span className="text-[11px] font-bold text-slate-200">{item.platform}</span>
                      </div>

                      {/* Status selectors */}
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          item.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            : item.status === 'Scheduled'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Headline and Copy */}
                    <div className="space-y-1.5 flex-grow">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.headline}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed bg-slate-900/30 p-2.5 rounded-xl border border-slate-900/50">
                        {item.body}
                      </p>
                    </div>

                    {/* Date/Time and Action Triggers */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-900/80">
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[9px]">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        <span>{item.publishDate} @ {item.publishTime}</span>
                      </div>

                      {/* Item Quick Controls */}
                      <div className="flex items-center gap-1.5">
                        {item.status !== 'Published' && (
                          <button
                            onClick={() => handleToggleStatus(item.id, 'Published')}
                            className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                            title="Mark Published"
                          >
                            Publish Now
                          </button>
                        )}
                        {item.status === 'Draft' && (
                          <button
                            onClick={() => handleToggleStatus(item.id, 'Scheduled')}
                            className="text-[9px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 px-2 py-1 rounded transition-all cursor-pointer"
                            title="Schedule Post"
                          >
                            Schedule
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCalendarItem(item.id)}
                          className="p-1 text-slate-600 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          title="Delete content item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-500 bg-slate-950/20 border border-slate-850 rounded-2xl py-24 flex flex-col items-center justify-center space-y-3">
                <Calendar className="w-8 h-8 text-slate-700" />
                <h4 className="text-xs font-bold text-slate-400">No content items found</h4>
                <p className="text-[11px] text-slate-600 max-w-sm leading-relaxed">
                  There are no {calendarFilter !== 'All' ? calendarFilter.toLowerCase() : ''} items scheduled for your active connected app.
                </p>
                <button
                  onClick={() => setCurrentView('generator')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Draft a New Copy Asset</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
