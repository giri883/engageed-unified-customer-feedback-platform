import React from 'react';
import { Service } from '../types';
import { useApp } from '../context/AppContext';
import {
  Utensils,
  ShoppingBag,
  Landmark,
  Plane,
  GraduationCap,
  HeartPulse,
  PlaySquare,
  Wrench,
  Globe,
  ExternalLink,
  MessageSquarePlus,
  Star,
  MonitorCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const getCategoryTheme = (category: string) => {
  switch (category) {
    case 'Food Delivery':
      return {
        icon: Utensils,
        iconBg: 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/25',
        cardGradient: 'from-orange-500/10 via-white/80 to-amber-500/5',
        borderHover: 'hover:border-orange-300 hover:shadow-orange-500/15',
        badge: 'text-orange-700 bg-orange-50/80 border-orange-200/80',
      };
    case 'E-Commerce':
      return {
        icon: ShoppingBag,
        iconBg: 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-sm shadow-purple-500/25',
        cardGradient: 'from-purple-500/10 via-white/80 to-pink-500/5',
        borderHover: 'hover:border-pink-300 hover:shadow-pink-500/15',
        badge: 'text-purple-700 bg-purple-50/80 border-purple-200/80',
      };
    case 'Banking':
      return {
        icon: Landmark,
        iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/25',
        cardGradient: 'from-emerald-500/10 via-white/80 to-teal-500/5',
        borderHover: 'hover:border-teal-300 hover:shadow-teal-500/15',
        badge: 'text-teal-700 bg-teal-50/80 border-teal-200/80',
      };
    case 'Travel':
      return {
        icon: Plane,
        iconBg: 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-500/25',
        cardGradient: 'from-blue-500/10 via-white/80 to-cyan-500/5',
        borderHover: 'hover:border-cyan-300 hover:shadow-cyan-500/15',
        badge: 'text-blue-700 bg-blue-50/80 border-blue-200/80',
      };
    case 'Education':
      return {
        icon: GraduationCap,
        iconBg: 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25',
        cardGradient: 'from-indigo-500/10 via-white/80 to-violet-500/5',
        borderHover: 'hover:border-indigo-300 hover:shadow-indigo-500/15',
        badge: 'text-indigo-700 bg-indigo-50/80 border-indigo-200/80',
      };
    case 'Healthcare':
      return {
        icon: HeartPulse,
        iconBg: 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-sm shadow-rose-500/25',
        cardGradient: 'from-rose-500/10 via-white/80 to-pink-500/5',
        borderHover: 'hover:border-rose-300 hover:shadow-rose-500/15',
        badge: 'text-rose-700 bg-rose-50/80 border-rose-200/80',
      };
    case 'Entertainment':
      return {
        icon: PlaySquare,
        iconBg: 'bg-gradient-to-tr from-fuchsia-600 to-purple-600 text-white shadow-sm shadow-fuchsia-500/25',
        cardGradient: 'from-fuchsia-500/10 via-white/80 to-purple-500/5',
        borderHover: 'hover:border-purple-300 hover:shadow-purple-500/15',
        badge: 'text-fuchsia-700 bg-fuchsia-50/80 border-fuchsia-200/80',
      };
    case 'Local Services':
      return {
        icon: Wrench,
        iconBg: 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-sm shadow-amber-500/25',
        cardGradient: 'from-amber-500/10 via-white/80 to-orange-500/5',
        borderHover: 'hover:border-amber-300 hover:shadow-amber-500/15',
        badge: 'text-amber-800 bg-amber-50/80 border-amber-200/80',
      };
    default:
      return {
        icon: Globe,
        iconBg: 'bg-gradient-to-tr from-neutral-700 to-neutral-900 text-white shadow-sm',
        cardGradient: 'from-indigo-500/5 via-white/80 to-purple-500/5',
        borderHover: 'hover:border-indigo-300 hover:shadow-indigo-500/15',
        badge: 'text-neutral-700 bg-neutral-100 border-neutral-200',
      };
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { openEmbeddedService, openFeedbackModal } = useApp();
  const theme = getCategoryTheme(service.category);
  const IconComponent = theme.icon;

  return (
    <div
      className={`group relative glass-card bg-gradient-to-br ${theme.cardGradient} rounded-2xl border border-white/80 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${theme.borderHover} cursor-pointer active:scale-[0.99]`}
      onClick={() => openEmbeddedService(service)}
    >
      <div>
        {/* Header: Dynamic Gradient Icon + Rating */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div
            className={`w-11 h-11 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2`}
          >
            <IconComponent className="w-5 h-5 text-white" />
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-xs font-semibold text-neutral-900 font-mono">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="tabular-nums font-bold">{service.rating_avg.toFixed(1)}</span>
            </div>
            <div className="text-2xs text-neutral-500 tabular-nums">
              {service.feedback_count} reviews
            </div>
          </div>
        </div>

        {/* Category Pill with Soft Gradient Identity */}
        <div className="mb-1.5">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-2xs font-semibold border ${theme.badge}`}
          >
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-neutral-950 mb-1.5 tracking-tight group-hover:text-indigo-950 transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Embedding Availability Note */}
        <div className="flex items-center gap-1.5 text-2xs font-medium text-neutral-500 mb-5">
          {service.can_embed ? (
            <>
              <MonitorCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>In-Platform Browser Ready</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>External Security Gateway</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="pt-3.5 border-t border-white/60 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => openEmbeddedService(service)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-neutral-800 bg-white/90 hover:bg-white rounded-xl transition-all shadow-2xs border border-white hover:border-indigo-200 cursor-pointer"
        >
          <span>Use Service</span>
          {service.can_embed ? (
            <ArrowRight className="w-3 h-3 text-indigo-500 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ExternalLink className="w-3 h-3 text-neutral-500" />
          )}
        </button>

        <button
          onClick={() => openFeedbackModal(service)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all whitespace-nowrap shadow-xs shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer active:scale-95"
          title={`Give feedback for ${service.name}`}
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-cyan-200" />
          <span>Feedback</span>
        </button>
      </div>
    </div>
  );
};
