import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from './supabase';
import { apiJson, API_BASE } from './api';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ needsVerification: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  verifyEmail: (token: string) => Promise<{ error?: string }>;
  resendVerification: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Try to restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('brillance_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.token) {
          setUser(parsed.user);
        }
      } catch { /* ignore invalid stored data */ }
    }
    setLoading(false);
  }, []);

  const persistSession = (user: AuthUser, token: string) => {
    localStorage.setItem('brillance_auth', JSON.stringify({ user, token }));
  };

  const clearSession = () => {
    localStorage.removeItem('brillance_auth');
    setUser(null);
  };

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { needsVerification: false, error: data.detail || 'Signup failed' };
      }
      // If email verification is required, user gets a token but email_verified is false
      if (data.user && data.access_token) {
        const u: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          email_verified: data.user.email_verified,
        };
        setUser(u);
        persistSession(u, data.access_token);
        if (!data.user.email_verified) {
          toast.success('Account created! Check your email to verify.');
          return { needsVerification: true };
        }
        return { needsVerification: false };
      }
      return { needsVerification: false, error: 'Unexpected response' };
    } catch (err: any) {
      return { needsVerification: false, error: err.message || 'Network error' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.detail || 'Sign in failed' };
      }
      const u: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        email_verified: data.user.email_verified,
      };
      setUser(u);
      persistSession(u, data.access_token);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Network error' };
    }
  }, []);

  const signOut = useCallback(async () => {
    clearSession();
    navigate('/login');
    toast.success('Signed out');
  }, [navigate]);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.detail || 'Verification failed' };
      }
      const u: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        email_verified: true,
      };
      setUser(u);
      persistSession(u, data.access_token);
      toast.success('Email verified!');
      return {};
    } catch (err: any) {
      return { error: err.message || 'Network error' };
    }
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.detail || 'Failed to resend' };
      }
      toast.success('Verification email sent!');
      return {};
    } catch (err: any) {
      return { error: err.message || 'Network error' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, verifyEmail, resendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
