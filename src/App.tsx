/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LiveNetworkBackground } from './components/LiveNetworkBackground';
import { AmbientMusic } from './components/AmbientMusic';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ServiceHub } from './components/ServiceHub';
import { FeedbackHistory } from './components/FeedbackHistory';
import { BusinessDashboard } from './components/BusinessDashboard';
import { EmbeddedService } from './components/EmbeddedService';
import { FeedbackModal } from './components/FeedbackModal';
import { AuthView } from './components/AuthView';
import { CheckCircle2, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    activeEmbeddedService,
    isFeedbackModalOpen,
    openFeedbackModal,
    notification,
  } = useApp();

  const isAuthView = currentView === 'signin' || currentView === 'signup';

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans bg-[#02060B]">
      {/* ========================================================================= */}
      {/* PERSISTENT LIVE NETWORK BACKGROUND: Near-black tech constellation style    */}
      {/* Mounted once at root level. Never restarts on page or modal navigation.   */}
      {/* ========================================================================= */}
      <LiveNetworkBackground />

      {/* Persistent Ambient Soundtrack Controller (Starts strictly AFTER feedback submission) */}
      <AmbientMusic />

      {/* Foreground Interactive Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Floating Modern Glass Navbar - hidden during dedicated auth view */}
        {!isAuthView && <Navbar />}

        {/* Main View Area with Smooth Page Transition */}
        <main key={currentView} className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'services' && <ServiceHub />}
          {currentView === 'history' && <FeedbackHistory />}
          {currentView === 'business_dashboard' && <BusinessDashboard />}
          {isAuthView && <AuthView />}
        </main>

        {/* Embedded Service Browser Container */}
        {activeEmbeddedService && <EmbeddedService service={activeEmbeddedService} />}

        {/* Stress-Free Feedback Modal with Adaptive Sentiment Background Glow */}
        {isFeedbackModalOpen && <FeedbackModal />}

        {/* Persistent Floating Feedback Trigger with soft glow */}
        {!isAuthView && !activeEmbeddedService && !isFeedbackModalOpen && (
          <div className="fixed bottom-6 right-6 z-30">
            <button
              onClick={() => openFeedbackModal()}
              className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-full text-xs sm:text-sm font-bold shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 border border-white/20"
            >
              <span className="text-base group-hover:scale-110 transition-transform">💬</span>
              <span className="hidden sm:inline">Share Feedback</span>
              <span className="sm:hidden">Feedback</span>
            </button>
          </div>
        )}

        {/* Toast Notification Banner with Glass Panel */}
        {notification && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel bg-neutral-950/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-200">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
