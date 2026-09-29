import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  RotateCw,
  AlertTriangle,
  TrendingUp,
  Tag,
  CheckCircle2,
  Lightbulb,
  Zap,
} from 'lucide-react';

export const AIInsightsView: React.FC = () => {
  const { aiInsights, refreshAIInsights, isGeneratingInsights, feedbacks } = useApp();

  return (
    <div className="space-y-6">
      {/* Header and Refresh Action */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Gemini AI Intelligence Engine
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">
            Automated Cross-Service AI Insights
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Grounded strictly in {feedbacks.length} verified customer submissions. Last analyzed{' '}
            <span className="font-mono text-neutral-700">
              {new Date(aiInsights.generated_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            .
          </p>
        </div>

        <button
          onClick={refreshAIInsights}
          disabled={isGeneratingInsights}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
          <span>{isGeneratingInsights ? 'Analyzing Feedback...' : 'Re-Run AI Analysis'}</span>
        </button>
      </div>

      {/* Grid: Common Problems & Emerging Issues */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Most Common Customer Problems */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-950">Most Common Customer Problems</h3>
                <p className="text-2xs text-neutral-500">Recurring bottlenecks aggregated across reviews</p>
              </div>
            </div>

            <div className="space-y-3">
              {aiInsights.common_problems.map((prob, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl glass-card border border-white/90 bg-gradient-to-r from-rose-50/40 to-white/70 flex items-start justify-between gap-3 text-xs hover:shadow-xs transition-all"
                >
                  <div>
                    <span className="font-semibold text-neutral-900 block leading-snug">
                      {prob.problem}
                    </span>
                    <span className="text-2xs text-neutral-500 mt-1 block">
                      Category: <strong>{prob.affected_category}</strong>
                    </span>
                  </div>
                  <span
                    className={`text-2xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      prob.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : prob.severity === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {prob.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emerging Issues */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-950">Emerging Issues (Early Warning)</h3>
                <p className="text-2xs text-neutral-500">Recently detected anomalies gaining velocity</p>
              </div>
            </div>

            <div className="space-y-3">
              {aiInsights.emerging_issues.map((em, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl glass-card border border-amber-200/70 bg-gradient-to-r from-amber-50/40 to-white/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-950">{em.issue}</span>
                    <span className="text-2xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {em.urgency} Urgency
                    </span>
                  </div>
                  <div className="text-2xs text-neutral-500 font-mono">
                    First Flagged: {em.detection_date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Frequently Mentioned Topics & Positive Trends */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Frequent Topics */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-950">Frequently Mentioned Topics</h3>
              <p className="text-2xs text-neutral-500">Subject clusters extracted from customer commentary</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {aiInsights.frequent_topics.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-2xl glass-card border border-white/90 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900">{t.topic}</span>
                  <span className="text-2xs text-neutral-400 font-mono tabular-nums">
                    ({t.frequency} mentions)
                  </span>
                </div>
                <span
                  className={`text-2xs font-bold px-2.5 py-0.5 rounded-full ${
                    t.sentiment_trend === 'positive'
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                      : t.sentiment_trend === 'negative'
                      ? 'text-rose-800 bg-rose-50 border border-rose-200'
                      : 'text-amber-800 bg-amber-50 border border-amber-200'
                  }`}
                >
                  Trend: {t.sentiment_trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Positive Trends */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-950">Positive Trends & Appreciated Features</h3>
              <p className="text-2xs text-neutral-500">Strengths to celebrate and double down on</p>
            </div>
          </div>

          <div className="space-y-3">
            {aiInsights.positive_trends.map((trend, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl glass-card border border-emerald-100 bg-gradient-to-r from-emerald-50/40 to-white/70 text-xs space-y-2"
              >
                <div className="font-bold text-neutral-950">{trend.trend}</div>
                <div className="text-2xs text-neutral-700 italic bg-white/90 p-2.5 rounded-xl border border-emerald-100">
                  "{trend.customer_quote}"
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Suggested Improvements & Strategic Roadmap */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-950">AI Actionable Improvement Recommendations</h3>
            <p className="text-xs text-neutral-500">Concrete steps businesses can execute to reduce friction and improve customer retention</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {aiInsights.suggested_improvements.map((imp, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl glass-card border border-white/90 flex flex-col justify-between text-xs space-y-3 hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-2xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      imp.effort === 'quick_win'
                        ? 'bg-emerald-100 text-emerald-800'
                        : imp.effort === 'medium'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {imp.effort.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-neutral-950 text-sm mb-1">{imp.title}</h4>
                <p className="text-2xs text-neutral-600 leading-relaxed">{imp.impact}</p>
              </div>

              <div className="pt-2.5 border-t border-indigo-100/60 flex items-center gap-1.5 text-2xs font-bold text-indigo-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ready to execute</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
