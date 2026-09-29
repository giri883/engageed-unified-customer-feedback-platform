import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Issue, FeedbackPriority, FeedbackStatus } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Check,
  RotateCcw,
} from 'lucide-react';

export const IssueTable: React.FC = () => {
  const { issues, updateIssueStatus } = useApp();
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = issues.filter((iss) => {
    const matchesPriority = filterPriority === 'All' || iss.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || iss.status === filterStatus;
    const matchesSearch =
      iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.service_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const getPriorityBadge = (priority: FeedbackPriority) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 text-2xs font-extrabold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
            <span>Critical</span>
          </span>
        );
      case 'High':
        return (
          <span className="text-2xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="text-2xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="text-2xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>In Progress</span>
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Investigating</span>
          </span>
        );
      default:
        return (
          <span className="text-2xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
            Open
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/80 shadow-md overflow-hidden">
      {/* Table Header and Controls */}
      <div className="p-6 border-b border-indigo-100/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Prioritization Matrix</span>
          </div>
          <h3 className="text-base font-bold text-neutral-950">Issue Ranking & Auto-Prioritization</h3>
          <p className="text-xs text-neutral-500">
            Ranked by customer frequency, sentiment severity, and affected user volume.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 glass-input rounded-xl text-xs focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="glass-input rounded-xl px-3 py-1.5 text-neutral-700 focus:outline-none text-xs font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input rounded-xl px-3 py-1.5 text-neutral-700 focus:outline-none text-xs font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-indigo-50/40 border-b border-indigo-100/60 text-neutral-600 font-bold uppercase tracking-wider text-2xs">
            <tr>
              <th className="py-3 px-5">Issue & Service</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Mentions</th>
              <th className="py-3 px-4">Sentiment</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50/60">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((iss) => (
                <tr key={iss.id} className="hover:bg-white/80 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-neutral-900 text-xs sm:text-sm">
                      {iss.title}
                    </div>
                    <div className="text-2xs text-neutral-500 mt-0.5">
                      Service: <strong className="text-neutral-700 font-semibold">{iss.service_name}</strong> · Detected: {iss.last_detected}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-neutral-600 font-medium whitespace-nowrap">
                    {iss.category}
                  </td>

                  <td className="py-4 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                      {iss.mentions_count} users
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`text-2xs font-bold ${
                        iss.sentiment === 'Positive'
                          ? 'text-emerald-700'
                          : iss.sentiment === 'Negative'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {iss.sentiment}
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {getPriorityBadge(iss.priority)}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(iss.status)}
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    {iss.status !== 'resolved' ? (
                      <button
                        onClick={() => updateIssueStatus(iss.id, 'resolved')}
                        className="px-3 py-1.5 text-2xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => updateIssueStatus(iss.id, 'open')}
                        className="px-3 py-1.5 text-2xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl transition-all hover:bg-neutral-50 cursor-pointer"
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-neutral-400">
                  No issues found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
