import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Check, Download, Eye, Sun, Moon, Copy,
  Palette, Type, Sparkles, RefreshCw, ChevronRight
} from 'lucide-react';

const STYLE_PRESETS = [
  { id: 'minimal', label: 'Minimal', desc: 'Clean, whitespace-first', color: '#e8e8f0' },
  { id: 'saas', label: 'SaaS/Dashboard', desc: 'Data-dense, professional', color: '#7C6AF7' },
  { id: 'corporate', label: 'Corporate', desc: 'Trustworthy, formal', color: '#3b82f6' },
  { id: 'mobile', label: 'Mobile App', desc: 'Touch-first, vibrant', color: '#10b981' },
  { id: 'ai', label: 'AI Tool', desc: 'Futuristic, dark-first', color: '#f472b6' },
];

const EXPORT_FORMATS = [
  { id: 'flutter', label: 'Flutter ThemeData', ext: '.dart', color: '#60a5fa', desc: 'ColorScheme, TextTheme, ButtonThemeData' },
  { id: 'css', label: 'CSS Variables', ext: '.css', color: '#f472b6', desc: 'Custom properties, light + dark modes' },
  { id: 'json', label: 'JSON Tokens', ext: '.json', color: '#34d399', desc: 'Style Dictionary compatible' },
  { id: 'tailwind', label: 'Tailwind Config', ext: '.js', color: '#fbbf24', desc: 'tailwind.config.js with all tokens' },
  { id: 'figma', label: 'Figma Script', ext: '.js', color: '#a78bfa', desc: 'Paste in Figma console to create variables' },
];

function generatePalette(hex: string): string[] {
  const shades: string[] = [];
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const opacities = [0.08, 0.15, 0.25, 0.38, 0.5, 0.65, 0.78, 0.88, 0.95, 1.0];
  for (const op of opacities) {
    const nr = Math.round(r * op + 255 * (1 - op));
    const ng = Math.round(g * op + 255 * (1 - op));
    const nb = Math.round(b * op + 255 * (1 - op));
    shades.push(`#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`);
  }
  return shades;
}

const COLOR_STOPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const FONT_SCALE = [
  { name: 'Display', size: 56, weight: 800 },
  { name: 'H1', size: 40, weight: 700 },
  { name: 'H2', size: 32, weight: 700 },
  { name: 'H3', size: 24, weight: 600 },
  { name: 'H4', size: 20, weight: 600 },
  { name: 'Body LG', size: 18, weight: 400 },
  { name: 'Body', size: 16, weight: 400 },
  { name: 'Body SM', size: 14, weight: 400 },
  { name: 'Label', size: 13, weight: 500 },
  { name: 'Caption', size: 12, weight: 400 },
];

const RADIUS_SCALE = [
  { name: 'none', value: '0px' },
  { name: 'sm', value: '4px' },
  { name: 'md', value: '8px' },
  { name: 'lg', value: '12px' },
  { name: 'xl', value: '16px' },
  { name: 'full', value: '9999px' },
];

const SEMANTIC_COLORS = [
  { name: 'Success', light: '#10b981', dark: '#34d399' },
  { name: 'Error', light: '#ef4444', dark: '#f87171' },
  { name: 'Warning', light: '#f59e0b', dark: '#fbbf24' },
  { name: 'Info', light: '#3b82f6', dark: '#60a5fa' },
];

export function DesignSystemPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState('Brillance');
  const [primaryColor, setPrimaryColor] = useState('#7C6AF7');
  const [stylePreset, setStylePreset] = useState('saas');
  const [darkMode, setDarkMode] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [exported, setExported] = useState<string[]>([]);

  const palette = generatePalette(primaryColor);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setStep(3);
    }, 2000);
  };

  const handleExport = (id: string) => {
    setExported(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <div style={{ padding: '28px 32px', color: '#e8e8f0', fontFamily: 'var(--font-sans)', maxWidth: 1100, margin: '0 auto', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Design System Generator</h1>
        <p style={{ fontSize: 14, color: '#6b6b8a' }}>Generate a complete token set and export to Flutter, CSS, JSON, and more.</p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 36, alignItems: 'center' }}>
        {['Brand Input', 'Auto-Generation', 'Preview & Export'].map((s, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => done && setStep(n)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  cursor: done ? 'pointer' : 'default',
                  padding: '6px 12px',
                }}
              >
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: done ? '#7C6AF7' : active ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.05)',
                  border: done ? '2px solid #7C6AF7' : active ? '2px solid #7C6AF7' : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: done ? '#fff' : active ? '#a78bfa' : '#4a4a6a',
                  flexShrink: 0,
                }}>
                  {done ? <Check size={12} /> : n}
                </div>
                <span style={{ fontSize: 13, color: active ? '#e8e8f0' : done ? '#a78bfa' : '#4a4a6a', fontWeight: active ? 600 : 400 }}>{s}</span>
              </button>
              {i < 2 && <ChevronRight size={14} color="#3a3a52" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Brand Input */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 8 }}>Brand Name</label>
              <input
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Your brand name"
                style={{ width: '100%', background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '11px 14px', color: '#e8e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontWeight: 500 }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 8 }}>Primary Color</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  style={{ width: 48, height: 48, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer', padding: 2 }}
                />
                <input
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  style={{ flex: 1, background: '#1a1a28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '11px 14px', color: '#e8e8f0', fontSize: 14, outline: 'none', fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {['#7C6AF7', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#f472b6', '#06b6d4', '#8b5cf6'].map(c => (
                  <div
                    key={c}
                    onClick={() => setPrimaryColor(c)}
                    style={{ width: 22, height: 22, borderRadius: 5, background: c, cursor: 'pointer', border: primaryColor === c ? '2px solid #fff' : '2px solid transparent', boxSizing: 'border-box' }}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#a89bfa', marginBottom: 8 }}>Style Preset</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {STYLE_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setStylePreset(preset.id)}
                    style={{
                      background: stylePreset === preset.id ? `${preset.color}15` : '#111118',
                      border: `1px solid ${stylePreset === preset.id ? `${preset.color}40` : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: stylePreset === preset.id ? preset.color : '#c8c8e0', marginBottom: 2 }}>{preset.label}</div>
                    <div style={{ fontSize: 11, color: '#6b6b8a' }}>{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#7C6AF7',
                border: 'none',
                color: '#fff',
                padding: '14px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              <Sparkles size={16} />
              Generate Design System
            </button>
          </div>

          {/* Live preview */}
          <div>
            <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 12 }}>Color preview</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2, marginBottom: 24 }}>
              {palette.map((color, i) => (
                <div key={i} title={`${COLOR_STOPS[i]}: ${color}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: '100%', paddingBottom: '100%', background: color, borderRadius: 4 }} />
                  <span style={{ fontSize: 9, color: '#4a4a6a' }}>{COLOR_STOPS[i]}</span>
                </div>
              ))}
            </div>

            {/* Component preview */}
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 14 }}>Component preview</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ background: primaryColor, color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Primary</div>
                <div style={{ background: `${primaryColor}15`, border: `1px solid ${primaryColor}40`, color: primaryColor, padding: '9px 18px', borderRadius: 8, fontSize: 13 }}>Secondary</div>
                <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#e8e8f0', padding: '9px 18px', borderRadius: 8, fontSize: 13 }}>Outline</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['Success', '#10b981'], ['Error', '#ef4444'], ['Warning', '#f59e0b'], ['Info', '#3b82f6']].map(([label, color]) => (
                  <span key={label} style={{ background: `${color}20`, border: `1px solid ${color}40`, color: color as string, padding: '3px 10px', borderRadius: 100, fontSize: 12 }}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generating */}
      {generating && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 60, height: 60, border: '3px solid rgba(124,106,247,0.2)', borderTopColor: '#7C6AF7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' }} />
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Generating your design system...</div>
          <div style={{ fontSize: 14, color: '#6b6b8a' }}>Creating color scales, typography, spacing, and components</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Step 3: Preview + Export */}
      {step === 3 && generated && !generating && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '5px 14px' }}>
              <Check size={13} color="#10b981" />
              <span style={{ fontSize: 13, color: '#10b981' }}>Design system generated for {brand}</span>
            </div>
            <button onClick={() => { setStep(1); setGenerated(false); }} style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
              <RefreshCw size={13} /> Regenerate
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => setDarkMode(false)} style={{ background: !darkMode ? 'rgba(255,255,255,0.1)' : 'none', border: '1px solid rgba(255,255,255,0.1)', color: !darkMode ? '#e8e8f0' : '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Sun size={13} /> Light
              </button>
              <button onClick={() => setDarkMode(true)} style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'none', border: '1px solid rgba(255,255,255,0.1)', color: darkMode ? '#e8e8f0' : '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Moon size={13} /> Dark
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            {/* Preview */}
            <div>
              {/* Colors */}
              <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Palette size={15} color="#a78bfa" />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Colors</span>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 8 }}>Primary — {brand}</div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {palette.map((c, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: '100%', paddingBottom: '100%', background: c, borderRadius: 4, border: i === 6 ? `2px solid ${primaryColor}` : 'none' }} />
                        <span style={{ fontSize: 9, color: '#4a4a6a' }}>{COLOR_STOPS[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 8 }}>Semantic Colors</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {SEMANTIC_COLORS.map(sc => (
                      <div key={sc.name} style={{ textAlign: 'center' }}>
                        <div style={{ height: 32, borderRadius: 6, background: darkMode ? sc.dark : sc.light, marginBottom: 4 }} />
                        <div style={{ fontSize: 11, color: '#6b6b8a' }}>{sc.name}</div>
                        <div style={{ fontSize: 10, color: '#4a4a6a', fontFamily: 'var(--font-mono)' }}>{darkMode ? sc.dark : sc.light}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Type size={15} color="#a78bfa" />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Typography</span>
                </div>
                {FONT_SCALE.slice(0, 6).map(f => (
                  <div key={f.name} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ width: 70, fontSize: 11, color: '#4a4a6a', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>{f.name}</span>
                    <span style={{ fontSize: f.size > 32 ? 32 : f.size, fontWeight: f.weight, color: '#e8e8f0', lineHeight: 1.2 }}>Aa</span>
                    <span style={{ fontSize: 11, color: '#6b6b8a', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{f.size}px / {f.weight}</span>
                  </div>
                ))}
              </div>

              {/* Border radius */}
              <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Border Radius</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  {RADIUS_SCALE.map(r => (
                    <div key={r.name} style={{ textAlign: 'center' }}>
                      <div style={{ width: 48, height: 48, background: primaryColor + '30', border: `1px solid ${primaryColor}40`, borderRadius: r.value === '9999px' ? '50%' : r.value, marginBottom: 6 }} />
                      <div style={{ fontSize: 11, color: '#6b6b8a' }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: '#4a4a6a', fontFamily: 'var(--font-mono)' }}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export panel */}
            <div>
              <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Export</div>
                  <div style={{ fontSize: 12, color: '#6b6b8a' }}>Download in any format</div>
                </div>
                {EXPORT_FORMATS.map(fmt => {
                  const done = exported.includes(fmt.id);
                  return (
                    <div key={fmt.id} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#e8e8f0' }}>{fmt.label}</span>
                          <span style={{ fontSize: 10, color: fmt.color, background: `${fmt.color}15`, border: `1px solid ${fmt.color}30`, padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{fmt.ext}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#6b6b8a' }}>{fmt.desc}</div>
                      </div>
                      <button
                        onClick={() => handleExport(fmt.id)}
                        style={{
                          background: done ? 'rgba(16,185,129,0.1)' : `${fmt.color}15`,
                          border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : `${fmt.color}30`}`,
                          color: done ? '#10b981' : fmt.color,
                          width: 32,
                          height: 32,
                          borderRadius: 7,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s',
                        }}
                      >
                        {done ? <Check size={14} /> : <Download size={14} />}
                      </button>
                    </div>
                  );
                })}
                <div style={{ padding: '14px 16px' }}>
                  <button style={{ width: '100%', background: '#7C6AF7', border: 'none', color: '#fff', padding: '11px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Download size={15} />
                    Export All Formats
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
