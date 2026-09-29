import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCard } from './ServiceCard';
import { ServiceCategory } from '../types';
import { Search, Compass, Sparkles, Filter, X } from 'lucide-react';

const CATEGORIES: ('All' | ServiceCategory)[] = [
  'All',
  'Food Delivery',
  'E-Commerce',
  'Banking',
  'Travel',
  'Education',
  'Healthcare',
  'Entertainment',
  'Local Services',
];

const getCategoryPillStyle = (cat: 'All' | ServiceCategory, isSelected: boolean) => {
  if (!isSelected) {
    return 'bg-white/80 text-neutral-600 border border-white/80 hover:bg-white hover:text-neutral-900 shadow-2xs';
  }

  switch (cat) {
    case 'Food Delivery':
      return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 font-bold';
    case 'E-Commerce':
      return 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-pink-500/20 font-bold';
    case 'Banking':
      return 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-teal-500/20 font-bold';
    case 'Travel':
      return 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold';
    case 'Education':
      return 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 font-bold';
    case 'Healthcare':
      return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 font-bold';
    case 'Entertainment':
      return 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md shadow-purple-500/20 font-bold';
    case 'Local Services':
      return 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-md shadow-amber-500/20 font-bold';
    default:
      return 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 font-bold';
  }
};

export const ServiceHub: React.FC = () => {
  const { services, openFeedbackModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ServiceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && service.status === 'active';
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner / Heading */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 text-xs font-semibold text-indigo-900 shadow-xs mb-2">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Unified Access Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Service Hub
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Access participating applications directly or share stress-free feedback at any time during your experience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openFeedbackModal()}
              className="text-xs sm:text-sm font-semibold text-neutral-800 bg-white/90 hover:bg-white border border-indigo-200/80 hover:border-indigo-400 px-4 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              Direct Feedback Form
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services by name, category or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 glass-input rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills/Tabs (Interactive Filter Controls with distinct subtle gradients) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${getCategoryPillStyle(
                cat,
                selectedCategory === cat
              )}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Services */}
      {filteredServices.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/80 p-8 shadow-sm">
          <Filter className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-950 mb-1">No services match your filter</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query or select "All" categories to view all participating services.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transition-all shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
