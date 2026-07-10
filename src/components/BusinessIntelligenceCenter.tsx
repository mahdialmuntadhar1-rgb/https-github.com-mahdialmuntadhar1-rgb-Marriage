/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConnectedApp } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  CheckCircle2, 
  HelpCircle, 
  Compass, 
  ShieldAlert, 
  Sliders, 
  MapPin, 
  Layers,
  ChevronRight,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BusinessIntelligenceCenterProps {
  activeApp: ConnectedApp;
}

// Schema structure corresponding to our backend response
interface ChartPoint {
  label: string;
  value: number;
  previousValue: number;
}

interface SimpleDataPoint {
  label: string;
  value: number;
}

interface BIInsight {
  title: string;
  metric: string;
  change: string;
  isPositive: boolean;
  explanation: string;
  chartData: SimpleDataPoint[];
}

interface BIGrowthOpportunity {
  title: string;
  potentialImpact: string;
  targetSegment: string;
  suggestedChannel: string;
  explanation: string;
  chartData: SimpleDataPoint[];
}

interface BIRiskAlert {
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  stat: string;
  explanation: string;
  preventativeAction: string;
  chartData: SimpleDataPoint[];
}

interface BIPacket {
  performanceOverview: {
    headline: string;
    desc: string;
    healthScore: number;
    chartPoints: ChartPoint[];
  };
  insights: BIInsight[];
  opportunities: BIGrowthOpportunity[];
  riskAlerts: BIRiskAlert[];
}

// Preset High-Fidelity Data packets for the ConnectedApps
const PRESET_BI_DATA: Record<string, BIPacket> = {
  zawaj: {
    performanceOverview: {
      headline: "Strong Matchmaking LTV with Segment Churn Pressure",
      desc: "Zawaj is showing an upward MRR trajectory driven by successful matching seasons. However, the high intentional 'success-churn' (users deleting profiles because they married) creates unique customer acquisition pressures that require highly targeted regional and identity-verified retention campaigns.",
      healthScore: 78,
      chartPoints: [
        { label: "Jan", value: 38000, previousValue: 35000 },
        { label: "Feb", value: 41000, previousValue: 37200 },
        { label: "Mar", value: 43200, previousValue: 39500 },
        { label: "Apr", value: 44800, previousValue: 42100 },
        { label: "May", value: 46200, previousValue: 45000 },
        { label: "Jun", value: 48500, previousValue: 47100 }
      ]
    },
    insights: [
      {
        title: "Female Identity Verification Retention Multiplier",
        metric: "Cohort Retention Rate",
        change: "+14%",
        isPositive: true,
        explanation: "Your female user retention increased 14% after introducing strict Wali (guardian) and identity profile verification. The high-trust mechanism drastically reduced superficial interactions and encouraged serious, long-term matrimonial searchers.",
        chartData: [
          { label: "Unverified", value: 42 },
          { label: "Verified Only", value: 56 },
          { label: "Wali Linked", value: 78 }
        ]
      },
      {
        title: "Wali/Guardian Co-Engagement Peak",
        metric: "Weekly Chat Velocity",
        change: "+32%",
        isPositive: true,
        explanation: "Matched profiles that connected an active family moderator or Wali showed a 3.2x increase in message response speed, leading to high-efficiency compatibility outcomes within 3 weeks of matching.",
        chartData: [
          { label: "Solo Chat", value: 15 },
          { label: "Guardian Present", value: 48 },
          { label: "Verified Match", value: 58 }
        ]
      },
      {
        title: "Indirect Profile Photo Blurred Dropout",
        metric: "Match Request Success Rate",
        change: "-22%",
        isPositive: false,
        explanation: "Accounts relying on complete image blurring without reciprocal placeholder reveals had a 22% lower matching probability, creating an engagement bottleneck in younger segments.",
        chartData: [
          { label: "Fully Visible", value: 65 },
          { label: "Mutual Reveal", value: 48 },
          { label: "Permanently Blurred", value: 14 }
        ]
      }
    ],
    opportunities: [
      {
        title: "Baghdad Demographic Expansion Campaign",
        potentialImpact: "High (+24% MRR Boost)",
        targetSegment: "Baghdad & Central Iraq Metro Areas",
        suggestedChannel: "Localized WhatsApp & Traditional Family Outreaches",
        explanation: "Users registering from Baghdad display a 42% higher engagement rate and superior conversion. Setting up localized campaigns focusing on 'high-safeguard family compatibility' in central Iraq will tap into an underserved matrimonial demographic.",
        chartData: [
          { label: "Baghdad", value: 92 },
          { label: "Basra", value: 64 },
          { label: "Erbil", value: 45 },
          { label: "Mosul", value: 38 }
        ]
      },
      {
        title: "Premium Wali Advisory Consultation Packages",
        potentialImpact: "Medium (+12% ARPU Lift)",
        targetSegment: "Ages 28-35 Matrimonial Candidates",
        suggestedChannel: "In-App Feature Unlock Promos",
        explanation: "Our research shows family guardians are eager to purchase direct, curated consultation phone packages. Premium access can be packaged as an upsell, yielding direct non-subscription revenue.",
        chartData: [
          { label: "No Upsell", value: 12 },
          { label: "Basic Advice", value: 24 },
          { label: "Guardian Pro", value: 45 }
        ]
      },
      {
        title: "Diaspora Matrimonial Matching Bridges",
        potentialImpact: "High (+18% Revenue)",
        targetSegment: "Diaspora in Europe & North America",
        suggestedChannel: "Targeted Meta & Search Ads",
        explanation: "Diaspora users exhibit a 3.1x higher ARPU, matching back to families in Iraq. Emphasizing high-trust identity safeguards across borders will rapidly drive premium matchmaking subscription signups.",
        chartData: [
          { label: "Domestic", value: 12 },
          { label: "Europe", value: 35 },
          { label: "North America", value: 42 }
        ]
      }
    ],
    riskAlerts: [
      {
        title: "Matrimonial Compatibility Signup Dropout",
        severity: "High",
        stat: "-18% Completion",
        explanation: "Signup flow completion decreased this week. Analysis shows the recent introduction of the 25-step deep values compatibility questionnaire has created a massive registration friction point.",
        preventativeAction: "Enable 'save progress' drafts or separate the detailed matching questions into post-registration onboarding play cards.",
        chartData: [
          { label: "Week 1", value: 85 },
          { label: "Week 2", value: 82 },
          { label: "Week 3", value: 71 },
          { label: "This Week", value: 67 }
        ]
      },
      {
        title: "Post-Engagement Churn Cascade",
        severity: "Medium",
        stat: "+8.4% Churn",
        explanation: "Your subscription retention is suffering from rapid matchmaking successes. Successful couples are muting accounts and canceling recurring billing plans.",
        preventativeAction: "Offer a 'Couple Anniversary Premium Archive' or transitional family advisory services to maintain user connection post-marriage.",
        chartData: [
          { label: "Cohort 1M", value: 92 },
          { label: "Cohort 3M", value: 74 },
          { label: "Cohort 6M", value: 45 }
        ]
      }
    ]
  },
  eduquest: {
    performanceOverview: {
      headline: "Excellent Gamified Retention offset by Premium Parent Upgrade Latency",
      desc: "EduQuest has reached outstanding stickiness with kids enjoying the adaptation loops. The core challenge is that parents register their children, but delay upgrading to the Premium Parent Portal due to lacking direct evidence of STEM progress snapshots.",
      healthScore: 84,
      chartPoints: [
        { label: "Jan", value: 95000, previousValue: 92000 },
        { label: "Feb", value: 102000, previousValue: 97000 },
        { label: "Mar", value: 109000, previousValue: 104000 },
        { label: "Apr", value: 114000, previousValue: 110000 },
        { label: "May", value: 119000, previousValue: 115000 },
        { label: "Jun", value: 124000, previousValue: 121000 }
      ]
    },
    insights: [
      {
        title: "STEM Adaptation Milestone Conversion Boost",
        metric: "Parent Upgrade Conversion",
        change: "+28%",
        isPositive: true,
        explanation: "Upgrade rates rise by 28% when parents receive a real-time cognitive adaptation card showing their child mastered a difficult multiplication tree. Celebrating child achievements builds immediate parent buy-in.",
        chartData: [
          { label: "Standard Alert", value: 14 },
          { label: "Progress Card", value: 32 },
          { label: "AI Snapshot", value: 48 }
        ]
      },
      {
        title: "Daily Gamified Streaks Stickiness Peak",
        metric: "7-Day Cohort Retention",
        change: "+19%",
        isPositive: true,
        explanation: "Children who maintain a 3-day quest streak on STEM topics show a 19% improvement in continuing their homework trail, avoiding the standard 1-week educational burnout curve.",
        chartData: [
          { label: "No Streaks", value: 35 },
          { label: "3-Day Streak", value: 54 },
          { label: "7-Day Streak", value: 72 }
        ]
      },
      {
        title: "Friction Point on Parent Dashboard Linking",
        metric: "Dashboard Connection Rate",
        change: "-15%",
        isPositive: false,
        explanation: "Linking parents via email invitations created a 15% drop-off. Parents often missed email prompts or failed to sign up quickly on separate mobile views.",
        chartData: [
          { label: "One-Click QR", value: 82 },
          { label: "Standard Code", value: 55 },
          { label: "Email Invite", value: 40 }
        ]
      }
    ],
    opportunities: [
      {
        title: "Parent Progress Telemetry SMS Campaign",
        potentialImpact: "High (+20% Upgrades)",
        targetSegment: "Dormant Parents of Active STEM Children",
        suggestedChannel: "SMS / WhatsApp Telemetry Progress Digests",
        explanation: "Parents who ignore email reports respond exceptionally well to short, SMS summaries of their children's active learning hours. Highlighting child persistence drives active platform subscription support.",
        chartData: [
          { label: "Email Reports", value: 18 },
          { label: "SMS Alerts", value: 45 },
          { label: "WhatsApp Chat", value: 58 }
        ]
      },
      {
        title: "Primary School STEM Partnership Integration",
        potentialImpact: "Medium (+14% MAU Boost)",
        targetSegment: "School Teachers & Primary Students",
        suggestedChannel: "Classroom QR Boards & Progress Badges",
        explanation: "Deploying simple class badges in Baghdad or regional hubs can trigger organic network loops, as children compete in mathematics trails under teacher moderation.",
        chartData: [
          { label: "Organic Ads", value: 20 },
          { label: "School Promos", value: 62 },
          { label: "Teacher Codes", value: 84 }
        ]
      },
      {
        title: "Adaptive Science Quest Module Expansion",
        potentialImpact: "High (+15% MRR Lift)",
        targetSegment: "Ages 9-12 Primary School Pupils",
        suggestedChannel: "In-App Gamified Quest Maps",
        explanation: "Expanding gamification adaptiveness from mathematics to physics/space quests is the #1 request from parents. Unlocking this module under a premium package directly addresses upgrade latency.",
        chartData: [
          { label: "Math Only", value: 20 },
          { label: "Math + Science", value: 35 },
          { label: "Full STEM Map", value: 55 }
        ]
      }
    ],
    riskAlerts: [
      {
        title: "Parent Account Linking Drop-off",
        severity: "High",
        stat: "-24% Active Connections",
        explanation: "Our signup telemetry shows parent verification connections decreased by 24% this month. The new parental consent flow is confusing and lacks an immediate SMS quick-verification key.",
        preventativeAction: "Implement quick QR scanning pairing directly between parent mobile phones and children's desktop screens.",
        chartData: [
          { label: "Week 1", value: 76 },
          { label: "Week 2", value: 68 },
          { label: "Week 3", value: 58 },
          { label: "This Week", value: 52 }
        ]
      },
      {
        title: "Post-Exam Seasonal Inactivity Trend",
        severity: "Medium",
        stat: "-12.5% MAU",
        explanation: "As school term exams conclude, student inactivity peaks. Gamified engagement trails show active children are shifting to generic mobile apps during summer break.",
        preventativeAction: "Launch 'Summer STEM Quest Leagues' with tangible gamified prize models to keep platforms top-of-mind during holiday breaks.",
        chartData: [
          { label: "Term High", value: 95 },
          { label: "Post-Exam", value: 68 },
          { label: "Summer Break", value: 42 }
        ]
      }
    ]
  },
  localcart: {
    performanceOverview: {
      headline: "Artisanal Baker Engagement High with Local Supply Pipeline Constraints",
      desc: "LocalCart is riding a wave of neighborhood organic bakery adoption. While buyer order sizes have spiked in regional urban areas, our seller retention is hitting a ceiling because baking micro-chefs struggle with health inspection license uploads and logistical delivery paths.",
      healthScore: 75,
      chartPoints: [
        { label: "Jan", value: 55000, previousValue: 51000 },
        { label: "Feb", value: 60000, previousValue: 56000 },
        { label: "Mar", value: 64200, previousValue: 60000 },
        { label: "Apr", value: 67100, previousValue: 62400 },
        { label: "May", value: 69800, previousValue: 65100 },
        { label: "Jun", value: 72000, previousValue: 68000 }
      ]
    },
    insights: [
      {
        title: "Artisan Profile Verification Trust Spike",
        metric: "Local Basket Conversion",
        change: "+31%",
        isPositive: true,
        explanation: "Baker storefront conversions increase by 31% when local health inspector badges and kitchen origin photos are verified and visible. High-fidelity sanitation proof makes customers comfortable purchasing homemade sourdough.",
        chartData: [
          { label: "No Verification", value: 18 },
          { label: "Inspector Verified", value: 38 },
          { label: "Kitchen Reveal", value: 49 }
        ]
      },
      {
        title: "WhatsApp Order Confirmation Speed Lift",
        metric: "Artisan Order Fulfillment Rate",
        change: "+24%",
        isPositive: true,
        explanation: "Integrating automatic WhatsApp confirmation alerts for baking sellers cut dispatch latency in half, reducing abandoned pastry orders and bad-review rates.",
        chartData: [
          { label: "App-Only Alerts", value: 45 },
          { label: "SMS Alerts", value: 68 },
          { label: "WhatsApp Direct", value: 89 }
        ]
      },
      {
        title: "Health Inspection License Upload Bottleneck",
        metric: "Artisan Storefront Onboarding",
        change: "-18%",
        isPositive: false,
        explanation: "Introducing detailed health inspection PDF uploads in the initial step caused 18% of prospective bakers to abandon the onboarding funnel on mobile screens.",
        chartData: [
          { label: "Simple Profile", value: 88 },
          { label: "Standard Form", value: 65 },
          { label: "Health PDF Step", value: 38 }
        ]
      }
    ],
    opportunities: [
      {
        title: "Baghdad Baker Group-Buying Promo Circles",
        potentialImpact: "High (+26% Order Frequency)",
        targetSegment: "Neighborhood Food Enthusiast Circles",
        suggestedChannel: "WhatsApp / Viber Group Sharing Coupon Rails",
        explanation: "Users from Baghdad central neighborhoods display high communal affinity. Enabling group-buying baked boxes with communal delivery hubs will rapidly lower CAC while boosting order density.",
        chartData: [
          { label: "Karrada District", value: 95 },
          { label: "Mansour Area", value: 84 },
          { label: "Adhamiyah", value: 62 },
          { label: "Zayouna", value: 48 }
        ]
      },
      {
        title: "Seasonal Baker Delivery Logistics Integration",
        potentialImpact: "Medium (+15% Retention)",
        targetSegment: "Home Artisanal Sourdough Bakers",
        suggestedChannel: "In-App Route Planning Tools",
        explanation: "Home chefs are excellent creators but poor delivery coordinators. Providing a simplified, hyper-local third party courier route integration is a massive value-add to prevent merchant churn.",
        chartData: [
          { label: "Self Delivery", value: 35 },
          { label: "Courier Assist", value: 68 },
          { label: "Fully Managed", value: 91 }
        ]
      },
      {
        title: "Artisanal Baker Micro-Loans Partnership",
        potentialImpact: "High (+12% ARPU Boost)",
        targetSegment: "Highly Rated Sourdough Sellers",
        suggestedChannel: "Partner Financial Portal",
        explanation: "Top baking sellers frequently state they need commercial oven upgrades. Brokering localized kitchen equipment micro-loans through partner credit channels opens up robust fintech platform revenues.",
        chartData: [
          { label: "No Capital", value: 100 },
          { label: "Loan Offered", value: 240 },
          { label: "Upgraded Kitchen", value: 410 }
        ]
      }
    ],
    riskAlerts: [
      {
        title: "Artisan Onboarding Dropout Spike",
        severity: "High",
        stat: "-20% Completion Rate",
        explanation: "Signup completion among local home bakers decreased this week. Analysis proves that requiring strict local government business permit IDs at registration is stalling the merchant pipeline.",
        preventativeAction: "Permit bakers to register and list up to 5 artisanal items under a 'Provisional Vendor' banner, while granting a 14-day compliance grace period.",
        chartData: [
          { label: "Week 1", value: 82 },
          { label: "Week 2", value: 76 },
          { label: "Week 3", value: 68 },
          { label: "This Week", value: 55 }
        ]
      },
      {
        title: "Logistical Delivery Delay Backlash",
        severity: "Medium",
        stat: "+11.4% Refund Requests",
        explanation: "Pastry items are arriving stale due to local courier traffic delays. Customer support reports show a spike in disputes concerning weekend breakfast items.",
        preventativeAction: "Establish a 'Sourdough Pre-Order Dispatch Window' lock that guarantees early-morning baking shifts are coordinated by 6:00 AM.",
        chartData: [
          { label: "On-Time Dispatch", value: 92 },
          { label: "Moderate Delay", value: 15 },
          { label: "Stale Refunds", value: 12 }
        ]
      }
    ]
  },
  taskpulse: {
    performanceOverview: {
      headline: "Outstanding Engineering Workspace Activity with Multi-Tenant Integration Hurdles",
      desc: "TaskPulse has captured incredible team velocity counts. Developer boards are exceptionally active. The overarching monetization bottleneck is that product managers create workspace boards but fail to connect Slack, causing overall retention of team accounts to decline after 30 days.",
      healthScore: 81,
      chartPoints: [
        { label: "Jan", value: 32000, previousValue: 30000 },
        { label: "Feb", value: 37000, previousValue: 34200 },
        { label: "Mar", value: 41200, previousValue: 38000 },
        { label: "Apr", value: 45000, previousValue: 42100 },
        { label: "May", value: 48900, previousValue: 46200 },
        { label: "Jun", value: 52000, previousValue: 49000 }
      ]
    },
    insights: [
      {
        title: "Slack Workspace Pairing Retention Surge",
        metric: "30-Day Cohort Retention",
        change: "+34%",
        isPositive: true,
        explanation: "Matched teams that connected active Slack channels showed a 34% increase in user retention. Instant Slack team updates on active developer boards pull collaborators back into work streams automatically.",
        chartData: [
          { label: "Standalone", value: 45 },
          { label: "Slack Sync", value: 68 },
          { label: "Webhook Master", value: 79 }
        ]
      },
      {
        title: "Bento Board Customization Spark",
        metric: "Daily Activity Count",
        change: "+22%",
        isPositive: true,
        explanation: "Developer workspaces utilizing the personalized bento layout boards instead of traditional tables had a 22% higher daily card transition rate, showcasing strong design-centric engagement.",
        chartData: [
          { label: "List View", value: 22 },
          { label: "Board View", value: 35 },
          { label: "Bento Grid Layout", value: 58 }
        ]
      },
      {
        title: "Initial Team Invite Friction Point",
        metric: "Team Member Invite Rate",
        change: "-12%",
        isPositive: false,
        explanation: "Workspaces demanding corporate SSO setup before first board sharing experienced a 12% drop-off in active daily active team counts, slowing team network viral loop effects.",
        chartData: [
          { label: "One-Click Link", value: 91 },
          { label: "Invite Code", value: 76 },
          { label: "Required SSO", value: 42 }
        ]
      }
    ],
    opportunities: [
      {
        title: "Automatic Slack Integration Onboarding",
        potentialImpact: "High (+28% User Activity)",
        targetSegment: "Newly Registered Engineering PMs",
        suggestedChannel: "Slack Bot Welcome Message",
        explanation: "Failing to link team chats is our biggest retention leak. Implementing a one-click 'Connect Slack' flow directly during workspace creation will solve onboarding dropping.",
        chartData: [
          { label: "No Chat Pairing", value: 24 },
          { label: "Slack Enabled", value: 68 },
          { label: "Full Bot Sync", value: 89 }
        ]
      },
      {
        title: "Baghdad Tech Hub Enterprise Outreach",
        potentialImpact: "Medium (+15% MRR Boost)",
        targetSegment: "Tech Startups & Agency Founders in Baghdad",
        suggestedChannel: "LinkedIn / Meta Segmented Campaigns",
        explanation: "Tech startup founders in Baghdad show high task creation density and low relative churn. Creating agency pricing packages customized for Iraqi tech operations will quickly drive enterprise client conversions.",
        chartData: [
          { label: "Tech Agencies", value: 74 },
          { label: "B2C Startups", value: 52 },
          { label: "E-Commerce", value: 38 },
          { label: "Local Services", value: 24 }
        ]
      },
      {
        title: "Dynamic Gantt Roadmap Milestone Add-on",
        potentialImpact: "High (+18% ARPU Lift)",
        targetSegment: "Teams with > 5 active boards",
        suggestedChannel: "In-App Upgrade Overlay Panel",
        explanation: "Teams with active developer boards frequently inquire about custom portfolio roadmapping views. Gating this premium view will trigger immediate, high-value monetization upgrades.",
        chartData: [
          { label: "Standard Board", value: 15 },
          { label: "Milestones", value: 28 },
          { label: "Gantt Timeline", value: 45 }
        ]
      }
    ],
    riskAlerts: [
      {
        title: "SSO Security Verification Funnel Leak",
        severity: "High",
        stat: "-14% Signups",
        explanation: "The signup completion rate decreased this week. Investigation shows our complex corporate SSO and workspace domain validation requirements are blocking smaller agile teams.",
        preventativeAction: "Permit single-developer signups via quick Google login options first, keeping enterprise SSO as an optional setting in workspace panels.",
        chartData: [
          { label: "Week 1", value: 94 },
          { label: "Week 2", value: 88 },
          { label: "Week 3", value: 82 },
          { label: "This Week", value: 68 }
        ]
      },
      {
        title: "Corporate Budget Churn Spillover",
        severity: "Medium",
        stat: "+7.2% Team Churn",
        explanation: "Inactivity metrics show team workspaces are dropping off as quarterly billing cycles close, as agency accounts fail to renew bulk licenses.",
        preventativeAction: "Offer automated 'Idle Seat Credits' that pause billing parameters on team accounts that show no board interactions during a 20-day timeframe.",
        chartData: [
          { label: "Month 1", value: 96 },
          { label: "Month 2", value: 88 },
          { label: "Month 3", value: 72 }
        ]
      }
    ]
  }
};

export default function BusinessIntelligenceCenter({ activeApp }: BusinessIntelligenceCenterProps) {
  // Try to load initial data packet for the current activeApp, fallback to zawaj if needed
  const [biData, setBiData] = useState<BIPacket>(PRESET_BI_DATA[activeApp.id] || PRESET_BI_DATA.zawaj);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'opportunities' | 'risks'>('overview');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  // Sync preset data if app changes and user has not run customized AI updates
  useEffect(() => {
    if (PRESET_BI_DATA[activeApp.id]) {
      setBiData(PRESET_BI_DATA[activeApp.id]);
      setActiveItemIndex(0);
      setErrorMessage(null);
    }
  }, [activeApp]);

  // Request Live AI Re-generation via Gemini SDK server-side endpoint
  const handleRegenerateLiveAI = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeApp })
      });

      if (!response.ok) {
        throw new Error('Analytics BI generation endpoint failed. Server offline.');
      }

      const data = await response.json();
      if (data.result) {
        setBiData(data.result);
        setActiveItemIndex(0);
      } else {
        throw new Error('Invalid JSON schema received from Gemini.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to synthesize live AI insights.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to render high-contrast SVG trend graph (Chronological Months)
  const renderChronologicalOverviewChart = (points: ChartPoint[]) => {
    if (!points || points.length === 0) return null;
    
    const width = 560;
    const height = 180;
    const padding = 35;
    
    const maxVal = Math.max(...points.map(p => Math.max(p.value, p.previousValue)), 1000);
    const minVal = Math.min(...points.map(p => Math.min(p.value, p.previousValue)), 0);
    const valRange = maxVal - minVal || 100;

    // Map coordinates for Current Period
    const currentCoordinates = points.map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((p.value - minVal) / valRange) * (height - padding * 2);
      return { x, y, label: p.label, value: p.value };
    });

    // Map coordinates for Previous Period (for comparative line)
    const previousCoordinates = points.map((p, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((p.previousValue - minVal) / valRange) * (height - padding * 2);
      return { x, y, value: p.previousValue };
    });

    const currentPathStr = currentCoordinates.map(c => `${c.x},${c.y}`).join(' L ');
    const previousPathStr = previousCoordinates.map(c => `${c.x},${c.y}`).join(' L ');

    return (
      <div className="bg-slate-950 border border-slate-850/80 rounded-2xl p-4.5 relative overflow-hidden shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Chronological Growth Trajectory</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
              <span className="text-slate-300">Active Month</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-slate-700 inline-block border-dashed border-t border-slate-500"></span>
              <span className="text-slate-500">Target/Baseline</span>
            </span>
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, gridIdx) => {
            const y = padding + ratio * (height - padding * 2);
            const val = Math.round(maxVal - ratio * valRange);
            return (
              <g key={gridIdx}>
                <line 
                  x1={padding} 
                  y1={y} 
                  x2={width - padding} 
                  y2={y} 
                  stroke="#1e293b" 
                  strokeDasharray="3 3" 
                  strokeWidth="0.8"
                />
                <text 
                  x={padding - 8} 
                  y={y + 3} 
                  fill="#64748b" 
                  fontSize="8" 
                  fontFamily="monospace" 
                  textAnchor="end"
                >
                  ${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}
                </text>
              </g>
            );
          })}

          {/* Previous/Baseline Path Line */}
          {previousPathStr && (
            <path
              d={`M ${previousPathStr}`}
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />
          )}

          {/* Current Period Path Line */}
          {currentPathStr && (
            <path
              d={`M ${currentPathStr}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Scatter Dots & Value Labels */}
          {currentCoordinates.map((c, dotIdx) => (
            <g key={dotIdx} className="group cursor-pointer">
              {/* Highlight Ring */}
              <circle
                cx={c.x}
                cy={c.y}
                r="6"
                fill="#10b981"
                className="opacity-0 group-hover:opacity-20 transition-opacity"
              />
              {/* Core Dot */}
              <circle
                cx={c.x}
                cy={c.y}
                r="3.5"
                fill="#020617"
                stroke="#10b981"
                strokeWidth="2"
              />
              {/* Label at bottom */}
              <text
                x={c.x}
                y={height - 12}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="500"
                textAnchor="middle"
              >
                {c.label}
              </text>
              {/* Tooltip text when hovered */}
              <text
                x={c.x}
                y={c.y - 10}
                fill="#ffffff"
                fontSize="8.5"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded"
              >
                ${c.value.toLocaleString()}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute top-2 right-2 text-[8px] font-mono text-slate-600">
          * Drag nodes or hover points to check coordinates
        </div>
      </div>
    );
  };

  // Helper to render interactive bar chart (comparison points)
  const renderSimpleBarChart = (data: SimpleDataPoint[], color: 'emerald' | 'amber' | 'rose' = 'emerald') => {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.value), 10);
    const colorClasses = {
      emerald: { bar: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
      amber: { bar: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
      rose: { bar: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' },
    };
    const currentTheme = colorClasses[color];

    return (
      <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-4">
        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Comparative Visualization</span>
        
        <div className="space-y-3.5">
          {data.map((item, idx) => {
            const percentage = Math.max(Math.round((item.value / maxVal) * 100), 5);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-300">{item.label}</span>
                  <span className={`font-mono font-bold ${currentTheme.text}`}>{item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${currentTheme.bar}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans" id="business-intelligence-workspace">
      
      {/* Workspace Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800/80 p-5 rounded-3xl shadow-xl">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Growth Radar
              <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                AI Intelligence
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Find regional customer hotspots, analyze why users are leaving, and master customer sharing loops with clear, simple business translations.
            </p>
          </div>
        </div>

        {/* Global Regenerate Button */}
        <button
          onClick={handleRegenerateLiveAI}
          disabled={loading}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 disabled:bg-slate-950 text-emerald-400 disabled:text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer self-start md:self-auto hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Scanning your business...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400 fill-current" />
              <span>Refresh Business Scanner</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Error Banner */}
      {errorMessage && (
        <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-2xl flex items-start gap-3 text-rose-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-bold block">AI Scanner Offline</span>
            <span className="opacity-90">{errorMessage}. Showing cached business records instead.</span>
          </div>
        </div>
      )}

      {/* Grid: Left Column Tabs + Selectors, Right Column Deep Explanations & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand: Category Tabs and Interactive Cards list */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Navigation Category Pill Selector */}
          <div className="grid grid-cols-4 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-850">
            {[
              { id: 'overview', name: 'Health', icon: Activity },
              { id: 'insights', name: 'Insights', icon: Sparkles },
              { id: 'opportunities', name: 'Growth', icon: Lightbulb },
              { id: 'risks', name: 'Risks', icon: AlertTriangle }
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id as any);
                    setActiveItemIndex(0);
                  }}
                  className={`py-2 text-[10px] font-bold rounded-xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isSelected 
                      ? 'bg-emerald-500 text-slate-950 font-black' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamically List items based on Active Tab */}
          <div className="space-y-3">
            
            {/* Tab 1: Health / Performance Overview Panel */}
            {activeTab === 'overview' && (
              <div 
                onClick={() => setActiveItemIndex(0)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all border-l-4 border-l-emerald-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">BUSINESS STRENGTH SCORE</span>
                  <span className="text-xl font-mono font-black text-emerald-400">{biData.performanceOverview.healthScore}/100</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-2 leading-tight">{biData.performanceOverview.headline}</h4>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {biData.performanceOverview.desc}
                </p>
                <div className="mt-3.5 pt-3 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>TREND PATTERN: Growth Trend</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            )}

            {/* Tab 2: Deep AI Insights List */}
            {activeTab === 'insights' && biData.insights.map((ins, idx) => {
              const isSelected = activeItemIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveItemIndex(idx)}
                  className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected ? 'border-emerald-500/40 border-l-4 border-l-emerald-500' : 'border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest truncate max-w-[120px]">
                        {ins.metric}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        ins.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {ins.change}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2 leading-tight">{ins.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {ins.explanation}
                  </p>
                </div>
              );
            })}

            {/* Tab 3: Growth Opportunities List */}
            {activeTab === 'opportunities' && biData.opportunities.map((opp, idx) => {
              const isSelected = activeItemIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveItemIndex(idx)}
                  className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected ? 'border-emerald-500/40 border-l-4 border-l-emerald-500' : 'border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest truncate max-w-[120px]">
                        {opp.targetSegment}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                        {opp.potentialImpact}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2 leading-tight">{opp.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {opp.explanation}
                  </p>
                </div>
              );
            })}

            {/* Tab 4: Risk Alerts List */}
            {activeTab === 'risks' && biData.riskAlerts.map((risk, idx) => {
              const isSelected = activeItemIndex === idx;
              const isHigh = risk.severity === 'High';
              return (
                <div
                  key={idx}
                  onClick={() => setActiveItemIndex(idx)}
                  className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected ? 'border-emerald-500/40 border-l-4 border-l-rose-500' : 'border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        isHigh ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {risk.severity} RISK
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-400">{risk.stat}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-2 leading-tight">{risk.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {risk.explanation}
                  </p>
                </div>
              );
            })}

          </div>

        </div>

        {/* Right Hand: Deep Dive AI Analysis and Custom SVG Charts */}
        <div className="lg:col-span-2">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl min-h-[480px]">
            
            {/* Header deep dive */}
            <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
              <div>
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Interactive Growth Board</span>
                <h3 className="text-sm font-black text-white mt-1">
                  {activeTab === 'overview' && 'Overall Business Growth Trajectory'}
                  {activeTab === 'insights' && `Actionable Insight: ${biData.insights[activeItemIndex]?.title || ''}`}
                  {activeTab === 'opportunities' && `Growth Opportunity: ${biData.opportunities[activeItemIndex]?.title || ''}`}
                  {activeTab === 'risks' && `Potential Risk: ${biData.riskAlerts[activeItemIndex]?.title || ''}`}
                </h3>
              </div>

              {/* Decorative category label */}
              <span className="text-[9px] font-mono font-bold bg-slate-950 border border-slate-850 text-slate-400 px-2 py-1 rounded">
                / {activeTab.toUpperCase()}
              </span>
            </div>

            {/* Loading Cover Overlay */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4 text-center">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">Scanning customer habits...</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                    AI is analyzing how users interact with your business to find easy ways to increase retention and boost organic growth.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Visual Chart Section */}
                <div>
                  {activeTab === 'overview' && renderChronologicalOverviewChart(biData.performanceOverview.chartPoints)}
                  
                  {activeTab === 'insights' && biData.insights[activeItemIndex] && (
                    renderSimpleBarChart(
                      biData.insights[activeItemIndex].chartData, 
                      biData.insights[activeItemIndex].isPositive ? 'emerald' : 'rose'
                    )
                  )}

                  {activeTab === 'opportunities' && biData.opportunities[activeItemIndex] && (
                    renderSimpleBarChart(biData.opportunities[activeItemIndex].chartData, 'emerald')
                  )}

                  {activeTab === 'risks' && biData.riskAlerts[activeItemIndex] && (
                    renderSimpleBarChart(biData.riskAlerts[activeItemIndex].chartData, 'rose')
                  )}
                </div>

                {/* AI Explanation Box */}
                <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 space-y-3.5 relative">
                  
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-400 animate-pulse fill-current" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">AI Executive Explanation</span>
                  </div>

                  {/* Dynamic Texts depending on active tabs */}
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    
                    {activeTab === 'overview' && (
                      <p className="text-[12px]">
                        {biData.performanceOverview.desc}
                      </p>
                    )}

                    {activeTab === 'insights' && biData.insights[activeItemIndex] && (
                      <div className="space-y-3">
                        <p className="text-[12px]">
                          {biData.insights[activeItemIndex].explanation}
                        </p>
                        <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[10.5px] text-slate-400 leading-normal">
                            <strong className="text-slate-200">Business Translation:</strong> Our analysis shows that users in this category show a {biData.insights[activeItemIndex].change} difference in engagement compared to your standard customer base.
                          </span>
                        </div>
                      </div>
                    )}

                    {activeTab === 'opportunities' && biData.opportunities[activeItemIndex] && (
                      <div className="space-y-3">
                        <p className="text-[12px]">
                          {biData.opportunities[activeItemIndex].explanation}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">YOUR TARGET AUDIENCE</span>
                            <span className="text-[10.5px] font-bold text-white flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              {biData.opportunities[activeItemIndex].targetSegment}
                            </span>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">HOW TO REACH THEM</span>
                            <span className="text-[10.5px] font-bold text-emerald-400">
                              {biData.opportunities[activeItemIndex].suggestedChannel}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'risks' && biData.riskAlerts[activeItemIndex] && (
                      <div className="space-y-4">
                        <p className="text-[12px]">
                          {biData.riskAlerts[activeItemIndex].explanation}
                        </p>
                        
                        <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2">
                          <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest block flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            Preventative Action Step
                          </span>
                          <p className="text-[11px] text-slate-300 leading-normal">
                            {biData.riskAlerts[activeItemIndex].preventativeAction}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
