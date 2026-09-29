import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserRole } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage key for fallback auth persistence
const AUTH_STORAGE_KEY = 'engaged_auth_session_v1';
const USERS_STORAGE_KEY = 'engaged_registered_users_v1';

// Seed initial users for local fallback authentication
const DEFAULT_LOCAL_USERS = [
  {
    id: 'usr_c01',
    email: 'alex.rivera@example.com',
    password: 'password123',
    full_name: 'Alex Rivera',
    role: 'customer' as UserRole,
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr_adm01',
    email: 'sarah.chen@engaged.io',
    password: 'password123',
    full_name: 'Sarah Chen (Platform Director)',
    role: 'admin' as UserRole,
    created_at: '2025-11-01T08:00:00Z',
  },
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_LOCAL_USERS));
      return DEFAULT_LOCAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LOCAL_USERS;
  }
}

function saveStoredUsers(users: any[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export async function authSignIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  // If real Supabase is configured with valid URL & Key
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data?.user) {
        const mappedUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url,
          role: (data.user.user_metadata?.role as UserRole) || 'customer',
          created_at: data.user.created_at,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser));
        return { user: mappedUser, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase auth network error, trying local verification:', err);
    }
  }

  // Realistic Local / Prototype Auth Engine
  // Simulate network roundtrip latency (400-500ms)
  await new Promise((r) => setTimeout(r, 450));

  const trimmedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const found = users.find(
    (u: any) => u.email.toLowerCase() === trimmedEmail && u.password === password
  );

  if (found) {
    const sessionUser: User = {
      id: found.id,
      email: found.email,
      full_name: found.full_name,
      role: found.role || 'customer',
      created_at: found.created_at,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    return { user: sessionUser, error: null };
  }

  // If email exists but password was wrong
  const emailExists = users.some((u: any) => u.email.toLowerCase() === trimmedEmail);
  if (emailExists) {
    return { user: null, error: 'Email or password is incorrect.' };
  }

  // For seamless demo onboarding: if user entered valid email and password >= 6 chars, register them
  if (trimmedEmail.includes('@') && password.length >= 6) {
    const newUser = {
      id: `usr_${Date.now()}`,
      email: trimmedEmail,
      password: password,
      full_name: trimmedEmail.split('@')[0].replace('.', ' '),
      role: 'customer' as UserRole,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    saveStoredUsers(users);

    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      created_at: newUser.created_at,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
    return { user: sessionUser, error: null };
  }

  return { user: null, error: 'Email or password is incorrect.' };
}

export async function authSignUp(
  fullName: string,
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  // If real Supabase is configured
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'customer',
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data?.user) {
        const mappedUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName,
          role: 'customer',
          created_at: data.user.created_at,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser));
        return { user: mappedUser, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase signUp error, continuing to local fallback:', err);
    }
  }

  // Realistic Local / Prototype Auth Engine
  await new Promise((r) => setTimeout(r, 550));

  const trimmedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const existing = users.find((u: any) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return { user: null, error: 'An account with this email already exists. Please Sign In.' };
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email: trimmedEmail,
    password: password,
    full_name: fullName.trim() || trimmedEmail.split('@')[0],
    role: 'customer' as UserRole,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  const sessionUser: User = {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    role: newUser.role,
    created_at: newUser.created_at,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
  return { user: sessionUser, error: null };
}

export async function authSignInWithGoogle(): Promise<{ user: User | null; error: string | null }> {
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) return { user: null, error: error.message };
      return { user: null, error: null };
    } catch (err: any) {
      console.warn('Google OAuth error, using preview mode:', err);
    }
  }

  // Fast preview Google login simulation
  await new Promise((r) => setTimeout(r, 650));
  const googleUser: User = {
    id: `usr_g_${Date.now()}`,
    email: 'google.user@example.com',
    full_name: 'Alex Rivera (Google)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'customer',
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
  return { user: googleUser, error: null };
}

export function authSignOut(): void {
  if (supabase && isSupabaseConfigured) {
    supabase.auth.signOut().catch(console.error);
  }
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getInitialSessionUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
