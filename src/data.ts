/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConnectedApp, Recommendation, GrowthTask, ChatMessage, MarketingAutomation } from './types';

export const INITIAL_APPS: ConnectedApp[] = [
  {
    id: 'ai_growth_os',
    name: 'AI-Growth-OS',
    businessModel: 'SaaS',
    description: 'Central operational workspace orchestrating automated growth marketing campaigns, custom business dashboards, and custom AI helpers.',
    targetAudience: 'Growth executives, SaaS operators, and marketing team leads seeking streamlined intelligent workflows.',
    metrics: {
      mrr: 95400,
      mau: 210000,
      churn: 1.8,
      arpu: 45,
      cac: 85,
      viralCo: 0.35,
    },
    connectedAt: '2026-01-10',
    status: 'synced'
  },
  {
    id: 'zawaj',
    name: 'Zawaj',
    businessModel: 'Matchmaking',
    description: 'Culturally-respectful, privacy-focused Muslim matchmaking platform utilizing deep value compatibility matching.',
    targetAudience: 'Single Muslims aged 24-40 looking for intentional marriage with active family involvement and high safety safeguards.',
    metrics: {
      mrr: 48500,
      mau: 142000,
      churn: 8.2, // High churn rate due to 'good churn' (users marry and leave)
      arpu: 12,
      cac: 24,
      viralCo: 0.28,
    },
    connectedAt: '2026-03-12',
    status: 'synced'
  },
  {
    id: 'halal',
    name: 'Halal',
    businessModel: 'Marketplace',
    description: 'E-commerce and marketplace portal verifying and delivering certified halal organic foods and artisanal products.',
    targetAudience: 'Families seeking authenticated halal products and verified local micro-producers.',
    metrics: {
      mrr: 64200,
      mau: 98000,
      churn: 3.4,
      arpu: 25,
      cac: 32,
      viralCo: 0.42,
    },
    connectedAt: '2026-02-15',
    status: 'synced'
  },
  {
    id: 'mrdm',
    name: 'MRDM',
    businessModel: 'Education',
    description: 'Modern digital resource delivery platform and educational portal focusing on premium masterclass cohorts.',
    targetAudience: 'Professional adult learners seeking high-impact, career-advancing certifications.',
    metrics: {
      mrr: 112000,
      mau: 45000,
      churn: 2.8,
      arpu: 95,
      cac: 150,
      viralCo: 0.14,
    },
    connectedAt: '2026-04-20',
    status: 'synced'
  },
  {
    id: 'eventra',
    name: 'Eventra',
    businessModel: 'SaaS',
    description: 'All-in-one smart reservation, ticketing, and event planning suite with real-time analytics.',
    targetAudience: 'Corporate organizers and premium event hosts managing high-throughput venues.',
    metrics: {
      mrr: 78000,
      mau: 64000,
      churn: 4.1,
      arpu: 35,
      cac: 75,
      viralCo: 0.29,
    },
    connectedAt: '2026-05-05',
    status: 'synced'
  },
  {
    id: 'personal_brand',
    name: 'Personal Brand',
    businessModel: 'Education',
    description: 'Content syndication hub, newsletters, and premium advisory portal for building executive brand presence.',
    targetAudience: 'Founders, thought leaders, and venture capitalists building scalable digital reputations.',
    metrics: {
      mrr: 24000,
      mau: 18000,
      churn: 5.2,
      arpu: 50,
      cac: 20,
      viralCo: 0.62,
    },
    connectedAt: '2026-05-18',
    status: 'synced'
  },
  {
    id: 'agency_clients',
    name: 'Agency Clients',
    businessModel: 'SaaS/B2B',
    description: 'Client dashboard and progress tracking engine serving elite B2B professional accounts.',
    targetAudience: 'Retained marketing, design, and development clients expecting high-touch, data-rich reports.',
    metrics: {
      mrr: 185000,
      mau: 150,
      churn: 0.8,
      arpu: 1200,
      cac: 850,
      viralCo: 0.05,
    },
    connectedAt: '2026-06-01',
    status: 'synced'
  }
];

export const INITIAL_RECOMMENDATIONS: Record<string, Recommendation[]> = {
  zawaj: [
    {
      id: 'zawaj_rec_1',
      title: 'Success-Driven Referral Loop (The Walimah Boost)',
      category: 'Virality',
      impact: 'High',
      effort: 'Medium',
      metricImpact: '+3.5x Viral K',
      description: 'Matchmaking naturally has "good churn" (when couples find matches, they leave). Turn this exit point into your biggest growth driver. Introduce an optional, automated wedding gift referral system. When a couple disables their profile due to finding a match on Zawaj, prompt them to send three curated invite links to unmarried friends as a gift, which unlocks a premium gift voucher or charitable donation in their honor.',
      actionSteps: [
        'Build custom exit workflow triggered only when deleting/disabling account for matchmaking success.',
        'Create beautifully styled sharing cards enabling successful couples to directly invite friends via WhatsApp or Email.',
        'Partner with Islamic relief funds or bridal brands to trigger a donation/gift upon successful referrals.'
      ],
      completed: false
    },
    {
      id: 'zawaj_rec_2',
      title: 'Family Involvement Portal to decrease Churn & CAC',
      category: 'Retention',
      impact: 'High',
      effort: 'High',
      metricImpact: '-25% Churn Rate',
      description: 'In traditional matchmaking, family opinion is key. Provide a dedicated "Wali/Guardian Viewer Mode" where users can share profile matches securely with parents or trusted advisors for review. This deepens cultural trust, keeps users from abandoning the app due to family pressure, and builds secondary growth loops among parents.',
      actionSteps: [
        'Design a secure read-only viewer dashboard accessible via single-use encrypted access codes.',
        'Implement parental feedback comments that link directly to active matching chats.',
        'Include culturally-tailored explanations outlining how the parent mode protects privacy.'
      ],
      completed: false
    },
    {
      id: 'zawaj_rec_3',
      title: 'Value-Based Compatibility Quiz Paywall',
      category: 'Monetization',
      impact: 'Medium',
      effort: 'Low',
      metricImpact: '+18% ARPU',
      description: 'Upgrade the core onboarding experience by charging a premium to unlock the "Deep Compatibility Index" (detailed comparison of values, family goals, and lifestyle habits). This boosts the initial cart value without restricting basic matchmaking.',
      actionSteps: [
        'Establish an advanced 24-point values compatibility scoring mechanism.',
        'Design a high-converting comparison paywall showing blurred overlap insights.',
        'Test a pricing sweet spot of $14.99 one-time payment during the onboarding flow.'
      ],
      completed: false
    }
  ],
  eduquest: [
    {
      id: 'edu_rec_1',
      title: 'Gamified Parent-Teacher Night Sharing loop',
      category: 'Virality',
      impact: 'High',
      effort: 'Medium',
      metricImpact: '-30% CAC',
      description: 'Enable parents to generate a polished weekly "Children Cognitive Growth Report PDF" directly from their app. Include direct links for peer parents to scan and get 30 days of free EduQuest premium, leveraging classroom parent circles.',
      actionSteps: [
        'Develop an automated PDF report generator that highlights student learning streaks and skill badges.',
        'Add a highly visible "Share in Parent Group" button that copies a customized WhatsApp message.',
        'Deploy a tracked QR code embedded directly inside the parent report card PDF.'
      ],
      completed: false
    },
    {
      id: 'edu_rec_2',
      title: 'Cohort-Based Kid-to-Kid Quest Leagues',
      category: 'Retention',
      impact: 'High',
      effort: 'High',
      metricImpact: '+35% Session Time',
      description: 'To decrease drop-off after basic quests are completed, establish low-friction cohort leagues. Group children into anonymized math battle teams of 5, competing together to complete learning puzzles, driving mutual peer engagement and daily habits.',
      actionSteps: [
        'Draft a matchmaking matchmaking algorithm that pairs kids of similar mathematical proficiency.',
        'Construct a non-toxic team leaderboard showing avatar progress and collective point counts.',
        'Generate notifications reminding kids when their team needs their help to complete the weekly quest.'
      ],
      completed: false
    }
  ],
  localcart: [
    {
      id: 'local_rec_1',
      title: 'Baker Storefront Social Co-Sharing Loop',
      category: 'Virality',
      impact: 'High',
      effort: 'Low',
      metricImpact: '+45% Organic Traffic',
      description: 'Provide micro-chefs and artisanal bakers with beautiful, pre-designed visual menu banners optimized for Instagram Stories and WhatsApp Statuses. Each menu links back to their LocalCart storefront, causing your sellers to market your platform for you.',
      actionSteps: [
        'Build a dynamic canvas engine that automatically populates menu items and pricing onto striking social templates.',
        'Deploy a direct "Share to Instagram Stories" native integration link for mobile sellers.',
        'Incentivize sellers with a lower commission fee (e.g. 5% instead of 10%) on orders placed through their own referral menu link.'
      ],
      completed: false
    }
  ],
  taskpulse: [
    {
      id: 'task_rec_1',
      title: 'Developer Slack Viral Hook ("Synced by TaskPulse")',
      category: 'Virality',
      impact: 'High',
      effort: 'Low',
      metricImpact: '+200% Lead Gen',
      description: 'Whenever TaskPulse auto-summarizes a stand-up or daily call and creates a ticket, post an elegant rich message inside the Slack channel saying "⚡ Dispatch completed. TaskPulse auto-synced this to JIRA in 4 seconds. Get automated standups here." This converts non-user engineers in the same slack workspace into active advocates.',
      actionSteps: [
        'Update Slack integration payload to include a styled, subtle footer attribution.',
        'Create a dedicated high-speed onboarding landing page specifically targeting Slack redirect traffic.',
        'Implement single-click invite buttons for teammates watching the active Slack summaries.'
      ],
      completed: false
    }
  ]
};

export const INITIAL_TASKS: GrowthTask[] = [
  {
    id: 'task_zawaj_1',
    title: 'Fix onboarding drop-off during Guardian verification',
    appId: 'zawaj',
    category: 'Retention',
    completed: false,
    priority: 'High',
    dueDate: '2026-07-10'
  },
  {
    id: 'task_zawaj_2',
    title: 'Publish cultural trust & marriage engagement content template',
    appId: 'zawaj',
    category: 'Acquisition',
    completed: false,
    priority: 'Medium',
    dueDate: '2026-07-14'
  },
  {
    id: 'task_zawaj_3',
    title: 'Review organic SEO schema opportunities for matchmaking terms',
    appId: 'zawaj',
    category: 'Acquisition',
    completed: false,
    priority: 'Low',
    dueDate: '2026-07-22'
  },
  {
    id: 'task_1',
    title: 'Deploy parental dashboard sharing link',
    appId: 'eduquest',
    category: 'Virality',
    completed: false,
    priority: 'High',
    dueDate: '2026-07-15'
  },
  {
    id: 'task_2',
    title: 'Draft bridal discount partnership contract',
    appId: 'zawaj',
    category: 'Virality',
    completed: true,
    priority: 'Medium',
    dueDate: '2026-07-18'
  },
  {
    id: 'task_3',
    title: 'Optimize compatibility quiz mobile paywall spacing',
    appId: 'zawaj',
    category: 'Monetization',
    completed: true,
    priority: 'High',
    dueDate: '2026-07-06'
  },
  {
    id: 'task_4',
    title: 'Launch low-commission promo code for P2P bakers',
    appId: 'localcart',
    category: 'Acquisition',
    completed: false,
    priority: 'High',
    dueDate: '2026-07-20'
  }
];

export const INITIAL_CHAT: Record<string, ChatMessage[]> = {
  zawaj: [
    {
      id: 'm1',
      role: 'model',
      content: "Assalamu Alaikum! I'm your GrowthBrain AI coach. I've analyzed Zawaj's performance. You have fantastic user numbers (142k MAU) and very reasonable CAC ($24). However, your churn of 8.2% is high—but much of this is likely successful couples deleting the app. Let's turn this 'success churn' into a viral flywheel! Ask me anything about building referral loops, optimizing parent views, or boosting ARPU.",
      timestamp: '01:10 AM',
      report: {
        title: "Matchmaking Engagement Diagnostics",
        metrics: [
          { label: "Active Users (MAU)", value: "142,500", change: "+14% MoM", isGood: true },
          { label: "CAC Efficiency", value: "$24", change: "Optimal", isGood: true },
          { label: "Monthly Churn", value: "8.2%", change: "+3.2% High", isGood: false },
          { label: "Viral Coefficient (K)", value: "0.22", change: "Sub-critical", isGood: false }
        ],
        findings: [
          "Users display significant onboarding friction during parental/guardian security verification.",
          "High churn rate is inflated by positive success states (couples marrying and deleting profiles).",
          "Lack of automated referral campaigns to leverage successful married couples as organic brand advocates."
        ]
      },
      actions: [
        { label: "Create Referral Campaign", type: "create_campaign", payload: { goal: "Convert successful couples into wedding referrers", tone: "Warm & Respectful" } },
        { label: "Improve Onboarding Task", type: "add_task", payload: { title: "Fix onboarding drop-off during Guardian verification", category: "Retention", priority: "High" } },
        { label: "Examine Performance Hub", type: "view_tab", payload: { tabId: "dashboard" } }
      ]
    }
  ],
  eduquest: [
    {
      id: 'm1',
      role: 'model',
      content: "Hello! I am GrowthBrain. I've completed a diagnostic on EduQuest. You have an extremely high-retention product (2.1% churn is incredible for education SaaS), but your CAC of $65 is eating your margins because your viral coefficient is low (0.12). Let's unlock organic parent-led viral loops. What strategy would you like to build first?",
      timestamp: '01:10 AM',
      report: {
        title: "EduQuest Growth Metrics Diagnostic",
        metrics: [
          { label: "Product Churn", value: "2.1%", change: "Stellar", isGood: true },
          { label: "Acquisition CAC", value: "$65", change: "Elevated", isGood: false },
          { label: "Viral Coefficient K", value: "0.12", change: "Extremely Low", isGood: false },
          { label: "Simulated MRR", value: "$76,400", change: "+5.1% MoM", isGood: true }
        ],
        findings: [
          "Outstanding customer satisfaction and gamified learning retention once onboarded.",
          "High customer acquisition cost is limiting scalability since organic loops are missing.",
          "Significant opportunity to introduce automated parental sharing links to create viral loops."
        ]
      },
      actions: [
        { label: "Design Sharing Campaign", type: "create_campaign", payload: { goal: "Launch parent dashboard sharing link", tone: "Encouraging" } },
        { label: "Add Viral Sharing Loop", type: "add_task", payload: { title: "Deploy parental dashboard sharing link", category: "Virality", priority: "High" } },
        { label: "View Growth Cockpit", type: "view_tab", payload: { tabId: "dashboard" } }
      ]
    }
  ],
  localcart: [
    {
      id: 'm1',
      role: 'model',
      content: "Hey there! GrowthBrain is online. LocalCart has amazing natural dynamics—your bakers and foodies already share word of mouth, leading to a high viral coefficient of 0.65. Our goal is to capitalize on this and build structured, automated creator templates. Let's design some growth plays!",
      timestamp: '01:10 AM',
      report: {
        title: "LocalCart Hyperlocal Diagnostic",
        metrics: [
          { label: "Viral Coefficient K", value: "0.65", change: "+0.15 Healthy", isGood: true },
          { label: "Organic Acquisition", value: "62%", change: "Excellent", isGood: true },
          { label: "P2P Churn Rate", value: "6.0%", change: "Moderate", isGood: false },
          { label: "Average ARPU", value: "$6.0", change: "-12% Sub-par", isGood: false }
        ],
        findings: [
          "Strong organic referral loops driven naturally by artisanal food sharing.",
          "Merchant and creator churn is triggered by complex manual payouts.",
          "Low average transaction size (ARPU) indicates pricing or premium tier optimization is needed."
        ]
      },
      actions: [
        { label: "Launch Merchant Campaign", type: "create_campaign", payload: { goal: "Launch low-commission promo code for P2P bakers", tone: "Hype & Direct" } },
        { label: "Add Seller Promo Play", type: "add_task", payload: { title: "Launch low-commission promo code for P2P bakers", category: "Acquisition", priority: "High" } }
      ]
    }
  ],
  taskpulse: [
    {
      id: 'm1',
      role: 'model',
      content: "Welcome, founder! GrowthBrain is ready. TaskPulse has healthy MRR ($352k) and stellar enterprise retention (1.4% churn). But your CAC is extremely high ($280) and you have almost no natural organic growth (0.05 viral coefficient). We need to leverage your presence inside developer slack channels to create highly viral feedback loops. Let's build a plan.",
      timestamp: '01:10 AM',
      report: {
        title: "Enterprise SaaS Structural Diagnostic",
        metrics: [
          { label: "Enterprise Churn", value: "1.4%", change: "Stellar", isGood: true },
          { label: "Enterprise MRR", value: "$352,000", change: "+12.4% MoM", isGood: true },
          { label: "Outbound CAC", value: "$280", change: "Severely High", isGood: false },
          { label: "Viral Coefficient K", value: "0.05", change: "None", isGood: false }
        ],
        findings: [
          "Phenomenal lock-in and usage volume inside team environments.",
          "Heavy reliance on expensive outbound sales leads to excessive CAC rates.",
          "Slack/Teams integrations can be optimized with automated invites to unlock product-led growth."
        ]
      },
      actions: [
        { label: "Slack Invite Campaign", type: "create_campaign", payload: { goal: "Generate virality via Slack shared links", tone: "Hype & Direct" } },
        { label: "Build Slack Invitation loop", type: "add_task", payload: { title: "Implement Slack workspace invite prompt on completed boards", category: "Virality", priority: "Medium" } }
      ]
    }
  ]
};

export const INITIAL_AUTOMATIONS: MarketingAutomation[] = [
  // Zawaj Automations
  {
    id: 'auto_zawaj_1',
    appId: 'zawaj',
    name: 'New User Journey',
    trigger: 'User registers',
    actions: [
      'Send welcome message (Warm & Respectful tone)',
      'Suggest profile completion (Wali/Guardian verification setup)',
      'Track and log engagement telemetry'
    ],
    status: 'Active',
    lastFired: '2026-07-08 10:15 AM',
    runsCount: 1420
  },
  {
    id: 'auto_zawaj_2',
    appId: 'zawaj',
    name: 'Inactive User Nudge',
    trigger: 'User inactive for 7 days',
    actions: [
      'Create customized reminder campaign',
      'Choose best channel automatically (WhatsApp preference)',
      'Measure engagement response rates'
    ],
    status: 'Active',
    lastFired: '2026-07-07 04:30 PM',
    runsCount: 384
  },

  // EduQuest Automations
  {
    id: 'auto_eduquest_1',
    appId: 'eduquest',
    name: 'New User Journey',
    trigger: 'User registers',
    actions: [
      'Send welcome message with initial gamified setup details',
      'Suggest parent dashboard completion & linking',
      'Track child homework trail engagements'
    ],
    status: 'Active',
    lastFired: '2026-07-08 11:22 AM',
    runsCount: 650
  },
  {
    id: 'auto_eduquest_2',
    appId: 'eduquest',
    name: 'Inactive Parent Reactivation',
    trigger: 'User inactive for 7 days',
    actions: [
      'Generate cognitive progress snapshot summary',
      'Choose best channel automatically (Email preference)',
      'Measure tracking report open rates'
    ],
    status: 'Paused',
    lastFired: '2026-07-05 09:10 AM',
    runsCount: 112
  },

  // LocalCart Automations
  {
    id: 'auto_localcart_1',
    appId: 'localcart',
    name: 'New Artisan Welcome',
    trigger: 'User registers',
    actions: [
      'Send welcome message with food handler verification checklist',
      'Suggest storefront profile catalog setup',
      'Track shop view engagement telemetry'
    ],
    status: 'Active',
    lastFired: '2026-07-08 08:05 AM',
    runsCount: 224
  },
  {
    id: 'auto_localcart_2',
    appId: 'localcart',
    name: 'Dormant Buyer Reactivation',
    trigger: 'User inactive for 7 days',
    actions: [
      'Create high-urgency baker discount code promo campaign',
      'Choose best channel automatically (WhatsApp/SMS preference)',
      'Measure redemption rate and coupon usage'
    ],
    status: 'Active',
    lastFired: '2026-07-07 12:40 PM',
    runsCount: 92
  },

  // TaskPulse Automations
  {
    id: 'auto_taskpulse_1',
    appId: 'taskpulse',
    name: 'New Team Workspace Setup',
    trigger: 'User registers',
    actions: [
      'Send welcome message with workspace onboarding layout',
      'Suggest Slack workspace automation integration',
      'Track active board velocity rates'
    ],
    status: 'Active',
    lastFired: '2026-07-08 07:30 AM',
    runsCount: 512
  },
  {
    id: 'auto_taskpulse_2',
    appId: 'taskpulse',
    name: 'Dev Flow Resuscitator',
    trigger: 'User inactive for 7 days',
    actions: [
      'Create high-impact slack velocity reminder campaign',
      'Choose best channel automatically (Slack notification preference)',
      'Measure click-through response telemetry'
    ],
    status: 'Active',
    lastFired: '2026-07-06 10:15 AM',
    runsCount: 180
  }
];

