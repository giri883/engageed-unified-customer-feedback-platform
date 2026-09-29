import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquarePlus, User, Building2, Sparkles, LogIn, LogOut, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    userRole,
    setUserRole,
    currentView,
    setCurrentView,
    openFeedbackModal,
    activeEmbeddedService,
    issues,
    currentUser,
    isAuthenticated,
    signOut,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const unresolvedIssuesCount = issues.filter((i) => i.status !== 'resolved').length;

  return (
    <div className="sticky top-3 z-40 w-full px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-300">
      <header className="glass-panel rounded-2xl px-4 sm:px-5 py-2.5 flex items-center justify-between gap-4 border border-white/80 shadow-xl shadow-indigo-950/5">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/25 transition-all group-hover:scale-105 group-hover:shadow-indigo-500/40">
              E
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-950 via-indigo-950 to-purple-950 bg-clip-text text-transparent">
                EngageEd
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links with active pill */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setCurrentView('services')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === 'services'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-500/25 font-bold'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            Services Hub
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
              currentView === 'history'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-500/25 font-bold'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            My Feedback
          </button>

          <button
            onClick={() => {
              setUserRole('admin');
              setCurrentView('business_dashboard');
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'business_dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-500/25 font-bold'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
            }`}
          >
            <span>Business Analytics</span>
            {unresolvedIssuesCount > 0 && (
              <span
                className={`text-2xs font-mono font-bold px-1.5 py-0.5 rounded-md ${
                  currentView === 'business_dashboard'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {unresolvedIssuesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick role switcher glass segmented control */}
          <div className="flex items-center p-0.5 bg-neutral-100/90 rounded-xl border border-neutral-200/70 text-xs font-medium">
            <button
              onClick={() => setUserRole('customer')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                userRole === 'customer'
                  ? 'bg-white text-neutral-950 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Customer</span>
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                userRole === 'admin'
                  ? 'bg-white text-neutral-950 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Business</span>
            </button>
          </div>

          {/* User Account / Sign In Trigger */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white/80 hover:bg-white border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-xs font-semibold text-neutral-800"
              >
                {currentUser?.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xs font-bold shadow-xs">
                    {currentUser?.full_name ? currentUser.full_name[0] : 'U'}
                  </div>
                )}
                <span className="hidden lg:inline max-w-[85px] truncate">
                  {currentUser?.full_name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:inline" />
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div
                  onMouseLeave={() => setIsProfileOpen(false)}
                  className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl p-2 shadow-2xl border border-white/90 animate-in fade-in zoom-in-95 duration-150 z-50 text-xs"
                >
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="font-bold text-neutral-900 truncate">{currentUser.full_name}</p>
                    <p className="text-3xs text-neutral-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-3xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="capitalize">{currentUser.role} Account</span>
                    </div>
                  </div>

                  <div className="pt-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setCurrentView('signin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors cursor-pointer text-left font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Switch Account / Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setCurrentView('signup');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 hover:bg-purple-50 hover:text-purple-900 transition-colors cursor-pointer text-left font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-purple-600" />
                      <span>Create New Account</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentView('signin')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 bg-white/80 hover:bg-white hover:text-neutral-950 rounded-xl transition-all border border-neutral-200/80 shadow-2xs hover:shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            </div>
          )}

          {/* Primary CTA: Give Feedback */}
          <button
            onClick={() => openFeedbackModal(activeEmbeddedService || undefined)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-cyan-200" />
            <span className="hidden xs:inline">Share Feedback</span>
            <span className="xs:hidden">Feedback</span>
          </button>
        </div>
      </header>
    </div>
  );
};
