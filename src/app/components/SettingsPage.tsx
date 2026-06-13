import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Key, CreditCard, Users, Copy, Check, Plus, Trash2,
  Eye, EyeOff, Shield, Bell, LogOut, Crown, Zap
} from 'lucide-react';

type Tab = 'account' | 'api' | 'billing' | 'team';

const INVOICES = [
  { date: 'Jun 1, 2026', amount: '$19.00', plan: 'Pro', status: 'Paid' },
  { date: 'May 1, 2026', amount: '$19.00', plan: 'Pro', status: 'Paid' },
  { date: 'Apr 1, 2026', amount: '$19.00', plan: 'Pro', status: 'Paid' },
  { date: 'Mar 1, 2026', amount: '$0.00', plan: 'Free', status: 'Paid' },
];

const TEAM_MEMBERS = [
  { name: 'Amir Al-Rashid', email: 'amir@noon.com', role: 'Admin', avatar: 'AR', you: true },
  { name: 'Sarah Chen', email: 'sarah@grab.com', role: 'Editor', avatar: 'SC', you: false },
  { name: 'Marcus Osei', email: 'marcus@paystack.com', role: 'Viewer', avatar: 'MO', you: false },
];

const API_KEYS = [
  { id: 'k1', name: 'Production API Key', key: 'bri_live_xK2mNp9...4fRa', created: 'Jun 1, 2026', last: 'Just now' },
  { id: 'k2', name: 'CI/CD Pipeline', key: 'bri_live_qW8vTu3...9bYz', created: 'May 15, 2026', last: '2 days ago' },
];

const PLANS = [
  { id: 'free', name: 'Free', price: '$0/mo', color: '#6b6b8a' },
  { id: 'pro', name: 'Pro', price: '$19/mo', color: '#7C6AF7', current: true },
  { id: 'team', name: 'Team', price: '$49/mo', color: '#10b981' },
];

function TabBtn({ id, label, icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderRadius: 8,
        border: 'none',
        background: active ? 'rgba(124,106,247,0.12)' : 'none',
        color: active ? '#a78bfa' : '#6b6b8a',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        width: '100%',
        textAlign: 'left',
        transition: 'all 0.15s',
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function InputRow({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 7 }}>{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        style={{ width: '100%', background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', color: '#e8e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.5)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
    </div>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [copied, setCopied] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ display: 'flex', height: '100%', color: '#e8e8f0', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      {/* Left nav */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '24px 12px', background: 'rgba(10,10,15,0.4)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, paddingLeft: 14 }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TabBtn id="account" label="Account" icon={User} active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
          <TabBtn id="api" label="API Keys" icon={Key} active={activeTab === 'api'} onClick={() => setActiveTab('api')} />
          <TabBtn id="billing" label="Billing" icon={CreditCard} active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
          <TabBtn id="team" label="Team" icon={Users} active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 24, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: 'none', background: 'none', color: '#6b6b8a', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'left' }}
          >
            <Bell size={16} /> Notifications
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'left' }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 36px' }}>
        {/* Account tab */}
        {activeTab === 'account' && (
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Account Settings</h3>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '20px', background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                AR
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>Amir Al-Rashid</div>
                <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 10 }}>amir@noon.com</div>
                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#c8c8e0', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                  Change avatar
                </button>
              </div>
            </div>

            <InputRow label="Full Name" defaultValue="Amir Al-Rashid" />
            <InputRow label="Email Address" defaultValue="amir@noon.com" type="email" />
            <InputRow label="Current Password" defaultValue="" type="password" />
            <InputRow label="New Password" defaultValue="" type="password" />

            <button style={{ background: '#7C6AF7', border: 'none', color: '#fff', padding: '11px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Save Changes
            </button>

            <div style={{ marginTop: 36, padding: '20px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Danger Zone</div>
              <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 14 }}>Permanently delete your account and all data.</div>
              <button style={{ background: 'none', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 13 }}>
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* API Keys tab */}
        {activeTab === 'api' && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>API Keys</h3>
                <p style={{ fontSize: 14, color: '#6b6b8a' }}>Use these keys to call the Brillance API from your own tools.</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#7C6AF7', border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                <Plus size={15} /> New Key
              </button>
            </div>

            {API_KEYS.map(k => (
              <div key={k.id} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{k.name}</div>
                    <div style={{ fontSize: 12, color: '#6b6b8a' }}>Created {k.created} · Last used {k.last}</div>
                  </div>
                  <button style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '5px 8px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, padding: '9px 14px', fontSize: 13, fontFamily: 'var(--font-mono)', color: '#6b6b8a', display: 'flex', alignItems: 'center' }}>
                    {showKey === k.id ? k.key : k.key.replace(/[^.]/g, '·')}
                  </div>
                  <button
                    onClick={() => setShowKey(showKey === k.id ? null : k.id)}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b6b8a', padding: '9px 12px', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showKey === k.id ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => copyKey(k.id, k.key)}
                    style={{ background: copied === k.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${copied === k.id ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`, color: copied === k.id ? '#10b981' : '#6b6b8a', padding: '9px 12px', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    {copied === k.id ? <Check size={14} /> : <Copy size={14} />}
                    {copied === k.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}

            <div style={{ background: 'rgba(124,106,247,0.06)', border: '1px solid rgba(124,106,247,0.15)', borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 12, marginTop: 8 }}>
              <Shield size={16} color="#a78bfa" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 3 }}>Keep your keys secret</div>
                <div style={{ fontSize: 12, color: '#6b6b8a', lineHeight: 1.6 }}>Never commit API keys to source control. Use environment variables (BRILLANCE_API_KEY) in production.</div>
              </div>
            </div>
          </div>
        )}

        {/* Billing tab */}
        {activeTab === 'billing' && (
          <div style={{ maxWidth: 680 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Billing & Plans</h3>

            {/* Current plan */}
            <div style={{ background: 'linear-gradient(135deg, rgba(124,106,247,0.12), rgba(124,106,247,0.04))', border: '1px solid rgba(124,106,247,0.3)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(124,106,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={22} color="#a78bfa" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>Pro Plan</span>
                  <span style={{ background: 'rgba(124,106,247,0.2)', color: '#a78bfa', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>CURRENT</span>
                </div>
                <div style={{ fontSize: 13, color: '#6b6b8a' }}>Next billing: Jul 1, 2026 · $19.00</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e8e8f0', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                  Downgrade
                </button>
                <button style={{ background: '#7C6AF7', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Crown size={14} /> Upgrade to Team
                </button>
              </div>
            </div>

            {/* Plan comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
              {PLANS.map(p => (
                <div key={p.id} style={{ background: p.current ? `${p.color}10` : '#111118', border: `1px solid ${p.current ? `${p.color}30` : 'rgba(255,255,255,0.06)'}`, borderRadius: 10, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: p.current ? p.color : '#c8c8e0', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0', marginBottom: 8 }}>{p.price}</div>
                  {p.current && <div style={{ fontSize: 12, color: p.color, background: `${p.color}15`, borderRadius: 100, padding: '2px 10px', display: 'inline-block' }}>Current plan</div>}
                </div>
              ))}
            </div>

            {/* Invoices */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Invoice History</div>
              <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Date', 'Plan', 'Amount', 'Status'].map(h => (
                    <span key={h} style={{ fontSize: 11, color: '#4a4a6a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                  ))}
                </div>
                {INVOICES.map((inv, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', padding: '12px 16px', borderBottom: i < INVOICES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#c8c8e0' }}>{inv.date}</span>
                    <span style={{ fontSize: 13, color: '#6b6b8a' }}>{inv.plan}</span>
                    <span style={{ fontSize: 13, color: '#e8e8f0', fontFamily: 'var(--font-mono)' }}>{inv.amount}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 4 }}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team tab */}
        {activeTab === 'team' && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Team</h3>
                <p style={{ fontSize: 14, color: '#6b6b8a' }}>Manage your team members and their roles.</p>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#7C6AF7', border: 'none', color: '#fff', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                <Plus size={15} /> Invite Member
              </button>
            </div>

            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
              {TEAM_MEMBERS.map((member, i) => (
                <div key={member.email} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < TEAM_MEMBERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {member.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{member.name}</span>
                      {member.you && <span style={{ fontSize: 11, color: '#6b6b8a', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 4 }}>You</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b6b8a' }}>{member.email}</div>
                  </div>
                  <select
                    defaultValue={member.role}
                    disabled={member.you}
                    style={{ background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 10px', color: '#e8e8f0', fontSize: 13, cursor: member.you ? 'not-allowed' : 'pointer', outline: 'none' }}
                  >
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  {!member.you && (
                    <button style={{ background: 'none', border: 'none', color: '#4a4a6a', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Invite form */}
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Invite by Email</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  placeholder="colleague@company.com"
                  style={{ flex: 1, background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', color: '#e8e8f0', fontSize: 14, outline: 'none' }}
                />
                <select
                  style={{ background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 14px', color: '#e8e8f0', fontSize: 14, outline: 'none', cursor: 'pointer' }}
                >
                  <option>Editor</option>
                  <option>Viewer</option>
                  <option>Admin</option>
                </select>
                <button style={{ background: '#7C6AF7', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
