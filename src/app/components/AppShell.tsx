import { useNavigate, useLocation } from 'react-router';
import { ReactNode, useState, useEffect } from 'react';
import {
  Zap, LayoutDashboard, Palette, Settings,
  FolderOpen, Bell, Search, Command, LogOut
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AppShellProps {
  children: ReactNode;
  fullWidth?: boolean;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', path: '/dashboard' },
  { icon: Palette, label: 'Design Systems', path: '/design-system/new' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const PROJECTS = [
  { id: '1', name: 'Noon E-Commerce App', updated: '2h ago', components: 24 },
  { id: '2', name: 'Paystack Dashboard', updated: '1d ago', components: 47 },
  { id: '3', name: 'Grab Mobile UI', updated: '3d ago', components: 31 },
];

export function AppShell({ children, fullWidth }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0f', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{
        width: 240,
        flexShrink: 0,
        background: '#0e0e16',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#e8e8f0', letterSpacing: '-0.02em' }}>Brillance</span>
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 12px 8px' }}>
          <button
            onClick={() => setCmdOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              color: '#4a4a6a',
              fontSize: 13,
            }}
          >
            <Search size={14} />
            <span style={{ flex: 1, textAlign: 'left' }}>Search...</span>
            <div style={{ display: 'flex', gap: 2 }}>
              <kbd style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '1px 5px', fontSize: 11, color: '#4a4a6a' }}>⌘</kbd>
              <kbd style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '1px 5px', fontSize: 11, color: '#4a4a6a' }}>K</kbd>
            </div>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: '8px 8px', flex: 1, overflow: 'auto' }}>
          <div style={{ marginBottom: 20 }}>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 7,
                    border: 'none',
                    background: active ? 'rgba(124,106,247,0.12)' : 'none',
                    color: active ? '#a78bfa' : '#6b6b8a',
                    cursor: 'pointer',
                    fontSize: 14,
                    textAlign: 'left',
                    marginBottom: 2,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e8e8f0'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6b6b8a'; } }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Projects */}
          <div>
            <div style={{ fontSize: 11, color: '#3a3a52', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px', marginBottom: 6 }}>Recent Projects</div>
            {PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(`/project/${p.id}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 10px',
                  borderRadius: 7,
                  border: 'none',
                  background: location.pathname === `/project/${p.id}` ? 'rgba(124,106,247,0.1)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  marginBottom: 2,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = location.pathname === `/project/${p.id}` ? 'rgba(124,106,247,0.1)' : 'none'; }}
              >
                <div style={{ width: 22, height: 22, borderRadius: 5, background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', flexShrink: 0 }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, color: '#c8c8e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#4a4a6a' }}>{p.components} components · {p.updated}</div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* User */}
        <div style={{ padding: '12px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0
              }}>
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
                  : user?.email
                    ? user.email.substring(0, 2).toUpperCase()
                    : 'AR'}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.user_metadata?.full_name || user?.email || 'Amir Al-Rashid'}
                </div>
                <div style={{ fontSize: 11, color: '#4a4a6a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'Pro plan'}
                </div>
              </div>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/login');
              }}
              title="Sign Out"
              style={{
                background: 'none',
                border: 'none',
                color: '#6b6b8a',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b6b8a'; e.currentTarget.style.background = 'none'; }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          height: 52,
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 12,
          background: 'rgba(10,10,15,0.6)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ flex: 1 }} />
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b8a', padding: 6, borderRadius: 6 }}>
            <Bell size={18} />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b6b8a', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Command size={14} />
            Command palette
          </button>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: fullWidth ? 'hidden' : 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
