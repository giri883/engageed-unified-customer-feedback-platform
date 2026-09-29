import React, { useState } from 'react';
import { SUPABASE_SQL_SCHEMA } from '../data/mockData';
import { Database, Copy, Check, ShieldCheck, Key, Server, Lock } from 'lucide-react';

export const SupabaseViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tables = [
    {
      name: 'services',
      description: 'Participating web apps and services eligible for customer feedback.',
      columns: ['id (UUID)', 'name', 'slug', 'category', 'website_url', 'can_embed', 'rating_avg'],
    },
    {
      name: 'feedback',
      description: 'Customer feedback submissions with raw text, AI summary, sentiment, and priority.',
      columns: ['id (UUID)', 'service_id (FK)', 'user_id (FK)', 'rating', 'raw_text', 'ai_summary', 'sentiment', 'category', 'priority', 'status'],
    },
    {
      name: 'feedback_issues',
      description: 'Aggregated prioritized issues classified by frequency, sentiment, and severity.',
      columns: ['id (UUID)', 'service_id (FK)', 'title', 'category', 'mentions_count', 'priority', 'status'],
    },
    {
      name: 'business_accounts',
      description: 'Connects business staff to the specific services they manage.',
      columns: ['id (UUID)', 'user_id (FK)', 'service_id (FK)', 'role (owner/manager)'],
    },
    {
      name: 'users',
      description: 'User profiles mapped to Supabase auth.users with role management.',
      columns: ['id (UUID FK)', 'email', 'full_name', 'role (customer/admin)'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Supabase PostgreSQL Architecture
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">
            Database Schema & Row Level Security (RLS)
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Production-grade relational schema designed with Row Level Security for privacy enforcement.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'SQL Copied to Clipboard!' : 'Copy Supabase SQL'}</span>
        </button>
      </div>

      {/* RLS Policies Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <h3 className="text-sm font-bold text-neutral-950 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Row Level Security (RLS) Policies</span>
        </h3>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
            <div className="font-semibold text-neutral-900 mb-1">Customer Privacy Policy</div>
            <p className="text-2xs text-neutral-600 leading-relaxed">
              Customers can only query their own non-anonymous submissions. Anonymous submissions hide all PII columns from public view.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
            <div className="font-semibold text-neutral-900 mb-1">Business Multi-Tenant Scoping</div>
            <p className="text-2xs text-neutral-600 leading-relaxed">
              Business accounts can only view and update feedback entries corresponding to their linked service IDs in <code>business_accounts</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
            <div className="font-semibold text-neutral-900 mb-1">Public Anonymous Submissions</div>
            <p className="text-2xs text-neutral-600 leading-relaxed">
              Open <code>INSERT</code> policy enables customers to submit unauthenticated feedback without requiring an intimidating signup flow.
            </p>
          </div>
        </div>
      </div>

      {/* Tables Breakdown Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((t) => (
          <div key={t.name} className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-xs text-neutral-950">{t.name}</span>
              <span className="text-2xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">RLS Enabled</span>
            </div>
            <p className="text-2xs text-neutral-500 mb-3">{t.description}</p>
            <div className="space-y-1">
              {t.columns.map((c, i) => (
                <div key={i} className="text-2xs font-mono text-neutral-700 bg-neutral-50 px-2 py-0.5 rounded">
                  {c}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SQL Migration Script Box */}
      <div className="bg-neutral-950 rounded-2xl p-6 text-neutral-200 overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-neutral-400 ml-2">supabase_migration.sql</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-2xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <pre className="font-mono text-xs overflow-x-auto max-h-80 leading-relaxed text-neutral-300">
          {SUPABASE_SQL_SCHEMA}
        </pre>
      </div>
    </div>
  );
};
