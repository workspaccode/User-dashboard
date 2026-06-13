import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Zap, Mail, Lock, User, Chrome, ArrowRight, Eye, EyeOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export function AuthPage({ mode: initialMode }: AuthPageProps) {
  const navigate = useNavigate();
  const { signUp, signIn, resendVerification, user } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [searchParams] = useSearchParams();
  const justVerified = searchParams.get('verified') === '1';

  useEffect(() => {
    if (user && !needsVerification) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, needsVerification, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'signup') {
        if (!form.name.trim()) {
          setErrorMessage('Full name is required');
          setLoading(false);
          return;
        }
        const result = await signUp(form.email, form.password, form.name);
        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.needsVerification) {
          setNeedsVerification(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        const result = await signIn(form.email, form.password);
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    const result = await resendVerification(form.email);
    if (result.error) setErrorMessage(result.error);
    setLoading(false);
  };

  // Verification screen
  if (needsVerification) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        padding: 24,
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(124,106,247,0.3)',
              }}>
                <Zap size={22} color="#fff" />
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#e8e8f0', letterSpacing: '-0.02em' }}>Brillance</span>
            </button>
          </div>

          <div style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: 36,
            textAlign: 'center',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(124,106,247,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle2 size={28} color="#7C6AF7" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, color: '#e8e8f0' }}>
              Check your email
            </h2>
            <p style={{ fontSize: 14, color: '#6b6b8a', marginBottom: 8, lineHeight: 1.5 }}>
              We sent a verification link to <strong style={{ color: '#a89bfa' }}>{form.email}</strong>
            </p>
            <p style={{ fontSize: 13, color: '#4a4a6a', marginBottom: 28 }}>
              Click the link in the email to activate your account, then sign in.
            </p>

            {errorMessage && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: '#ef4444',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleResend}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8e8f0',
                padding: '11px 24px',
                borderRadius: 10,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 20,
              }}
            >
              {loading ? (
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <RefreshCw size={16} />
              )}
              Resend email
            </button>

            <p style={{ fontSize: 14, color: '#6b6b8a' }}>
              Already verified?{' '}
              <button
                onClick={() => { setNeedsVerification(false); setMode('login'); }}
                style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      padding: 24,
    }}>
      {/* Glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(124,106,247,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(124,106,247,0.3)',
            }}>
              <Zap size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#e8e8f0', letterSpacing: '-0.02em' }}>Brillance</span>
          </button>
        </div>

        {/* Card */}
        <div style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: 36,
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, textAlign: 'center', color: '#e8e8f0' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ fontSize: 14, color: '#6b6b8a', textAlign: 'center', marginBottom: 28 }}>
            {mode === 'login' ? 'Sign in to your Brillance workspace' : 'Start converting designs to Flutter code'}
          </p>

          {justVerified && mode === 'login' && (
            <div style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#22c55e',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Email verified! Sign in to your account.
            </div>
          )}

          {errorMessage && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#ef4444',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              {errorMessage}
            </div>
          )}

          {/* Google OAuth */}
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8e8f0',
              padding: '12px',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 20,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: '#4a4a6a' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 6 }}>Full name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#4a4a6a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Amir Al-Rashid"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{
                      width: '100%',
                      background: '#1a1a28',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      padding: '11px 14px 11px 42px',
                      color: '#e8e8f0',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 6 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#4a4a6a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="amir@company.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{
                    width: '100%',
                    background: '#1a1a28',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    padding: '11px 14px 11px 42px',
                    color: '#e8e8f0',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, color: '#a89bfa' }}>Password</label>
                {mode === 'login' && (
                  <button type="button" style={{ background: 'none', border: 'none', color: '#7C6AF7', fontSize: 13, cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#4a4a6a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{
                    width: '100%',
                    background: '#1a1a28',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    padding: '11px 42px 11px 42px',
                    color: '#e8e8f0',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4a4a6a' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: loading ? 'rgba(124,106,247,0.5)' : '#7C6AF7',
                border: 'none',
                color: '#fff',
                padding: '13px',
                borderRadius: 10,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 15,
                fontWeight: 600,
                transition: 'background 0.2s',
              }}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b6b8a', marginTop: 20 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#4a4a6a', marginTop: 20 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
