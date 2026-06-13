import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Code2, Palette, Users, FileText, Wand2, PenTool, Upload, Zap, ArrowRight, Check } from 'lucide-react';
import { apiFormData } from '../lib/api';

const ROLES = [
  { id: 'dev', icon: Code2, label: 'Flutter Developer', desc: 'I write Dart code and build Flutter apps', color: '#7C6AF7' },
  { id: 'designer', icon: Palette, label: 'UI/UX Designer', desc: 'I create designs in Figma and hand off to devs', color: '#f472b6' },
  { id: 'lead', icon: Users, label: 'Tech Lead / PM', desc: 'I manage the product and engineering team', color: '#34d399' },
];

const USES = [
  { id: 'convert', icon: FileText, label: 'Convert Design Files', desc: 'Turn .fig or .html files into Flutter code', color: '#7C6AF7' },
  { id: 'system', icon: Wand2, label: 'Generate Design System', desc: 'Build a token system and Flutter ThemeData', color: '#fbbf24' },
  { id: 'draw', icon: PenTool, label: 'Draw Components', desc: 'Use the canvas editor to design from scratch', color: '#60a5fa' },
];

function StepDot({ num, active, done }: { num: number; active: boolean; done: boolean }) {
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: done ? '#7C6AF7' : active ? 'rgba(124,106,247,0.2)' : 'rgba(255,255,255,0.05)',
      border: done ? '2px solid #7C6AF7' : active ? '2px solid #7C6AF7' : '2px solid rgba(255,255,255,0.1)',
      fontSize: 13,
      fontWeight: 700,
      color: done ? '#fff' : active ? '#a78bfa' : '#4a4a6a',
      flexShrink: 0,
      transition: 'all 0.3s',
    }}>
      {done ? <Check size={14} /> : num}
    </div>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [use, setUse] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  const handleComplete = () => {
    if (createdProjectId) {
      navigate(`/project/${createdProjectId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedFileName(file.name);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('color', '#7C6AF7');

    try {
      const data = await apiFormData('/api/projects/import-html', formData);
      setCreatedProjectId(data.id);
      localStorage.setItem('brillance_project_id', data.id);
      localStorage.setItem('brillance_project_name', data.name);
    } catch {
      alert('Error parsing and importing HTML file. Make sure the backend is running');
    } finally {
      setUploading(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      padding: '40px 24px',
    }}>
      <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(124,106,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color="#fff" />
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0' }}>Brillance</span>
      </div>

      {/* Progress steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 48 }}>
        {[1, 2, 3].map((n, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
            <StepDot num={n} active={step === n} done={step > n} />
            {i < 2 && (
              <div style={{ width: 80, height: 2, background: step > n ? 'rgba(124,106,247,0.5)' : 'rgba(255,255,255,0.07)', transition: 'background 0.3s' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 560, position: 'relative' }}>
        {/* Step 1: Role */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#e8e8f0', letterSpacing: '-0.02em' }}>
              What's your role?
            </h2>
            <p style={{ fontSize: 15, color: '#6b6b8a', textAlign: 'center', marginBottom: 32 }}>
              We'll personalize Brillance for how you work.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ROLES.map(r => {
                const Icon = r.icon;
                const selected = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      background: selected ? `${r.color}15` : '#111118',
                      border: selected ? `1px solid ${r.color}50` : '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '18px 20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${r.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} color={r.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#e8e8f0', marginBottom: 3 }}>{r.label}</div>
                      <div style={{ fontSize: 13, color: '#6b6b8a' }}>{r.desc}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: selected ? `2px solid ${r.color}` : '2px solid rgba(255,255,255,0.15)', background: selected ? r.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selected && <Check size={11} color="#fff" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => role && setStep(2)}
              disabled={!role}
              style={{
                width: '100%',
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: role ? '#7C6AF7' : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: role ? '#fff' : '#4a4a6a',
                padding: '14px',
                borderRadius: 10,
                cursor: role ? 'pointer' : 'not-allowed',
                fontSize: 15,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Primary use */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#e8e8f0', letterSpacing: '-0.02em' }}>
              What will you use Brillance for?
            </h2>
            <p style={{ fontSize: 15, color: '#6b6b8a', textAlign: 'center', marginBottom: 32 }}>
              Choose your primary workflow — you can always do more.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {USES.map(u => {
                const Icon = u.icon;
                const selected = use === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setUse(u.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      background: selected ? `${u.color}15` : '#111118',
                      border: selected ? `1px solid ${u.color}50` : '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '18px 20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${u.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color={u.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#e8e8f0', marginBottom: 3 }}>{u.label}</div>
                      <div style={{ fontSize: 13, color: '#6b6b8a' }}>{u.desc}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: selected ? `2px solid ${u.color}` : '2px solid rgba(255,255,255,0.15)', background: selected ? u.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selected && <Check size={11} color="#fff" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#e8e8f0', padding: '14px', borderRadius: 10, cursor: 'pointer', fontSize: 15 }}>
                Back
              </button>
              <button
                onClick={() => use && setStep(3)}
                disabled={!use}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: use ? '#7C6AF7' : 'rgba(255,255,255,0.05)', border: 'none', color: use ? '#fff' : '#4a4a6a', padding: '14px', borderRadius: 10, cursor: use ? 'pointer' : 'not-allowed', fontSize: 15, fontWeight: 600 }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Import file */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#e8e8f0', letterSpacing: '-0.02em' }}>
              Import your first design
            </h2>
            <p style={{ fontSize: 15, color: '#6b6b8a', textAlign: 'center', marginBottom: 32 }}>
              Optional — see Brillance in action with your own files.
            </p>

            <input
              type="file"
              id="file-input"
              accept=".html,.svg,.fig"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div
              onClick={triggerFileInput}
              style={{
                border: uploading ? '2px dashed rgba(16,185,129,0.5)' : '2px dashed rgba(124,106,247,0.3)',
                borderRadius: 16,
                padding: '48px 24px',
                textAlign: 'center',
                background: uploading ? 'rgba(16,185,129,0.04)' : 'rgba(124,106,247,0.04)',
                marginBottom: 16,
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = 'rgba(124,106,247,0.6)'; }}
              onMouseLeave={e => { if (!uploading) e.currentTarget.style.borderColor = 'rgba(124,106,247,0.3)'; }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: uploading ? 'rgba(16,185,129,0.12)' : 'rgba(124,106,247,0.12)',
                border: uploading ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(124,106,247,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Upload size={24} color={uploading ? '#34d399' : '#a78bfa'} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#e8e8f0' }}>
                {uploading ? 'Parsing and extracting components...' : uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to select or drop your file here'}
              </div>
              <div style={{ fontSize: 13, color: '#6b6b8a' }}>
                {uploadedFileName && !uploading ? 'Click to select a different file' : 'Supports .html (Extracts layouts, navbars, cards, buttons)'}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                {['.html', '.fig', '.svg'].map(ext => (
                  <span key={ext} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#6b6b8a', fontFamily: 'var(--font-mono)' }}>{ext}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#e8e8f0', padding: '14px', borderRadius: 10, cursor: 'pointer', fontSize: 15 }}>
                Back
              </button>
              <button
                onClick={handleComplete}
                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#7C6AF7', border: 'none', color: '#fff', padding: '14px', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600 }}
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            </div>
            <button
              onClick={handleComplete}
              style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', fontSize: 14 }}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
