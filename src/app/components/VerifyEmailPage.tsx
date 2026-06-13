import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Zap, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { apiJson } from '../lib/api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setError('No verification token provided.');
      return;
    }
    apiJson('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }).then(() => {
      setStatus('success');
      // Redirect to login with success message after 2 seconds
      setTimeout(() => navigate('/login?verified=1'), 1500);
    }).catch((err) => {
      setStatus('error');
      setError(err.message || 'Verification failed');
    });
  }, []);

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
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(124,106,247,0.3)',
            margin: '0 auto 10px',
          }}>
            <Zap size={22} color="#fff" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#e8e8f0', letterSpacing: '-0.02em' }}>Brillance</span>
        </div>

        <div style={{
          background: '#111118',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: 48,
        }}>
          {status === 'loading' && (
            <>
              <Loader2 size={40} color="#7C6AF7" style={{ marginBottom: 16, animation: 'spin 0.8s linear infinite' }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0', marginBottom: 8 }}>Verifying your email...</h2>
              <p style={{ fontSize: 14, color: '#6b6b8a' }}>Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 size={48} color="#22c55e" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0', marginBottom: 8 }}>Email verified!</h2>
              <p style={{ fontSize: 14, color: '#6b6b8a', marginBottom: 24 }}>
                Redirecting you to sign in...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0', marginBottom: 8 }}>Verification failed</h2>
              <p style={{ fontSize: 14, color: '#ef4444', marginBottom: 24 }}>{error}</p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: '#7C6AF7',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 32px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
