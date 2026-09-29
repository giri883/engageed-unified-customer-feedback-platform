import { Service, Feedback, Issue, AIInsights, User } from '../types';

export const CURRENT_USER: User = {
  id: 'usr_c01',
  email: 'alex.rivera@example.com',
  full_name: 'Alex Rivera',
  role: 'customer',
  created_at: '2026-01-15T08:00:00Z',
};

export const ADMIN_USER: User = {
  id: 'usr_adm01',
  email: 'sarah.chen@engaged.io',
  full_name: 'Sarah Chen (Platform Director)',
  role: 'admin',
  created_at: '2025-11-01T08:00:00Z',
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv_food_01',
    name: 'QuickBite',
    slug: 'quickbite',
    logo: 'Utensils',
    website_url: 'https://quickbite.delivery',
    category: 'Food Delivery',
    description: 'Hot meals & groceries delivered in under 30 minutes from top local kitchens.',
    can_embed: true,
    status: 'active',
    rating_avg: 4.1,
    feedback_count: 84,
    sample_app_type: 'food',
  },
  {
    id: 'srv_ecom_02',
    name: 'UrbanCart',
    slug: 'urbancart',
    logo: 'ShoppingBag',
    website_url: 'https://urbancart.shop',
    category: 'E-Commerce',
    description: 'Curated lifestyle, electronics, apparel, and daily essentials with same-day dispatch.',
    can_embed: true,
    status: 'active',
    rating_avg: 4.5,
    feedback_count: 112,
    sample_app_type: 'ecommerce',
  },
  {
    id: 'srv_bank_03',
    name: 'NexaBank',
    slug: 'nexabank',
    logo: 'Landmark',
    website_url: 'https://nexabank.online',
    category: 'Banking',
    description: 'Modern digital banking, multi-currency debit accounts, and automated micro-investing.',
    can_embed: false, // demonstrates graceful external fallback handling for security-restricted services
    status: 'active',
    rating_avg: 3.8,
    feedback_count: 67,
    sample_app_type: 'banking',
  },
  {
    id: 'srv_trav_04',
    name: 'SkyVoyage',
    slug: 'skyvoyage',
    logo: 'Plane',
    website_url: 'https://skyvoyage.travel',
    category: 'Travel',
    description: 'Flight tickets, train bookings, boutique hotels, and automated cancellation protection.',
    can_embed: true,
    status: 'active',
    rating_avg: 4.4,
    feedback_count: 53,
    sample_app_type: 'travel',
  },
  {
    id: 'srv_edu_05',
    name: 'SkillForge',
    slug: 'skillforge',
    logo: 'GraduationCap',
    website_url: 'https://skillforge.academy',
    category: 'Education',
    description: 'Interactive STEM, coding bootcamps, and professional career certification tracks.',
    can_embed: true,
    status: 'active',
    rating_avg: 4.7,
    feedback_count: 95,
    sample_app_type: 'education',
  },
  {
    id: 'srv_hlth_06',
    name: 'PulseCare',
    slug: 'pulsecare',
    logo: 'HeartPulse',
    website_url: 'https://pulsecare.health',
    category: 'Healthcare',
    description: 'Telehealth appointments, e-prescriptions, and continuous health tracker sync.',
    can_embed: false, // demonstrates external medical portal redirect
    status: 'active',
    rating_avg: 4.3,
    feedback_count: 48,
    sample_app_type: 'healthcare',
  },
  {
    id: 'srv_ent_07',
    name: 'StreamWave',
    slug: 'streamwave',
    logo: 'PlaySquare',
    website_url: 'https://streamwave.media',
    category: 'Entertainment',
    description: 'Lossless audio streaming, indie documentaries, and live community podcast sessions.',
    can_embed: true,
    status: 'active',
    rating_avg: 4.2,
    feedback_count: 76,
    sample_app_type: 'entertainment',
  },
  {
    id: 'srv_loc_08',
    name: 'CleanPro',
    slug: 'cleanpro',
    logo: 'Wrench',
    website_url: 'https://cleanpro.services',
    category: 'Local Services',
    description: 'Verified on-demand home cleaning, plumbing, HVAC maintenance, and electrical work.',
    can_embed: true,
    status: 'active',
    rating_avg: 4.0,
    feedback_count: 39,
    sample_app_type: 'local',
  },
];

export const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: 'fb_001',
    service_id: 'srv_food_01',
    service_name: 'QuickBite',
    user_id: 'usr_c01',
    user_name: 'Alex Rivera',
    is_anonymous: false,
    privacy_mode: 'profile',
    rating: 3,
    raw_text: 'delivery romba late ah vandhuchu but food was good',
    ai_summary: 'Overall, the food quality was good, but the delivery was significantly delayed.',
    sentiment: 'Mixed',
    category: 'Delivery',
    priority: 'Medium',
    key_topics: ['Food Quality', 'Delivery Delay'],
    status: 'in_progress',
    internal_notes: ['Assigned to local dispatcher to review driver route timings.'],
    created_at: '2026-09-28T04:12:00Z',
  },
  {
    id: 'fb_002',
    service_id: 'srv_food_01',
    service_name: 'QuickBite',
    is_anonymous: true,
    privacy_mode: 'anonymous',
    rating: 1,
    raw_text: 'Delivery was late by 40 minutes.',
    ai_summary: 'Customer experienced an unacceptable 40-minute delivery delay past the ETA.',
    sentiment: 'Negative',
    category: 'Delivery',
    priority: 'High',
    key_topics: ['Delivery SLA', 'Driver Route'],
    status: 'investigating',
    internal_notes: ['Compensation coupon issued via automated system.'],
    created_at: '2026-09-27T19:45:00Z',
  },
  {
    id: 'fb_003',
    service_id: 'srv_ecom_02',
    service_name: 'UrbanCart',
    user_id: 'usr_c01',
    user_name: 'Alex Rivera',
    is_anonymous: false,
    privacy_mode: 'profile',
    rating: 5,
    raw_text: 'The application interface is very easy to use.',
    ai_summary: 'Customer expressed high satisfaction with the user interface and overall ease of navigation.',
    sentiment: 'Positive',
    category: 'User Interface',
    priority: 'Low',
    key_topics: ['Ease of Use', 'App Navigation'],
    status: 'resolved',
    internal_notes: ['Forwarded as positive design benchmark to Product Design.'],
    created_at: '2026-09-27T14:20:00Z',
  },
  {
    id: 'fb_004',
    service_id: 'srv_bank_03',
    service_name: 'NexaBank',
    is_anonymous: true,
    privacy_mode: 'anonymous',
    rating: 1,
    raw_text: 'Payment failed twice.',
    ai_summary: 'Critical transaction failure occurred repeatedly during card checkout verification.',
    sentiment: 'Negative',
    category: 'Payment',
    priority: 'Critical',
    key_topics: ['Payment Gateway', 'Transaction Failure'],
    status: 'open',
    internal_notes: ['Logged incident with Tier-1 banking gateway provider.'],
    created_at: '2026-09-27T11:05:00Z',
  },
  {
    id: 'fb_005',
    service_id: 'srv_trav_04',
    service_name: 'SkyVoyage',
    user_name: 'Elena Rostova',
    is_anonymous: false,
    privacy_mode: 'profile',
    rating: 5,
    raw_text: 'Customer support solved my issue quickly.',
    ai_summary: 'Customer commended the rapid and effective resolution provided by the support staff.',
    sentiment: 'Positive',
    category: 'Support',
    priority: 'Low',
    key_topics: ['Support Response', 'Problem Resolution'],
    status: 'resolved',
    internal_notes: ['Agent commendation logged.'],
    created_at: '2026-09-26T16:30:00Z',
  },
  {
    id: 'fb_006',
    service_id: 'srv_edu_05',
    service_name: 'SkillForge',
    user_name: 'Priya Nair',
    is_anonymous: false,
    privacy_mode: 'profile',
    rating: 5,
    raw_text: 'Course projects have realistic code repositories. The browser compiler works flawlessly.',
    ai_summary: 'Learner highly values the practical project structures and robust browser-based IDE.',
    sentiment: 'Positive',
    category: 'Product',
    priority: 'Low',
    key_topics: ['Curriculum Quality', 'Browser IDE'],
    status: 'resolved',
    created_at: '2026-09-26T10:15:00Z',
  },
  {
    id: 'fb_007',
    service_id: 'srv_hlth_06',
    service_name: 'PulseCare',
    is_anonymous: true,
    privacy_mode: 'anonymous',
    rating: 4,
    raw_text: 'Doctor was super attentive and reviewed my previous lab reports without rush.',
    ai_summary: 'Positive patient experience regarding physician thoroughness during telehealth consultation.',
    sentiment: 'Positive',
    category: 'Service',
    priority: 'Low',
    key_topics: ['Physician Care', 'Consultation Quality'],
    status: 'resolved',
    created_at: '2026-09-25T17:50:00Z',
  },
  {
    id: 'fb_008',
    service_id: 'srv_ent_07',
    service_name: 'StreamWave',
    is_anonymous: true,
    privacy_mode: 'anonymous',
    rating: 2,
    raw_text: 'Audio stutters whenever I switch between cellular network and home Wi-Fi.',
    ai_summary: 'Playback buffering and stutter occurs during network transition between LTE and Wi-Fi.',
    sentiment: 'Negative',
    category: 'Performance',
    priority: 'High',
    key_topics: ['Audio Streaming', 'Network Handoff'],
    status: 'investigating',
    created_at: '2026-09-25T13:40:00Z',
  },
  {
    id: 'fb_009',
    service_id: 'srv_loc_08',
    service_name: 'CleanPro',
    user_name: 'Marcus Bell',
    is_anonymous: false,
    privacy_mode: 'profile',
    rating: 4,
    raw_text: 'Plumber arrived 10 minutes early and fixed the kitchen leak cleanly.',
    ai_summary: 'Prompt technician arrival and high craftsmanship on residential plumbing repair.',
    sentiment: 'Positive',
    category: 'Service',
    priority: 'Low',
    key_topics: ['Punctuality', 'Workmanship'],
    status: 'resolved',
    created_at: '2026-09-24T09:10:00Z',
  },
  {
    id: 'fb_010',
    service_id: 'srv_ecom_02',
    service_name: 'UrbanCart',
    is_anonymous: true,
    privacy_mode: 'anonymous',
    rating: 3,
    raw_text: 'Returns process is confusing. The courier pickup label is hard to download on iPhone.',
    ai_summary: 'Friction in the product return flow due to mobile PDF label download issues on iOS.',
    sentiment: 'Mixed',
    category: 'User Interface',
    priority: 'Medium',
    key_topics: ['Returns Flow', 'Mobile iOS Download'],
    status: 'open',
    created_at: '2026-09-23T18:00:00Z',
  },
  {
    id: 'fb_011',
    service_id: 'srv_food_01',
    service_name: 'QuickBite',
    user_name: 'David K.',
    is_anonymous: false,
    privacy_mode: 'profile',
    rating: 2,
    raw_text: 'Food arrived cold because the delivery person took two other orders on the opposite side of town.',
    ai_summary: 'Batch delivery routing caused order to arrive lukewarm, degrading food experience.',
    sentiment: 'Negative',
    category: 'Delivery',
    priority: 'High',
    key_topics: ['Multi-order Routing', 'Food Temperature'],
    status: 'in_progress',
    created_at: '2026-09-22T20:15:00Z',
  },
  {
    id: 'fb_012',
    service_id: 'srv_bank_03',
    service_name: 'NexaBank',
    is_anonymous: false,
    privacy_mode: 'hidden_pii',
    rating: 4,
    raw_text: 'Instant virtual debit card creation works wonderfully for online trials.',
    ai_summary: 'Virtual disposable cards feature praised for privacy and effortless creation.',
    sentiment: 'Positive',
    category: 'Product',
    priority: 'Low',
    key_topics: ['Virtual Cards', 'Online Security'],
    status: 'resolved',
    created_at: '2026-09-22T11:45:00Z',
  },
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss_001',
    title: 'Peak-Hour Delivery Delays past Promised ETA',
    category: 'Delivery',
    mentions_count: 28,
    sentiment: 'Negative',
    priority: 'High',
    status: 'in_progress',
    service_id: 'srv_food_01',
    service_name: 'QuickBite',
    sample_feedback_ids: ['fb_001', 'fb_002', 'fb_011'],
    last_detected: '28 Sep 2026',
  },
  {
    id: 'iss_002',
    title: 'Repeated 3D-Secure Payment Verification Timeout',
    category: 'Payment',
    mentions_count: 19,
    sentiment: 'Negative',
    priority: 'Critical',
    status: 'investigating',
    service_id: 'srv_bank_03',
    service_name: 'NexaBank',
    sample_feedback_ids: ['fb_004'],
    last_detected: '27 Sep 2026',
  },
  {
    id: 'iss_003',
    title: 'Network Handoff Audio Stutter on iOS',
    category: 'Performance',
    mentions_count: 12,
    sentiment: 'Negative',
    priority: 'High',
    status: 'open',
    service_id: 'srv_ent_07',
    service_name: 'StreamWave',
    sample_feedback_ids: ['fb_008'],
    last_detected: '25 Sep 2026',
  },
  {
    id: 'iss_004',
    title: 'Mobile PDF Return Label Download Friction',
    category: 'User Interface',
    mentions_count: 8,
    sentiment: 'Mixed',
    priority: 'Medium',
    status: 'open',
    service_id: 'srv_ecom_02',
    service_name: 'UrbanCart',
    sample_feedback_ids: ['fb_010'],
    last_detected: '23 Sep 2026',
  },
  {
    id: 'iss_005',
    title: 'Customer Support Response Time Commendations',
    category: 'Support',
    mentions_count: 34,
    sentiment: 'Positive',
    priority: 'Low',
    status: 'resolved',
    service_id: 'srv_trav_04',
    service_name: 'SkyVoyage',
    sample_feedback_ids: ['fb_005'],
    last_detected: '26 Sep 2026',
  },
];

export const INITIAL_AI_INSIGHTS: AIInsights = {
  generated_at: '2026-09-28T05:30:00Z',
  total_analyzed: 42,
  common_problems: [
    {
      problem: 'Delivery dispatch delays during peak dinner hours (19:00 - 21:30)',
      severity: 'high',
      affected_category: 'Delivery',
    },
    {
      problem: 'Secondary authentication gateway timeout during card transactions',
      severity: 'critical',
      affected_category: 'Payment',
    },
    {
      problem: 'Mobile checkout PDF return label generation on Safari/iOS',
      severity: 'medium',
      affected_category: 'User Interface',
    },
  ],
  frequent_topics: [
    { topic: 'Delivery Speed & ETA', frequency: 31, sentiment_trend: 'negative' },
    { topic: 'Customer Support Quality', frequency: 24, sentiment_trend: 'positive' },
    { topic: 'App Usability & Visual Cleanliness', frequency: 29, sentiment_trend: 'positive' },
    { topic: 'Payment Gateway Reliability', frequency: 17, sentiment_trend: 'negative' },
    { topic: 'Virtual Debit Card Features', frequency: 12, sentiment_trend: 'positive' },
  ],
  emerging_issues: [
    {
      issue: 'Spike in multi-order driver batching complaints in Metro areas',
      detection_date: '28 Sep 2026',
      urgency: 'High',
    },
    {
      issue: 'Recent iOS 19 Safari update causing PDF download blob errors',
      detection_date: '27 Sep 2026',
      urgency: 'Medium',
    },
  ],
  positive_trends: [
    {
      trend: 'Rapid customer support resolution receives 92% 5-star mentions across platforms',
      customer_quote: 'Customer support solved my issue quickly.',
    },
    {
      trend: 'Interface simplicity is universally praised across first-time customers',
      customer_quote: 'The application interface is very easy to use.',
    },
  ],
  areas_requiring_attention: [
    {
      area: 'Payment Gateway Redundancy',
      rationale: 'Transaction failure has an immediate 100% negative impact and prevents conversions.',
      recommendation: 'Implement instant failover to secondary merchant processor upon first timeout.',
    },
    {
      area: 'Driver Routing Dispatch Constraints',
      rationale: 'Batching 3+ orders leads to cold deliveries and 40-minute delays.',
      recommendation: 'Cap peak meal batching to 2 orders within a 1.5-mile radius maximum.',
    },
  ],
  suggested_improvements: [
    {
      title: 'Proactive Delay Alerts with Automated Compensation Voucher',
      impact: 'Reduces negative review propensity by 43% when delays occur',
      effort: 'medium',
    },
    {
      title: 'One-Tap Native Wallet Checkout (Apple Pay / Google Pay)',
      impact: 'Bypasses SMS OTP timeouts, reducing payment dropoffs by ~22%',
      effort: 'quick_win',
    },
    {
      title: 'Universal Return QR Code for Dropoff Without Home Printing',
      impact: 'Eliminates PDF download failures for mobile shoppers',
      effort: 'quick_win',
    },
  ],
};

export const SUPABASE_SQL_SCHEMA = `-- EngageEd Unified Customer Feedback Platform
-- Supabase PostgreSQL Schema with Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT NOT NULL,
  website_url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  can_embed BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  rating_avg NUMERIC(3, 2) DEFAULT 0.0,
  feedback_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Feedback Categories
CREATE TABLE IF NOT EXISTS public.feedback_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT
);

-- 4. User Profiles & Roles
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'business_member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Business Accounts (Connecting businesses to services)
CREATE TABLE IF NOT EXISTS public.business_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'analyst')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Customer Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN DEFAULT false,
  privacy_mode TEXT DEFAULT 'profile' CHECK (privacy_mode IN ('anonymous', 'profile', 'hidden_pii')),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  raw_text TEXT NOT NULL,
  ai_summary TEXT,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('Positive', 'Negative', 'Neutral', 'Mixed')),
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  key_topics TEXT[] DEFAULT '{}',
  screenshot_url TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'in_progress', 'resolved')),
  quick_reaction TEXT CHECK (quick_reaction IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Internal Issue Prioritization
CREATE TABLE IF NOT EXISTS public.feedback_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  mentions_count INTEGER DEFAULT 1,
  sentiment TEXT DEFAULT 'Negative',
  priority TEXT DEFAULT 'High' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'in_progress', 'resolved')),
  last_detected TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Row Level Security Policies (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_issues ENABLE ROW LEVEL SECURITY;

-- Customers can view public services
CREATE POLICY "Public services are readable by all"
  ON public.services FOR SELECT
  USING (status = 'active');

-- Customers can submit feedback
CREATE POLICY "Any authenticated or anonymous user can create feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Customers can view their own non-anonymous feedback
CREATE POLICY "Users can view their own feedback"
  ON public.feedback FOR SELECT
  USING (
    auth.uid() = user_id 
    OR is_anonymous = false
  );

-- Business accounts can view all feedback for their owned services
CREATE POLICY "Businesses can view feedback for their services"
  ON public.feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_accounts ba
      WHERE ba.user_id = auth.uid()
        AND ba.service_id = feedback.service_id
    )
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- Business accounts can update feedback status & notes
CREATE POLICY "Businesses can update feedback status"
  ON public.feedback FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.business_accounts ba
      WHERE ba.user_id = auth.uid()
        AND ba.service_id = feedback.service_id
    )
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
`;
