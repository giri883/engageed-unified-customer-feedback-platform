import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  ShieldCheck,
  Star,
  Check,
} from 'lucide-react';
import { FeedbackStatus } from '../types';

export const FeedbackHistory: React.FC = () => {
  const { feedbacks, currentUser, openFeedbackModal, setCurrentView } = useApp();
  const [filterService, setFilterService] = useState('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const myFeedbacks = feedbacks.filter((f) => {
    const isOwner = f.user_id === currentUser.id || f.user_name === currentUser.full_name || f.is_anonymous;
    const matchesService = filterService === 'All' || f.service_name === filterService;
    const matchesStatus = filterStatus === 'All' || f.status === filterStatus;
    return isOwner && matchesService && matchesStatus;
  });

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>In Progress</span>
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Investigating</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
            <span>Received</span>
          </span>
        );
    }
  };

  const getEmojiRating = (rating: number) => {
    switch (rating) {
      case 5:
        return '😊 Great';
      case 4:
        return '🙂 Good';
      case 3:
        return '😐 Okay';
      case 2:
        return '😕 Not Good';
      case 1:
        return '😞 Poor';
      default:
        return '⭐ Rated';
    }
  };

  const uniqueServices = Array.from(new Set(feedbacks.map((f) => f.service_name)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 text-xs font-semibold text-indigo-900 shadow-xs mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            My Feedback History
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Track status updates, responses, and fixes for the feedback you have submitted across participating apps.
          </p>
        </div>

        <button
          onClick={() => openFeedbackModal()}
          className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-500/25 cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          + Submit New Feedback
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 glass-card rounded-2xl border border-white/80 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-semibold text-neutral-700">Filter Service:</span>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1 text-neutral-800 focus:outline-none font-medium"
          >
            <option value="All">All Services</option>
            {uniqueServices.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 sm:ml-4">
          <span className="font-semibold text-neutral-700">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1 text-neutral-800 focus:outline-none font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="open">Received</option>
            <option value="investigating">Investigating</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="ml-auto text-neutral-500 font-mono text-2xs tabular-nums font-semibold">
          Showing {myFeedbacks.length} submissions
        </div>
      </div>

      {/* Submissions List */}
      {myFeedbacks.length > 0 ? (
        <div className="space-y-4">
          {myFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className="glass-panel rounded-3xl border border-white/80 p-6 shadow-md hover:border-indigo-200/80 transition-all flex flex-col md:flex-row md:items-start justify-between gap-5"
            >
              <div className="space-y-3 flex-1">
                {/* Header row: Service name, Date, Category */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-extrabold text-neutral-950 text-base">{fb.service_name}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-neutral-500 font-medium">{fb.category}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-neutral-400 font-mono tabular-nums">
                    Submitted: {new Date(fb.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {fb.is_anonymous && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span className="inline-flex items-center gap-1 text-2xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        Anonymous Protected
                      </span>
                    </>
                  )}
                </div>

                {/* Rating & Sentiment */}
                <div className="flex items-center gap-3">
                  <div className="text-xs sm:text-sm font-bold text-neutral-900 bg-white/90 px-3 py-1.5 rounded-xl border border-neutral-200/80 inline-flex items-center gap-2 shadow-2xs">
                    <span>{getEmojiRating(fb.rating)}</span>
                    <span className="font-mono text-2xs text-neutral-500">({fb.rating}/5)</span>
                  </div>

                  <span className="text-xs text-neutral-600 font-medium">
                    Sentiment: <strong className="text-neutral-900">{fb.sentiment}</strong>
                  </span>
                </div>

                {/* Feedback Body (AI structured or raw) */}
                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-neutral-100">
                  {fb.ai_summary || fb.raw_text}
                </p>

                {/* Internal notes / Team resolution note */}
                {fb.internal_notes && fb.internal_notes.length > 0 && (
                  <div className="mt-2 text-xs text-emerald-950 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3 rounded-2xl flex items-start gap-2 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Team Action:</span>{' '}
                      <span>{fb.internal_notes[fb.internal_notes.length - 1]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="shrink-0 self-start md:self-center">
                {getStatusBadge(fb.status)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-panel rounded-3xl border border-white/80 p-8 shadow-sm">
          <MessageSquare className="w-10 h-10 text-indigo-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-950 mb-1">No feedback entries found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-5">
            You haven't submitted any feedback matching these filters yet. Experience a service in the Hub and share your honest thoughts!
          </p>
          <button
            onClick={() => setCurrentView('services')}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-sm"
          >
            Explore Services
          </button>
        </div>
      )}
    </div>
  );
};
