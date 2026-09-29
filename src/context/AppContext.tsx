import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Service,
  Feedback,
  Issue,
  AIInsights,
  User,
  UserRole,
  FeedbackStatus,
  FeedbackRating,
  FeedbackSentiment,
  FeedbackCategory,
  FeedbackPriority,
  PrivacyMode,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_FEEDBACKS,
  INITIAL_ISSUES,
  INITIAL_AI_INSIGHTS,
  CURRENT_USER,
  ADMIN_USER,
} from '../data/mockData';
import { generateAIInsights } from '../services/geminiService';
import { ambientAudioEngine } from '../utils/ambientAudioEngine';

export type AppView = 'landing' | 'services' | 'history' | 'business_dashboard' | 'signin' | 'signup';

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  services: Service[];
  feedbacks: Feedback[];
  issues: Issue[];
  aiInsights: AIInsights;
  isGeneratingInsights: boolean;
  activeServiceForFeedback: Service | null;
  isFeedbackModalOpen: boolean;
  activeEmbeddedService: Service | null;
  notification: { message: string; type: 'success' | 'info' } | null;
  openFeedbackModal: (service?: Service) => void;
  closeFeedbackModal: () => void;
  openEmbeddedService: (service: Service) => void;
  closeEmbeddedService: () => void;
  showNotification: (message: string, type?: 'success' | 'info') => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  addFeedback: (data: {
    serviceId: string;
    rating: FeedbackRating;
    rawText: string;
    aiSummary?: string;
    sentiment: FeedbackSentiment;
    category: FeedbackCategory;
    priority: FeedbackPriority;
    keyTopics: string[];
    isAnonymous: boolean;
    privacyMode: PrivacyMode;
    screenshotUrl?: string;
    quickReaction?: 'like' | 'dislike';
  }) => Promise<Feedback>;
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  addFeedbackNote: (id: string, note: string) => void;
  updateIssueStatus: (id: string, status: FeedbackStatus) => void;
  addService: (service: Omit<Service, 'id' | 'rating_avg' | 'feedback_count'>) => void;
  toggleServiceStatus: (id: string) => void;
  ambientSentiment: 'positive' | 'neutral' | 'negative' | 'default';
  setAmbientSentiment: (sentiment: 'positive' | 'neutral' | 'negative' | 'default') => void;
  isAuthSubmitting: boolean;
  setIsAuthSubmitting: (submitting: boolean) => void;
  feedbackSuccessActive: boolean;
  setFeedbackSuccessActive: (active: boolean) => void;
  wallpaperEvent: { type: 'feedback_submitted' | 'login_success' | 'none'; timestamp: number; origin?: { x: number; y: number } };
  triggerWallpaperEvent: (type: 'feedback_submitted' | 'login_success', origin?: { x: number; y: number }) => void;
  hasFeedbackSubmitted: boolean;
  musicActive: boolean;
  startAmbientMusic: () => void;
  stopAmbientMusic: () => void;
  refreshAIInsights: () => Promise<void>;
  resetToDemoData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'engaged_platform_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default to initial data
  const [userRole, setUserRoleState] = useState<UserRole>('customer');
  const [currentView, setCurrentView] = useState<AppView>('landing');

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}feedbacks`);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}issues`);
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [aiInsights, setAiInsights] = useState<AIInsights>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}insights`);
    return saved ? JSON.parse(saved) : INITIAL_AI_INSIGHTS;
  });

  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [activeServiceForFeedback, setActiveServiceForFeedback] = useState<Service | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeEmbeddedService, setActiveEmbeddedService] = useState<Service | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}feedbacks`, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}issues`, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}insights`, JSON.stringify(aiInsights));
  }, [aiInsights]);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user`);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}is_auth`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [ambientSentiment, setAmbientSentiment] = useState<'positive' | 'neutral' | 'negative' | 'default'>('default');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState<boolean>(false);
  const [feedbackSuccessActive, setFeedbackSuccessActive] = useState<boolean>(false);
  const [wallpaperEvent, setWallpaperEvent] = useState<{
    type: 'feedback_submitted' | 'login_success' | 'none';
    timestamp: number;
    origin?: { x: number; y: number };
  }>({ type: 'none', timestamp: 0 });

  const [hasFeedbackSubmitted, setHasFeedbackSubmitted] = useState<boolean>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}feedback_submitted_once`) === 'true';
  });
  const [musicActive, setMusicActive] = useState<boolean>(false);

  const startAmbientMusic = () => {
    setMusicActive(true);
  };

  const stopAmbientMusic = () => {
    setMusicActive(false);
  };

  const triggerWallpaperEvent = (type: 'feedback_submitted' | 'login_success', origin?: { x: number; y: number }) => {
    setWallpaperEvent({ type, timestamp: Date.now(), origin });
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    const updatedUser = role === 'admin' ? ADMIN_USER : CURRENT_USER;
    setCurrentUser(updatedUser);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user`, JSON.stringify(updatedUser));
    if (role === 'admin' && currentView !== 'business_dashboard') {
      setCurrentView('business_dashboard');
    } else if (role === 'customer' && currentView === 'business_dashboard') {
      setCurrentView('services');
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 700));
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
    const namePrefix = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = namePrefix.replace(/\b\w/g, (c) => c.toUpperCase()) || 'EngageEd Member';
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      full_name: formattedName,
      role,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(user);
    setUserRoleState(role);
    setIsAuthenticated(true);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user`, JSON.stringify(user));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}is_auth`, JSON.stringify(true));
    triggerWallpaperEvent('login_success');
    showNotification(`Welcome back, ${user.full_name}!`, 'success');
    return { success: true };
  };

  const signUp = async (fullName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 800));
    if (!fullName.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      full_name: fullName.trim(),
      role,
      created_at: new Date().toISOString(),
    };
    setCurrentUser(user);
    setUserRoleState(role);
    setIsAuthenticated(true);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user`, JSON.stringify(user));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}is_auth`, JSON.stringify(true));
    triggerWallpaperEvent('login_success');
    showNotification(`Account created! Welcome to EngageEd, ${user.full_name}.`, 'success');
    return { success: true };
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 750));
    const user: User = {
      id: `usr_g_${Date.now()}`,
      email: 'alex.rivera@gmail.com',
      full_name: 'Alex Rivera',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    setCurrentUser(user);
    setUserRoleState('customer');
    setIsAuthenticated(true);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user`, JSON.stringify(user));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}is_auth`, JSON.stringify(true));
    triggerWallpaperEvent('login_success');
    showNotification('Signed in with Google successfully!', 'success');
    return { success: true };
  };

  const signOut = () => {
    setIsAuthenticated(false);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}is_auth`, JSON.stringify(false));
    showNotification('You have been signed out.', 'info');
    setCurrentView('landing');
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const openFeedbackModal = (service?: Service) => {
    if (service) {
      setActiveServiceForFeedback(service);
    } else if (activeEmbeddedService) {
      setActiveServiceForFeedback(activeEmbeddedService);
    } else if (services.length > 0) {
      setActiveServiceForFeedback(services[0]);
    }
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setActiveServiceForFeedback(null);
  };

  const openEmbeddedService = (service: Service) => {
    setActiveEmbeddedService(service);
  };

  const closeEmbeddedService = () => {
    setActiveEmbeddedService(null);
  };

  const addFeedback = async (data: {
    serviceId: string;
    rating: FeedbackRating;
    rawText: string;
    aiSummary?: string;
    sentiment: FeedbackSentiment;
    category: FeedbackCategory;
    priority: FeedbackPriority;
    keyTopics: string[];
    isAnonymous: boolean;
    privacyMode: PrivacyMode;
    screenshotUrl?: string;
    quickReaction?: 'like' | 'dislike';
  }): Promise<Feedback> => {
    const targetService = services.find((s) => s.id === data.serviceId);
    const serviceName = targetService ? targetService.name : 'Participating Service';

    const newFeedback: Feedback = {
      id: `fb_${Date.now()}`,
      service_id: data.serviceId,
      service_name: serviceName,
      user_id: data.isAnonymous ? undefined : currentUser.id,
      user_name: data.isAnonymous
        ? undefined
        : data.privacyMode === 'hidden_pii'
        ? `${currentUser.full_name[0]}. ****`
        : currentUser.full_name,
      is_anonymous: data.isAnonymous,
      privacy_mode: data.privacyMode,
      rating: data.rating,
      raw_text: data.rawText,
      ai_summary: data.aiSummary || data.rawText,
      sentiment: data.sentiment,
      category: data.category,
      priority: data.priority,
      key_topics: data.keyTopics.length > 0 ? data.keyTopics : [data.category],
      screenshot_url: data.screenshotUrl,
      quick_reaction: data.quickReaction,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);

    // Recalculate service statistics
    setServices((prevServices) =>
      prevServices.map((s) => {
        if (s.id === data.serviceId) {
          const currentCount = s.feedback_count;
          const newAvg = Number(
            ((s.rating_avg * currentCount + data.rating) / (currentCount + 1)).toFixed(1)
          );
          return {
            ...s,
            feedback_count: currentCount + 1,
            rating_avg: newAvg,
          };
        }
        return s;
      })
    );

    // If negative or critical issue, automatically correlate or append into issues table
    if (data.rating <= 2 || data.priority === 'Critical' || data.priority === 'High') {
      setIssues((prevIssues) => {
        const existingIdx = prevIssues.findIndex(
          (iss) =>
            iss.service_id === data.serviceId &&
            iss.category === data.category &&
            iss.status !== 'resolved'
        );

        if (existingIdx !== -1) {
          const updated = [...prevIssues];
          const curr = updated[existingIdx];
          updated[existingIdx] = {
            ...curr,
            mentions_count: curr.mentions_count + 1,
            sample_feedback_ids: [newFeedback.id, ...curr.sample_feedback_ids.slice(0, 4)],
            last_detected: 'Just now',
            priority: data.priority === 'Critical' ? 'Critical' : curr.priority,
          };
          return updated;
        } else {
          const newIssue: Issue = {
            id: `iss_${Date.now()}`,
            title: `${data.category} friction reported on ${serviceName}`,
            category: data.category,
            mentions_count: 1,
            sentiment: data.sentiment,
            priority: data.priority,
            status: 'open',
            service_id: data.serviceId,
            service_name: serviceName,
            sample_feedback_ids: [newFeedback.id],
            last_detected: 'Just now',
          };
          return [newIssue, ...prevIssues];
        }
      });
    }

    // Fire celebration confetti for customer encouragement
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0284c7', '#10b981', '#f59e0b', '#6366f1'],
      });
    } catch {
      // Ignored if canvas-confetti unsupported
    }

    // Trigger background live network celebratory effect
    setFeedbackSuccessActive(true);
    triggerWallpaperEvent('feedback_submitted');

    // Start user's uploaded background song under the user click gesture
    setHasFeedbackSubmitted(true);
    setMusicActive(true);
    ambientAudioEngine.startBackgroundMusic();
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}feedback_submitted_once`, 'true');

    setTimeout(() => {
      setFeedbackSuccessActive(false);
    }, 3200);

    showNotification('Feedback submitted successfully. Thank you for making services better!', 'success');
    return newFeedback;
  };

  const updateFeedbackStatus = (id: string, status: FeedbackStatus) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status } : fb))
    );
    showNotification(`Feedback status updated to "${status.replace('_', ' ')}"`, 'info');
  };

  const addFeedbackNote = (id: string, note: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id
          ? { ...fb, internal_notes: [...(fb.internal_notes || []), note] }
          : fb
      )
    );
    showNotification('Internal note added successfully', 'info');
  };

  const updateIssueStatus = (id: string, status: FeedbackStatus) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, status } : iss))
    );
    showNotification(`Issue marked as ${status.replace('_', ' ')}`, 'info');
  };

  const addService = (serviceData: Omit<Service, 'id' | 'rating_avg' | 'feedback_count'>) => {
    const newService: Service = {
      ...serviceData,
      id: `srv_${Date.now()}`,
      rating_avg: 5.0,
      feedback_count: 0,
    };
    setServices((prev) => [newService, ...prev]);
    showNotification(`Service "${newService.name}" registered successfully`, 'success');
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      )
    );
  };

  const refreshAIInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const fresh = await generateAIInsights(feedbacks);
      setAiInsights(fresh);
      showNotification('Generated fresh data-grounded AI insights', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Could not refresh AI insights', 'info');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const resetToDemoData = () => {
    setServices(INITIAL_SERVICES);
    setFeedbacks(INITIAL_FEEDBACKS);
    setIssues(INITIAL_ISSUES);
    setAiInsights(INITIAL_AI_INSIGHTS);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}services`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}feedbacks`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}issues`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}insights`);
    showNotification('Reset platform to rich realistic demo data', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        setUserRole,
        currentView,
        setCurrentView,
        services,
        feedbacks,
        issues,
        aiInsights,
        isGeneratingInsights,
        activeServiceForFeedback,
        isFeedbackModalOpen,
        activeEmbeddedService,
        notification,
        openFeedbackModal,
        closeFeedbackModal,
        openEmbeddedService,
        closeEmbeddedService,
        showNotification,
        isAuthenticated,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        addFeedback,
        updateFeedbackStatus,
        addFeedbackNote,
        updateIssueStatus,
        addService,
        toggleServiceStatus,
        refreshAIInsights,
        resetToDemoData,
        ambientSentiment,
        setAmbientSentiment,
        isAuthSubmitting,
        setIsAuthSubmitting,
        feedbackSuccessActive,
        setFeedbackSuccessActive,
        wallpaperEvent,
        triggerWallpaperEvent,
        hasFeedbackSubmitted,
        musicActive,
        startAmbientMusic,
        stopAmbientMusic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
