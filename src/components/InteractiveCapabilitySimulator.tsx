import React, { useState, useEffect } from 'react';
import { 
  ConnectedApp, 
  GrowthTask, 
  AppMetrics, 
  Recommendation, 
  ChatMessage 
} from '../types';
import { 
  Layout, 
  Calendar, 
  TrendingUp, 
  FolderOpen, 
  Shield, 
  Play, 
  Pause, 
  Users, 
  Layers, 
  Search, 
  Video, 
  Image as ImageIcon, 
  Presentation, 
  Mail, 
  BookOpen, 
  Compass, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Settings, 
  Cpu, 
  Sparkles, 
  Database, 
  Globe, 
  FileText, 
  MessageSquare, 
  PlusCircle, 
  CheckCircle, 
  X,
  RefreshCw, 
  Sliders, 
  ClipboardList, 
  Send, 
  Share2, 
  Smartphone, 
  Zap, 
  Award, 
  AlertCircle, 
  MapPin, 
  Activity, 
  Code, 
  Clock, 
  ArrowRight, 
  Lock, 
  Unlock, 
  Volume2, 
  Archive, 
  User, 
  PenSquare,
  BarChart3,
  Flame,
  Check,
  ChevronRight,
  Filter,
  Eye,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DailyAgenda from './DailyAgenda';
import BusinessIntelligenceCenter from './BusinessIntelligenceCenter';
import AiRecommendations from './AiRecommendations';
import ContentStudio from './ContentStudio';
import GrowthBrainChat from './GrowthBrainChat';
import AutomationCenter from './AutomationCenter';
import ConnectedAppsMarketplace from './ConnectedAppsMarketplace';
import SettingsPanel from './SettingsPanel';

const getFounderGuide = (category: string, subSection: string, appName: string) => {
  switch (subSection) {
    case 'Daily Briefing':
      return {
        what: `Your central strategic briefing room compiled by your AI executive team.`,
        why: `Keeps you focused on high-priority critical decisions instead of drowning in daily noise.`,
        recommended: `Launch the email marketing strategic override to capture Wali signups today.`,
        impact: `+4.5% conversion increase on pending candidate registrations.`,
        time: `1 minute setup`
      };
    case 'Website Builder':
      return {
        what: `An intelligent no-code landing page visual outline custom designed for your target audience.`,
        why: `High-converting layouts attract organic search traffic and establish premium brand trust.`,
        recommended: `Deploy the "Guardian Verification Trust Accent" section at the top fold.`,
        impact: `+12.8% sign-up conversion rate improvement.`,
        time: `3 minutes compiling`
      };
    case 'Mobile App Builder':
      return {
        what: `An interactive storyboard simulation to visualize user onboarding, paywalls, and match cards.`,
        why: `Pre-visualizing critical screen steps guarantees delightful, frictionless parent interaction.`,
        recommended: `Enable the prominent Wali Guardian invite email input field on Step 1.`,
        impact: `-22.4% registration dropoff in early funnel stages.`,
        time: `2 minutes auto-reload`
      };
    case 'AI App Builder':
      return {
        what: `A cognitive sandbox workspace to configure backend model parameters and system instructions.`,
        why: `Tailoring your AI's custom persona aligns outreach replies with respectful family values.`,
        recommended: `Use the Gemini 2.5 Pro model for deep family review safety checks.`,
        impact: `99.2% alignment rate with community communication policies.`,
        time: `1 minute sandbox sync`
      };
    case 'Database Builder':
      return {
        what: `A visual table designer to trace what specific parameters and fields your software stores.`,
        why: `Structuring databases visually prevents technical bugs without writing a single line of SQL.`,
        recommended: `Maintain distinct tables for verified wali accounts and match history logs.`,
        impact: `100% data compliance audit readiness.`,
        time: `1 minute table build`
      };
    case 'Workflow Builder':
      return {
        what: `A drag-and-drop logical linker connecting triggers with immediate actions.`,
        why: `Automating repetitive notifications keeps engagement high without manual founder efforts.`,
        recommended: `Trigger welcome emails immediately after candidate profile completion.`,
        impact: `+30% customer return rate in first 48 hours.`,
        time: `2 minutes automation link`
      };
    case 'Video Studio':
      return {
        what: `An AI-powered storyboard generator creating custom visual script outlines.`,
        why: `Premium video storytelling converts social media scroll sessions into loyal platform users.`,
        recommended: `Draft a 30-second trust-building script explaining parent-supported security.`,
        impact: `+42% video click-through-rate boost.`,
        time: `3 minutes script generation`
      };
    case 'Image Studio':
      return {
        what: `A visual prompting canvas to render elegant mockups, illustrations, and ad creatives.`,
        why: `Beautiful, brand-aligned visual assets capture interest on Instagram, Meta, and TikTok.`,
        recommended: `Select flat modern illustrations matching your core green brand palette.`,
        impact: `+18.5% click volume on social promotion banners.`,
        time: `1 minute asset compile`
      };
    case 'Presentation Studio':
      return {
        what: `An AI outline helper structuring comprehensive slide pitch decks for future partners.`,
        why: `A highly persuasive deck demonstrates huge market size and clear business model monetization.`,
        recommended: `Emphasize the values-first matchmaking gap over swipe-fatigue dating.`,
        impact: `Establishes immediate high-trust professional pitch credibility.`,
        time: `4 minutes structure outline`
      };
    case 'Email Studio':
      return {
        what: `An onboarding sequence editor configuring respectful copy variants and action links.`,
        why: `Polished, context-aware emails guide users step-by-step through verification portals.`,
        recommended: `Deploy the "Guardian Verification Request" template with an automated single-use login link.`,
        impact: `+15.4% click-through-rate response rate.`,
        time: `1 minute preset load`
      };
    case 'Blog Studio':
      return {
        what: `An SEO outline composer crafting informative, rank-worthy educational titles.`,
        why: `Providing high-quality answers to search queries drives free, sustainable organic customer traffic.`,
        recommended: `Target search terms focusing on respectful and honorable marriage frameworks.`,
        impact: `+200% search index visibility increase.`,
        time: `2 minutes outline draft`
      };
    case 'Ad Studio':
      return {
        what: `A multichannel ad copy generator tailoring separate variants for Meta and Google.`,
        why: `Aligning headlines with targeted keyword search terms lowers cost-per-click acquisition fees.`,
        recommended: `Target specific values-driven safety highlights in your headline drafts.`,
        impact: `-15% CAC acquisition expense drop.`,
        time: `1 minute multi-copy compile`
      };
    case 'Brand Kit':
      return {
        what: `A corporate identity manager establishing consistent, eye-pleasing typography and colors.`,
        why: `Cohesive styling builds professional credibility, making your software feel highly polished.`,
        recommended: `Pair classic Inter fonts with elegant Islamic green accents.`,
        impact: `98% brand sentiment alignment score.`,
        time: `Instant visual sync`
      };
    case 'Product Launch Wizard':
      return {
        what: `An interactive step-by-step checklist guiding your launch sequence from start to finish.`,
        why: `A clean chronological roadmap ensures you don't miss vital security or legal disclosures.`,
        recommended: `Complete the Wali verification tests before starting paid display campaigns.`,
        impact: `Guarantees a flawless, bug-free launch day experience.`,
        time: `Ongoing launch guide`
      };
    default:
      return {
        what: `An interactive capability simulator designed to manage and optimize your ${appName} workspace.`,
        why: `Zero-code control rooms let founders build, launch, and analyze campaigns in native human language.`,
        recommended: `Leverage AI-driven growth plays ranked by high impact and low effort.`,
        impact: `Accelerated operational velocity with zero developer hiring costs.`,
        time: `Instant simulation`
      };
  }
};

interface MicroLesson {
  title: string;
  concept: string;
  before: string;
  after: string;
  lesson: string;
  animationText: string;
}

const MICRO_LESSONS: Record<string, MicroLesson> = {
  'Website Builder': {
    title: 'High-Converting Landing Page Architecture',
    concept: 'Above-The-Fold Trust Stacking',
    before: 'Generic sign-up form saying "Find your partner here" with no social proof.',
    after: 'Headline highlighting safety, verified wali credentials, and an initial zero-obligation consultation badge.',
    lesson: 'For faith-based matchmaking, security is the supreme product. Stacking trust metrics (such as active guardian signatures) above the fold increases sign-ups by up to 48% because it reassures families.',
    animationText: '⚡ Conversions: 1.2% ➔ 4.8%'
  },
  'Mobile App Builder': {
    title: 'Friction-Free Onboarding Flows',
    concept: 'Progressive Information Disclosure',
    before: 'Requiring a full identity check and uploading papers before seeing any match overview.',
    after: 'Guiding parents through a simple 3-step conversational wizard, saving identity verification for connection requests.',
    lesson: 'Never slam the user with high-friction requirements during their first 60 seconds. Reveal steps progressively to let users experience immediate value first.',
    animationText: '⚡ Retention: 35% ➔ 84%'
  },
  'AI App Builder': {
    title: 'Culturally Aligned AI Personas',
    concept: 'Empathetic Custom Prompt Engineering',
    before: 'Default system response: "Please choose from available database rows to start matching."',
    after: 'Empathetic response: "Welcome. We are honored to assist you and your family on this beautiful journey. Let us guide you carefully."',
    lesson: 'An AI engine should mirror the cultural values and warmth of your physical team. Standard mechanical replies drive users away; respectful empathy builds long-term loyalty.',
    animationText: '⚡ User Satisfaction: 60% ➔ 98%'
  },
  'Database Builder': {
    title: 'Zero-Code Relational Architecture',
    concept: 'Relational Database Integrity',
    before: 'Storing all user profiles, matches, and logs in one giant messy spreadsheet.',
    after: 'Separate tables for Candidates and Wali accounts connected securely via a relational reference ID.',
    lesson: 'Keeping tables isolated prevents critical data leaks. Relational linkages ensure that when a Candidate registers, their Guardian is automatically paired without duplications.',
    animationText: '⚡ Data Speed: 500ms ➔ 12ms'
  },
  'Workflow Builder': {
    title: 'Automated Retention Loops',
    concept: 'Event-Triggered Interactions',
    before: 'Sending a manual newsletter once a week to all users at random times.',
    after: 'An automatic friendly notification triggered exactly 48 hours after sign-up if no guardian has been invited yet.',
    lesson: 'Timely triggers based on specific user actions are 5x more effective than bulk broadcasts. They catch the user when interest is active.',
    animationText: '⚡ Response Rate: 4% ➔ 28%'
  },
  'Video Studio': {
    title: 'Highly Persuasive Video Outlines',
    concept: 'The Hook-Problem-Solution Framework',
    before: 'A 2-minute raw screen capture of the platform features with a boring voiceover.',
    after: 'A 30-second authentic narrative introducing parent anxieties, the verification solution, and a clear call-to-action.',
    lesson: 'Video creatives should lead with genuine human problems. Hook attention in the first 3 seconds, show the solution, and prompt action.',
    animationText: '⚡ Play Rate: 10% ➔ 65%'
  },
  'Email Studio': {
    title: 'The "Wali Invite" Sequence',
    concept: 'Respectful Family outreach',
    before: 'Sending a blunt email: "Your child wants you to sign up for this app. Click here."',
    after: 'A respectful invitation: "Your family member has requested your guidance and support in their pursuit of a blessed marriage. Review their application here."',
    lesson: 'Guardian participation requires extreme respect. Framing invitations around guidance and honor ensures high response rates and parental trust.',
    animationText: '⚡ Acceptance Rate: 15% ➔ 72%'
  },
  'Brand Kit': {
    title: 'Consistent Visual Branding',
    concept: 'Aesthetic Palette & Typography Pairing',
    before: 'Using 6 different random colors and generic default fonts on every block.',
    after: 'A carefully curated combination of Inter, Space Grotesk, and beautiful emerald accents.',
    lesson: 'Visual design is a subconscious signal of quality. Cluttered interfaces suggest a fragile product; elegant minimalist grids convey world-class security.',
    animationText: '⚡ User Trust Score: 40% ➔ 95%'
  }
};

interface InteractiveCapabilitySimulatorProps {
  activeCategory: string;
  activeSubSection: string;
  activeApp: ConnectedApp;
  apps: ConnectedApp[];
  recommendations: Recommendation[];
  tasks: GrowthTask[];
  chatHistory: ChatMessage[];
  automations: any[];
  founderMode?: 'beginner' | 'advanced';
  onToggleFounderMode?: (mode: 'beginner' | 'advanced') => void;
  onSelectApp: (id: string) => void;
  onConnectApp: (newApp: any) => void;
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality', priority: 'High' | 'Medium' | 'Low') => void;
  onDeleteTask: (id: string) => void;
  onSetRecommendations: (recs: Recommendation[]) => void;
  onAdoptAsTask: (title: string, category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality', priority: 'High' | 'Medium' | 'Low') => void;
  onAddChatMessage: (msg: ChatMessage) => void;
  onClearChatHistory: () => void;
  onSwitchTab: (tabId: any) => void;
  onPrefillCampaign: (goal: string, tone: string) => void;
  onUpdateMetrics: (metrics: AppMetrics) => void;
  onSetAutomations: (automations: any[]) => void;
  prefilledGoal: string;
  prefilledTone: string;
  onClearPrefilled: () => void;
}

export default function InteractiveCapabilitySimulator(props: InteractiveCapabilitySimulatorProps) {
  const {
    activeCategory,
    activeSubSection,
    activeApp,
    apps,
    recommendations,
    tasks,
    chatHistory,
    automations,
    founderMode = 'beginner',
    onToggleFounderMode,
    onSelectApp,
    onConnectApp,
    onToggleTask,
    onAddTask,
    onDeleteTask,
    onSetRecommendations,
    onAdoptAsTask,
    onAddChatMessage,
    onClearChatHistory,
    onSwitchTab,
    onPrefillCampaign,
    onUpdateMetrics,
    onSetAutomations,
    prefilledGoal,
    prefilledTone,
    onClearPrefilled
  } = props;

  // --------------------------------------------------
  // STATE DEFINITIONS FOR THE VARIOUS WORKSPACES
  // --------------------------------------------------

  // Micro Lesson States
  const [activeLessonKey, setActiveLessonKey] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // HOME -> Recent Projects
  const [projects, setProjects] = useState([
    { id: 'p1', name: 'Guardian Verification Optimization', status: 'In Progress', progress: 65, team: 'Product & Dev', priority: 'High' },
    { id: 'p2', name: 'Wali Family Invites Referral Loop', status: 'Review', progress: 90, team: 'Growth Marketing', priority: 'High' },
    { id: 'p3', name: 'SEO Matchmaking Terms Capture', status: 'Backlog', progress: 15, team: 'Content', priority: 'Low' },
  ]);

  // CEO Command Center States
  const [briefingCampaignStatus, setBriefingCampaignStatus] = useState<'idle' | 'launching' | 'launched'>('idle');
  const [showBriefingDetails, setShowBriefingDetails] = useState(false);
  const [feedLogs, setFeedLogs] = useState<Array<{ id: string, time: string, message: string }>>([
    { id: '1', time: '09:12 AM', message: '🤖 AI Agent auto-optimized meta ad creative variation B based on high engagement.' },
    { id: '2', time: 'Yesterday', message: '🔔 Competitor system update detected. Their basic subscription package increased by $2/mo.' },
    { id: '3', time: '2 days ago', message: '📊 Business health index increased +3% following the wali invitation flow verification fix.' }
  ]);

  // BUILD -> Website Builder State
  const [webSections, setWebSections] = useState([
    { id: 's1', type: 'Hero', title: 'Find Intentional Muslim Marriage', desc: 'A culturally-respectful, privacy-focused environment with family guardian options.' },
    { id: 's2', type: 'Features', title: 'Designed for Family Honor', desc: 'Secure 24-point compatibility test, parental review screens, and active wali inclusion.' },
    { id: 's3', type: 'Pricing', title: 'Simple, Transparent Subscription', desc: 'Basic matching is always free. Advanced profile analytics and compatibility index starting at $12/mo.' }
  ]);
  const [aiCodeResult, setAiCodeResult] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);

  // BUILD -> Mobile App Builder State
  const [mobileScreen, setMobileScreen] = useState<'onboarding' | 'dashboard' | 'matches' | 'paywall'>('onboarding');
  const [mobileTitle, setMobileTitle] = useState('Welcome to Zawaj');

  // BUILD -> AI App Builder State
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [systemPrompt, setSystemPrompt] = useState('You are an expert matchmaking coach for the Zawaj platform. Speak with extreme warmth, honor, and deep wisdom. Help users write high-impact bio profiles.');
  const [aiSandboxChat, setAiSandboxChat] = useState<{role: 'user'|'model', content: string}[]>([
    { role: 'model', content: 'Sandbox agent initialized with instructions. Try testing me below!' }
  ]);
  const [aiSandboxInput, setAiSandboxInput] = useState('');

  // BUILD -> Database Builder State
  const [dbTables, setDbTables] = useState([
    { name: 'profiles', columns: ['id (UUID)', 'user_id (UUID)', 'gender (VARCHAR)', 'age (INTEGER)', 'wali_email (VARCHAR)'] },
    { name: 'matchmaking_chats', columns: ['id (UUID)', 'initiator_id (UUID)', 'receiver_id (UUID)', 'status (VARCHAR)', 'created_at (TIMESTAMP)'] }
  ]);
  const [newTableName, setNewTableName] = useState('');

  // BUILD -> Workflow Builder State
  const [workflowTrigger, setWorkflowTrigger] = useState('User registers');
  const [workflowCondition, setWorkflowCondition] = useState('Wali email is provided');
  const [workflowAction, setWorkflowAction] = useState('Send Guardian Welcome Email');
  const [activeWorkflows, setActiveWorkflows] = useState([
    { id: 'w1', trigger: 'User signs up', condition: 'No profile photo added in 24h', action: 'Send automated push nudge', status: 'Active' },
    { id: 'w2', trigger: 'Wali declines review', condition: 'Always', action: 'Notify matchmaking user & pause match', status: 'Active' }
  ]);

  // BUILD -> Landing Page Builder State
  const [landingPreset, setLandingPreset] = useState('waitlist');
  const [leadsCount, setLeadsCount] = useState(148);

  // CREATE -> Video Studio State
  const [videoGoal, setVideoGoal] = useState('Brand Trust');
  const [videoDraft, setVideoDraft] = useState('');

  // CREATE -> Image Studio State
  const [imageStyle, setImageStyle] = useState('Flat Illustration');
  const [imageRatio, setImageRatio] = useState('1:1');
  const [imagePrompt, setImagePrompt] = useState('A warm, minimal flat vector illustration of an elegant wedding arch decorated with delicate emerald leaves, soft cream roses, and simple gold rings on a clean neutral background.');
  const [generatedImageMock, setGeneratedImageMock] = useState('');

  // CREATE -> Presentation Studio State
  const [pitchOutline, setPitchOutline] = useState<string[]>([]);

  // CREATE -> Email Studio State
  const [emailTemplate, setEmailTemplate] = useState('welcome');
  const [emailSubject, setEmailSubject] = useState('Welcome to your intentional matchmaking journey');

  // CREATE -> Blog Studio State
  const [blogKeyword, setBlogKeyword] = useState('intentional matchmaking');
  const [blogOutline, setBlogOutline] = useState('');

  // CREATE -> Ad Studio State
  const [adTargetFeature, setAdTargetFeature] = useState('Guardian Portal');

  // CREATE -> Brand Kit State
  const [brandPalette, setBrandPalette] = useState('Emerald Premium');
  const [brandFont, setBrandFont] = useState('Inter & Space Grotesk');
  const [brandTone, setBrandTone] = useState('Warm, Respectful, & Analytical');

  // LAUNCH -> Product Launch Wizard State
  const [launchSteps, setLaunchSteps] = useState([
    { id: 'l1', name: 'Draft Campaign Assets', completed: true },
    { id: 'l2', name: 'Configure Target Segment Lists', completed: true },
    { id: 'l3', name: 'Set up Meta & Google Ad Budgets', completed: false },
    { id: 'l4', name: 'Connect Analytics Tunnels', completed: false },
    { id: 'l5', name: 'Deploy Campaign to Production', completed: false }
  ]);

  // LAUNCH -> Social Publishing State
  const [queuedPosts, setQueuedPosts] = useState([
    { id: 'qp1', channel: 'Twitter', text: 'Traditional values meet modern matchmaking technology. Discover why we include family wali guides inside our platform.', day: 'Monday 10:00 AM' },
    { id: 'qp2', channel: 'LinkedIn', text: 'How we solved "good churn" in matchmaking by converting successful couples into brand advocates. Read our full growth analysis.', day: 'Wednesday 2:00 PM' }
  ]);

  // LAUNCH -> Email Campaigns State
  const [emailRecipientFilter, setEmailRecipientFilter] = useState('Registered but did not verify Wali');
  const [simulatedEmailsSent, setSimulatedEmailsSent] = useState(0);

  // LAUNCH -> Meta Ads / Google Ads States
  const [adBudget, setAdBudget] = useState(1500);

  // LAUNCH -> App Deployment State
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'building' | 'deployed'>('idle');

  // KNOWLEDGE -> Founder Memory State
  const [founderMemoryFacts, setFounderMemoryFacts] = useState([
    'Our target audience values privacy and respect above rapid swiping mechanics.',
    'We include Wali (guardian) options specifically to reduce onboarding friction and align with cultural needs.',
    'Our long-term brand differentiator is family-respectful, certified safety parameters.',
    'Core conversion choke point is guardian email verification—solve by sending friendly explainer slides.'
  ]);
  const [newFact, setNewFact] = useState('');

  // KNOWLEDGE -> SOP Library
  const SOP_PLAYBOOKS = [
    { title: 'The Success Churn Referral Loop SOP', cat: 'Virality', difficulty: 'Medium', readTime: '5 min' },
    { title: 'Parent Guardian Onboarding Optimization SOP', cat: 'Retention', difficulty: 'High', readTime: '8 min' },
    { title: 'Values-Based Matchmaking Paywall Architecture', cat: 'Monetization', difficulty: 'Low', readTime: '4 min' }
  ];

  // --------------------------------------------------
  // SIDE EFFECTS & LIFECYCLE
  // --------------------------------------------------

  // Autocomplete AI prompts on activeApp changes
  useEffect(() => {
    if (activeApp) {
      setImagePrompt(`A warm, minimal flat vector illustration of an elegant branding canvas for ${activeApp.name}, styled with ${brandPalette} color scheme, clean margins, and sophisticated displaying elements.`);
      setMobileTitle(`Welcome to ${activeApp.name}`);
    }
  }, [activeApp, brandPalette]);

  // --------------------------------------------------
  // HANDLERS FOR SIMULATIONS
  // --------------------------------------------------

  // Website Builder Section Adding
  const addWebSection = () => {
    const newSec = {
      id: `s_${Date.now()}`,
      type: 'Feature Accent',
      title: 'Built-in Security Protocols',
      desc: 'All interaction events are fully encrypted. Real-time diagnostic monitors scan for inappropriate communication flags.'
    };
    setWebSections([...webSections, newSec]);
  };

  const deleteWebSection = (id: string) => {
    setWebSections(webSections.filter(s => s.id !== id));
  };

  const handleGenerateCode = () => {
    setGeneratingCode(true);
    setTimeout(() => {
      let code = `import React from 'react';\n\nexport default function Landinger() {\n  return (\n    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans">\n      {/* Generated for ${activeApp.name} */}\n`;
      webSections.forEach(sec => {
        code += `      {/* ${sec.type} Section */}\n      <section className="py-16 px-6 max-w-5xl mx-auto border-b border-slate-900">\n        <h2 className="text-3xl font-bold font-display tracking-tight text-white">${sec.title}</h2>\n        <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-2xl">${sec.desc}</p>\n        <button className="mt-6 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition-all shadow-lg">Get Started</button>\n      </section>\n`;
      });
      code += `    </div>\n  );\n}`;
      setAiCodeResult(code);
      setGeneratingCode(false);
    }, 1200);
  };

  // AI Sandbox Chat
  const sendSandboxMessage = () => {
    if (!aiSandboxInput.trim()) return;
    const userMsg = { role: 'user' as const, content: aiSandboxInput };
    setAiSandboxChat(prev => [...prev, userMsg]);
    setAiSandboxInput('');

    setTimeout(() => {
      const response = `[AI Employee using ${aiModel}]: I've processed your message based on my active system parameters ("${systemPrompt}"). \n\nFor ${activeApp.name}, we should construct a premium, trust-enhancing profile checklist. How would you like me to refine this further?`;
      setAiSandboxChat(prev => [...prev, { role: 'model' as const, content: response }]);
    }, 800);
  };

  // Database Column Adding
  const handleAddTable = () => {
    if (!newTableName) return;
    setDbTables([...dbTables, { name: newTableName, columns: ['id (UUID)', 'created_at (TIMESTAMP)', 'updated_at (TIMESTAMP)'] }]);
    setNewTableName('');
  };

  // Trigger campaign simulation
  const triggerSimulation = () => {
    setSimulatedEmailsSent(prev => prev + 480);
    setTimeout(() => {
      alert(`🚀 Campaign Successfully Dispatched!\n\nAudience Segment: ${emailRecipientFilter}\nSimulated Emails Dispatched: 480\nSimulated Open Rate: 68.4%\nClick-through Rate: 14.5%`);
    }, 300);
  };

  // Deploy Action
  const handleDeployAction = () => {
    setDeployStatus('building');
    setDeployLogs([
      'Initializing container build pipeline...',
      'Bundling static React workspace assets...',
      'Configuring Node production runtime cluster...',
      'Verifying Secure Socket handshake configurations...',
      'Running linter checks (tsc --noEmit)... OK',
    ]);

    setTimeout(() => {
      setDeployLogs(prev => [...prev, 'Compiling production server entry points...', 'Asset bundling completed: 14.8MB loaded.']);
    }, 1000);

    setTimeout(() => {
      setDeployLogs(prev => [...prev, 'Deployment completed successfully!', 'Container live at https://production-growos-cloudrun.app/']);
      setDeployStatus('deployed');
    }, 2400);
  };

  // Founder Memory Adding
  const handleAddMemory = () => {
    if (!newFact) return;
    setFounderMemoryFacts([...founderMemoryFacts, newFact]);
    setNewFact('');
  };

  // Brand Kit Color Switcher
  const getPaletteColors = (palette: string) => {
    switch (palette) {
      case 'Emerald Premium': return ['bg-emerald-500', 'bg-teal-400', 'bg-emerald-950'];
      case 'Tech Indigo': return ['bg-indigo-600', 'bg-violet-400', 'bg-indigo-950'];
      case 'Minimalist Slate': return ['bg-slate-300', 'bg-slate-400', 'bg-slate-800'];
      case 'Warm Coral': return ['bg-rose-500', 'bg-orange-400', 'bg-rose-950'];
      default: return ['bg-emerald-500', 'bg-teal-400', 'bg-emerald-950'];
    }
  };

  // --------------------------------------------------
  // ROUTING & RENDERING CONTENT ACCORDING TO SUB-SECTION
  // --------------------------------------------------

  // Direct component rendering check
  if (activeCategory === 'HOME' && activeSubSection === 'Today\'s Tasks') {
    return (
      <DailyAgenda
        activeApp={activeApp}
        tasks={tasks}
        onToggleTask={onToggleTask}
        onAddTask={onAddTask}
        onDeleteTask={onDeleteTask}
      />
    );
  }

  if (activeCategory === 'ANALYZE' && activeSubSection === 'Business Dashboard') {
    return (
      <BusinessIntelligenceCenter
        activeApp={activeApp}
      />
    );
  }

  if (activeCategory === 'HOME' && activeSubSection === 'AI Recommendations') {
    return (
      <AiRecommendations
        activeApp={activeApp}
        recommendations={recommendations}
        onSetRecommendations={onSetRecommendations}
        onAdoptAsTask={onAdoptAsTask}
      />
    );
  }

  if (activeCategory === 'CREATE' && activeSubSection === 'Content Studio') {
    return (
      <ContentStudio
        activeApp={activeApp}
        prefilledGoal={prefilledGoal}
        prefilledTone={prefilledTone}
        onClearPrefilled={onClearPrefilled}
      />
    );
  }

  if (activeCategory === 'AUTOMATE' && activeSubSection === 'AI Employees/Agents') {
    return (
      <GrowthBrainChat
        activeApp={activeApp}
        chatHistory={chatHistory}
        onAddChatMessage={onAddChatMessage}
        onClearChatHistory={onClearChatHistory}
        onSwitchTab={onSwitchTab}
        onAddTask={onAddTask}
        onPrefillCampaign={onPrefillCampaign}
        onUpdateMetrics={onUpdateMetrics}
      />
    );
  }

  if (activeCategory === 'BUILD' && activeSubSection === 'Automation Builder') {
    return (
      <AutomationCenter
        activeApp={activeApp}
        automations={automations}
        onSetAutomations={onSetAutomations}
      />
    );
  }

  if (activeCategory === 'WORKSPACES' && activeSubSection === 'Switch Workspace') {
    return (
      <ConnectedAppsMarketplace
        apps={apps}
        activeAppId={activeApp.id}
        onSelectApp={onSelectApp}
        onConnectApp={onConnectApp}
      />
    );
  }

  // Fallback to Settings
  if (activeCategory === 'WORKSPACES' && activeSubSection === 'Independent Memory') {
    return (
      <SettingsPanel
        activeApp={activeApp}
        apps={apps}
        onSelectApp={onSelectApp}
      />
    );
  }

  // --------------------------------------------------
  // INTERACTIVE WORKSPACE SIMULATORS
  // --------------------------------------------------
  return (
    <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-6 md:p-8" id="simulator-canvas">
      
      {/* Dynamic Simulator Header Accent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-widest uppercase block bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full w-max">
            {activeCategory} SIMULATOR
          </span>
          <h3 className="text-xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            {activeSubSection}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure system parameters and run simulated AI actions tailored to the <span className="text-white font-bold">{activeApp.name}</span> profile.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-slate-950/60 border border-slate-850 px-3 py-1.5 rounded-xl">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Active Context: {activeApp.name} ({activeApp.businessModel})</span>
        </div>
      </div>

      {/* Beginner Mode Founder Companion overlay */}
      {founderMode === 'beginner' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/20 rounded-2xl shadow-xl shadow-emerald-950/5 relative overflow-hidden"
        >
          {/* subtle animated glow element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full filter blur-xl pointer-events-none animate-pulse"></div>
          
          <div className="flex items-start gap-4">
            <div className="bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/30 text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            
            <div className="space-y-4 flex-grow">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Founder Companion Guide
                  <span className="text-[8px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-md">BEGINNER MODE</span>
                </h4>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  💡 <strong className="text-white">What this is:</strong> {getFounderGuide(activeCategory, activeSubSection, activeApp.name).what}
                </p>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  🎯 <strong className="text-white">Why it matters:</strong> {getFounderGuide(activeCategory, activeSubSection, activeApp.name).why}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-[11px] font-mono">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-slate-500 uppercase tracking-widest block font-bold mb-1">Recommended Choice</span>
                  <span className="text-emerald-400 font-semibold">{getFounderGuide(activeCategory, activeSubSection, activeApp.name).recommended}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-slate-500 uppercase tracking-widest block font-bold mb-1">Projected Outcome</span>
                  <span className="text-teal-400 font-semibold">{getFounderGuide(activeCategory, activeSubSection, activeApp.name).impact}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                  <span className="text-slate-500 uppercase tracking-widest block font-bold mb-1">Completion Time</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    {getFounderGuide(activeCategory, activeSubSection, activeApp.name).time}
                  </span>
                </div>
              </div>

              {MICRO_LESSONS[activeSubSection] && (
                <div className="pt-3.5 border-t border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {completedLessons.includes(activeSubSection) 
                      ? '✅ You mastered this micro-lesson strategy!' 
                      : '🎓 Study the visual interactive guide for this builder module.'}
                  </span>
                  <button
                    onClick={() => setActiveLessonKey(activeSubSection)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{completedLessons.includes(activeSubSection) ? 'Review Strategic Lesson' : 'Launch Interactive Lesson'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* RENDER CUSTOM SCREEN BASED ON ACTIVE SUBSECTION */}
      <div className="min-h-[350px]">
        
        {/* ==================== HOME -> Daily Briefing ==================== */}
        {activeSubSection === 'Daily Briefing' && (
          <div className="space-y-8 animate-fade-in" id="ceo-command-center">
            
            {/* Main Greeting & Time Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/60 border border-slate-900 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full w-max">
                  AI CEO CO-PILOT ACTIVE
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                  Good morning, Founder.
                </h2>
                <p className="text-xs text-slate-400">
                  Daily Briefing finalized • Ready to execute tactical overrides for <span className="text-white font-semibold">{activeApp.name}</span>.
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-right shrink-0 z-10 font-mono">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">SYSTEM DATE</div>
                <div className="text-sm font-bold text-white mt-1">Friday, July 10, 2026</div>
                <div className="text-[10px] text-slate-400 mt-0.5">00:15 AM (UTC-7)</div>
              </div>
            </div>

            {/* Conversational AI Briefing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Briefing text */}
              <div className="lg:col-span-2 bg-gradient-to-tr from-slate-950 via-slate-950 to-slate-900/40 border border-slate-850 p-6 rounded-3xl space-y-6 relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Conversational AI Executive Summary</h3>
                  </div>
                  
                  {/* The exact requested Conversational AI experience structured elegantly */}
                  <div className="space-y-3 pl-1">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      "Good morning, Founder. Based on real-time database snapshots and marketing sync streams, here is your high-level diagnostic overview for <span className="text-white font-bold">{activeApp.name}</span>:"
                    </p>
                    
                    <div className="space-y-2.5 pt-1.5">
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="text-lg bg-rose-950/40 border border-rose-500/20 p-1.5 rounded-xl shrink-0">📊</span>
                        <div>
                          <span className="text-rose-400 font-semibold">Revenue is down 6%</span> this week. Checkout funnel friction in Wali confirmation reports a dropoff.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="text-lg bg-emerald-950/40 border border-emerald-500/20 p-1.5 rounded-xl shrink-0">📈</span>
                        <div>
                          <span className="text-emerald-400 font-semibold">Instagram engagement increased 18%</span>. Last night's educational campaign is converting highly.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="text-lg bg-teal-950/40 border border-teal-500/20 p-1.5 rounded-xl shrink-0">⚡</span>
                        <div>
                          You have <span className="text-teal-400 font-bold">3 automated outreach campaigns</span> ready to launch from the dispatch room.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <span className="text-lg bg-amber-950/40 border border-amber-500/20 p-1.5 rounded-xl shrink-0">🔔</span>
                        <div>
                          <span className="text-amber-400 font-semibold">One competitor launched</span> a brand-new tiered pricing model yesterday.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RECOMMENDED ACTION */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">AI RECOMMENDED STRATEGIC OVERRIDE</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">96% Conf. Match</span>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-extrabold text-white">RECOMMENDED ACTION: Launch your email campaign today.</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Directly re-engage the 480 registered users who haven't completed guardian invites. Simulated models forecast a +4.5% conversion increase.
                    </p>
                  </div>

                  {/* Interactivity Section for Campaign Launch */}
                  <AnimatePresence mode="wait">
                    {briefingCampaignStatus === 'idle' && (
                      <div className="flex flex-wrap gap-2.5 pt-1.5">
                        <button 
                          onClick={() => {
                            setBriefingCampaignStatus('launching');
                            setTimeout(() => {
                              setBriefingCampaignStatus('launched');
                              setFeedLogs(prev => [
                                { id: `log_${Date.now()}`, time: 'Just Now', message: '🚀 Automated email marketing campaign dispatched to active user cohort.' },
                                ...prev
                              ]);
                              // Slightly boost MAU or MRR in the app metrics for extra high-fidelity responsiveness!
                              onUpdateMetrics({
                                ...activeApp.metrics,
                                mrr: Math.floor(activeApp.metrics.mrr * 1.01),
                                mau: Math.floor(activeApp.metrics.mau * 1.02)
                              });
                            }, 1500);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Launch Now</span>
                        </button>
                        
                        <button 
                          onClick={() => {
                            // Prefill the campaign to Create Studio
                            onPrefillCampaign('Re-engage Unverified Wali Guardians', 'Warm & Respectful');
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl border border-slate-800 transition-all duration-200 cursor-pointer"
                        >
                          Review Campaign
                        </button>
                        
                        <button 
                          onClick={() => setShowBriefingDetails(true)}
                          className="bg-transparent hover:bg-slate-900 text-slate-400 hover:text-white font-medium text-xs px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          See Details
                        </button>
                      </div>
                    )}

                    {briefingCampaignStatus === 'launching' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 py-2 text-xs text-emerald-400 font-mono"
                      >
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Compiling segment parameters & dispatching SMTP relays...</span>
                      </motion.div>
                    )}

                    {briefingCampaignStatus === 'launched' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-emerald-500/20 rounded-xl p-4 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                          <CheckCircle className="w-4 h-4" />
                          <span>Campaign Successfully Dispatched!</span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Dispatched 480 emails targeting: <em>"Registered but did not verify Wali"</em>. Estimated response metrics will reflect in your Business Dashboard within 24 hours.
                        </p>
                        <button 
                          onClick={() => setBriefingCampaignStatus('idle')}
                          className="text-[10px] text-slate-500 hover:text-slate-300 underline font-mono block pt-1 cursor-pointer"
                        >
                          Dismiss / Reset Action
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Overall Business Health Score (Progress Circle) */}
              <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-3xl flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">BUSINESS VITALITY</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Holistic diagnostic score of all connected micro-systems.</p>
                </div>

                <div className="flex justify-center py-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="52"
                        className="stroke-slate-900"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="72"
                        cy="72"
                        r="52"
                        className="stroke-emerald-400"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 52}
                        initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.94) }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-4xl font-black font-mono text-white">94</span>
                      <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-widest mt-0.5">HEALTH RATE</span>
                    </div>
                  </div>
                </div>

                {/* Mini Indicators */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-mono block">MRR Velocity</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-white font-mono">${activeApp.metrics.mrr.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-rose-400 flex items-center bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">-6%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-mono block">Acquisition (CAC)</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-white font-mono">${activeApp.metrics.cac}</span>
                      <span className="text-[9px] font-bold text-emerald-400 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">-$2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* See Details Expanded Panel (Modal/Drawer style) */}
            <AnimatePresence>
              {showBriefingDetails && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-950 border border-emerald-500/15 rounded-3xl p-6 space-y-6 overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">Detailed Diagnostic Breakdown • {activeApp.name}</h4>
                    </div>
                    <button 
                      onClick={() => setShowBriefingDetails(false)}
                      className="text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Close Breakdown
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-850 space-y-3">
                      <h5 className="text-xs font-bold text-slate-300">Wali Conversion Funnel</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>1. Account Created</span>
                          <span className="text-white font-mono font-bold">100% (1,240)</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500/80" style={{ width: '100%' }}></div>
                        </div>
                        
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>2. Partner Profile Bio Completed</span>
                          <span className="text-white font-mono font-bold">78% (967)</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500/70" style={{ width: '78%' }}></div>
                        </div>

                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>3. Wali Email Invited</span>
                          <span className="text-white font-mono font-bold">38% (480)</span>
                        </div>
                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500/80 animate-pulse" style={{ width: '38%' }}></div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal italic pt-1">
                        *Note: Major funnel dropoff identified at step 3. Recommended action directly mitigates this choke point.
                      </p>
                    </div>

                    <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-850 space-y-3">
                      <h5 className="text-xs font-bold text-slate-300">Competitor Monitoring Telemetry</h5>
                      <div className="space-y-3 font-mono text-[11px] text-slate-400">
                        <div className="border-l-2 border-amber-500 pl-2 py-0.5 space-y-1">
                          <span className="text-amber-400 font-bold block">Sabeel Matchmaking</span>
                          <p className="text-[10px] text-slate-300 leading-normal">
                            Updated premium tier to $14.99/mo (+2.00 increase). Added "guardian view" highlights.
                          </p>
                        </div>
                        <div className="border-l-2 border-slate-700 pl-2 py-0.5 space-y-1">
                          <span className="text-slate-300 font-bold block">Halal Wed Hub</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            No significant core updates. Display ad volume has flatlined across meta channels.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-850 space-y-3">
                      <h5 className="text-xs font-bold text-slate-300">Social Audience Engagement</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Instagram Reach Spike</span>
                          <span className="text-emerald-400 font-bold font-mono">+18.4%</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">TikTok Video Plays</span>
                          <span className="text-emerald-400 font-bold font-mono">+12.1%</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Ad Click-through Rate</span>
                          <span className="text-emerald-400 font-bold font-mono">4.82%</span>
                        </div>
                      </div>
                      <div className="bg-slate-950 p-2 border border-slate-850 rounded-xl text-[10px] text-emerald-400 font-mono text-center">
                        ✓ Ad Creative Auto-Sync Complete
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Row - Priority-based Action Cards, Recent Activity Feed, Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Priority-Based Action Cards */}
              <div className="space-y-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">Priority Action Plays</h3>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">AI RECOMMENDED</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    {
                      id: 'play_1',
                      title: 'Fix Checkout Conversion Dropoff',
                      desc: 'Address the 6.2% checkout page exit rate. Deploy automated discount codes for uncompleted checkouts.',
                      category: 'Monetization' as const,
                      priority: 'High' as const,
                      reward: '+8.5% MRR Potential'
                    },
                    {
                      id: 'play_2',
                      title: 'Re-engage Inactive Guardians',
                      desc: 'Send an automated friendly overview deck directly to guardians who have not replied in 48 hours.',
                      category: 'Retention' as const,
                      priority: 'High' as const,
                      reward: '-4.2% Churn Prevention'
                    },
                    {
                      id: 'play_3',
                      title: 'Social Referral Loop Launch',
                      desc: 'Deploy shareable card structures when couples successfully match. Boost organic viral invitation rate.',
                      category: 'Virality' as const,
                      priority: 'Medium' as const,
                      reward: '+12% Free Invites'
                    }
                  ].map((play) => {
                    // Check if this task already exists in the tasks checklist to prevent duplicate additions
                    const isAdopted = tasks.some(t => t.title === play.title && t.appId === activeApp.id);

                    return (
                      <div key={play.id} className="bg-slate-900/60 hover:bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-3 transition-colors duration-200">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                play.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {play.priority}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{play.category}</span>
                            </div>
                            <h4 className="text-xs font-bold text-white mt-1 leading-tight">{play.title}</h4>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">{play.desc}</p>
                        
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                          <span className="text-emerald-400 font-mono font-bold">{play.reward}</span>
                          
                          <button
                            disabled={isAdopted}
                            onClick={() => {
                              onAdoptAsTask(play.title, play.category, play.priority);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 ${
                              isAdopted
                                ? 'bg-slate-850 text-slate-500 border border-transparent cursor-not-allowed'
                                : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 hover:border-transparent cursor-pointer'
                            }`}
                          >
                            {isAdopted ? '✓ Adopted' : 'Adopt Play'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="space-y-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">CEO Activity Timeline</h3>
                    </div>
                    <button 
                      onClick={() => setFeedLogs([
                        { id: `log_${Date.now()}`, time: 'Just Now', message: '🧹 Activity feed refreshed & synced.' }
                      ])}
                      className="text-[10px] font-mono text-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="relative pl-3 border-l border-slate-900 space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {feedLogs.map((log) => (
                      <div key={log.id} className="relative text-[11px] leading-relaxed">
                        {/* Bullet point accent */}
                        <div className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-emerald-500 border-2 border-slate-950"></div>
                        <div className="font-mono text-[9px] text-slate-500 font-bold uppercase">{log.time}</div>
                        <p className="text-slate-300 mt-0.5">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                  <span>SYSTEM HEARTBEAT: OK</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    SYNCED
                  </span>
                </div>
              </div>

              {/* Upcoming Tasks Checklist */}
              <div className="space-y-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest font-mono">Today's Operating Tasks</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded-md">
                    {tasks.filter(t => t.appId === activeApp.id && !t.completed).length} Pending
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {tasks.filter(t => t.appId === activeApp.id).length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs font-medium">
                      No operating tasks registered for this workspace yet. Adopt AI recommends above or add custom checklist items under the "Today's Tasks" module!
                    </div>
                  ) : (
                    tasks.filter(t => t.appId === activeApp.id).map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => onToggleTask(task.id)}
                        className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                          task.completed 
                            ? 'bg-slate-950/20 border-slate-950 text-slate-500 line-through' 
                            : 'bg-slate-900/60 border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-200'
                        }`}
                      >
                        <button className="mt-0.5 shrink-0 text-emerald-400 hover:text-emerald-300">
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-700 hover:border-emerald-400"></div>
                          )}
                        </button>
                        <div className="flex-grow space-y-1">
                          <span className="text-xs font-medium leading-tight block">{task.title}</span>
                          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 font-bold">
                            <span className="uppercase">{task.category}</span>
                            <span>•</span>
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== HOME -> Recent Projects ==================== */}
        {activeSubSection === 'Recent Projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Workspace Active Projects</span>
              <button onClick={() => {
                const newP = { id: `p_${Date.now()}`, name: 'New AI Campaign Integration', status: 'In Progress', progress: 10, team: 'Marketing', priority: 'Medium' };
                setProjects([...projects, newP]);
              }} className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Create Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map(proj => (
                <div key={proj.id} className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">{proj.team}</span>
                      <h4 className="text-sm font-bold text-white mt-1 leading-tight">{proj.name}</h4>
                    </div>
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      proj.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {proj.priority}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span className="font-mono">{proj.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                    <span>Status: <span className="text-emerald-400 font-bold">{proj.status}</span></span>
                    <button onClick={() => setProjects(projects.filter(p => p.id !== proj.id))} className="hover:text-rose-400 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== HOME -> Business Health Score ==================== */}
        {activeSubSection === 'Business Health Score' && (
          <div className="space-y-6">
            <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-8">
              {/* Score Gauge */}
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-4 border-slate-850">
                <div className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-500/20 animate-spin"></div>
                <div className="text-center">
                  <span className="text-5xl font-mono font-black text-white">94</span>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-widest mt-1">HEALTH SCORE</span>
                </div>
              </div>

              {/* Insights */}
              <div className="flex-grow space-y-4">
                <h4 className="text-md font-bold text-white tracking-tight">Excellent Workspace Vitality</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your business is in the <strong>95th percentile</strong> of other {activeApp.businessModel} platforms. High customer trust (extremely low B2B/matchmaking cancellations) paired with very reasonable CAC yields highly efficient operational economics.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 block">LTV-to-CAC Efficiency</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">6.2x Ratio (Excellent)</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 block">Churn Risk Assessment</span>
                    <span className="text-xs font-bold text-teal-400 font-mono">Stable / Declining Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== HOME -> One-click Quick Actions ==================== */}
        {activeSubSection === 'One-click Quick Actions' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Operational Controls</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Draft Ad Campaign', desc: 'Craft optimized, high-converting social banner and copy drafts for Meta.', action: () => onSwitchTab('marketing') },
                { title: 'Diagnose Checkout Funnel', desc: 'Examine metrics telemetry and flag conversion leaks instantly.', action: () => onSwitchTab('dashboard') },
                { title: 'Audit Brand Kit Options', desc: 'Modify system color palettes and corporate communication guidelines.', action: () => alert('🎨 Palette synced! Head to CREATE -> Brand Kit to adjust typography.') },
                { title: 'Run System Health check', desc: 'Check development container deploy health and static routing status.', action: () => alert('✓ Operational node online. TLS 1.3 verified. Port 3000 fully routed.') },
              ].map((act, i) => (
                <button
                  key={i}
                  onClick={act.action}
                  className="bg-slate-950/80 hover:bg-slate-900 border border-slate-850 p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer hover:border-emerald-500/20 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{act.title}</h4>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{act.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ==================== BUILD -> Website Builder ==================== */}
        {activeSubSection === 'Website Builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Page Sections Outline</span>
                <button
                  onClick={addWebSection}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Section</span>
                </button>
              </div>

              <div className="space-y-3">
                {webSections.map((sec, idx) => (
                  <div key={sec.id} className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center font-mono text-[10px] text-slate-500 shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-slate-900 text-emerald-400 px-1.5 py-0.2 rounded uppercase">
                          {sec.type}
                        </span>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const updated = [...webSections];
                            updated[idx].title = e.target.value;
                            setWebSections(updated);
                          }}
                          className="bg-transparent border-none text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 rounded px-1 flex-grow"
                        />
                      </div>
                      <textarea
                        value={sec.desc}
                        onChange={(e) => {
                          const updated = [...webSections];
                          updated[idx].desc = e.target.value;
                          setWebSections(updated);
                        }}
                        rows={2}
                        className="bg-transparent border-none text-[11px] text-slate-400 mt-1 leading-normal w-full resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/20 rounded px-1"
                      />
                    </div>
                    <button onClick={() => deleteWebSection(sec.id)} className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerateCode}
                disabled={generatingCode}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {generatingCode ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling Landing Page Sections...</span>
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4" />
                    <span>AI Generate Code & Mock Landing Page</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview Window */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-[10px] text-slate-500">Preview: {activeApp.name}</span>
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.2 rounded">LIVE VISUALIZER</span>
              </div>

              <div className="p-6 flex-grow overflow-y-auto max-h-[380px] space-y-8 bg-slate-950">
                {webSections.map((sec) => (
                  <div key={sec.id} className="border-b border-slate-900 pb-6 last:border-b-0">
                    <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest font-bold">[{sec.type}]</span>
                    <h4 className="text-lg font-black text-white mt-1 tracking-tight">{sec.title}</h4>
                    <p className="text-[11.5px] text-slate-400 mt-2 leading-relaxed">{sec.desc}</p>
                    <button className="mt-4 px-4 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all">
                      Action CTA
                    </button>
                  </div>
                ))}
              </div>

              {aiCodeResult && (
                <div className="border-t border-slate-850 bg-slate-950 p-4 font-mono text-[9px] text-emerald-400 overflow-x-auto max-h-[120px]">
                  <div className="flex justify-between items-center text-slate-500 mb-2 border-b border-slate-900 pb-1.5">
                    <span>GENERATED REACT/TAILWIND COMPONENTS</span>
                    <button onClick={() => {
                      navigator.clipboard.writeText(aiCodeResult);
                      alert('✓ Copy successful!');
                    }} className="hover:text-white cursor-pointer font-bold">COPY CODE</button>
                  </div>
                  <pre>{aiCodeResult}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== BUILD -> Mobile App Builder ==================== */}
        {activeSubSection === 'Mobile App Builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">App Simulator Editor</span>
              
              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Screen Active Title</label>
                  <input
                    type="text"
                    value={mobileTitle}
                    onChange={(e) => setMobileTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Simulation Active Screen Router</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'onboarding', label: 'Onboarding Screen' },
                      { id: 'dashboard', label: 'Home Feed' },
                      { id: 'matches', label: 'Matches Profile' },
                      { id: 'paywall', label: 'Premium Paywall' }
                    ].map((scr) => (
                      <button
                        key={scr.id}
                        onClick={() => setMobileScreen(scr.id as any)}
                        className={`py-2 text-[11px] font-mono rounded-lg border text-center transition-all cursor-pointer ${
                          mobileScreen === scr.id 
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {scr.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-[10.5px] text-slate-400 leading-relaxed">
                  <span className="font-bold text-white block mb-1">Interactive Hot-Reload Active</span>
                  Modifying custom screens auto-compiles downstream mobile templates. Deploy to simulate on-device performance check.
                </div>
              </div>
            </div>

            {/* Simulated Phone Interface */}
            <div className="flex justify-center">
              <div className="relative w-72 h-[450px] bg-slate-950 border-[6px] border-slate-800 rounded-[36px] shadow-2xl flex flex-col overflow-hidden">
                {/* Speaker pill */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-24 bg-slate-800 rounded-full z-10"></div>
                
                {/* App Content */}
                <div className="flex-grow flex flex-col p-5 pt-8 bg-slate-950 relative">
                  
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono mb-4">
                    <span>9:41 AM</span>
                    <span className="flex items-center gap-1">5G • [■]</span>
                  </div>

                  {/* Header Title */}
                  <h4 className="text-sm font-bold text-white tracking-tight text-center border-b border-slate-900 pb-2 mb-4">
                    {mobileTitle}
                  </h4>

                  <div className="flex-grow flex flex-col justify-between">
                    {mobileScreen === 'onboarding' && (
                      <div className="text-center space-y-4 pt-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 mx-auto">
                          <User className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] text-slate-400">Step 1 of 3: Establish your premium match preferences securely.</p>
                        <input type="text" placeholder="Wali Guardian Email Address" className="w-full bg-slate-900 border border-slate-800 text-[10px] text-center rounded-lg py-1.5 focus:outline-none" readOnly />
                      </div>
                    )}

                    {mobileScreen === 'dashboard' && (
                      <div className="space-y-3">
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                          <span className="text-[8px] font-mono text-emerald-400 uppercase">RECOMMENDED</span>
                          <h5 className="text-[10.5px] font-bold text-white mt-0.5">Aisha & Faisal Matching</h5>
                          <p className="text-[8.5px] text-slate-500 mt-1">94% Overlap score in Family goals.</p>
                        </div>
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                          <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">SHARED PREFERENCES</span>
                          <h5 className="text-[10.5px] font-bold text-slate-300 mt-0.5">Zahra & Amina matching</h5>
                        </div>
                      </div>
                    )}

                    {mobileScreen === 'matches' && (
                      <div className="text-center space-y-4 pt-4">
                        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                          Match View
                        </div>
                        <h5 className="text-xs font-bold text-white">Wali Review Pending</h5>
                        <p className="text-[9.5px] text-slate-400">Waiting on parental review approval before matching chat launches.</p>
                      </div>
                    )}

                    {mobileScreen === 'paywall' && (
                      <div className="text-center space-y-3 pt-2">
                        <span className="text-[8px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">UNLOCKED PREMIUM</span>
                        <h5 className="text-xs font-black text-white">Values compatibility Index</h5>
                        <p className="text-[9px] text-slate-400">Unlock detailed metrics analysis of compatibility scores.</p>
                        <button className="w-full py-1.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-lg">Upgrade for $14.99</button>
                      </div>
                    )}

                    {/* Bottom Action Pill */}
                    <button className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-xl border border-emerald-500/20 transition-all">
                      Confirm Action Loop
                    </button>
                  </div>
                </div>

                {/* Home Indicator line */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-28 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BUILD -> AI App Builder ==================== */}
        {activeSubSection === 'AI App Builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Setup */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Agent Thinking Configuration</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Cognitive Base Model</label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Default optimized speed)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep reasoning, verbose)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Legacy Fast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">System Prompt Instructions</label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none resize-none font-mono"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider">Active Tools for Agent</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['Google Web Search', 'Google Maps Grounding', 'Code Sandbox Interpreter', 'Founder Memory Index'].map((tool, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-[10.5px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Testing Sandbox */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>Agent Testing Terminal ({aiModel})</span>
                </span>
                <button onClick={() => setAiSandboxChat([{ role: 'model', content: 'Sandbox agent context re-seeded.' }])} className="hover:text-white cursor-pointer">RESET</button>
              </div>

              <div className="p-4 flex-grow overflow-y-auto max-h-[250px] space-y-4 min-h-[220px]">
                {aiSandboxChat.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role !== 'user' && (
                      <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none' 
                        : 'bg-slate-900 text-slate-300 rounded-tl-none border border-slate-850'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-slate-850 bg-slate-950/80 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your sandbox agent something..."
                  value={aiSandboxInput}
                  onChange={(e) => setAiSandboxInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendSandboxMessage()}
                  className="flex-grow bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500/30"
                />
                <button
                  onClick={sendSandboxMessage}
                  className="p-2 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BUILD -> Database Builder ==================== */}
        {activeSubSection === 'Database Builder' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Visual Schema Designer</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Table Name"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                />
                <button onClick={handleAddTable} className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-emerald-400 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Table</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbTables.map((table, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <h4 className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>{table.name}</span>
                    </h4>
                    <button onClick={() => setDbTables(dbTables.filter(t => t.name !== table.name))} className="text-slate-500 hover:text-rose-400 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {table.columns.map((col, cidx) => (
                      <div key={cidx} className="flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-850">
                        <span>{col}</span>
                        <span className="text-slate-500">Key</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const colName = prompt('Enter column name & type (e.g., bio_text VARCHAR):');
                      if (colName) {
                        const updated = [...dbTables];
                        updated[idx].columns.push(colName);
                        setDbTables(updated);
                      }
                    }}
                    className="w-full py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9px] font-mono text-slate-500 hover:text-white transition-all"
                  >
                    + ADD COLUMN
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== BUILD -> Workflow Builder ==================== */}
        {activeSubSection === 'Workflow Builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Creator */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Interactive Logic Linker</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">1. If Event (Trigger)</label>
                  <select
                    value={workflowTrigger}
                    onChange={(e) => setWorkflowTrigger(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="User registers">User registers</option>
                    <option value="Guardian review declined">Guardian review declined</option>
                    <option value="Cart abandoned over 2h">Cart abandoned over 2h</option>
                    <option value="Matchmaking success logged">Matchmaking success logged</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">2. Under Criteria (Condition)</label>
                  <select
                    value={workflowCondition}
                    onChange={(e) => setWorkflowCondition(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Wali email is provided">Wali email is provided</option>
                    <option value="Cart total exceeds $50">Cart total exceeds $50</option>
                    <option value="Always trigger">Always trigger</option>
                    <option value="User resides in specified target area">User resides in target area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">3. AI Action (Then execute)</label>
                  <select
                    value={workflowAction}
                    onChange={(e) => setWorkflowAction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Send Guardian Welcome Email">Send Guardian Welcome Email</option>
                    <option value="Notify user matchmaking & pause match">Notify user & pause match</option>
                    <option value="Auto-generate discount voucher inside chat">Auto-generate discount voucher</option>
                    <option value="Dispatch successful Walimah gift invite links">Dispatch Walimah exit invites</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setActiveWorkflows([...activeWorkflows, { id: `w_${Date.now()}`, trigger: workflowTrigger, condition: workflowCondition, action: workflowAction, status: 'Active' }]);
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Automation Link</span>
                </button>
              </div>
            </div>

            {/* Active List */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Event Hooks</span>

              <div className="space-y-2.5">
                {activeWorkflows.map(wf => (
                  <div key={wf.id} className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/20 px-2 py-0.5 rounded">
                        {wf.status}
                      </span>
                      <button onClick={() => setActiveWorkflows(activeWorkflows.filter(w => w.id !== wf.id))} className="text-slate-500 hover:text-rose-400 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                      <div>
                        <span className="text-slate-500 block uppercase text-[8px]">IF EVENT</span>
                        <span className="text-slate-200 mt-0.5 block">{wf.trigger}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[8px]">CONDITION</span>
                        <span className="text-slate-200 mt-0.5 block">{wf.condition}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[8px]">THEN DO</span>
                        <span className="text-emerald-400 mt-0.5 block font-bold">{wf.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== CREATE -> Video Studio ==================== */}
        {activeSubSection === 'Video Studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">AI Scripting Studio</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Campaign Script Goal</label>
                  <select
                    value={videoGoal}
                    onChange={(e) => setVideoGoal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Brand Trust">Brand Trust & Safety (Highlight Guardian portal)</option>
                    <option value="Viral Walimah Loops">Viral Walimah Loops (Referral invite showcase)</option>
                    <option value="High Compatibility Index">Deep Compatibility Scoring (Highlight quiz value)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    let draft = `TITLE: ${activeApp.name} - ${videoGoal} (30s Promotional Script)\n==================================================\n\n`;
                    if (videoGoal === 'Brand Trust') {
                      draft += `SCENE 1 (0-10s):\n[VISUAL]: A warm, sunlit modern lounge. A young Muslim woman sits with her mother, laughing and scrolling through a secure iPad interface.\n[VOICEOVER]: "Trust isn't built on swipes. It's built on family commitment. That's why we created ${activeApp.name}."\n\nSCENE 2 (10-20s):\n[VISUAL]: Graphic animation showing a secure, encrypted Wali Guardian review dashboard, displaying blurred overlaps of compatibility.\n[VOICEOVER]: "With built-in guardian invite portals, share compatible profiles instantly with your loved ones for a respectful, honored marriage."\n\nSCENE 3 (20-30s):\n[VISUAL]: Minimalist closing title: ${activeApp.name} - Intentional Matchmaking. Download today.\n[VOICEOVER]: "Find your intentional match, beautifully and respectfully."`;
                    } else {
                      draft += `SCENE 1 (0-10s):\n[VISUAL]: Beautiful wedding venue, couples laughing as they share exit surveys.\n[VOICEOVER]: "The Walimah exit survey turns matchmaking success into peer invitations..."`;
                    }
                    setVideoDraft(draft);
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Draft Storyboard Script</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 overflow-y-auto max-h-[350px] font-mono text-[10px] text-slate-300">
              {videoDraft ? (
                <pre className="whitespace-pre-wrap leading-relaxed">{videoDraft}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <Video className="w-8 h-8 mb-2" />
                  <span>Draft script storyboard outline to test.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== CREATE -> Image Studio ==================== */}
        {activeSubSection === 'Image Studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Visual Asset Prompting</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Aesthetic Style</label>
                    <select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11.5px] text-white focus:outline-none"
                    >
                      <option value="Flat Illustration">Flat Vector Illustration</option>
                      <option value="3D Clay Render">3D Clay Render</option>
                      <option value="Editorial Editorial">Editorial Editorial Photo</option>
                      <option value="Modern Swiss Style">Swiss Editorial Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Aspect Ratio</label>
                    <select
                      value={imageRatio}
                      onChange={(e) => setImageRatio(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11.5px] text-white focus:outline-none"
                    >
                      <option value="1:1">1:1 Square (Ad Banner)</option>
                      <option value="16:9">16:9 Wide (Landing Page)</option>
                      <option value="9:16">9:16 Portrait (Stories/Ads)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">AI Prompt Composer</label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none font-mono"
                  />
                </div>

                <button
                  onClick={() => {
                    setGeneratedImageMock(`https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop`);
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Draft Mock Marketing Asset</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
              {generatedImageMock ? (
                <div className="relative w-full h-full">
                  <img src={generatedImageMock} alt="Mock generation" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 p-4 flex flex-col justify-between">
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider w-max">
                      {imageStyle} • {imageRatio}
                    </span>
                    <span className="text-[10px] text-white drop-shadow font-mono leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      Prompt draft compiled successfully for matching.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span>Visual asset mockup loading station.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== CREATE -> Presentation Studio ==================== */}
        {activeSubSection === 'Presentation Studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pitch Deck Orchestrator</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <button
                  onClick={() => {
                    setPitchOutline([
                      `SLIDE 1: Title & Vision - ${activeApp.name}: Restoring honor and commitment to modern matchmaking.`,
                      `SLIDE 2: The Problem - Swiping apps promote shallow, transactional dating, causing high customer frustration and parent exclusion.`,
                      `SLIDE 3: The Solution - A family-supportive, values-guided matchmaking ecosystem featuring parent review modes.`,
                      `SLIDE 4: Market Opportunity - Over 1.8 billion Muslims globally, with high demand for privacy-focused matrimonial portals.`,
                      `SLIDE 5: Business Model - Free basic pairing. Premium tiers for Wali interaction nodes, scoring at $12-$15/mo.`
                    ]);
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Presentation className="w-4 h-4" />
                  <span>Compile Outline Deck</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-3 max-h-[350px] overflow-y-auto">
              {pitchOutline.length > 0 ? (
                pitchOutline.map((slide, i) => (
                  <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-850 text-[10.5px] text-slate-300 font-mono leading-relaxed">
                    {slide}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <Presentation className="w-8 h-8 mb-2" />
                  <span>Draft deck outline cards.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== CREATE -> Email Studio ==================== */}
        {activeSubSection === 'Email Studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Sequence Designer</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Layout Preset</label>
                  <select
                    value={emailTemplate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmailTemplate(val);
                      if (val === 'welcome') {
                        setEmailSubject('Welcome to your intentional matchmaking journey');
                      } else {
                        setEmailSubject('Action needed: Verify your Wali guardian email');
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="welcome">Welcome Onboarding Email</option>
                    <option value="guardian">Guardian Verification Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Subject Line</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 text-xs leading-relaxed text-slate-300 font-sans space-y-3">
              <div className="border-b border-slate-900 pb-3 mb-2 font-mono text-[10px] text-slate-500 space-y-1">
                <div><strong>Subject:</strong> {emailSubject}</div>
                <div><strong>From:</strong> updates@{activeApp.name.toLowerCase()}.com</div>
              </div>

              {emailTemplate === 'welcome' ? (
                <div className="space-y-3">
                  <p>As-salamu alaykum,</p>
                  <p>Welcome to <strong>{activeApp.name}</strong>, where we design technology to respect and honor your intentional marriage journey.</p>
                  <p>Our records indicate that you have successfully established your candidate matching profile. Next, to activate compatibility scoring and parental review modes, please connect your guardian email address inside your dashboard.</p>
                  <p>Let's find compatibility beautifully,</p>
                  <p>The {activeApp.name} Team</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p>Dear Guardian,</p>
                  <p>A member of your family has registered on <strong>{activeApp.name}</strong> and listed you as their official Matrimonial Wali/Guardian.</p>
                  <p>We invite you to securely review compatible candidate profiles together with them. Click the single-use access link below to launch your guardian viewer mode.</p>
                  <button className="px-4 py-2 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-lg mt-2">Activate Guardian Mode</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== CREATE -> Blog Studio ==================== */}
        {activeSubSection === 'Blog Studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">SEO Article Outline Draft</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Target Keyword/Search phrase</label>
                  <input
                    type="text"
                    value={blogKeyword}
                    onChange={(e) => setBlogKeyword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    setBlogOutline(`SEO ARTICLE OUTLINE: "The Power of ${blogKeyword} in Matrimonials"\n==================================================\n\n1. INTRODUCTION: Swiping Fatigue vs. Intentional Matchmaking\n   - Core pain points of conventional swipe portals.\n   - Defining intentional marital pairing.\n\n2. CULTURAL TRUST: Why Guardian Support decreases matching friction\n   - Aligning with traditional honors.\n   - Designing secure access viewer screens.\n\n3. THE METRIC: Overlapping core lifestyle & religious compatibility values.\n\n4. CONCLUSION: Building families, beautifully.`);
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Draft Blog Outline</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 max-h-[350px] overflow-y-auto font-mono text-[10px] text-slate-300 leading-relaxed">
              {blogOutline ? (
                <pre className="whitespace-pre-wrap">{blogOutline}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <BookOpen className="w-8 h-8 mb-2" />
                  <span>Draft SEO blog outline cards.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== CREATE -> Ad Studio ==================== */}
        {activeSubSection === 'Ad Studio' && (
          <div className="space-y-5">
            <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Focus Feature for Ad copy</label>
                <input
                  type="text"
                  value={adTargetFeature}
                  onChange={(e) => setAdTargetFeature(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none w-64"
                />
              </div>
              <button
                onClick={() => alert(`✓ Multi-network copies compiled side-by-side for ${adTargetFeature}!`)}
                className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all cursor-pointer"
              >
                Compile Ads Panel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3">
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Meta Display (Facebook/Instagram)</span>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <p className="font-bold text-white mb-2">Primary Text:</p>
                  No more endless swiping. Involve your family, protect your values, and find your intentional marriage on {activeApp.name}. Introducing our secure {adTargetFeature}.
                  <p className="font-bold text-white mt-3 mb-1">Headline:</p>
                  Intentional Matrimony beautifully designed.
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3">
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Google Search (Sponsored Text Ad)</span>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-300 font-mono space-y-1">
                  <div><strong className="text-blue-400 text-xs">Ad • www.{activeApp.name.toLowerCase()}.com/intentional</strong></div>
                  <div><strong className="text-white text-xs">{activeApp.name} Matrimonial - Respectful {adTargetFeature}</strong></div>
                  <div className="text-slate-500 text-[10px]">Secure Compatibility Quiz. Built with parental review mode safeguards. Free Onboarding registration.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CREATE -> Brand Kit ==================== */}
        {activeSubSection === 'Brand Kit' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Workspace Aesthetic Guidelines</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Selected Theme Palette</label>
                  <select
                    value={brandPalette}
                    onChange={(e) => setBrandPalette(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Emerald Premium">Emerald Premium (Islamic Green & Teal Accent)</option>
                    <option value="Tech Indigo">Tech Indigo (Deep Modern Blue & violet)</option>
                    <option value="Minimalist Slate">Minimalist Slate (Elegant Grayscale & Silver)</option>
                    <option value="Warm Coral">Warm Coral (Energetic Rose & Orange)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Typography Pairing</label>
                  <select
                    value={brandFont}
                    onChange={(e) => setBrandFont(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  >
                    <option value="Inter & Space Grotesk">Inter (Sans-serif UI) & Space Grotesk (Headings)</option>
                    <option value="Outfit & JetBrains Mono">Outfit (Display) & JetBrains Mono (Technical/SaaS)</option>
                    <option value="Playfair Display & Inter">Playfair Display (Serif Headings) & Inter (UI)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Preview */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block mb-2">Style Sheet preview</span>
                <div className="flex gap-2">
                  {getPaletteColors(brandPalette).map((color, idx) => (
                    <div key={idx} className={`w-12 h-12 rounded-xl ${color} shadow-lg border border-slate-900`}></div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: brandFont.split(' & ')[1] || 'sans-serif' }}>
                  {activeApp.name} Matrimonial Heading
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The brand kit establishes cohesive font structures. It uses <strong>{brandTone}</strong> parameters, rendering templates consistently.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== LAUNCH -> Product Launch Wizard ==================== */}
        {activeSubSection === 'Product Launch Wizard' && (
          <div className="space-y-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Matrimonial Release Checklist</span>
            
            <div className="space-y-3">
              {launchSteps.map((step, idx) => (
                <div key={step.id} className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const updated = [...launchSteps];
                        updated[idx].completed = !updated[idx].completed;
                        setLaunchSteps(updated);
                      }}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                        step.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      {step.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span className={`text-xs font-medium ${step.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {step.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">STEP 0{idx+1}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Overall Progress</span>
              <span className="font-mono font-bold text-emerald-400">
                {Math.round((launchSteps.filter(s => s.completed).length / launchSteps.length) * 100)}% Completed
              </span>
            </div>
          </div>
        )}

        {/* ==================== LAUNCH -> Social Publishing ==================== */}
        {activeSubSection === 'Social Publishing' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Queued Content Calendar</span>
              <button onClick={() => {
                const text = prompt('Enter post content:');
                if (text) setQueuedPosts([...queuedPosts, { id: `qp_${Date.now()}`, channel: 'Twitter', text, day: 'Friday 4:00 PM' }]);
              }} className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                <span>Queue Post</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {queuedPosts.map(post => (
                <div key={post.id} className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{post.day}</span>
                    <span className="text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.2 rounded font-mono uppercase">{post.channel}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{post.text}</p>
                  <div className="flex justify-end gap-2 text-[10px] text-slate-500 font-mono">
                    <button onClick={() => setQueuedPosts(queuedPosts.filter(qp => qp.id !== post.id))} className="hover:text-rose-400 cursor-pointer">
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== LAUNCH -> Email Campaigns ==================== */}
        {activeSubSection === 'Email Campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email List dispatcher</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Recipient target Filter</label>
                  <select
                    value={emailRecipientFilter}
                    onChange={(e) => setEmailRecipientFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Registered but did not verify Wali">Registered but did not verify Wali (High priority)</option>
                    <option value="Active matchmaking premium users">Premium Active matches</option>
                    <option value="All active subscribers">All workspace listings</option>
                  </select>
                </div>

                <button
                  onClick={triggerSimulation}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Simulated campaign</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Campaign Analytics Log</span>
                <p className="text-xs text-slate-400 mt-2">
                  Total simulated dispatches in progress: <span className="text-white font-bold">{simulatedEmailsSent}</span>
                </p>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
                <div>CTR Tracker: 14.5% success</div>
                <div>Status: IDLE (Awaiting dispatch action)</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== LAUNCH -> Meta Ads & Google Ads ==================== */}
        {(activeSubSection === 'Meta Ads' || activeSubSection === 'Google Ads') && (
          <div className="space-y-6">
            <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 flex-grow">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Monthly Budget Allocator</span>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="500"
                    value={adBudget}
                    onChange={(e) => setAdBudget(Number(e.target.value))}
                    className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="text-sm font-mono font-bold text-emerald-400 shrink-0">${adBudget.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center font-mono">
                <span className="text-[8px] text-slate-500 block uppercase font-bold">Simulated ROAS (Return)</span>
                <span className="text-lg font-black text-emerald-400">3.4x Average</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Impressions', val: (adBudget * 12.5).toLocaleString() },
                { label: 'Total Clicks', val: (adBudget * 0.85).toLocaleString() },
                { label: 'Cost Per Click', val: '$0.85' },
                { label: 'Conversions', val: Math.round(adBudget * 0.045).toLocaleString() },
              ].map((m, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">{m.label}</span>
                  <span className="text-lg font-bold font-mono text-white block mt-1">{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== LAUNCH -> WhatsApp Campaigns ==================== */}
        {activeSubSection === 'WhatsApp Campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Conversational Outreach tree</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-300">
                  <span className="font-bold text-white block mb-1">Bot trigger event:</span>
                  "If candidate remains unverified for 48h to push friendly WhatsApp nudge with Wali guardian overview flyer."
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 font-mono text-[10px] text-slate-400 space-y-4">
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-850 leading-relaxed text-slate-300 max-w-[85%]">
                As-salamu alaykum! We noticed you haven't completed your Wali guardian review link. Involving family helps secure compatibility. Send "1" for guardian guides or "2" for support.
              </div>
            </div>
          </div>
        )}

        {/* ==================== LAUNCH -> App Deployment ==================== */}
        {activeSubSection === 'App Deployment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Production Build panel</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center text-[11.5px] text-slate-400">
                  <span>Routing status:</span>
                  <span className="text-emerald-400 font-bold">100% healthy</span>
                </div>

                <button
                  onClick={handleDeployAction}
                  disabled={deployStatus === 'building'}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${deployStatus === 'building' ? 'animate-spin' : ''}`} />
                  <span>{deployStatus === 'building' ? 'Compiling production cluster...' : 'Trigger Production build'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-[9px] text-emerald-400 overflow-y-auto max-h-[300px]">
              <div className="flex justify-between text-slate-500 mb-2 border-b border-slate-900 pb-1.5">
                <span>BUILD TERMINAL STREAM LOGS</span>
                <span>STATUS: {deployStatus.toUpperCase()}</span>
              </div>
              {deployLogs.length > 0 ? (
                deployLogs.map((log, i) => <div key={i} className="mb-1">{log}</div>)
              ) : (
                <div className="text-slate-600 py-12 text-center">Logs idle. Awaiting build actions.</div>
              )}
            </div>
          </div>
        )}

        {/* ==================== ANALYZE -> Growth Intelligence ==================== */}
        {activeSubSection === 'Growth Intelligence' && (
          <div className="space-y-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">LTV & CAC diagnostic Matrix</span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl text-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Payback Period</span>
                <span className="text-lg font-bold text-emerald-400 font-mono block mt-1">2.4 Months</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl text-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">LTV Metric</span>
                <span className="text-lg font-bold text-white font-mono block mt-1">${(activeApp.metrics.arpu * 12).toFixed(0)}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl text-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Ad Efficiency</span>
                <span className="text-lg font-bold text-teal-400 font-mono block mt-1">Stellar CAC ROI</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ANALYZE -> Marketing Analytics ==================== */}
        {activeSubSection === 'Marketing Analytics' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">ROI Performance scorecard</span>

            <div className="space-y-2">
              {[
                { source: 'Organic SEO', share: '45%', roi: 'Infinite' },
                { source: 'Meta Ads Retargeting', share: '30%', roi: '3.4x' },
                { source: 'Successful Referrals (Walimah Exit)', share: '25%', roi: 'Organic Flywheel' }
              ].map((ch, i) => (
                <div key={i} className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold">{ch.source}</span>
                  <div className="flex gap-6 font-mono text-[10.5px]">
                    <div>Share: {ch.share}</div>
                    <div className="text-emerald-400 font-bold">ROI: {ch.roi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== ANALYZE -> Competitor Analysis ==================== */}
        {activeSubSection === 'Competitor Analysis' && (
          <div className="space-y-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">AI Market Position Quadrant</span>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 text-xs leading-relaxed text-slate-300">
              <span className="font-mono font-bold text-emerald-400 text-[10px] uppercase block mb-2">Diagnostic positioning</span>
              Your competitor profile shows that conventional swipe engines compete strictly on swiping velocity. By building deep <strong>Wali Verification loops</strong> and custom parent viewer portals, {activeApp.name} establishes a completely distinct high-integrity segment.
            </div>
          </div>
        )}

        {/* ==================== ANALYZE -> SEO Analysis ==================== */}
        {activeSubSection === 'SEO Analysis' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Search Engine Performance audit</span>

            <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-3 font-mono text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span>Domain Authority score:</span>
                <span className="text-emerald-400 font-bold">54/100</span>
              </div>
              <div className="flex justify-between">
                <span>Keywords Indexed:</span>
                <span className="text-white">14,200 ranking</span>
              </div>
              <div className="border-t border-slate-900 pt-2 text-[9px] text-slate-500 leading-normal">
                ON-PAGE SUGGESTION: Embed schema cards explicitly targetting "intentional Muslim matrimonial options".
              </div>
            </div>
          </div>
        )}

        {/* ==================== ANALYZE -> Revenue & Funnel ==================== */}
        {activeSubSection === 'Revenue & Funnel' && (
          <div className="space-y-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Interactive Checkout stage Dropoff</span>

            <div className="space-y-3.5">
              {[
                { stage: '1. Landing Page Visit', rate: '100%', count: '210k users' },
                { stage: '2. Profile Creation completed', rate: '68%', count: '142k users' },
                { stage: '3. Wali Verification handshake', rate: '24%', count: '34k users (Conversion choke point)' },
                { stage: '4. Paywall Premium checkout', rate: '8.2%', count: '11.6k subscribers' }
              ].map((stage, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{stage.stage}</span>
                    <span className="font-mono">{stage.rate} ({stage.count})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: stage.rate }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== ANALYZE -> Customer Journey ==================== */}
        {activeSubSection === 'Customer Journey' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Chronological Customer telemetry</span>

            <div className="space-y-2">
              {[
                { stamp: '10:02 AM', event: 'User Ahmed S. registered candidate matchmaking account.', type: 'SYSTEM' },
                { stamp: '10:04 AM', event: 'Ahmed S. listed parent guardian Wali email.', type: 'WALI LINKED' },
                { stamp: '10:05 AM', event: 'Secure verification link dispatched to Wali inbox.', type: 'AUTOMATION' },
              ].map((jr, i) => (
                <div key={i} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center text-[10.5px] font-mono text-slate-300">
                  <div className="flex gap-4">
                    <span className="text-slate-500">{jr.stamp}</span>
                    <span>{jr.event}</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded">{jr.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== ANALYZE -> AI Recommendations & Forecasts ==================== */}
        {activeSubSection === 'AI Recommendations & Forecasts' && (
          <div className="space-y-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">12-Month Predictive Analytics</span>

            <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4 leading-relaxed text-xs text-slate-300">
              <span className="font-mono font-bold text-emerald-400 text-[10px] uppercase block mb-1">Forecast summary</span>
              Under present growth velocity, {activeApp.name} is on track to cross <strong>$150,000 MRR</strong> by Q4 2026. Activating the Walimah exit referral loop secures an estimated 1.8x boost in organic lead generations, saving $14k in ad budgets.
            </div>
          </div>
        )}

        {/* ==================== AUTOMATE -> CRM Automation / Workflow Automation ==================== */}
        {(activeSubSection === 'CRM Automation' || activeSubSection === 'Workflow Automation' || activeSubSection === 'Scheduled Tasks') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
              <span className="text-xs font-bold text-white block">Active trigger metrics:</span>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[10.5px] font-mono text-slate-400 space-y-2">
                <div>Cron active: Daily clean cohort indexes (00:00 UTC)</div>
                <div>Webhooks Target: Fully synchronized</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 font-mono text-[10px] text-slate-400 space-y-2">
              <div className="text-slate-500 border-b border-slate-900 pb-1.5 font-bold">AUTOMATION HISTORY LOG</div>
              <div>[00:00 UTC] Cron Clean task completed. 1,420 profiles verified.</div>
              <div>[02:14 UTC] Webhook active. Dispatched checkout voucher.</div>
            </div>
          </div>
        )}

        {/* ==================== AUTOMATE -> Lead Generation ==================== */}
        {activeSubSection === 'Lead Generation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">AI Sourcing Prospector</span>

              <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
                <p className="text-xs text-slate-300 leading-normal">
                  Scrapes niche directories matching the workspace profile (e.g. Muslim cultural clubs, community centers) to feed automated partner outreach.
                </p>
                <button
                  onClick={() => alert('🔍 AI scraping and matching partner directories... Found 14 matching accounts.')}
                  className="w-full py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all cursor-pointer"
                >
                  Source Partners
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-[10px] text-slate-400 space-y-2">
              <div className="text-slate-500 border-b border-slate-900 pb-1 font-bold">SOURCED DIRECTORY SAMPLES</div>
              <div>• London Islamic Center (Email: info@londonislamic.org)</div>
              <div>• Muslim Youth Association (Email: outreach@mya-matrimonials.net)</div>
            </div>
          </div>
        )}

        {/* ==================== AUTOMATE -> Email Sequences ==================== */}
        {activeSubSection === 'Email Sequences' && (
          <div className="space-y-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Multi-Day Drip sequence Outline</span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { day: 'Day 1: Onboarding welcome', trigger: 'Immediately after registration' },
                { day: 'Day 3: Guardian explainer', trigger: 'If Wali email is still blank' },
                { day: 'Day 7: Value compatibility promo', trigger: 'If profile completed but not upgraded' }
              ].map((seq, i) => (
                <div key={i} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-white font-mono">{seq.day}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Trigger: {seq.trigger}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== KNOWLEDGE -> Founder Memory ==================== */}
        {activeSubSection === 'Founder Memory' && (
          <div className="space-y-5">
            <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
              <span className="text-xs font-bold text-white block">Workspace Core Memory facts</span>
              <p className="text-xs text-slate-400 leading-normal">
                These core business facts are automatically appended to the context when Growth OS compiles AI suggestions and content campaigns. Keeping these facts updated ensures personalized, highly contextual recommendations.
              </p>

              <div className="space-y-2">
                {founderMemoryFacts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-900 rounded-xl border border-slate-850 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{fact}</p>
                    <button onClick={() => setFounderMemoryFacts(founderMemoryFacts.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-rose-400 shrink-0 ml-auto cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new business fact or operational constraint..."
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
                className="flex-grow bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500/30"
              />
              <button onClick={handleAddMemory} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer">
                Commit Fact
              </button>
            </div>
          </div>
        )}

        {/* ==================== KNOWLEDGE -> Business Documents ==================== */}
        {activeSubSection === 'Business Documents' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Playbook & Brand document Locker</span>
            
            <div className="p-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-500" />
              <div className="text-xs text-slate-400">
                <span className="text-emerald-400 font-bold hover:underline cursor-pointer">Upload guidelines, marketing files or PDFs</span> to let AI read them as reference.
              </div>
              <span className="text-[9.5px] font-mono text-slate-600">Max size 25MB • PDF, MD, TXT, DOCX</span>
            </div>
          </div>
        )}

        {/* ==================== KNOWLEDGE -> Playbooks & SOPs ==================== */}
        {activeSubSection === 'Playbooks & SOPs' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Growth Playbooks Library</span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SOP_PLAYBOOKS.map((sop, i) => (
                <div key={i} className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-3">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">{sop.cat}</span>
                    <h4 className="text-sm font-bold text-white mt-1 leading-tight">{sop.title}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-500">
                    <span>{sop.difficulty} diff</span>
                    <span>{sop.readTime} reading</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== KNOWLEDGE -> Research Notes ==================== */}
        {activeSubSection === 'Research Notes' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Founders Scratchpad Notes</span>

            <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl space-y-4">
              <textarea
                placeholder="Jot down quick operational ideas or scratchpad details here..."
                rows={5}
                className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none"
              />
              <button onClick={() => alert('Notes committed to memory workspace!')} className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 cursor-pointer">
                Save Notes
              </button>
            </div>
          </div>
        )}

        {/* ==================== KNOWLEDGE -> Saved Conversations ==================== */}
        {activeSubSection === 'Saved Conversations' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Historical Diagnostics Logs</span>

            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl text-[11px] leading-relaxed text-slate-300">
              <span className="font-mono font-bold text-emerald-400 text-[10px] block mb-1">Session archive reference</span>
              No archived chat sessions synced yet. Complete live conversations in the <strong>AUTOMATE &gt; AI Employees/Agents</strong> channel and flag them as saved to see records.
            </div>
          </div>
        )}

        {/* ==================== WORKSPACES -> Add Organization ==================== */}
        {activeSubSection === 'Add Organization' && (
          <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-3xl space-y-5 max-w-xl mx-auto">
            <h4 className="text-sm font-black text-white">Create New Workspace Node</h4>
            <p className="text-xs text-slate-400 leading-normal">
              Register an entirely independent workspace organization. Each workspace has its own localized memory parameters, subscriber accounts, and diagnostic insights.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Company / Idea Name</label>
                <input type="text" placeholder="e.g. Halal Food Delivery" className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none" />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Target Audience</label>
                <input type="text" placeholder="e.g. Health-conscious families in London" className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none" />
              </div>

              <button onClick={() => alert('✓ Success! New Workspace created in your App switcher.')} className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 cursor-pointer shadow-lg">
                Activate organization workspace
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Micro-Lesson Drawer Overlay */}
      <AnimatePresence>
        {activeLessonKey && MICRO_LESSONS[activeLessonKey] && (() => {
          const lesson = MICRO_LESSONS[activeLessonKey];
          const isCompleted = completedLessons.includes(activeLessonKey);
          return (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveLessonKey(null)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end"
              >
                {/* Content Panel */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-lg h-screen bg-slate-900 border-l border-slate-800 p-6 md:p-8 flex flex-col justify-between overflow-y-auto"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          FOUNDER MICRO-LESSON
                        </span>
                        <h3 className="text-base font-black text-white mt-1 leading-tight">{lesson.title}</h3>
                      </div>
                      <button
                        onClick={() => setActiveLessonKey(null)}
                        className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Concept */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest block">Core Skill Set</span>
                      <span className="text-xs text-white font-bold block">{lesson.concept}</span>
                    </div>

                    {/* Before & After Comparison */}
                    <div className="space-y-4">
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest block">Interactive Case Study</span>
                      
                      {/* Before Box */}
                      <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 space-y-1 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-[8px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded">
                          BEFORE
                        </div>
                        <span className="text-[10px] font-mono text-rose-400/80 font-bold block uppercase tracking-wider">Conventional Setup</span>
                        <p className="text-xs text-slate-300 pr-12 leading-relaxed">{lesson.before}</p>
                      </div>

                      {/* Animated Arrow Icon */}
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-bounce">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* After Box */}
                      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-1 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          AFTER
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">Growth OS Optimization</span>
                        <p className="text-xs text-slate-300 pr-12 leading-relaxed font-medium">{lesson.after}</p>
                      </div>
                    </div>

                    {/* Why It Works Detail */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest block">Why This Strategy Rules</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{lesson.lesson}</p>
                    </div>

                    {/* Projected Growth Animation Graph block */}
                    <div className="bg-slate-950 border border-slate-850 p-4.5 rounded-xl flex items-center justify-between overflow-hidden">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wider">Projected Growth Impact</span>
                        <span className="text-sm font-black text-emerald-400 font-mono block">{lesson.animationText}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-6 w-1.5 bg-emerald-500/20 rounded-full"></span>
                        <span className="h-9 w-1.5 bg-emerald-500/40 rounded-full"></span>
                        <span className="h-12 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-6 border-t border-slate-800 flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (!isCompleted) {
                          setCompletedLessons(prev => [...prev, activeLessonKey]);
                        }
                        setActiveLessonKey(null);
                      }}
                      className="flex-grow py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                    >
                      {isCompleted ? '✓ Done Reviewing' : '✓ Mark Lesson as Mastered'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
