import React, { useState } from 'react';
import { Feedback } from '../types';
import { Star, TrendingUp, Sparkles, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsChartsProps {
  feedbacks: Feedback[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ feedbacks }) => {
  const [hoveredSentiment, setHoveredSentiment] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const total = feedbacks.length || 1;

  // Sentiment counts
  const positiveCount = feedbacks.filter((f) => f.sentiment === 'Positive').length;
  const negativeCount = feedbacks.filter((f) => f.sentiment === 'Negative').length;
  const neutralCount = feedbacks.filter((f) => f.sentiment === 'Neutral').length;
  const mixedCount = feedbacks.filter((f) => f.sentiment === 'Mixed').length;

  const posPct = Math.round((positiveCount / total) * 100);
  const negPct = Math.round((negativeCount / total) * 100);
  const neuPct = Math.round((neutralCount / total) * 100);
  const mixPct = Math.round((mixedCount / total) * 100);

  // Category counts
  const categories = [
    'Product',
    'Service',
    'Support',
    'Payment',
    'Delivery',
    'User Interface',
    'Performance',
    'Other',
  ];
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: feedbacks.filter((f) => f.category === cat).length,
  }));
  const maxCatCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  // Rating distribution 1 to 5
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    stars: r,
    count: feedbacks.filter((f) => f.rating === r).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Sentiment Distribution Card with Gradient Bar and Interactive Cards */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
                <PieChart className="w-3.5 h-3.5" />
                <span>Emotional NLP Breakdown</span>
              </div>
              <h3 className="text-base font-bold text-neutral-950">Sentiment Distribution</h3>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
              {feedbacks.length} Reviews
            </span>
          </div>

          {/* Interactive Multi-segment Gradient Bar */}
          <div className="h-4 w-full rounded-full bg-neutral-100/90 overflow-hidden flex mb-6 p-0.5 shadow-inner">
            <div
              style={{ width: `${posPct}%` }}
              onMouseEnter={() => setHoveredSentiment(`Positive (${posPct}%) - ${positiveCount} reviews`)}
              onMouseLeave={() => setHoveredSentiment(null)}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 transition-all rounded-l-full cursor-pointer"
            />
            <div
              style={{ width: `${neuPct}%` }}
              onMouseEnter={() => setHoveredSentiment(`Neutral (${neuPct}%) - ${neutralCount} reviews`)}
              onMouseLeave={() => setHoveredSentiment(null)}
              className="bg-gradient-to-r from-neutral-400 to-slate-400 hover:opacity-90 transition-all cursor-pointer"
            />
            <div
              style={{ width: `${mixPct}%` }}
              onMouseEnter={() => setHoveredSentiment(`Mixed (${mixPct}%) - ${mixedCount} reviews`)}
              onMouseLeave={() => setHoveredSentiment(null)}
              className="bg-gradient-to-r from-amber-400 to-orange-400 hover:opacity-90 transition-all cursor-pointer"
            />
            <div
              style={{ width: `${negPct}%` }}
              onMouseEnter={() => setHoveredSentiment(`Negative (${negPct}%) - ${negativeCount} reviews`)}
              onMouseLeave={() => setHoveredSentiment(null)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition-all rounded-r-full cursor-pointer"
            />
          </div>

          {/* Live Hover Tooltip */}
          <div className="h-5 text-center text-xs font-semibold text-neutral-600 mb-2">
            {hoveredSentiment || 'Hover over sections for detailed breakdown'}
          </div>

          {/* Grid of Sentiment Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-100 hover:shadow-xs transition-all">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Positive</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-emerald-950 tabular-nums">
                {posPct}%
              </div>
              <div className="text-2xs text-emerald-700/80 font-mono tabular-nums">{positiveCount} reviews</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-neutral-50 border border-neutral-200/80 hover:shadow-xs transition-all">
              <div className="flex items-center gap-1.5 text-neutral-700 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>Neutral</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-neutral-950 tabular-nums">
                {neuPct}%
              </div>
              <div className="text-2xs text-neutral-500 font-mono tabular-nums">{neutralCount} reviews</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-yellow-50/40 border border-amber-100 hover:shadow-xs transition-all">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Mixed</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-amber-950 tabular-nums">
                {mixPct}%
              </div>
              <div className="text-2xs text-amber-700/80 font-mono tabular-nums">{mixedCount} reviews</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/80 to-pink-50/40 border border-rose-100 hover:shadow-xs transition-all">
              <div className="flex items-center gap-1.5 text-rose-800 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Negative</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-rose-950 tabular-nums">
                {negPct}%
              </div>
              <div className="text-2xs text-rose-700/80 font-mono tabular-nums">{negativeCount} reviews</div>
            </div>
          </div>
        </div>

        {/* Rating Distribution Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-purple-600 mb-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Score Dispersion</span>
              </div>
              <h3 className="text-base font-bold text-neutral-950">Rating Distribution</h3>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold font-mono text-neutral-950">
                {(
                  feedbacks.reduce((a, b) => a + b.rating, 0) / (feedbacks.length || 1)
                ).toFixed(1)}{' '}
                / 5.0
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {ratingCounts.map((item) => {
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.stars} className="flex items-center gap-3 text-xs group cursor-pointer">
                  <span className="w-12 font-bold text-neutral-700 font-mono flex items-center gap-1">
                    <span>{item.stars}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-3.5 rounded-full bg-neutral-100/90 overflow-hidden p-0.5">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.stars >= 4
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : item.stars === 3
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                          : 'bg-gradient-to-r from-rose-500 to-pink-500'
                      }`}
                    />
                  </div>
                  <span className="w-12 text-right font-mono font-bold text-neutral-700 tabular-nums">
                    {pct}%
                  </span>
                  <span className="w-10 text-right font-mono text-2xs text-neutral-400 tabular-nums">
                    ({item.count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Category Volume & Friction Breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-md">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-blue-600 mb-0.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Domain Classification</span>
            </div>
            <h3 className="text-base font-bold text-neutral-950">Feedback Volume by Category</h3>
          </div>
          {hoveredCategory && (
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {hoveredCategory}
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCounts.map((cat) => {
            const pct = Math.round((cat.count / total) * 100);
            return (
              <div
                key={cat.name}
                onMouseEnter={() => setHoveredCategory(`${cat.name}: ${cat.count} reports (${pct}%)`)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="p-4 rounded-2xl glass-card border border-white/90 hover:border-indigo-300 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-neutral-900">{cat.name}</span>
                  <span className="font-mono text-indigo-600 font-bold tabular-nums">{cat.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden mb-1.5">
                  <div
                    style={{ width: `${(cat.count / maxCatCount) * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                  />
                </div>
                <span className="text-2xs text-neutral-500 font-mono tabular-nums">{pct}% of total reports</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
