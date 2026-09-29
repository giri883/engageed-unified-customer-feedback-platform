import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnalyticsCharts } from './AnalyticsCharts';
import { IssueTable } from './IssueTable';
import { FeedbackTable } from './FeedbackTable';
import { AIInsightsView } from './AIInsightsView';
import { ServiceManagement } from './ServiceManagement';
import { SupabaseViewer } from './SupabaseViewer';
import {
  LineChart,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Layers,
  Database,
  Star,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { feedbacks, issues, resetToDemoData, services } = useApp();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'insights' | 'issues' | 'feedback_mgmt' | 'services_mgmt' | 'supabase'
  >('analytics');

  // Key Aggregated Metrics
  const totalFeedback = feedbacks.length;
  const positiveFeedback = feedbacks.filter((f) => f.sentiment === 'Positive').length;
  const negativeFeedback = feedbacks.filter((f) => f.sentiment === 'Negative').length;
  const neutralFeedback = feedbacks.filter((f) => f.sentiment === 'Neutral' || f.sentiment === 'Mixed').length;

  const positivePercent = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0;
  const negativePercent = totalFeedback > 0 ? Math.round((negativeFeedback / totalFeedback) * 100) : 0;

  const avgRating = totalFeedback > 0
    ? (feedbacks.reduce((a, b) => a + b.rating, 0) / totalFeedback).toFixed(1)
    : '0.0';

  const unresolvedIssues = issues.filter((i) => i.status !== 'resolved').length;
  const highPriorityIssues = issues.filter(
    (i) => (i.priority === 'High' || i.priority === 'Critical') && i.status !== 'resolved'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 text-xs font-semibold text-indigo-900 shadow-xs mb-2">
            <LineChart className="w-3.5 h-3.5 text-indigo-600" />
            <span>Executive Business Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Feedback & Issue Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time aggregated customer sentiment, root cause categorization, and automated issue prioritization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDemoData}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white/90 hover:bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl transition-all shadow-xs cursor-pointer"
            title="Reset dataset to default realistic demo state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Featured Attractive AI Insights Banner Card (As requested) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white p-6 sm:p-7 shadow-xl shadow-indigo-950/15 border border-indigo-400/20 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-4 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg text-amber-300 animate-glow-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <span>✨ AI Insight</span>
              </span>
              <span className="text-white/40">·</span>
              <span className="text-2xs text-white/70 font-mono">Live Synthesis</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-2xl">
              "Customers frequently mention delivery speed. Recent feedback shows an increase in delivery-related complaints."
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('insights')}
          className="z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 text-cyan-200" />
        </button>
      </div>

      {/* 7 Gradient Metric Cards with Hover Animations */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {/* Total Feedback */}
        <div className="glass-card bg-gradient-to-br from-indigo-50/80 via-white/80 to-blue-50/50 p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xs font-bold text-indigo-900 uppercase tracking-wider">
              Total Feedback
            </div>
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-950 tabular-nums">
            {totalFeedback}
          </div>
          <div className="text-2xs text-neutral-500 mt-1">Cross-platform</div>
        </div>

        {/* Positive */}
        <div className="glass-card bg-gradient-to-br from-emerald-50/80 via-white/80 to-teal-50/50 p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xs font-bold text-emerald-800 uppercase tracking-wider">
              Positive
            </div>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {positiveFeedback}
          </div>
          <div className="text-2xs text-emerald-700 font-mono tabular-nums mt-1 font-semibold">
            {positivePercent}% of total
          </div>
        </div>

        {/* Negative */}
        <div className="glass-card bg-gradient-to-br from-rose-50/80 via-white/80 to-pink-50/50 p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xs font-bold text-rose-800 uppercase tracking-wider">
              Negative
            </div>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
            {negativeFeedback}
          </div>
          <div className="text-2xs text-rose-700 font-mono tabular-nums mt-1 font-semibold">
            {negativePercent}% of total
          </div>
        </div>

        {/* Neutral */}
        <div className="glass-card bg-gradient-to-br from-amber-50/80 via-white/80 to-yellow-50/50 p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xs font-bold text-amber-800 uppercase tracking-wider">
              Neutral
            </div>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {neutralFeedback}
          </div>
          <div className="text-2xs text-neutral-500 mt-1">Balanced reviews</div>
        </div>

        {/* Average Rating */}
        <div className="glass-card bg-gradient-to-br from-purple-50/80 via-white/80 to-indigo-50/50 p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xs font-bold text-purple-900 uppercase tracking-wider">
              Avg Rating
            </div>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-950 tabular-nums flex items-baseline gap-1">
            <span>{avgRating}</span>
            <span className="text-xs text-neutral-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-2xs text-neutral-500 mt-1">CSAT Benchmark</div>
        </div>

        {/* Unresolved Issues */}
        <div className="glass-card bg-gradient-to-br from-blue-50/80 via-white/80 to-slate-50/50 p-4 rounded-2xl border border-white/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xs font-bold text-blue-900 uppercase tracking-wider">
              Unresolved
            </div>
            <AlertTriangle className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
            {unresolvedIssues}
          </div>
          <div className="text-2xs text-neutral-500 mt-1">Open tickets</div>
        </div>

        {/* High Priority Issues */}
        <div className="glass-card bg-gradient-to-br from-rose-100/70 via-white/80 to-rose-50/90 p-4 rounded-2xl border border-rose-200/90 shadow-sm hover:shadow-md hover:border-rose-400 transition-all duration-300 hover:-translate-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-2xs font-bold text-rose-800 uppercase tracking-wider">
              High Priority
            </div>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
            {highPriorityIssues}
          </div>
          <div className="text-2xs text-rose-700 mt-1 font-semibold">Immediate focus</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-semibold no-scrollbar">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 font-bold'
              : 'glass-card text-neutral-600 hover:text-neutral-900 hover:bg-white'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>Analytics & Visuals</span>
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'insights'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 font-bold'
              : 'glass-card text-neutral-600 hover:text-neutral-900 hover:bg-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>AI Insights Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'issues'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 font-bold'
              : 'glass-card text-neutral-600 hover:text-neutral-900 hover:bg-white'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Issue Prioritization ({unresolvedIssues})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback_mgmt')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'feedback_mgmt'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 font-bold'
              : 'glass-card text-neutral-600 hover:text-neutral-900 hover:bg-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feedback Management</span>
        </button>

        <button
          onClick={() => setActiveTab('services_mgmt')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'services_mgmt'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 font-bold'
              : 'glass-card text-neutral-600 hover:text-neutral-900 hover:bg-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Participating Services ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 font-bold'
              : 'glass-card text-neutral-600 hover:text-neutral-900 hover:bg-white'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase & RLS Schema</span>
        </button>
      </div>

      {/* Render Active View Tab */}
      <div className="pt-2">
        {activeTab === 'analytics' && <AnalyticsCharts feedbacks={feedbacks} />}
        {activeTab === 'insights' && <AIInsightsView />}
        {activeTab === 'issues' && <IssueTable />}
        {activeTab === 'feedback_mgmt' && <FeedbackTable />}
        {activeTab === 'services_mgmt' && <ServiceManagement />}
        {activeTab === 'supabase' && <SupabaseViewer />}
      </div>
    </div>
  );
};
