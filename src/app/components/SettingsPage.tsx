import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  User, Key, CreditCard, Copy, Check, Plus, Trash2,
  Eye, EyeOff, BarChart3, Shield, Crown, Zap, LogOut
} from 'lucide-react';

type Tab = 'account' | 'api' | 'usage' | 'billing';

const USER_ID = 'local-user';

function TabBtn({ id, label, icon: Icon, active, onClick }: any) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
      borderRadius: 8, border: 'none',
      background: active ? 'rgba(124,106,247,0.12)' : 'none',
      color: active ? '#a78bfa' : '#6b6b8a', cursor: 'pointer',
      fontSize: 14, fontWeight: active ? 600 : 400,
      width: '100%', textAlign: 'left', transition: 'all 0.15s',
    }}>
      <Icon size={16} /> {label}
    </button>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [copied, setCopied] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);

  // API keys state
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);

  // Usage state
  const [usage, setUsage] = useState<any>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const loadKeys = async () => {
    setLoadingKeys(true);
    try {
      const res = await fetch(`http://localhost:8000/api/keys/${USER_ID}`);
      if (res.ok) setApiKeys(await res.json());
    } catch { /* ignore */ }
    setLoadingKeys(false);
  };

  const loadUsage = async () => {
    setLoadingUsage(true);
    try {
      const res = await fetch(`http://localhost:8000/api/usage/${USER_ID}`);
      if (res.ok) setUsage(await res.json());
    } catch { /* ignore */ }
    setLoadingUsage(false);
  };

  useEffect(() => {
    if (activeTab === 'api') loadKeys();
    if (activeTab === 'usage') loadUsage();
  }, [activeTab]);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    }).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const createKey = async () => {
    setCreatingKey(true);
    setNewKeyValue(null);
    try {
      const res = await fetch('http://localhost:8000/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: USER_ID }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewKeyValue(data.full_key);
        toast.success('API key created — copy it now, you won\'t see it again');
        loadKeys();
      } else {
        toast.error('Failed to create API key');
      }
    } catch {
      toast.error('Failed to create API key. Check backend connection.');
    }
    setCreatingKey(false);
  };

  const deleteKey = async (keyId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/keys/${keyId}?user_id=${USER_ID}`, { method: 'DELETE' });
      if (res.ok) {
        setApiKeys(prev => prev.filter(k => k.id !== keyId));
        toast.success('API key deleted');
      }
    } catch {
      toast.error('Failed to delete API key');
    }
  };

  const planColor: Record<string, string> = { free: '#6b6b8a', pro: '#7C6AF7', team: '#10b981' };

  return (
    <div style={{ display: 'flex', height: '100%', color: '#e8e8f0', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      {/* Left nav */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '24px 12px', background: 'rgba(10,10,15,0.4)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, paddingLeft: 14 }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TabBtn id="account" label="Account" icon={User} active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
          <TabBtn id="api" label="API Keys" icon={Key} active={activeTab === 'api'} onClick={() => setActiveTab('api')} />
          <TabBtn id="usage" label="Usage" icon={BarChart3} active={activeTab === 'usage'} onClick={() => setActiveTab('usage')} />
          <TabBtn id="billing" label="Billing" icon={CreditCard} active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 24, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'left' }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 36px' }}>

        {/* ===== Account Tab ===== */}
        {activeTab === 'account' && (
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Account Settings</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: 20, background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>AR</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>HafezCode Flutter</div>
                <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 10 }}>hafez@example.com</div>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#c8c8e0', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Change avatar</button>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 7 }}>Display Name</label>
              <input defaultValue="HafezCode Flutter" style={{ width: '100%', background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', color: '#e8e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 7 }}>Email</label>
              <input type="email" defaultValue="hafez@example.com" style={{ width: '100%', background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', color: '#e8e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button style={{ background: '#7C6AF7', border: 'none', color: '#fff', padding: '11px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 36 }}
              onClick={() => toast.success('Settings saved')}>Save Changes</button>
            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Danger Zone</div>
              <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 14 }}>Permanently delete your account and all data.</div>
              <button style={{ background: 'none', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>Delete Account</button>
            </div>
          </div>
        )}

        {/* ===== API Keys Tab ===== */}
        {activeTab === 'api' && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>API Keys</h3>
                <p style={{ fontSize: 14, color: '#6b6b8a' }}>Authenticate with the Brillance API using Bearer tokens.</p>
              </div>
              <button onClick={createKey} disabled={creatingKey} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: creatingKey ? '#4a4a6a' : '#7C6AF7', border: 'none',
                color: '#fff', padding: '9px 18px', borderRadius: 8,
                cursor: creatingKey ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 600,
              }}>
                <Plus size={15} /> {creatingKey ? 'Creating...' : 'New Key'}
              </button>
            </div>

            {/* Show newly created key once */}
            {newKeyValue && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#34d399', marginBottom: 6 }}>🔑 Key created — copy it now</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, padding: '9px 14px', fontSize: 13, fontFamily: 'monospace', color: '#34d399' }}>
                    {newKeyValue}
                  </div>
                  <button onClick={() => copyToClipboard('new', newKeyValue)} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '9px 12px', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {copied === 'new' ? <Check size={14} /> : <Copy size={14} />}
                    {copied === 'new' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize: 12, color: '#6b6b8a', marginTop: 6 }}>This is the only time you'll see the full key.</div>
              </div>
            )}

            {loadingKeys ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#4a4a6a', fontSize: 14 }}>Loading keys...</div>
            ) : apiKeys.length === 0 ? (
              <div style={{ padding: '28px 20px', textAlign: 'center', color: '#6b6b8a', fontSize: 14, background: '#111118', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                No API keys yet. Create one to get started.
              </div>
            ) : apiKeys.map(k => (
              <div key={k.id} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#a78bfa', marginBottom: 2 }}>{k.key_prefix}••••••••</div>
                    <div style={{ fontSize: 12, color: '#6b6b8a' }}>Created {k.created_at ? new Date(k.created_at).toLocaleDateString() : 'recently'} {k.last_used_at ? `· Last used ${new Date(k.last_used_at).toLocaleDateString()}` : ''}</div>
                  </div>
                  <button onClick={() => deleteKey(k.id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, padding: '9px 14px', fontSize: 13, fontFamily: 'monospace', color: '#6b6b8a' }}>
                    {showKey === k.id ? k.key_prefix : k.key_prefix.replace(/./g, '·')}
                  </div>
                  <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b6b8a', padding: '9px 12px', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {showKey === k.id ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}

            <div style={{ background: 'rgba(124,106,247,0.06)', border: '1px solid rgba(124,106,247,0.15)', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 12, marginTop: 8 }}>
              <Shield size={16} color="#a78bfa" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 3 }}>Keep your keys secret</div>
                <div style={{ fontSize: 12, color: '#6b6b8a', lineHeight: 1.6 }}>Never commit API keys to source control. Use environment variables (<code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 3 }}>BRILLANCE_API_KEY</code>) in production.</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Usage Tab ===== */}
        {activeTab === 'usage' && (
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Usage</h3>
            <p style={{ fontSize: 14, color: '#6b6b8a', marginBottom: 24 }}>Your current plan usage and limits.</p>

            {loadingUsage ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#4a4a6a', fontSize: 14 }}>Loading usage...</div>
            ) : usage ? (
              <>
                {/* Plan badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '14px 18px', background: `${planColor[usage.plan] || '#6b6b8a'}10`, border: `1px solid ${planColor[usage.plan] || '#6b6b8a'}20`, borderRadius: 10 }}>
                  <Crown size={18} color={planColor[usage.plan] || '#6b6b8a'} />
                  <span style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>{usage.plan} Plan</span>
                  {usage.plan === 'free' && (
                    <button onClick={() => setActiveTab('billing')} style={{ marginLeft: 'auto', background: '#7C6AF7', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      Upgrade to Pro →
                    </button>
                  )}
                </div>

                {/* Usage bars */}
                <UsageBar label="File Imports" used={usage.imports_this_month} limit={usage.imports_limit} period="this month" color="#a78bfa" />
                <UsageBar label="AI Generations" used={usage.generations_today} limit={usage.generations_limit} period="today" color="#34d399" />
                <UsageBar label="Saved Components" used={0} limit={50} period="total" color="#60a5fa" />
                <UsageBar label="Design Systems" used={0} limit={3} period="total" color="#f472b6" />

                <div style={{ fontSize: 12, color: '#4a4a6a', marginTop: 20 }}>
                  Reset date: {usage.reset_date || 'Monthly'}
                </div>
              </>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: '#6b6b8a', fontSize: 14 }}>
                Unable to load usage data. Make sure the backend is running.
              </div>
            )}
          </div>
        )}

        {/* ===== Billing Tab ===== */}
        {activeTab === 'billing' && (
          <div style={{ maxWidth: 680 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Billing & Plans</h3>

            <div style={{ background: 'linear-gradient(135deg, rgba(124,106,247,0.12), rgba(124,106,247,0.04))', border: '1px solid rgba(124,106,247,0.3)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(124,106,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={22} color="#a78bfa" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>Free Plan</span>
                  <span style={{ background: 'rgba(124,106,247,0.2)', color: '#a78bfa', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>CURRENT</span>
                </div>
                <div style={{ fontSize: 13, color: '#6b6b8a' }}>3 imports/month · 10 AI generations/day</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#7C6AF7', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Crown size={14} /> Upgrade to Pro
                </button>
              </div>
            </div>

            {/* Plan comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
              {[{ id: 'free', name: 'Free', price: '$0/mo', color: '#6b6b8a', current: true },
                { id: 'pro', name: 'Pro', price: '$19/mo', color: '#7C6AF7', current: false },
              ].map(p => (
                <div key={p.id} style={{ background: p.current ? `${p.color}10` : '#111118', border: `1px solid ${p.current ? `${p.color}30` : 'rgba(255,255,255,0.06)'}`, borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.current ? p.color : '#c8c8e0', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#e8e8f0', marginBottom: 12 }}>{p.price}</div>
                  {p.current && <div style={{ fontSize: 12, color: p.color, background: `${p.color}15`, borderRadius: 100, padding: '2px 10px', display: 'inline-block' }}>Current plan</div>}
                  <div style={{ marginTop: 12, fontSize: 12, color: '#6b6b8a', lineHeight: 1.8 }}>
                    {p.id === 'free' ? (
                      <>• 3 imports/month<br />• 10 AI generations/day<br />• 50 saved components<br />• 3 design systems</>
                    ) : (
                      <>• Unlimited imports<br />• 500 AI generations/day<br />• Unlimited components<br />• Unlimited design systems<br />• Priority support</>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stripe placeholder */}
            <div style={{ padding: '20px', background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, textAlign: 'center' }}>
              <CreditCard size={20} color="#4a4a6a" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, color: '#6b6b8a' }}>
                Stripe billing integration coming soon. You'll be able to manage your subscription and payment methods here.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UsageBar({ label, used, limit, period, color }: { label: string; used: number; limit: number; period: string; color: string }) {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const remaining = isUnlimited ? 'Unlimited' : Math.max(limit - used, 0);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: '#6b6b8a' }}>
          <span style={{ color: pct > 80 ? '#f87171' : color }}>{used}</span>
          {isUnlimited ? '' : ` / ${limit}`} <span style={{ color: '#4a4a6a', fontSize: 12 }}>{period}</span>
        </span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
        {!isUnlimited && (
          <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? '#f87171' : color, borderRadius: 3, transition: 'width 0.4s ease' }} />
        )}
      </div>
      {!isUnlimited && (
        <div style={{ fontSize: 11, color: '#4a4a6a', marginTop: 2 }}>
          {remaining > 0 ? `${remaining} remaining` : 'Limit reached — upgrade for more'}
        </div>
      )}
    </div>
  );
}
