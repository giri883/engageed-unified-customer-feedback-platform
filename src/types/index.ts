export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type FeedbackSentiment = 'Positive' | 'Negative' | 'Neutral' | 'Mixed';

export type FeedbackCategory =
  | 'Product'
  | 'Service'
  | 'Support'
  | 'Payment'
  | 'Delivery'
  | 'User Interface'
  | 'Performance'
  | 'Other';

export type FeedbackPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type FeedbackStatus = 'open' | 'investigating' | 'in_progress' | 'resolved';

export type PrivacyMode = 'anonymous' | 'profile' | 'hidden_pii';

export type UserRole = 'customer' | 'admin';

export type ServiceCategory =
  | 'Food Delivery'
  | 'E-Commerce'
  | 'Banking'
  | 'Travel'
  | 'Education'
  | 'Healthcare'
  | 'Entertainment'
  | 'Local Services';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website_url: string;
  category: ServiceCategory;
  description: string;
  can_embed: boolean;
  status: 'active' | 'inactive';
  rating_avg: number;
  feedback_count: number;
  sample_app_type: 'food' | 'ecommerce' | 'banking' | 'travel' | 'education' | 'healthcare' | 'entertainment' | 'local';
}

export interface Feedback {
  id: string;
  service_id: string;
  service_name: string;
  user_id?: string;
  user_name?: string;
  is_anonymous: boolean;
  privacy_mode: PrivacyMode;
  rating: FeedbackRating;
  raw_text: string;
  ai_summary?: string;
  sentiment: FeedbackSentiment;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  key_topics: string[];
  screenshot_url?: string;
  quick_reaction?: 'like' | 'dislike';
  status: FeedbackStatus;
  internal_notes?: string[];
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  category: FeedbackCategory;
  mentions_count: number;
  sentiment: FeedbackSentiment;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  service_id?: string;
  service_name: string;
  sample_feedback_ids: string[];
  last_detected: string;
}

export interface AIInsights {
  generated_at: string;
  total_analyzed: number;
  common_problems: {
    problem: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    affected_category: string;
  }[];
  frequent_topics: {
    topic: string;
    frequency: number;
    sentiment_trend: 'positive' | 'negative' | 'mixed';
  }[];
  emerging_issues: {
    issue: string;
    detection_date: string;
    urgency: string;
  }[];
  positive_trends: {
    trend: string;
    customer_quote: string;
  }[];
  areas_requiring_attention: {
    area: string;
    rationale: string;
    recommendation: string;
  }[];
  suggested_improvements: {
    title: string;
    impact: string;
    effort: 'quick_win' | 'medium' | 'strategic';
  }[];
}
