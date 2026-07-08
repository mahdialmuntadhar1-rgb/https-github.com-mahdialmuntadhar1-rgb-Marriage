/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConnectedApp, AppMetrics } from '../types';
import { TrendingUp, Users, Percent, ShieldCheck, ArrowUpRight, DollarSign, RefreshCw, Zap, Sliders, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricsDashboardProps {
  activeApp: ConnectedApp;
  onUpdateMetrics: (metrics: AppMetrics) => void;
}

export default function MetricsDashboard({ activeApp, onUpdateMetrics }: MetricsDashboardProps) {
  const [showSimulator, setShowSimulator] = useState(false);
  
  // Local states for sliders (synchronized to activeApp on load/change)
  const [mrr, setMrr] = useState(activeApp.metrics.mrr);
  const [mau, setMau] = useState(activeApp.metrics.mau);
  const [churn, setChurn] = useState(activeApp.metrics.churn);
  const [arpu, setArpu] = useState(activeApp.metrics.arpu);
  const [cac, setCac] = useState(activeApp.metrics.cac);
  const [viralCo, setViralCo] = useState(activeApp.metrics.viralCo);

  // Sync state with app changes
  useEffect(() => {
    setMrr(activeApp.metrics.mrr);
    setMau(activeApp.metrics.mau);
    setChurn(activeApp.metrics.churn);
    setArpu(activeApp.metrics.arpu);
    setCac(activeApp.metrics.cac);
    setViralCo(activeApp.metrics.viralCo);
  }, [activeApp]);

  // Derived metrics calculations
  // LTV = ARPU / Churn Rate (as decimal)
  const churnDecimal = Math.max(churn / 100, 0.005); // prevent divide by zero
  const ltv = Math.round(arpu / churnDecimal);
  const ltvToCac = cac > 0 ? (ltv / cac).toFixed(1) : 'N/A';
  const paybackPeriod = arpu > 0 ? (cac / arpu).toFixed(1) : 'N/A';
  
  // Organic loop referrals per month
  const organicReferrals = Math.round(mau * (viralCo / 4)); 

  // Push updates to parent state
  const handleMetricChange = (key: keyof AppMetrics, value: number) => {
    const updated = {
      mrr,
      mau,
      churn,
      arpu,
      cac,
      viralCo,
      [key]: value,
    };
    
    // Update local states
    if (key === 'mrr') setMrr(value);
    if (key === 'mau') setMau(value);
    if (key === 'churn') setChurn(value);
    if (key === 'arpu') setArpu(value);
    if (key === 'cac') setCac(value);
    if (key === 'viralCo') setViralCo(value);

    onUpdateMetrics(updated);
  };

  // Generate 6-month projected MRR data for the SVG Chart
  const getProjectedPoints = () => {
    const points = [];
    let currentProjection = mrr;
    
    // Growth factor calculation based on viral K and basic metrics
    // K coefficient determines virality multiplier, Churn limits retention
    const netGrowthFactor = (viralCo * 0.1) - (churn / 100) + 0.04; 

    for (let i = 0; i < 6; i++) {
      points.push(Math.round(currentProjection));
      currentProjection = Math.max(currentProjection * (1 + netGrowthFactor), 1000);
    }
    return points;
  };

  const projections = getProjectedPoints();
  const maxProj = Math.max(...projections, 10000);
  const minProj = Math.min(...projections, 0);
  const range = maxProj - minProj || 1000;

  // Convert projections to SVG coordinate points (600x120 canvas)
  const chartPoints = projections.map((val, idx) => {
    const x = (idx / 5) * 580 + 10;
    const y = 110 - ((val - minProj) / range) * 90;
    return `${x},${y}`;
  }).join(' ');

  // Get color for LTV to CAC
  const getLtvToCacColor = () => {
    const val = parseFloat(ltvToCac);
    if (isNaN(val)) return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    if (val >= 3) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (val >= 1.5) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  // Dynamic Growth Cockpit variables
  const growthScore = Math.min(Math.max(Math.round(82 - (churn * 2.5) + (viralCo * 25)), 10), 100);
  const engagementRate = Math.min(Math.max(Math.round(76 - (churn * 2.8) + (viralCo * 18)), 15), 98);
  const conversionRate = Math.min(Math.max(parseFloat((5.4 - (churn * 0.12) + (viralCo * 1.5)).toFixed(1)), 0.5), 15);
  const campaignPerformance = viralCo >= 0.5 ? 'Excellent (High Viral K)' : viralCo >= 0.2 ? 'Healthy (Standard)' : 'Needs Virality Booster';

  return (
    <div className="space-y-6" id="metrics-dashboard">
      
      {/* CHUNK 3: Growth Overview (CEO Command Cockpit) */}
      <div className="space-y-3" id="growth-overview-cockpit">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Platform Intelligence</h4>
            <h3 className="text-base font-bold text-white mt-0.5">Growth Command Cockpit Overview</h3>
          </div>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full uppercase">
            Interactive Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Growth Score */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700/60 transition-all" id="overview-growth-score">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Score</span>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white">{growthScore}</span>
              <span className="text-slate-500 text-xs font-mono">/100</span>
            </div>
            <p className="text-[9px] text-emerald-400 font-medium mt-1">▲ Calculated Realtime</p>
          </div>

          {/* Active Users */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700/60 transition-all" id="overview-active-users">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Users</span>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-white">{mau.toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-1">Monthly Active (MAU)</p>
          </div>

          {/* Engagement */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700/60 transition-all" id="overview-engagement">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engagement Rate</span>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-blue-400">{engagementRate}%</span>
            </div>
            <p className="text-[9px] text-blue-500 font-mono mt-1">DAU / MAU Ratio</p>
          </div>

          {/* Conversion */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-slate-700/60 transition-all" id="overview-conversion">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conversion Rate</span>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-amber-400">{conversionRate}%</span>
            </div>
            <p className="text-[9px] text-amber-500 font-mono mt-1">Subscribers / MAU</p>
          </div>

          {/* Campaign Performance */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between col-span-2 lg:col-span-1 hover:border-slate-700/60 transition-all" id="overview-campaign-perf">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Campaign Performance</span>
            <div className="mt-3">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-block uppercase">
                {campaignPerformance}
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-1">Viral K Metric Output</p>
          </div>
        </div>
      </div>

      {/* KPI Grid Header */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Synced Financial Ledger Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* MRR */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between" id="metric-card-mrr">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-white tracking-tight">${mrr.toLocaleString()}</h3>
            <p className="text-slate-500 text-[10px] font-mono mt-0.5">Monthly Rec. Revenue</p>
          </div>
        </div>

        {/* MAU */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between" id="metric-card-mau">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">MAU</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-white tracking-tight">{mau.toLocaleString()}</h3>
            <p className="text-slate-500 text-[10px] font-mono mt-0.5">Active Users</p>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between" id="metric-card-churn">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Churn</span>
            <Percent className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-white tracking-tight">{churn}%</h3>
            <p className="text-slate-500 text-[10px] font-mono mt-0.5">Monthly Cancellations</p>
          </div>
        </div>

        {/* ARPU */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between" id="metric-card-arpu">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">ARPU</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-white tracking-tight">${arpu}</h3>
            <p className="text-slate-500 text-[10px] font-mono mt-0.5">Avg Rev Per User</p>
          </div>
        </div>

        {/* CAC */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between" id="metric-card-cac">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">CAC</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-white tracking-tight">${cac}</h3>
            <p className="text-slate-500 text-[10px] font-mono mt-0.5">User Acq. Cost</p>
          </div>
        </div>

        {/* Viral Coefficient */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between" id="metric-card-viral">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Viral K</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-xl font-bold text-white tracking-tight">{viralCo}</h3>
            <p className="text-slate-500 text-[10px] font-mono mt-0.5">Referral K-factor</p>
          </div>
        </div>
      </div>
      </div>

      {/* Advanced Computed Metrics Grid & Projection Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Intelligence projections */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                6-Month Interactive MRR Projection
              </h3>
              <p className="text-xs text-slate-400">Modeled growth trajectory incorporating churn rates and virality.</p>
            </div>
            
            <button
              id="simulator-toggle"
              onClick={() => setShowSimulator(!showSimulator)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                showSimulator 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showSimulator ? "Hide Simulator" : "Scenario Simulator"}</span>
            </button>
          </div>

          {/* SVG Sparkline chart */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 relative" id="chart-sparkline-canvas">
            <svg viewBox="0 0 600 120" className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#1e293b" strokeDasharray="3" />
              <line x1="0" y1="65" x2="600" y2="65" stroke="#1e293b" strokeDasharray="3" />
              <line x1="0" y1="110" x2="600" y2="110" stroke="#1e293b" strokeDasharray="3" />

              {/* Area Under Spline */}
              <path
                d={`M 10,110 L ${chartPoints} L 590,110 Z`}
                fill="url(#chart-grad)"
              />

              {/* Glowing Spline Path */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                d={`M ${chartPoints}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]"
              />

              {/* Spline Nodes */}
              {projections.map((val, idx) => {
                const x = (idx / 5) * 580 + 10;
                const y = 110 - ((val - minProj) / range) * 90;
                return (
                  <g key={idx} className="group">
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-slate-950 stroke-emerald-400 stroke-2 cursor-pointer transition-all hover:r-6"
                    />
                    {/* Tooltip on SVG node */}
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="fill-slate-400 text-[9px] font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 p-1"
                    >
                      ${Math.round(val).toLocaleString()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
              <span>Today (${projections[0].toLocaleString()})</span>
              <span>Month 1</span>
              <span>Month 2</span>
              <span>Month 3</span>
              <span>Month 4</span>
              <span>6M Proj (${projections[5].toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Derived Intelligence Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              SaaS Growth Diagnostics
            </h3>
            <p className="text-xs text-slate-400">Unit economic ratios computed dynamically from connection metrics.</p>
          </div>

          <div className="space-y-3.5" id="derived-metrics-list">
            {/* LTV */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                Customer Lifetime Value (LTV)
                <span className="group relative cursor-help">
                  <Info className="w-3 h-3 text-slate-600 hover:text-slate-400" />
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-300 text-[10px] rounded p-2 w-48 shadow-xl border border-slate-800 hidden group-hover:block z-20 normal-case">
                    Computed as ARPU divided by Churn Rate. Est. revenue per customer lifecycle.
                  </span>
                </span>
              </span>
              <span className="text-sm font-bold text-white">${ltv.toLocaleString()}</span>
            </div>

            {/* LTV to CAC Ratio */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                LTV to CAC Ratio
                <span className="group relative cursor-help">
                  <Info className="w-3 h-3 text-slate-600 hover:text-slate-400" />
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-950 text-slate-300 text-[10px] rounded p-2 w-48 shadow-xl border border-slate-800 hidden group-hover:block z-20">
                    SaaS health barometer. &gt;3.0x represents excellent profitable marketing loops.
                  </span>
                </span>
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-bold ${getLtvToCacColor()}`}>
                {ltvToCac}x
              </span>
            </div>

            {/* CAC Payback Period */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                CAC Payback Period
              </span>
              <span className="text-sm font-bold text-slate-300">{paybackPeriod} months</span>
            </div>

            {/* Viral Growth Generation */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                Organic Referrals / Mo
              </span>
              <span className="text-sm font-bold text-yellow-400 flex items-center gap-1">
                +{organicReferrals.toLocaleString()} users
              </span>
            </div>
          </div>

          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-slate-400 leading-relaxed">
              {parseFloat(ltvToCac) >= 3 ? (
                <span><strong>Healthy CAC Arbitrage</strong>: Your customer value supports aggressive paid-acquisition plays safely.</span>
              ) : parseFloat(ltvToCac) >= 1.5 ? (
                <span><strong>Marginal Economics</strong>: Improve onboarding features or pricing tiers to pull LTV above 3x CAC.</span>
              ) : (
                <span><strong>High-Risk Leak</strong>: Churn is erasing your margins. Prioritize retention and community virality.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Simulator Sliders (collapsible) */}
      {showSimulator && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden space-y-6"
          id="simulation-panel"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">Scenario Modeling Engine</h4>
              <h3 className="text-lg font-bold text-white mt-1">Adjust Variables Live</h3>
              <p className="text-xs text-slate-400">Toggle values to simulate how updates like pricing or virality programs affect cashflow models.</p>
            </div>
            <button
              id="reset-simulation"
              onClick={() => {
                setMrr(activeApp.metrics.mrr);
                setMau(activeApp.metrics.mau);
                setChurn(activeApp.metrics.churn);
                setArpu(activeApp.metrics.arpu);
                setCac(activeApp.metrics.cac);
                setViralCo(activeApp.metrics.viralCo);
                onUpdateMetrics(activeApp.metrics);
              }}
              className="px-3 py-1.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset to Synced DB
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Slide 1: MRR */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Monthly Revenue (MRR)</span>
                <span className="font-mono text-emerald-400 font-bold">${mrr.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="5000"
                value={mrr}
                onChange={(e) => handleMetricChange('mrr', parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$1K</span>
                <span>$500K</span>
                <span>$1M</span>
              </div>
            </div>

            {/* Slide 2: MAU */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Active Users (MAU)</span>
                <span className="font-mono text-blue-400 font-bold">{mau.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="2000000"
                step="5000"
                value={mau}
                onChange={(e) => handleMetricChange('mau', parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>500</span>
                <span>1M</span>
                <span>2M</span>
              </div>
            </div>

            {/* Slide 3: Churn */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Churn Rate</span>
                <span className="font-mono text-rose-400 font-bold">{churn}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={churn}
                onChange={(e) => handleMetricChange('churn', parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0.5% (Elite)</span>
                <span>12%</span>
                <span>25% (High Leak)</span>
              </div>
            </div>

            {/* Slide 4: ARPU */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Average Revenue Per User (ARPU)</span>
                <span className="font-mono text-amber-400 font-bold">${arpu}</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="5"
                value={arpu}
                onChange={(e) => handleMetricChange('arpu', parseInt(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$1</span>
                <span>$250</span>
                <span>$500</span>
              </div>
            </div>

            {/* Slide 5: CAC */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Customer Acquisition Cost (CAC)</span>
                <span className="font-mono text-purple-400 font-bold">${cac}</span>
              </div>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={cac}
                onChange={(e) => handleMetricChange('cac', parseInt(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$5 (Organic)</span>
                <span>$500</span>
                <span>$1K (High Adspend)</span>
              </div>
            </div>

            {/* Slide 6: Viral Co */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Viral Coefficient (K-factor)</span>
                <span className="font-mono text-yellow-400 font-bold">{viralCo}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={viralCo}
                onChange={(e) => handleMetricChange('viralCo', parseFloat(e.target.value))}
                className="w-full accent-yellow-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0.0 (None)</span>
                <span>1.0 (Viral loop)</span>
                <span>2.0 (Exponential)</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* CHUNK 3: Connected Applications Cards */}
      <div className="space-y-3 pt-6 border-t border-slate-800/80" id="connected-applications-status-section">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Ecosystem Platform Integration Status</h4>
            <p className="text-xs text-slate-400 mt-0.5">Central neural connection states across multiple enterprise tenants.</p>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700/30">
            2 / 4 Integrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Zawaj platform */}
          <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700/60 transition-all" id="ecosystem-zawaj">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div>
                <h5 className="text-xs font-bold text-white">Zawaj Matchmaking</h5>
                <p className="text-[10px] text-slate-500 font-mono">Status: Connected</p>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/10">Active</span>
          </div>

          {/* EduQuest platform */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700/60 transition-all" id="ecosystem-eduquest">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div>
                <h5 className="text-xs font-bold text-white">EduQuest Learning</h5>
                <p className="text-[10px] text-slate-500 font-mono">Status: Connected</p>
              </div>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/10">Active</span>
          </div>

          {/* Future App 1 */}
          <div className="bg-slate-900 border border-slate-800/40 rounded-2xl p-4 flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity" id="ecosystem-future-app-1">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0"></span>
              <div>
                <h5 className="text-xs font-bold text-slate-400">Future Marketplace</h5>
                <p className="text-[10px] text-slate-500 font-mono">Status: Waiting</p>
              </div>
            </div>
            <span className="text-[9px] bg-slate-950 text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-800/80">Pending</span>
          </div>

          {/* Future App 2 */}
          <div className="bg-slate-900 border border-slate-800/40 rounded-2xl p-4 flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity" id="ecosystem-future-app-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0"></span>
              <div>
                <h5 className="text-xs font-bold text-slate-400">Future SaaS Product</h5>
                <p className="text-[10px] text-slate-500 font-mono">Status: Waiting</p>
              </div>
            </div>
            <span className="text-[9px] bg-slate-950 text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-800/80">Pending</span>
          </div>
        </div>
      </div>

    </div>
  );
}
