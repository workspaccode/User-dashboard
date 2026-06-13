import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Mock Supabase Auth for local fallback testing when keys are not defined
class MockSupabaseAuth {
  private listeners: Array<(event: string, session: any) => void> = [];

  constructor() {
    window.addEventListener('storage', () => {
      this.trigger('SIGNED_IN', this.getSessionSync());
    });
  }

  private getSessionSync() {
    const user = localStorage.getItem('brillance_mock_user');
    if (!user) return null;
    return {
      user: JSON.parse(user),
      access_token: 'mock-token',
    };
  }

  async signUp({ email, password, options }: any) {
    await new Promise((r) => setTimeout(r, 600));
    const user = {
      id: 'mock-user-id-' + Math.random().toString(36).substring(2, 11),
      email,
      user_metadata: options?.data || {},
    };
    localStorage.setItem('brillance_mock_user', JSON.stringify(user));
    this.trigger('SIGNED_IN', { user, access_token: 'mock-token' });
    return { data: { user, session: { user, access_token: 'mock-token' } }, error: null };
  }

  async signInWithPassword({ email, password }: any) {
    await new Promise((r) => setTimeout(r, 600));
    const user = {
      id: 'mock-user-id',
      email,
      user_metadata: { full_name: 'Amir Al-Rashid' },
    };
    localStorage.setItem('brillance_mock_user', JSON.stringify(user));
    this.trigger('SIGNED_IN', { user, access_token: 'mock-token' });
    return { data: { user, session: { user, access_token: 'mock-token' } }, error: null };
  }

  async signOut() {
    localStorage.removeItem('brillance_mock_user');
    this.trigger('SIGNED_OUT', null);
    return { error: null };
  }

  async getSession() {
    return { data: { session: this.getSessionSync() }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback);
    const session = this.getSessionSync();
    callback(session ? 'INITIAL_SESSION' : 'SIGNED_OUT', session);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter((l) => l !== callback);
          },
        },
      },
    };
  }

  private trigger(event: string, session: any) {
    this.listeners.forEach((callback) => callback(event, session));
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : ({
    auth: new MockSupabaseAuth(),
  } as any);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. Running in mock fallback mode.'
  );
}
