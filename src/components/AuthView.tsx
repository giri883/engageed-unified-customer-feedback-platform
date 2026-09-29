import React from 'react';
import { useApp } from '../context/AppContext';
import { SignInCard } from './SignInCard';
import { SignUpCard } from './SignUpCard';
import { PageTransition } from './PageTransition';
import { ArrowLeft, ShieldCheck, Sparkles, Star, MessageSquare, Lightbulb, Smile, BarChart3 } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const isSignIn = currentView === 'signin';

  const handleSuccessNavigate = () => {
    setCurrentView('services');
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4 py-8 sm:py-12 my-auto">
        {/* Top return bar */}
        <div className="w-full flex items-center justify-between mb-4 sm:mb-6 max-w-[460px]">
          <button
            onClick={() => setCurrentView('landing')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all duration-200 cursor-pointer group shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-cyan-300" />
            <span>Back to EngageEd</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-3xs font-medium text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">256-Bit SSL Secured</span>
            <span className="sm:hidden">Secured</span>
          </div>
        </div>

        {/* Central Auth Container with Surrounding Feedback Atmosphere */}
        <div className="relative w-full max-w-[460px] flex flex-col items-center">
          {/* Top Feedback Element: 5 Stars + "Great service!" */}
          <div className="flex flex-col items-center mb-2.5 animate-float-bob select-none pointer-events-none">
            <div className="flex items-center gap-1 text-amber-300 text-xs drop-shadow-sm">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <span className="text-3xs font-semibold text-slate-200 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/15 mt-0.5 shadow-2xs">
              "Great service!"
            </span>
          </div>

          {/* Floating Left Atmosphere Elements: 😊 Positive & 💬 Speech bubble */}
          <div className="hidden lg:flex flex-col gap-3 absolute -left-36 top-20 animate-float-drift select-none pointer-events-none z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-speech-bubble text-slate-200 text-3xs font-semibold shadow-md">
              <span className="text-sm">😊</span>
              <span>Positive feedback</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-speech-bubble text-slate-200 text-3xs font-semibold shadow-md">
              <span className="text-sm">💬</span>
              <span>"Very easy to use"</span>
            </div>
          </div>

          {/* Floating Right Atmosphere Elements: 💡 Share Idea & 📊 Analytics */}
          <div className="hidden lg:flex flex-col gap-3 absolute -right-36 top-16 animate-float-drift-slow select-none pointer-events-none z-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-speech-bubble text-slate-200 text-3xs font-semibold shadow-md">
              <span className="text-sm">💡</span>
              <span>"Share your idea"</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-speech-bubble text-slate-200 text-3xs font-semibold shadow-md">
              <span className="text-sm">📊</span>
              <span>Instant insights</span>
            </div>
          </div>

          {/* The Glassmorphic Auth Card with PageTransition */}
          <div className="w-full flex justify-center z-20">
            <PageTransition viewKey={isSignIn ? 'signin' : 'signup'}>
              {isSignIn ? (
                <SignInCard
                  onSwitchToSignUp={() => setCurrentView('signup')}
                  onSuccessNavigate={handleSuccessNavigate}
                />
              ) : (
                <SignUpCard
                  onSwitchToSignIn={() => setCurrentView('signin')}
                  onSuccessNavigate={handleSuccessNavigate}
                />
              )}
            </PageTransition>
          </div>

          {/* Bottom Feedback Element: 💡 "Share your idea" */}
          <div className="flex items-center gap-1.5 mt-3 animate-float-bob select-none pointer-events-none text-3xs font-medium text-indigo-200/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-2xs">
            <span>💡</span>
            <span>"Share your idea · Help businesses improve"</span>
          </div>
        </div>
      </div>
    </div>
  );
};
