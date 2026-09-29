import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  FeedbackRating,
  FeedbackCategory,
  FeedbackSentiment,
  FeedbackPriority,
  PrivacyMode,
} from '../types';
import { assistFeedback, AIAssistResult } from '../services/geminiService';
import { FeedbackAssistant } from './FeedbackAssistant';
import {
  X,
  Sparkles,
  Mic,
  MicOff,
  Image as ImageIcon,
  Shield,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Check,
} from 'lucide-react';

const CATEGORIES: FeedbackCategory[] = [
  'Product',
  'Service',
  'Support',
  'Payment',
  'Delivery',
  'User Interface',
  'Performance',
  'Other',
];

const RATING_OPTIONS: {
  rating: FeedbackRating;
  emoji: string;
  label: string;
  activeColor: string;
}[] = [
  {
    rating: 5,
    emoji: '😊',
    label: 'Great',
    activeColor:
      'from-emerald-500/20 to-teal-500/20 border-emerald-400 text-emerald-950 shadow-emerald-500/20 ring-emerald-500',
  },
  {
    rating: 4,
    emoji: '🙂',
    label: 'Good',
    activeColor:
      'from-blue-500/20 to-cyan-500/20 border-blue-400 text-blue-950 shadow-blue-500/20 ring-blue-500',
  },
  {
    rating: 3,
    emoji: '😐',
    label: 'Okay',
    activeColor:
      'from-amber-500/20 to-yellow-500/20 border-amber-400 text-amber-950 shadow-amber-500/20 ring-amber-500',
  },
  {
    rating: 2,
    emoji: '😕',
    label: 'Not Good',
    activeColor:
      'from-orange-500/20 to-rose-500/20 border-orange-400 text-orange-950 shadow-orange-500/20 ring-orange-500',
  },
  {
    rating: 1,
    emoji: '😞',
    label: 'Poor',
    activeColor:
      'from-rose-500/20 to-red-500/20 border-rose-400 text-rose-950 shadow-rose-500/20 ring-rose-500',
  },
];

const QUICK_REASONS = [
  'Fast & reliable',
  'Easy to use',
  'Helpful support',
  'Unexpected delay',
  'Payment problem',
  'Confusing screen',
  'App crashed',
];

export const FeedbackModal: React.FC = () => {
  const {
    isFeedbackModalOpen,
    closeFeedbackModal,
    activeServiceForFeedback,
    services,
    addFeedback,
    setAmbientSentiment,
  } = useApp();

  const [mode, setMode] = useState<'standard' | 'quick'>('standard');

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [rating, setRating] = useState<FeedbackRating>(5);
  const [rawText, setRawText] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<FeedbackCategory>('Service');
  const [privacyMode, setPrivacyMode] =
    useState<PrivacyMode>('profile');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [screenshotUrl, setScreenshotUrl] =
    useState<string | undefined>(undefined);

  // Quick mode
  const [quickReaction, setQuickReaction] =
    useState<'like' | 'dislike'>('like');
  const [quickReason, setQuickReason] = useState<string>('');

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // 🎵 Background music
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // AI Assistant
  const [isAssisting, setIsAssisting] = useState(false);
  const [assistResult, setAssistResult] =
    useState<AIAssistResult | null>(null);
  const [appliedAISummary, setAppliedAISummary] =
    useState<string | undefined>(undefined);
  const [detectedSentiment, setDetectedSentiment] =
    useState<FeedbackSentiment>('Positive');
  const [detectedPriority, setDetectedPriority] =
    useState<FeedbackPriority>('Low');
  const [detectedTopics, setDetectedTopics] =
    useState<string[]>([]);

  // Submitting and success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync selected service
  useEffect(() => {
    if (activeServiceForFeedback) {
      setSelectedServiceId(activeServiceForFeedback.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }

    setShowSuccess(false);
  }, [
    activeServiceForFeedback,
    services,
    isFeedbackModalOpen,
  ]);

  // Ambient background reaction
  useEffect(() => {
    if (rating >= 4) {
      setAmbientSentiment('positive');
    } else if (rating === 3) {
      setAmbientSentiment('neutral');
    } else {
      setAmbientSentiment('negative');
    }

    return () => {
      setAmbientSentiment('default');
    };
  }, [rating, setAmbientSentiment]);

  // Cleanup fade timer
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  if (!isFeedbackModalOpen) return null;

  const currentService =
    services.find((s) => s.id === selectedServiceId) ||
    activeServiceForFeedback ||
    services[0];

  // ============================================================
  // 🎵 START BACKGROUND MUSIC
  // ============================================================

  const startBackgroundMusic = async () => {
    try {
      if (!audioRef.current) {
        const audio = new Audio(
          '/audio/engageed-background.mp3'
        );

        audio.loop = true;
        audio.volume = 0;

        audioRef.current = audio;
      }

      const audio = audioRef.current;

      // If already playing, don't restart it
      if (!audio.paused) {
        return;
      }

      // Start from zero volume
      audio.volume = 0;

      await audio.play();

      // Clear previous fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      let volume = 0;

      // Smooth fade from 0 → 0.30
      fadeIntervalRef.current = setInterval(() => {
        volume += 0.02;

        if (volume >= 0.3) {
          volume = 0.3;

          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        }

        audio.volume = volume;
      }, 150);
    } catch (error) {
      console.warn(
        'Background music could not start:',
        error
      );
    }
  };

  // ============================================================
  // 🎤 VOICE
  // ============================================================

  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';

          for (
            let i = event.resultIndex;
            i < event.results.length;
            ++i
          ) {
            transcript +=
              event.results[i][0].transcript;
          }

          if (transcript) {
            setRawText((prev) =>
              prev
                ? `${prev} ${transcript}`
                : transcript
            );
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();

        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (e) {
        simulateVoiceInput();
      }
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setIsRecording(true);

    setTimeout(() => {
      setRawText((prev) =>
        prev
          ? `${prev} Everything went smoothly, but the order confirmation screen took longer than expected to update.`
          : 'Everything went smoothly, but the order confirmation screen took longer than expected to update.'
      );

      setIsRecording(false);
    }, 2000);
  };

  // ============================================================
  // 📷 IMAGE
  // ============================================================

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // ============================================================
  // ✨ AI ASSIST
  // ============================================================

  const handleAIAssist = async () => {
    if (!rawText.trim()) return;

    setIsAssisting(true);

    try {
      const result = await assistFeedback(
        rawText,
        currentService?.name,
        rating
      );

      setAssistResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAssisting(false);
    }
  };

  const handleApplyAI = (
    refinedText: string,
    metadata: {
      sentiment: FeedbackSentiment;
      category: FeedbackCategory;
      priority: FeedbackPriority;
      keyTopics: string[];
    }
  ) => {
    setAppliedAISummary(refinedText);
    setDetectedSentiment(metadata.sentiment);
    setSelectedCategory(metadata.category);
    setDetectedPriority(metadata.priority);
    setDetectedTopics(metadata.keyTopics);
    setAssistResult(null);
  };

  // ============================================================
  // 🚀 SUBMIT FEEDBACK
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!currentService) return;

    setIsSubmitting(true);

    try {
      // QUICK MODE
      if (mode === 'quick') {
        const text = quickReason
          ? `Quick reaction: ${quickReaction}. Main reason: ${quickReason}`
          : `Customer left a quick ${quickReaction} reaction.`;

        await addFeedback({
          serviceId: currentService.id,
          rating:
            quickReaction === 'like' ? 5 : 2,
          rawText: text,
          aiSummary: text,
          sentiment:
            quickReaction === 'like'
              ? 'Positive'
              : 'Negative',
          category: 'Service',
          priority:
            quickReaction === 'like'
              ? 'Low'
              : 'Medium',
          keyTopics: [
            quickReason || 'Quick Feedback',
          ],
          isAnonymous,
          privacyMode: isAnonymous
            ? 'anonymous'
            : 'profile',
          quickReaction,
        });
      }

      // STANDARD MODE
      else {
        const textToSubmit =
          rawText.trim() ||
          'No additional comment provided.';

        let sentiment = detectedSentiment;
        let priority = detectedPriority;

        if (!appliedAISummary) {
          if (rating >= 4) {
            sentiment = 'Positive';
          } else if (rating <= 2) {
            sentiment = 'Negative';
          } else {
            sentiment = 'Neutral';
          }

          if (rating <= 2) {
            priority = 'High';
          } else {
            priority = 'Low';
          }
        }

        await addFeedback({
          serviceId: currentService.id,
          rating,
          rawText: textToSubmit,
          aiSummary:
            appliedAISummary || textToSubmit,
          sentiment,
          category: selectedCategory,
          priority,
          keyTopics:
            detectedTopics.length > 0
              ? detectedTopics
              : [selectedCategory],
          isAnonymous,
          privacyMode,
          screenshotUrl,
        });
      }

      // ======================================================
      // 🎵 FEEDBACK SUCCESS → START SONG
      // ======================================================

      setShowSuccess(true);

      await startBackgroundMusic();

      // Close success modal after 1.6 seconds
      setTimeout(() => {
        closeFeedbackModal();
        setShowSuccess(false);
      }, 1600);
    } catch (err) {
      console.error(
        'Failed to submit feedback:',
        err
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">

      <div className="w-full max-w-xl glass-panel bg-white/95 rounded-3xl shadow-2xl border border-white/90 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200 relative">

        {/* SUCCESS */}
        {showSuccess ? (
          <div className="py-20 px-8 text-center flex flex-col items-center justify-center space-y-4 animate-in zoom-in-90 duration-300">

            <div className="flex items-center justify-center gap-3 text-2xl">
              <span className="animate-bounce">
                ✨
              </span>

              <span className="animate-float-bob">
                💬
              </span>

              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 animate-pulse">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <span className="animate-float-bob">
                💬
              </span>

              <span className="animate-star-twinkle">
                ⭐
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-neutral-950">
                Feedback Received!
              </h3>

              <p className="text-xs text-neutral-600 max-w-sm">
                Thank you for helping improve the
                experience.
              </p>
            </div>

          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="px-6 py-4 border-b border-indigo-100/70 flex items-center justify-between gap-3 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-white">

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold bg-gradient-to-r from-neutral-950 via-indigo-950 to-purple-950 bg-clip-text text-transparent">
                    Share Your Experience
                  </h2>

                  <span className="text-xs text-neutral-300 font-medium">
                    ·
                  </span>

                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {currentService?.name}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 mt-0.5">
                  Your honest thoughts make services
                  better for everyone.
                </p>
              </div>

              <button
                onClick={closeFeedbackModal}
                className="p-2 text-neutral-400 hover:text-neutral-900 rounded-xl hover:bg-neutral-100/80 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MODE SELECTOR */}
            <div className="px-6 pt-3 pb-2 border-b border-indigo-100/50 flex items-center justify-between bg-white/70 text-xs">

              <div className="flex items-center gap-1 p-0.5 bg-neutral-100/90 rounded-xl">

                <button
                  type="button"
                  onClick={() =>
                    setMode('standard')
                  }
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    mode === 'standard'
                      ? 'bg-white text-neutral-950 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Standard Feedback
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMode('quick')
                  }
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    mode === 'quick'
                      ? 'bg-white text-neutral-950 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  ⚡ 5-Second Quick Mode
                </button>

              </div>

              {services.length > 1 && (
                <select
                  value={selectedServiceId}
                  onChange={(e) =>
                    setSelectedServiceId(
                      e.target.value
                    )
                  }
                  className="text-xs text-neutral-700 bg-white/80 border border-neutral-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {services.map((s) => (
                    <option
                      key={s.id}
                      value={s.id}
                    >
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              )}

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-6"
            >

              {mode === 'quick' ? (
                <div className="space-y-6 py-2">

                  <div className="text-center">
                    <h3 className="text-sm font-bold text-neutral-900 mb-1">
                      How was your quick experience?
                    </h3>

                    <p className="text-xs text-neutral-500">
                      Tap a thumb reaction and optionally
                      select a reason to submit instantly.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-6">

                    <button
                      type="button"
                      onClick={() =>
                        setQuickReaction('like')
                      }
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        quickReaction === 'like'
                          ? 'border-emerald-500 bg-gradient-to-b from-emerald-50 to-white shadow-md shadow-emerald-500/20'
                          : 'border-neutral-200/80 bg-white/80 hover:border-neutral-300'
                      }`}
                    >
                      <ThumbsUp
                        className={`w-9 h-9 transition-transform ${
                          quickReaction === 'like'
                            ? 'text-emerald-600 scale-110'
                            : 'text-neutral-500'
                        }`}
                      />

                      <span className="text-xs font-bold text-neutral-900">
                        Good
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setQuickReaction('dislike')
                      }
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        quickReaction === 'dislike'
                          ? 'border-rose-500 bg-gradient-to-b from-rose-50 to-white shadow-md shadow-rose-500/20'
                          : 'border-neutral-200/80 bg-white/80 hover:border-neutral-300'
                      }`}
                    >
                      <ThumbsDown
                        className={`w-9 h-9 transition-transform ${
                          quickReaction === 'dislike'
                            ? 'text-rose-600 scale-110'
                            : 'text-neutral-500'
                        }`}
                      />

                      <span className="text-xs font-bold text-neutral-900">
                        Needs Work
                      </span>
                    </button>

                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-600 block mb-2 text-center">
                      What was the main reason? (Optional)
                    </label>

                    <div className="flex flex-wrap items-center justify-center gap-2">

                      {QUICK_REASONS.map(
                        (reason) => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() =>
                              setQuickReason(
                                quickReason ===
                                  reason
                                  ? ''
                                  : reason
                              )
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              quickReason ===
                              reason
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                                : 'bg-white/80 text-neutral-700 border border-neutral-200 hover:bg-white'
                            }`}
                          >
                            {reason}
                          </button>
                        )
                      )}

                    </div>
                  </div>

                </div>
              ) : (
                <>
                  {/* RATING */}
                  <div className="space-y-3">

                    <label className="text-sm font-bold text-neutral-950 block">
                      How was your experience?
                    </label>

                    <div className="grid grid-cols-5 gap-2">

                      {RATING_OPTIONS.map(
                        (opt) => {
                          const isSelected =
                            rating === opt.rating;

                          return (
                            <button
                              key={opt.rating}
                              type="button"
                              onClick={() =>
                                setRating(
                                  opt.rating
                                )
                              }
                              className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 group ${
                                isSelected
                                  ? `bg-gradient-to-b ${opt.activeColor} ring-2 ring-offset-2 scale-105 shadow-md font-bold`
                                  : 'bg-white/80 border-neutral-200/80 text-neutral-700 hover:bg-white hover:border-indigo-200 hover:shadow-sm'
                              }`}
                            >
                              <span className="text-2xl sm:text-3xl leading-none transition-transform group-hover:scale-110">
                                {opt.emoji}
                              </span>

                              <span className="text-2xs font-semibold truncate max-w-full">
                                {opt.label}
                              </span>
                            </button>
                          );
                        }
                      )}

                    </div>
                  </div>

                  {/* TEXT */}
                  <div className="space-y-2">

                    <label className="text-sm font-bold text-neutral-950 block">
                      What would you like to tell us?
                    </label>

                    <div className="relative">

                      <textarea
                        rows={4}
                        value={rawText}
                        onChange={(e) => {
                          setRawText(
                            e.target.value
                          );

                          if (appliedAISummary) {
                            setAppliedAISummary(
                              undefined
                            );
                          }
                        }}
                        placeholder="Tell us what happened..."
                        className="w-full p-4 glass-input rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 leading-relaxed shadow-xs resize-none"
                      />

                    </div>

                    {/* TOOLS */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">

                      <div className="flex items-center gap-2">

                        {/* VOICE */}
                        <button
                          type="button"
                          onClick={
                            toggleVoiceRecording
                          }
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                            isRecording
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm animate-pulse'
                              : 'bg-white/80 text-neutral-700 hover:text-neutral-950 border border-neutral-200 hover:bg-white'
                          }`}
                          title="Speak feedback"
                        >
                          {isRecording ? (
                            <>
                              <MicOff className="w-3.5 h-3.5 text-rose-600" />
                              <span>
                                Listening...
                              </span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3.5 h-3.5 text-indigo-500" />
                              <span>
                                🎤 Voice
                              </span>
                            </>
                          )}
                        </button>

                        {/* IMAGE */}
                        <label className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/80 text-neutral-700 hover:text-neutral-950 border border-neutral-200 hover:bg-white transition-all cursor-pointer">

                          <ImageIcon className="w-3.5 h-3.5 text-purple-500" />

                          <span>
                            📷 Image
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={
                              handleImageUpload
                            }
                            className="hidden"
                          />

                        </label>

                      </div>

                      {/* AI */}
                      <button
                        type="button"
                        onClick={handleAIAssist}
                        disabled={
                          isAssisting ||
                          !rawText.trim()
                        }
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 ${
                          rawText.trim().length > 3
                            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-sm shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]'
                            : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                        }`}
                        title="Polish text with AI without changing meaning"
                      >
                        {isAssisting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>
                              AI Processing...
                            </span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>
                              ✨ AI Assist
                            </span>
                          </>
                        )}
                      </button>

                    </div>

                    {/* IMAGE PREVIEW */}
                    {screenshotUrl && (
                      <div className="relative rounded-xl border border-neutral-200 overflow-hidden p-2 flex items-center justify-between bg-neutral-50/80 mt-2">

                        <img
                          src={screenshotUrl}
                          alt="Attachment preview"
                          className="h-14 w-20 object-cover rounded-lg"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setScreenshotUrl(
                              undefined
                            )
                          }
                          className="text-xs text-rose-600 hover:underline px-3 font-medium cursor-pointer"
                        >
                          Remove
                        </button>

                      </div>
                    )}

                    {/* AI RESULT */}
                    {assistResult && (
                      <div className="pt-2">

                        <FeedbackAssistant
                          originalText={rawText}
                          assistResult={assistResult}
                          onApply={handleApplyAI}
                          onDiscard={() =>
                            setAssistResult(null)
                          }
                        />

                      </div>
                    )}

                    {/* AI APPLIED */}
                    {appliedAISummary && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2 shadow-2xs mt-2">

                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />

                        <div>
                          <span className="font-bold">
                            AI Structured Feedback:
                          </span>

                          <p className="mt-0.5 italic">
                            "{appliedAISummary}"
                          </p>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* CATEGORY */}
                  <div className="space-y-2">

                    <label className="text-xs font-semibold text-neutral-700 block">
                      Category
                    </label>

                    <div className="flex flex-wrap gap-1.5">

                      {CATEGORIES.map(
                        (cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              setSelectedCategory(
                                cat
                              )
                            }
                            className={`px-3 py-1 text-xs rounded-xl transition-all cursor-pointer ${
                              selectedCategory ===
                              cat
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xs'
                                : 'bg-white/80 text-neutral-700 border border-neutral-200 hover:bg-white'
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      )}

                    </div>
                  </div>

                  {/* PRIVACY */}
                  <div className="p-4 rounded-2xl glass-card border border-indigo-100/70 space-y-3">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <Shield className="w-4 h-4 text-indigo-600" />

                        <span className="text-xs font-bold text-neutral-900">
                          Submit Anonymously
                        </span>

                      </div>

                      <input
                        type="checkbox"
                        id="anon-toggle"
                        checked={isAnonymous}
                        onChange={(e) => {
                          setIsAnonymous(
                            e.target.checked
                          );

                          setPrivacyMode(
                            e.target.checked
                              ? 'anonymous'
                              : 'profile'
                          );
                        }}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                      />

                    </div>

                    <p className="text-2xs text-neutral-500 leading-relaxed">
                      Your feedback helps improve
                      the service.{' '}
                      {isAnonymous
                        ? 'Your identity is 100% hidden.'
                        : 'Only authorized service leads can see your profile.'}
                    </p>

                    {!isAnonymous && (
                      <div className="pt-2 border-t border-indigo-100/60 flex items-center gap-2 text-2xs text-neutral-600">

                        <span className="font-semibold">
                          Privacy Mode:
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setPrivacyMode(
                              'profile'
                            )
                          }
                          className={`px-2.5 py-0.5 rounded-lg transition-all ${
                            privacyMode ===
                            'profile'
                              ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                              : 'bg-white border text-neutral-600'
                          }`}
                        >
                          Full Profile
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setPrivacyMode(
                              'hidden_pii'
                            )
                          }
                          className={`px-2.5 py-0.5 rounded-lg transition-all ${
                            privacyMode ===
                            'hidden_pii'
                              ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                              : 'bg-white border text-neutral-600'
                          }`}
                        >
                          Mask Name (A. ****)
                        </button>

                      </div>
                    )}

                  </div>
                </>
              )}

              {/* FOOTER */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-indigo-100/70">

                <button
                  type="button"
                  onClick={closeFeedbackModal}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>
                        Sending...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Send Feedback
                      </span>

                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};