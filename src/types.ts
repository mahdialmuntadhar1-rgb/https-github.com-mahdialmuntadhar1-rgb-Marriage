/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BusinessModelType = 'SaaS' | 'Marketplace' | 'Matchmaking' | 'Education' | 'SaaS/B2B' | 'Mobile App';

export interface AppMetrics {
  mrr: number;          // Monthly Recurring Revenue
  mau: number;          // Monthly Active Users
  churn: number;        // Monthly Churn Rate in %
  arpu: number;         // Average Revenue Per User
  cac: number;          // Customer Acquisition Cost
  viralCo: number;      // Viral Coefficient (0 to 1.5+)
}

export interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  businessModel: BusinessModelType;
  metrics: AppMetrics;
  connectedAt: string;
  status: 'active' | 'synced' | 'connecting';
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality' | 'Brand';
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  metricImpact: string;
  description: string;
  actionSteps: string[];
  completed: boolean;
}

export interface MarketingChannelContent {
  subject?: string;
  headline: string;
  body: string;
  cta: string;
}

export interface Campaign {
  goal: string;
  tone: string;
  email: MarketingChannelContent;
  social: MarketingChannelContent;
  push: MarketingChannelContent;
  outreach: MarketingChannelContent;
}

export interface ChatMessageAction {
  label: string;
  type: 'create_campaign' | 'improve_signup' | 'generate_content' | 'add_task' | 'update_metrics' | 'view_tab';
  payload?: any;
}

export interface ChatMessageReportMetric {
  label: string;
  value: string | number;
  change: string;
  isGood: boolean;
}

export interface ChatMessageReport {
  title: string;
  metrics: ChatMessageReportMetric[];
  findings: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  actions?: ChatMessageAction[];
  report?: ChatMessageReport;
}

export interface GrowthTask {
  id: string;
  title: string;
  appId: string;
  category: 'Acquisition' | 'Retention' | 'Monetization' | 'Virality';
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

export interface MarketingAutomation {
  id: string;
  appId: string;
  name: string;
  trigger: string;
  actions: string[];
  status: 'Active' | 'Paused';
  lastFired?: string;
  runsCount: number;
}

