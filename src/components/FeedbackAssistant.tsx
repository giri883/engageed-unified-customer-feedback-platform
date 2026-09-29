import React, { useState } from 'react';
import { AIAssistResult } from '../services/geminiService';
import { Sparkles, Check, Edit3 } from 'lucide-react';

interface FeedbackAssistantProps {
  originalText: string;
  assistResult: AIAssistResult;
  onApply: (refinedText: string, metadata: { sentiment: any; category: any; priority: any; keyTopics: string[] }) => void;
  onDiscard: () => void;
}

export const FeedbackAssistant: React.FC<FeedbackAssistantProps> = ({
  originalText,
  assistResult,
  onApply,
  onDiscard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(assistResult.polishedText);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Negative':
        return 'text-rose-800 bg-rose-50 border-rose-200';
      case 'Mixed':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      default:
        return 'text-neutral-700 bg-neutral-100 border-neutral-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-rose-800 bg-rose-50 border-rose-200 font-bold';
      case 'High':
        return 'text-amber-800 bg-amber-50 border-amber-200 font-bold';
      case 'Medium':
        return 'text-blue-800 bg-blue-50 border-blue-200 font-semibold';
      default:
        return 'text-neutral-600 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <div className="glass-card bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-white/90 rounded-2xl border border-indigo-200/80 p-4 sm:p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
      {/* Assistant Header */}
      <div className="flex items-center justify-between gap-2 border-b border-indigo-100/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">EngageEd AI Expression Engine</h4>
            <p className="text-2xs text-neutral-500">Refined for constructive clarity while preserving your exact meaning</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold text-indigo-700 hover:text-indigo-950 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isEditing ? 'Preview' : 'Edit Text'}</span>
        </button>
      </div>

      {/* Side-by-side or stacked view */}
      <div className="space-y-3">
        {/* Original Text */}
        <div className="text-xs">
          <span className="font-semibold text-neutral-500 block mb-1">Your Draft:</span>
          <div className="p-3 rounded-xl bg-white/70 border border-neutral-200/80 text-neutral-600 italic">
            "{originalText}"
          </div>
        </div>

        {/* Polished Text */}
        <div className="text-xs">
          <span className="font-bold text-indigo-950 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Polished Feedback:</span>
          </span>

          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={3}
              className="w-full p-3 glass-input rounded-xl text-xs text-neutral-900 font-medium"
            />
          ) : (
            <div className="p-3.5 rounded-xl bg-white border border-indigo-200/90 text-neutral-900 font-medium shadow-2xs leading-relaxed">
              "{editedText}"
            </div>
          )}
        </div>
      </div>

      {/* Detected Signals / Metadata */}
      <div className="pt-2 border-t border-indigo-100/70 flex flex-wrap items-center gap-2 text-2xs">
        <span className="text-neutral-500 font-semibold">Detected Signals:</span>

        {/* Sentiment */}
        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${getSentimentColor(assistResult.sentiment)}`}>
          Sentiment: {assistResult.sentiment}
        </span>

        {/* Category */}
        <span className="px-2.5 py-0.5 rounded-full font-bold bg-white text-neutral-800 border border-neutral-200">
          Category: {assistResult.category}
        </span>

        {/* Priority */}
        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${getPriorityColor(assistResult.priority)}`}>
          Priority: {assistResult.priority}
        </span>

        {/* Key Topics */}
        {assistResult.keyTopics.map((topic, i) => (
          <span key={i} className="px-2 py-0.5 rounded-full bg-white text-indigo-700 font-medium border border-indigo-100">
            #{topic}
          </span>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onDiscard}
          className="px-3.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
        >
          Keep Original
        </button>

        <button
          type="button"
          onClick={() =>
            onApply(editedText, {
              sentiment: assistResult.sentiment,
              category: assistResult.category,
              priority: assistResult.priority,
              keyTopics: assistResult.keyTopics,
            })
          }
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-95"
        >
          <Check className="w-3.5 h-3.5 text-white" />
          <span>Use Polished Version</span>
        </button>
      </div>
    </div>
  );
};
