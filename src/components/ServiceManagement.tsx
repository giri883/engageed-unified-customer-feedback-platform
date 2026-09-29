import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import {
  Plus,
  Globe,
  MonitorCheck,
  ShieldAlert,
  Check,
  Building2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Food Delivery',
  'E-Commerce',
  'Banking',
  'Travel',
  'Education',
  'Healthcare',
  'Entertainment',
  'Local Services',
];

export const ServiceManagement: React.FC = () => {
  const { services, addService, toggleServiceStatus } = useApp();
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Food Delivery');
  const [description, setDescription] = useState('');
  const [canEmbed, setCanEmbed] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !websiteUrl.trim()) return;

    addService({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
      logo: 'Globe',
      website_url: websiteUrl.trim(),
      category,
      description: description.trim() || `Official ${category} service on EngageEd.`,
      can_embed: canEmbed,
      status: 'active',
      sample_app_type: 'ecommerce',
    });

    setName('');
    setWebsiteUrl('');
    setDescription('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-950">
            Participating Service Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure participating external apps, websites, embedding availability, and public status.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Close Form' : 'Register New Service'}</span>
        </button>
      </div>

      {/* Add Service Modal/Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4 animate-in fade-in"
        >
          <h3 className="text-sm font-bold text-neutral-950">Register New Service Partner</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Service Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Fresh Express"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Service Website URL *
              </label>
              <input
                type="url"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
              >
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Embedding Availability
              </label>
              <div className="flex items-center gap-4 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={canEmbed}
                    onChange={() => setCanEmbed(true)}
                    className="accent-neutral-900"
                  />
                  <span>Supports Embedded Browser</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={!canEmbed}
                    onChange={() => setCanEmbed(false)}
                    className="accent-neutral-900"
                  />
                  <span>External Launch Only (CSP/Security)</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this service provide to customers?"
              className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
            >
              Save Service
            </button>
          </div>
        </form>
      )}

      {/* Services List Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Website URL</th>
                <th className="py-3 px-4">Embedding Policy</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Reviews</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-neutral-950 whitespace-nowrap">
                    {srv.name}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 whitespace-nowrap">{srv.category}</td>
                  <td className="py-3.5 px-4 font-mono text-neutral-500 text-2xs truncate max-w-xs">
                    {srv.website_url}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {srv.can_embed ? (
                      <span className="inline-flex items-center gap-1 text-2xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        <MonitorCheck className="w-3 h-3 text-emerald-600" />
                        Embedded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-2xs text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        External Tab
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                    ★ {srv.rating_avg.toFixed(1)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-600 tabular-nums whitespace-nowrap">
                    {srv.feedback_count}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded ${
                        srv.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {srv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => toggleServiceStatus(srv.id)}
                      className={`text-2xs font-semibold px-2.5 py-1 rounded transition-colors ${
                        srv.status === 'active'
                          ? 'text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {srv.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
