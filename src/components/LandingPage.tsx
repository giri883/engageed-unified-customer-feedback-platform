import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  MessageSquareHeart,
  LineChart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Zap,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setUserRole, openFeedbackModal, services, feedbacks } = useApp();

  const totalReviews = feedbacks.length;
  const avgScore = (
    feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / (feedbacks.length || 1)
  ).toFixed(1);

  return (
    <div className="w-full relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Soft Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 text-xs font-semibold text-indigo-900 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Unified Customer Feedback Platform</span>
                <span className="text-neutral-300">·</span>
                <span className="text-indigo-600 font-mono text-2xs">v2.0 Glass</span>
              </div>

              {/* Hero Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
                <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Turn Every Experience
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                  Into Insight.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance max-w-xl">
                One place to experience services, share feedback, and help businesses improve. Powered by smart expression assistance and real-time sentiment analytics.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                {/* Explore Services */}
                <button
                  onClick={() => setCurrentView('services')}
                  className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 rounded-xl transition-all shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-cyan-200" />
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Share Feedback */}
                <button
                  onClick={() => openFeedbackModal()}
                  className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <MessageSquareHeart className="w-4 h-4 text-white" />
                  <span>Share Feedback</span>
                </button>

                {/* Business Dashboard */}
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setCurrentView('business_dashboard');
                  }}
                  className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-neutral-700 bg-white/80 hover:bg-white hover:text-neutral-950 rounded-xl transition-all border border-indigo-100/80 shadow-xs hover:shadow-sm"
                >
                  <LineChart className="w-4 h-4 text-indigo-600" />
                  <span>Business Hub</span>
                </button>

                {/* Sign In / Register */}
                <button
                  onClick={() => setCurrentView('signin')}
                  className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-neutral-700 bg-white/80 hover:bg-white hover:text-indigo-600 rounded-xl transition-all border border-indigo-100/80 shadow-xs hover:shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Sign In / Join</span>
                </button>
              </div>

              {/* Trust proof */}
              <div className="pt-4 flex items-center gap-6 text-2xs text-slate-300/90">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero-Stress Simple Flow</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Expression Assistance</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>100% Anonymous Option</span>
                </span>
              </div>
            </div>

            {/* Right Hero Column: Floating Glass Feedback Showcase */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              
              {/* Ambient Glow behind the card */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-400/25 via-purple-400/25 to-pink-400/25 blur-3xl pointer-events-none -z-10" />

              {/* Main Floating Feedback Card (as requested) */}
              <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/80 shadow-2xl shadow-indigo-500/15 animate-float-slow space-y-4">
                
                {/* Header with emoji and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl leading-none">😊</span>
                    <div>
                      <div className="text-sm font-bold text-neutral-950">Great experience</div>
                      <div className="text-2xs text-neutral-500 font-mono">QuickBite · Food Delivery</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-2xs font-semibold">
                    Verified
                  </span>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-mono font-bold text-neutral-700 ml-1.5 tabular-nums">5.0</span>
                </div>

                {/* Quote (as requested) */}
                <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-neutral-100">
                  "Fast delivery and excellent service!"
                </p>

                {/* AI Detected Signal Badge */}
                <div className="flex items-center justify-between text-2xs pt-1 border-t border-neutral-100/80">
                  <span className="text-neutral-500 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>AI Sentiment: <strong>Positive</strong></span>
                  </span>
                  <span className="font-mono text-neutral-400">Just now</span>
                </div>
              </div>

              {/* Secondary Floating Mini Accent Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 glass-card p-3 rounded-xl border border-white/90 shadow-xl shadow-purple-500/10 animate-float-reverse hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-left text-2xs">
                  <div className="font-bold text-neutral-900">Stress-Free Loop</div>
                  <div className="text-neutral-500">Submit in &lt; 5 seconds with emojis</div>
                </div>
              </div>

            </div>
          </div>

          {/* Social Proof & Metrics Glass Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl glass-card border border-white/80 shadow-md shadow-indigo-950/5 text-left">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent tabular-nums">
                {services.length}
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-0.5">Participating Services</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tabular-nums">
                {totalReviews}+
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-0.5">Customer Submissions</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent tabular-nums">
                {avgScore} / 5.0
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-0.5">Average Experience Score</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tabular-nums">
                100%
              </div>
              <div className="text-xs text-neutral-600 font-medium mt-0.5">Privacy & Anonymous Protected</div>
            </div>
          </div>

        </div>
      </section>

      {/* The Problem & Solution Breakdown */}
      <section className="py-16 md:py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
              Why Traditional Feedback Is Broken
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Customers hop between scattered apps and face high-stress questionnaires. Businesses get noisy, disjointed comments that are hard to act on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="glass-card p-7 rounded-2xl border border-rose-100/70 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-xs font-semibold text-rose-700 border border-rose-200/80 mb-4">
                The Fragmented Past
              </div>
              <h3 className="text-lg font-bold text-neutral-950 mb-3">
                Scattered, Stressful, and Ignored
              </h3>
              <ul className="space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-base">×</span>
                  <span>Visiting dozens of disconnected websites just to submit a quick observation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-base">×</span>
                  <span>Overwhelming 20-field surveys when you only wanted to report a single delay.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-base">×</span>
                  <span>Feeling uncomfortable or intimidated when sharing constructive criticism.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold text-base">×</span>
                  <span>Businesses drowning in unclassified emails and reviews without clear root causes.</span>
                </li>
              </ul>
            </div>

            {/* The EngageEd Way */}
            <div className="glass-panel p-7 rounded-2xl border border-indigo-100/80 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 text-xs font-semibold text-emerald-800 border border-emerald-200/80 mb-4">
                The EngageEd Standard
              </div>
              <h3 className="text-lg font-bold text-neutral-950 mb-3">
                Unified, Calm, and Action-Oriented
              </h3>
              <ul className="space-y-3 text-sm text-neutral-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Unified Service Hub:</strong> Access Food, Banking, Shopping, and Health in one place.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Stress-Free Feedback:</strong> Start with simple emoji emotions, voice notes, or 1-click reactions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Smart AI Assistant:</strong> Turns rough or multilingual notes into polite, structured feedback.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Real-Time Prioritization:</strong> Businesses get aggregated sentiment, issue rankings, and AI insights.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Guide */}
      <section className="py-16 md:py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
              How EngageEd Works
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              A frictionless loop connecting everyday customer service usage with fast continuous service improvement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card p-5 rounded-2xl border border-white/80 hover:border-indigo-200/80 transition-all hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-sm shadow-indigo-500/25">
                01
              </div>
              <h4 className="font-bold text-neutral-950 text-sm sm:text-base mb-1.5">Choose Service</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Browse participating food, banking, travel, and retail services in the unified hub.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/80 hover:border-purple-200/80 transition-all hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-sm shadow-purple-500/25">
                02
              </div>
              <h4 className="font-bold text-neutral-950 text-sm sm:text-base mb-1.5">Use in Browser</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Interact with the service directly inside our embedded container with top navigation and full security.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/80 hover:border-pink-200/80 transition-all hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-sm shadow-pink-500/25">
                03
              </div>
              <h4 className="font-bold text-neutral-950 text-sm sm:text-base mb-1.5">1-Click Feedback</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tap the floating feedback button anytime. Large emoji ratings, voice transcription, or AI polishing.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/80 hover:border-emerald-200/80 transition-all hover:-translate-y-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-3.5 shadow-sm shadow-emerald-500/25">
                04
              </div>
              <h4 className="font-bold text-neutral-950 text-sm sm:text-base mb-1.5">Actionable Insights</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Business dashboard aggregates sentiment, classifies urgency, and highlights critical issues to fix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Preview Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Participating Services
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Access your favorite digital products directly with unified feedback support.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('services')}
              className="text-xs sm:text-sm font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="glass-card p-5 rounded-2xl border border-white/80 hover:border-indigo-300/70 hover:shadow-lg hover:shadow-indigo-500/10 transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xs font-semibold text-neutral-500 uppercase tracking-wider">{service.category}</span>
                    <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
                      ★ {service.rating_avg}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-950 mb-1">{service.name}</h4>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      setCurrentView('services');
                    }}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-50 rounded-xl text-center transition-colors border border-neutral-200"
                  >
                    Open Hub
                  </button>
                  <button
                    onClick={() => openFeedbackModal(service)}
                    className="py-1.5 px-3 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-center transition-colors shadow-xs"
                    title="Give feedback"
                  >
                    Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-slate-400 glass-panel">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">EngageEd</span>
            <span>·</span>
            <span>Turn Every Experience Into Insight</span>
          </div>
          <div>
            <span>Unified Customer Feedback Platform · Powered by React, Tailwind & Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
