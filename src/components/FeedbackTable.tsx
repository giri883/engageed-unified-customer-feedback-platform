import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Feedback, FeedbackStatus } from '../types';
import {
  Search,
  Filter,
  MessageSquare,
  Sparkles,
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const FeedbackTable: React.FC = () => {
  const { feedbacks, updateFeedbackStatus, addFeedbackNote } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSentiment, setFilterSentiment] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch =
      fb.raw_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.ai_summary && fb.ai_summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fb.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.user_name && fb.user_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = filterCategory === 'All' || fb.category === filterCategory;
    const matchesSent = filterSentiment === 'All' || fb.sentiment === filterSentiment;
    const matchesPri = filterPriority === 'All' || fb.priority === filterPriority;
    const matchesSrv = filterService === 'All' || fb.service_name === filterService;
    const matchesStat = filterStatus === 'All' || fb.status === filterStatus;

    return matchesSearch && matchesCat && matchesSent && matchesPri && matchesSrv && matchesStat;
  });

  const handleAddNote = (id: string) => {
    if (!newNoteText.trim()) return;
    addFeedbackNote(id, newNoteText.trim());
    setNewNoteText('');
  };

  const uniqueServices = Array.from(new Set(feedbacks.map((f) => f.service_name)));

  return (
    <div className="glass-panel rounded-3xl border border-white/80 shadow-md overflow-hidden">
      {/* Search and Advanced Filters */}
      <div className="p-6 border-b border-indigo-100/60 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Full Feedback Log</span>
            </div>
            <h3 className="text-base font-bold text-neutral-950">Feedback Management Console</h3>
            <p className="text-xs text-neutral-500">
              Inspect raw and AI-refined customer submissions, assign statuses, and record team investigations.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full self-start md:self-auto tabular-nums">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
          </span>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Search */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feedback text, user or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 glass-input rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Service */}
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1.5 text-neutral-700 focus:outline-none text-xs font-medium"
          >
            <option value="All">All Services</option>
            {uniqueServices.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1.5 text-neutral-700 focus:outline-none text-xs font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Product">Product</option>
            <option value="Service">Service</option>
            <option value="Support">Support</option>
            <option value="Payment">Payment</option>
            <option value="Delivery">Delivery</option>
            <option value="User Interface">User Interface</option>
            <option value="Performance">Performance</option>
            <option value="Other">Other</option>
          </select>

          {/* Sentiment */}
          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1.5 text-neutral-700 focus:outline-none text-xs font-medium"
          >
            <option value="All">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Neutral">Neutral</option>
            <option value="Mixed">Mixed</option>
          </select>

          {/* Priority */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="glass-input rounded-xl px-2.5 py-1.5 text-neutral-700 focus:outline-none text-xs font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Feedbacks Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-indigo-50/40 border-b border-indigo-100/60 text-neutral-600 font-bold uppercase tracking-wider text-2xs">
            <tr>
              <th className="py-3 px-5">Service & Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Feedback Summary</th>
              <th className="py-3 px-4">Sentiment</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50/60">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((fb) => {
                const isExpanded = expandedId === fb.id;
                return (
                  <React.Fragment key={fb.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : fb.id)}
                      className="hover:bg-white/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="font-bold text-neutral-900">{fb.service_name}</div>
                        <div className="text-2xs text-neutral-400 font-mono tabular-nums">
                          {new Date(fb.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {fb.is_anonymous ? (
                          <span className="text-neutral-500 text-2xs italic flex items-center gap-1">
                            <Shield className="w-3 h-3 text-neutral-400" />
                            Anonymous
                          </span>
                        ) : (
                          <span className="font-semibold text-neutral-800">{fb.user_name || 'Customer'}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-neutral-900 tabular-nums bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                          ★ {fb.rating}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-neutral-600 font-medium">
                        {fb.category}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="truncate text-neutral-900 font-medium">
                          {fb.ai_summary || fb.raw_text}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                            fb.sentiment === 'Positive'
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : fb.sentiment === 'Negative'
                              ? 'text-rose-700 bg-rose-50 border border-rose-200'
                              : 'text-amber-700 bg-amber-50 border border-amber-200'
                          }`}
                        >
                          {fb.sentiment}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-2xs font-bold px-2.5 py-0.5 rounded-full ${
                            fb.priority === 'Critical'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : fb.priority === 'High'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {fb.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={fb.status}
                          onChange={(e) =>
                            updateFeedbackStatus(fb.id, e.target.value as FeedbackStatus)
                          }
                          className="text-2xs glass-input rounded-lg px-2.5 py-1 font-semibold focus:outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="investigating">Investigating</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap text-neutral-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 inline-block text-indigo-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 inline-block hover:text-neutral-700" />
                        )}
                      </td>
                    </tr>

                    {/* Expanded Drawer for Details & Internal Team Notes */}
                    {isExpanded && (
                      <tr className="bg-indigo-50/30">
                        <td colSpan={9} className="p-5 border-t border-indigo-100/60">
                          <div className="space-y-4 max-w-4xl mx-auto">
                            {/* Raw vs AI Text Comparison */}
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="p-4 rounded-2xl glass-card border border-white/90 text-xs">
                                <span className="font-bold text-neutral-500 block mb-1">
                                  Raw Customer Text:
                                </span>
                                <p className="text-neutral-800 italic">"{fb.raw_text}"</p>
                              </div>

                              <div className="p-4 rounded-2xl glass-card border border-indigo-200/80 bg-gradient-to-r from-indigo-50/50 to-white text-xs">
                                <span className="font-bold text-indigo-950 flex items-center gap-1.5 mb-1">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>AI Refined Meaning:</span>
                                </span>
                                <p className="text-neutral-900 font-semibold">
                                  "{fb.ai_summary || fb.raw_text}"
                                </p>
                              </div>
                            </div>

                            {/* Tags */}
                            {fb.key_topics && fb.key_topics.length > 0 && (
                              <div className="flex items-center gap-1.5 text-2xs">
                                <span className="font-bold text-neutral-500">Key Topics:</span>
                                {fb.key_topics.map((t, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-0.5 rounded-full bg-white border border-indigo-100 text-indigo-800 font-semibold"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Internal Notes Section */}
                            <div className="pt-2 border-t border-indigo-100/60 space-y-2">
                              <span className="font-bold text-neutral-900 text-xs block">
                                Internal Investigation Notes & Actions:
                              </span>

                              {fb.internal_notes && fb.internal_notes.length > 0 ? (
                                <div className="space-y-1.5">
                                  {fb.internal_notes.map((note, index) => (
                                    <div
                                      key={index}
                                      className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2 shadow-2xs"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                      <span>{note}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-2xs text-neutral-400 italic">
                                  No internal notes added yet.
                                </p>
                              )}

                              {/* Add Note Input */}
                              <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  placeholder="Add an internal note or action taken..."
                                  value={newNoteText}
                                  onChange={(e) => setNewNoteText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddNote(fb.id);
                                  }}
                                  className="flex-1 px-3.5 py-2 glass-input rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddNote(fb.id)}
                                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                                >
                                  Add Note
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-10 text-center text-neutral-400">
                  No feedback items match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
