import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  ExternalLink,
  X,
  MessageSquareHeart,
  ShieldCheck,
  ShieldAlert,
  ShoppingCart,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface EmbeddedServiceProps {
  service: Service;
}

export const EmbeddedService: React.FC<EmbeddedServiceProps> = ({ service }) => {
  const { closeEmbeddedService, openFeedbackModal } = useApp();

  const [currentUrl, setCurrentUrl] = useState(service.website_url);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Interactive demo states for simulated apps
  const [cartCount, setCartCount] = useState(2);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [searchDate, setSearchDate] = useState('2026-10-12');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleExternalOpen = () => {
    window.open(service.website_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-md flex flex-col justify-end md:justify-center p-0 md:p-6 animate-in fade-in duration-200">
      <div className="w-full h-full max-w-6xl mx-auto glass-panel bg-white/95 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/90">
        
        {/* Browser Top Navigation Chrome Bar */}
        <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-white border-b border-indigo-100/70 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          {/* Controls: Back, Forward, Refresh, Home */}
          <div className="flex items-center gap-1.5 text-neutral-600">
            <button
              onClick={() => setHistoryIndex((prev) => Math.max(0, prev - 1))}
              disabled={historyIndex === 0}
              className="p-1.5 hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setHistoryIndex((prev) => prev + 1)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className={`p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer ${
                isRefreshing ? 'animate-spin text-indigo-600' : ''
              }`}
              title="Refresh"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentUrl(service.website_url);
                setOrderPlaced(false);
              }}
              className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Secure URL Address Bar with Glass Styling */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="bg-white/90 border border-indigo-100 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-mono text-neutral-800 truncate select-all font-medium">
                {currentUrl}
              </span>
              <span className="ml-auto text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 hidden sm:inline">
                TLS 1.3 Verified
              </span>
            </div>
          </div>

          {/* Browser Actions: Open Externally, Close */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExternalOpen}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100"
              title="Open in new external browser window"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>Open in New Tab</span>
            </button>

            <button
              onClick={closeEmbeddedService}
              className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-white rounded-xl transition-colors ml-1 cursor-pointer"
              title="Close browser container"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="flex-1 bg-gradient-to-br from-indigo-50/30 via-slate-50 to-purple-50/30 overflow-y-auto relative p-4 sm:p-6">
          {/* Embedding Check & Fallback Handler */}
          {!service.can_embed ? (
            /* Graceful CSP / X-Frame-Options Fallback view */
            <div className="max-w-2xl mx-auto my-8 glass-panel bg-white/95 rounded-3xl p-6 sm:p-9 border border-white/90 shadow-xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/25">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
                External Website Security Isolation
              </h2>
              <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
                <strong>{service.name}</strong> enforces strict Content Security Policies (CSP) and X-Frame-Options to safeguard user authentication and sensitive transactions. For your protection, EngageEd respects these security boundaries without bypassing them.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={handleExternalOpen}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-200" />
                  <span>Open {service.name} in New Tab</span>
                </button>

                <button
                  onClick={() => openFeedbackModal(service)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-xl text-xs sm:text-sm font-bold hover:bg-neutral-50 transition-colors border border-indigo-200 cursor-pointer shadow-xs"
                >
                  <MessageSquareHeart className="w-4 h-4 text-rose-500" />
                  <span>Return & Give Feedback</span>
                </button>
              </div>

              {/* Sandbox preview simulation note */}
              <div className="pt-6 border-t border-indigo-100 text-left bg-indigo-50/40 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>EngageEd Deep-Link Support</span>
                </div>
                <p className="text-2xs text-neutral-600 leading-relaxed">
                  When you complete your action on {service.name}, your session connects back automatically. Click the floating "💬 Share Feedback" button anytime to report issues or applaud their service.
                </p>
              </div>
            </div>
          ) : (
            /* Interactive Simulated App View (Technical embedding supported) */
            <div className="max-w-4xl mx-auto glass-panel bg-white/95 rounded-3xl border border-white/90 shadow-xl overflow-hidden">
              {/* App Internal Header */}
              <div className="bg-gradient-to-r from-neutral-950 via-indigo-950 to-neutral-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {service.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-tight">{service.name}</div>
                    <div className="text-2xs text-indigo-200">{service.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {service.sample_app_type === 'food' || service.sample_app_type === 'ecommerce' ? (
                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md">
                      <ShoppingCart className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{cartCount} items</span>
                    </div>
                  ) : (
                    <span className="text-2xs font-mono text-neutral-400">Authenticated Session</span>
                  )}
                </div>
              </div>

              {/* Service Domain-Specific Interactive Workspace */}
              <div className="p-6">
                {service.sample_app_type === 'food' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-indigo-50 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-950">Grand Kitchen Bistro Menu</h3>
                        <p className="text-xs text-neutral-500">Estimated delivery: 25-35 mins · Free delivery over $30</p>
                      </div>
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Open Now
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 flex justify-between items-center hover:border-orange-300 transition-all">
                        <div>
                          <div className="font-bold text-sm text-neutral-900">Artisan Woodfired Truffle Pizza</div>
                          <div className="text-xs text-neutral-500 mt-0.5">$18.50 · Fresh mozzarella, wild mushrooms</div>
                        </div>
                        <button
                          onClick={() => setCartCount((c) => c + 1)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shrink-0 ml-3 cursor-pointer shadow-xs"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 flex justify-between items-center hover:border-orange-300 transition-all">
                        <div>
                          <div className="font-bold text-sm text-neutral-900">Crispy Spiced Chicken Bowl</div>
                          <div className="text-xs text-neutral-500 mt-0.5">$14.00 · Jasmine rice, pickled cucumber</div>
                        </div>
                        <button
                          onClick={() => setCartCount((c) => c + 1)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shrink-0 ml-3 cursor-pointer shadow-xs"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Order Action Simulator */}
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-neutral-900">Current Order: {cartCount} items ($32.50)</div>
                        <div className="text-2xs text-neutral-500">Delivery Address: 742 Evergreen Terrace</div>
                      </div>
                      <button
                        onClick={() => setOrderPlaced(true)}
                        disabled={orderPlaced}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        {orderPlaced ? 'Order In Route (Track)' : 'Place Delivery Order'}
                      </button>
                    </div>

                    {orderPlaced && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Order #QB-8942 confirmed! Driver assigned. Estimated arrival in 28 mins.</span>
                        </div>
                        <button
                          onClick={() => openFeedbackModal(service)}
                          className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer"
                        >
                          Share Delivery Feedback
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {service.sample_app_type === 'ecommerce' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-neutral-950">Featured Autumn Collection</h3>
                      <span className="text-xs text-neutral-500">Same-Day Priority Dispatch</span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl glass-card border border-neutral-200/80">
                        <div className="h-28 bg-neutral-100/90 rounded-xl mb-3 flex items-center justify-center text-xs text-neutral-500 font-medium">
                          Noise-Cancelling Headphones
                        </div>
                        <div className="text-sm font-bold text-neutral-900">$189.00</div>
                        <div className="text-2xs text-neutral-500">Free 2-day delivery</div>
                        <button
                          onClick={() => setCartCount((c) => c + 1)}
                          className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all cursor-pointer shadow-xs"
                        >
                          Add to Cart
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl glass-card border border-neutral-200/80">
                        <div className="h-28 bg-neutral-100/90 rounded-xl mb-3 flex items-center justify-center text-xs text-neutral-500 font-medium">
                          Minimalist Wool Overcoat
                        </div>
                        <div className="text-sm font-bold text-neutral-900">$240.00</div>
                        <div className="text-2xs text-neutral-500">100% Merino Wool</div>
                        <button
                          onClick={() => setCartCount((c) => c + 1)}
                          className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all cursor-pointer shadow-xs"
                        >
                          Add to Cart
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl glass-card border border-neutral-200/80">
                        <div className="h-28 bg-neutral-100/90 rounded-xl mb-3 flex items-center justify-center text-xs text-neutral-500 font-medium">
                          Ergonomic Trackball
                        </div>
                        <div className="text-sm font-bold text-neutral-900">$79.00</div>
                        <div className="text-2xs text-neutral-500">Precision optical sensor</div>
                        <button
                          onClick={() => setCartCount((c) => c + 1)}
                          className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all cursor-pointer shadow-xs"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {service.sample_app_type === 'travel' && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-neutral-950">Flight & Hotel Booking Engine</h3>
                    <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-2xs font-bold text-neutral-600 block mb-1">Departure</label>
                        <input
                          type="text"
                          defaultValue="San Francisco (SFO)"
                          className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-2xs font-bold text-neutral-600 block mb-1">Destination</label>
                        <input
                          type="text"
                          defaultValue="Tokyo Haneda (HND)"
                          className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-2xs font-bold text-neutral-600 block mb-1">Date</label>
                        <input
                          type="date"
                          value={searchDate}
                          onChange={(e) => setSearchDate(e.target.value)}
                          className="w-full px-3 py-1.5 glass-input rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl glass-card border border-neutral-200/80 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-neutral-900">Direct Express Flight · Boeing 787</div>
                        <div className="text-xs text-neutral-500">Non-stop 10h 45m · In-flight Wi-Fi included</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-neutral-900">$640</div>
                        <button
                          onClick={() => openFeedbackModal(service)}
                          className="text-xs text-indigo-600 hover:underline font-bold"
                        >
                          Review Experience
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {service.sample_app_type === 'education' && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-neutral-950">Interactive CS Course: Distributed Systems</h3>
                    <div className="p-4 rounded-2xl bg-neutral-950 text-neutral-200 font-mono text-xs leading-relaxed shadow-md">
                      <div className="text-emerald-400">// Interactive sandbox initialized</div>
                      <div>$ cluster.spawnNode('worker-01')</div>
                      <div className="text-neutral-400">&gt; Node worker-01 heartbeat acknowledged. Latency: 12ms</div>
                      <div className="text-cyan-400">&gt; Consensus algorithm: Raft Protocol verified.</div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => openFeedbackModal(service)}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:scale-[1.02] transition-all cursor-pointer shadow-xs"
                      >
                        Submit Course Feedback
                      </button>
                    </div>
                  </div>
                )}

                {service.sample_app_type === 'entertainment' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-950">Now Playing on StreamWave</h3>
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-950 via-purple-950 to-neutral-900 text-white flex items-center justify-between shadow-lg">
                      <div>
                        <div className="text-xs text-purple-300 font-semibold">Community Podcast Series</div>
                        <div className="text-lg font-bold">The Future of Human-Centric Software</div>
                        <div className="text-2xs text-cyan-400 mt-1">Lossless FLAC 24-bit/96kHz</div>
                      </div>
                      <button
                        onClick={() => openFeedbackModal(service)}
                        className="px-4 py-2.5 bg-white text-neutral-950 rounded-xl text-xs font-bold hover:scale-105 transition-all cursor-pointer shadow-md"
                      >
                        Feedback on Audio Quality
                      </button>
                    </div>
                  </div>
                )}

                {service.sample_app_type === 'local' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-950">CleanPro Service Booking</h3>
                    <div className="p-5 rounded-2xl glass-card border border-neutral-200/80 space-y-3">
                      <div className="font-bold text-sm">Residential Deep Cleaning · 3 Bedrooms</div>
                      <div className="text-xs text-neutral-600">Assigned Certified Specialist: Marcus Vance (4.9★)</div>
                      <div className="text-xs text-neutral-500">Scheduled: Tomorrow at 10:00 AM</div>
                      <button
                        onClick={() => openFeedbackModal(service)}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all cursor-pointer shadow-xs"
                      >
                        Rate Technician
                      </button>
                    </div>
                  </div>
                )}

                {service.sample_app_type === 'banking' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-950">NexaBank Simulated Vault</h3>
                    <div className="p-5 rounded-2xl glass-card border border-neutral-200/80">
                      <div className="text-xs text-neutral-500 font-semibold">Checking Balance</div>
                      <div className="text-3xl font-extrabold font-mono text-neutral-900 mt-1">$14,820.50</div>
                    </div>
                  </div>
                )}

                {service.sample_app_type === 'healthcare' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-950">PulseCare Telehealth Consultation</h3>
                    <div className="p-5 rounded-2xl glass-card border border-neutral-200/80">
                      <div className="text-xs text-neutral-700 font-semibold">Dr. Sarah Jenkins · Board Certified Internist</div>
                      <div className="text-xs text-neutral-500 mt-1">Review lab work & prescription renewal</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Browser Footer with Floating Bar "💬 Share Feedback" */}
        <div className="bg-white/95 border-t border-indigo-100/70 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Viewing <strong>{service.name}</strong> inside EngageEd</span>
          </div>

          {/* Primary Persistent Floating / Bottom Action: "💬 Share Feedback" with glowing aura */}
          <button
            onClick={() => openFeedbackModal(service)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-base">💬</span>
            <span>Share Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
};
