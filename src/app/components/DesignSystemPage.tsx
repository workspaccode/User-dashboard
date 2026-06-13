import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Check, Download, Eye, Sun, Moon, Copy,
  Palette, Type, Sparkles, RefreshCw, ChevronRight,
  Loader2, AlignRight, Save, Clock, Trash2
} from 'lucide-react';
import { api, apiJson } from '../lib/api';

const STYLE_PRESETS = [
  { id: 'minimal', label: 'Minimal', desc: 'Clean, whitespace-first', color: '#e8e8f0' },
  { id: 'saas', label: 'SaaS/Dashboard', desc: 'Data-dense, professional', color: '#7C6AF7' },
  { id: 'corporate', label: 'Corporate', desc: 'Trustworthy, formal', color: '#3b82f6' },
  { id: 'mobile', label: 'Mobile App', desc: 'Touch-first, vibrant', color: '#10b981' },
  { id: 'ai', label: 'AI Tool', desc: 'Futuristic, dark-first', color: '#f472b6' },
];

const COLOR_STOPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

const EXPORT_FORMATS = [
  { id: 'flutter', label: 'Flutter ThemeData', ext: '.dart', color: '#60a5fa', endpoint: '/export/theme-dart' },
  { id: 'css', label: 'CSS Variables', ext: '.css', color: '#f472b6', endpoint: '/export/css-vars' },
  { id: 'json', label: 'JSON Tokens', ext: '.json', color: '#34d399', endpoint: '/export/json-tokens' },
  { id: 'tailwind', label: 'Tailwind Config', ext: '.js', color: '#fbbf24', endpoint: '/export/tailwind-config' },
  { id: 'figma', label: 'Figma Script', ext: '.js', color: '#a78bfa', endpoint: '/export/figma-script' },
];

export function DesignSystemPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState('Brillance');
  const [primaryColor, setPrimaryColor] = useState('#7C6AF7');
  const [stylePreset, setStylePreset] = useState('saas');
  const [darkMode, setDarkMode] = useState(true);
  const [rtl, setRtl] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState<any>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSystems, setSavedSystems] = useState<any[]>([]);
  const [enhancing, setEnhancing] = useState(false);
  const [enhancements, setEnhancements] = useState<any>(null);

  useEffect(() => {
    apiJson('/api/design-systems')
      .then(data => setSavedSystems(data))
      .catch(() => {});
  }, []);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const data = await apiJson('/generate/design-system', {
        method: 'POST',
        body: JSON.stringify({
          brand_name: brand || 'Brand',
          primary_color: primaryColor,
          style_preset: stylePreset,
          dark_mode: darkMode,
        }),
      });
      setTokens(data);
      setStep(3);
    } catch {
      setError('Failed to generate. Make sure the backend is running');
    } finally {
      setGenerating(false);
    }
  }, [brand, primaryColor, stylePreset, darkMode]);

  const handleExport = useCallback(async (fmt: typeof EXPORT_FORMATS[0]) => {
    if (!tokens) return;
    setExporting(fmt.id);
    try {
      const data = await apiJson(`${fmt.endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ tokens }),
      });
      const blob = new Blob([data.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brand.replace(/\s+/g, '_').toLowerCase()}_theme${fmt.ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  }, [tokens, brand]);

  const handleExportAll = useCallback(async () => {
    for (const fmt of EXPORT_FORMATS) {
      await handleExport(fmt);
    }
  }, [handleExport]);

  const handleSave = useCallback(async () => {
    if (!tokens) return;
    setSaving(true);
    try {
      const saved = await apiJson('/api/design-systems', {
        method: 'POST',
        body: JSON.stringify({
          name: brand,
          primary_color: primaryColor,
          preset: stylePreset,
          tokens: tokens,
        }),
      });
      setSavedSystems(prev => [saved, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [tokens, brand, primaryColor, stylePreset]);

  const handleEnhance = useCallback(async () => {
    if (!tokens) return;
    setEnhancing(true);
    try {
      const data = await apiJson('/generate/design-system/enhance', {
        method: 'POST',
        body: JSON.stringify({
          tokens,
          brand_name: brand,
          primary_color: primaryColor,
          preset: stylePreset,
        }),
      });
      setEnhancements(data.enhancements);
    } catch (err) {
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  }, [tokens, brand, primaryColor, stylePreset]);

  return (
    <div style={{ padding: '28px 32px', color: '#e8e8f0', fontFamily: 'var(--font-sans)', maxWidth: 1100, margin: '0 auto', minHeight: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Design System Generator</h1>
        <p style={{ fontSize: 14, color: '#6b6b8a' }}>Generate a complete token set and export to Flutter, CSS, JSON, and more.</p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 36, alignItems: 'center' }}>
        {['Brand Input', 'Generation', 'Preview & Export'].map((s, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => done && setStep(n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'none', border: 'none', cursor: done ? 'pointer' : 'default',
                  padding: '6px 12px',
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: done ? '#7C6AF7' : active ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.05)',
                  border: done ? '2px solid #7C6AF7' : active ? '2px solid #7C6AF7' : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: done ? '#fff' : active ? '#a78bfa' : '#4a4a6a', flexShrink: 0,
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

      {/* Saved Design Systems */}
      {savedSystems.length > 0 && (
        <div style={{ marginBottom: 24, background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} color="#6b6b8a" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#c8c8e0' }}>Saved Design Systems</span>
            <span style={{ fontSize: 11, color: '#4a4a6a', marginLeft: 'auto' }}>{savedSystems.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '10px 12px', overflow: 'auto' }}>
            {savedSystems.map(ds => (
              <button
                key={ds.id}
                onClick={() => {
                  setBrand(ds.name);
                  setPrimaryColor(ds.primary_color);
                  setStylePreset(ds.preset);
                  if (ds.tokens) {
                    setTokens(typeof ds.tokens === 'string' ? JSON.parse(ds.tokens) : ds.tokens);
                    setStep(3);
                  }
                }}
                style={{
                  flexShrink: 0, background: '#1a1a28', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8, padding: '10px 14px', cursor: 'pointer', textAlign: 'left', minWidth: 160,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: ds.primary_color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e8e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ds.name}</span>
                </div>
                <span style={{ fontSize: 11, color: '#4a4a6a' }}>{ds.preset} · {ds.created_at?.slice(0, 10)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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
                      borderRadius: 8, padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: stylePreset === preset.id ? preset.color : '#c8c8e0', marginBottom: 2 }}>{preset.label}</div>
                    <div style={{ fontSize: 11, color: '#6b6b8a' }}>{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 12, padding: 8, background: 'rgba(239,68,68,0.08)', borderRadius: 6 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: generating ? 'rgba(124,106,247,0.5)' : '#7C6AF7',
                border: 'none', color: '#fff', padding: '14px', borderRadius: 10,
                cursor: generating ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600,
              }}
            >
              {generating ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
              {generating ? 'Generating...' : 'Generate Design System'}
            </button>
          </div>

          {/* Live preview sidebar */}
          <div>
            <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 12 }}>Preview based on inputs</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2, marginBottom: 24 }}>
              {(() => {
                const h = parseInt(primaryColor.slice(1, 3), 16);
                const s = parseInt(primaryColor.slice(3, 5), 16);
                const b = parseInt(primaryColor.slice(5, 7), 16);
                const palette = [0.08, 0.15, 0.28, 0.42, 0.58, 0.72, 0.82, 0.9, 0.96, 1].map(op => {
                  const nr = Math.round(h * op + 255 * (1 - op));
                  const ng = Math.round(s * op + 255 * (1 - op));
                  const nb = Math.round(b * op + 255 * (1 - op));
                  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
                });
                return palette.map((color, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: '100%', paddingBottom: '100%', background: color, borderRadius: 4 }} />
                    <span style={{ fontSize: 9, color: '#4a4a6a' }}>{COLOR_STOPS[i]}</span>
                  </div>
                ));
              })()}
            </div>

            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 14 }}>Component preview</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ background: primaryColor, color: '#fff', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Primary</div>
                <div style={{ background: `${primaryColor}15`, border: `1px solid ${primaryColor}40`, color: primaryColor, padding: '9px 18px', borderRadius: 8, fontSize: 13 }}>Secondary</div>
                <div style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#e8e8f0', padding: '9px 18px', borderRadius: 8, fontSize: 13 }}>Outline</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['Success', '#10b981'], ['Error', '#ef4444'], ['Warning', '#f59e0b'], ['Info', '#3b82f6']].map(([label, c]) => (
                  <span key={label} style={{ background: `${c}20`, border: `1px solid ${c}40`, color: c, padding: '3px 10px', borderRadius: 100, fontSize: 12 }}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generating */}
      {generating && step === 2 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 60, height: 60, border: '3px solid rgba(124,106,247,0.2)', borderTopColor: '#7C6AF7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' }} />
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Generating your design system...</div>
          <div style={{ fontSize: 14, color: '#6b6b8a' }}>Creating color scales, typography, spacing, and components</div>
        </div>
      )}

      {/* Step 3: Preview + Export */}
      {step === 3 && tokens && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '5px 14px' }}>
              <Check size={13} color="#10b981" />
              <span style={{ fontSize: 13, color: '#10b981' }}>{tokens.brand_name} — {tokens.style_preset} preset</span>
            </div>
            <button onClick={() => { setStep(1); setTokens(null); setEnhancements(null); }} style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
              <RefreshCw size={13} /> Regenerate
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', padding: '5px 12px', borderRadius: 7, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}
            >
              {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={13} />}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleEnhance}
              disabled={enhancing}
              style={{ background: enhancing ? 'rgba(244,114,182,0.1)' : 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.25)', color: '#f472b6', padding: '5px 12px', borderRadius: 7, cursor: enhancing ? 'not-allowed' : 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}
            >
              {enhancing ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} />}
              {enhancing ? 'Enhancing...' : 'Improve with AI'}
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => setRtl(r => !r)} style={{ background: rtl ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: rtl ? '#a78bfa' : '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlignRight size={13} /> RTL
              </button>
              <button onClick={() => setDarkMode(false)} style={{ background: !darkMode ? 'rgba(255,255,255,0.1)' : 'none', border: '1px solid rgba(255,255,255,0.1)', color: !darkMode ? '#e8e8f0' : '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Sun size={13} /> Light
              </button>
              <button onClick={() => setDarkMode(true)} style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'none', border: '1px solid rgba(255,255,255,0.1)', color: darkMode ? '#e8e8f0' : '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Moon size={13} /> Dark
              </button>
            </div>
          </div>

          {/* AI Enhancements */}
          {enhancements && (
            <div style={{ background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.15)', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Sparkles size={14} color="#f472b6" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#f472b6' }}>AI Suggestions</span>
              </div>
              <div style={{ fontSize: 13, color: '#c8c8e0', marginBottom: 6 }}>{enhancements.suggestion}</div>
              {enhancements.fonts && (
                <div style={{ fontSize: 12, color: '#6b6b8a' }}>
                  Fonts: {enhancements.fonts.display} / {enhancements.fonts.body}
                </div>
              )}
              {enhancements.contrast_issues?.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  {enhancements.contrast_issues.map((issue: string, i: number) => (
                    <div key={i} style={{ fontSize: 12, color: '#f87171' }}>⚠ {issue}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            {/* Preview */}
            <div>
              {/* Color Scales */}
              <div style={{ background: darkMode ? '#111118' : '#ffffff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Palette size={15} color="#a78bfa" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: darkMode ? '#e8e8f0' : '#12121a' }}>Colors</span>
                </div>
                {['primary', 'secondary', 'neutral'].map(scaleName => {
                  const scale = tokens.colors?.[scaleName];
                  if (!scale) return null;
                  return (
                    <div key={scaleName} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 8, textTransform: 'capitalize' }}>{scaleName}</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {COLOR_STOPS.map(stop => (
                          <div key={stop} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <div style={{ width: '100%', paddingBottom: '100%', background: scale[stop], borderRadius: 4 }} />
                            <span style={{ fontSize: 9, color: '#4a4a6a' }}>{stop}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Semantic colors */}
                <div>
                  <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 8 }}>Semantic</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {['success', 'error', 'warning', 'info'].map(semName => {
                      const sem = tokens.colors?.semantic?.[semName];
                      if (!sem) return null;
                      return (
                        <div key={semName} style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 1, marginBottom: 4 }}>
                            {['100', '500', '900'].map(stop => (
                              <div key={stop} style={{ flex: 1, height: 20, background: sem[stop], borderRadius: 3 }} />
                            ))}
                          </div>
                          <div style={{ fontSize: 11, color: '#6b6b8a', textTransform: 'capitalize' }}>{semName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div style={{ background: darkMode ? '#111118' : '#ffffff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Type size={15} color="#a78bfa" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: darkMode ? '#e8e8f0' : '#12121a' }}>Typography</span>
                  <span style={{ fontSize: 11, color: '#6b6b8a', marginLeft: 'auto' }}>
                    {tokens.typography?.font_family?.display} / {tokens.typography?.font_family?.body}
                  </span>
                </div>
                {tokens.typography?.scale && Object.entries(tokens.typography.scale).slice(0, 7).map(([name, val]: any) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ width: 100, fontSize: 11, color: '#4a4a6a', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>{name.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span style={{ fontSize: Math.min(val.size, 32), fontWeight: val.weight, color: darkMode ? '#e8e8f0' : '#12121a', lineHeight: 1.2 }}>Aa</span>
                    <span style={{ fontSize: 11, color: '#6b6b8a', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{val.size}px / w{val.weight}</span>
                  </div>
                ))}
              </div>

              {/* Spacing + Radius */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ background: darkMode ? '#111118' : '#ffffff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: darkMode ? '#e8e8f0' : '#12121a' }}>Spacing</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {tokens.spacing?.map((v: number, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#4a4a6a', width: 30, fontFamily: 'var(--font-mono)' }}>{v}px</span>
                        <div style={{ flex: 1, height: 8, background: `${tokens.colors?.primary?.['500']}40`, borderRadius: 4, width: `${Math.min(v * 3, 200)}px` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: darkMode ? '#111118' : '#ffffff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: darkMode ? '#e8e8f0' : '#12121a' }}>Border Radius</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {tokens.radius && Object.entries(tokens.radius).map(([name, val]: any) => (
                      <div key={name} style={{ textAlign: 'center' }}>
                        <div style={{ width: 40, height: 40, background: `${tokens.colors?.primary?.['500']}30`, border: `1px solid ${tokens.colors?.primary?.['500']}40`, borderRadius: val === 9999 ? '50%' : val, marginBottom: 4 }} />
                        <div style={{ fontSize: 11, color: '#6b6b8a' }}>{name}</div>
                        <div style={{ fontSize: 10, color: '#4a4a6a', fontFamily: 'var(--font-mono)' }}>{val === 9999 ? 'full' : `${val}px`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Component preview */}
              <div style={{ background: darkMode ? '#111118' : '#ffffff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: darkMode ? '#e8e8f0' : '#12121a' }}>Components</div>
                {tokens.components && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 8 }}>Buttons</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['primary', 'secondary', 'ghost'].map(variant => {
                          const btn = tokens.components.button?.[variant];
                          if (!btn) return null;
                          return (
                            <button key={variant} style={{
                              background: btn.bg, color: btn.color, border: variant === 'ghost' ? `1px solid ${btn.color}40` : 'none',
                              padding: btn.padding, borderRadius: btn.radius, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}>{variant}</button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 8 }}>Card</div>
                      {tokens.components.card && (
                        <div style={{ background: tokens.components.card.bg, borderRadius: tokens.components.card.radius, padding: tokens.components.card.padding, border: tokens.components.card.border, boxShadow: tokens.components.card.shadow }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#12121a', marginBottom: 8 }}>Card Title</div>
                          <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 12 }}>This is a preview of how cards will look with your design tokens.</div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ background: tokens.colors?.primary?.['50'], color: tokens.colors?.primary?.['900'], padding: '2px 8px', borderRadius: tokens.components.badge?.radius || 100, fontSize: 12 }}>badge</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export panel */}
            <div>
              <div style={{ background: darkMode ? '#111118' : '#ffffff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', position: 'sticky', top: 20 }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: darkMode ? '#e8e8f0' : '#12121a', marginBottom: 2 }}>Export</div>
                  <div style={{ fontSize: 12, color: '#6b6b8a' }}>Download in any format</div>
                </div>
                {EXPORT_FORMATS.map(fmt => {
                  const isExporting = exporting === fmt.id;
                  return (
                    <div key={fmt.id} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: darkMode ? '#e8e8f0' : '#12121a' }}>{fmt.label}</span>
                          <span style={{ fontSize: 10, color: fmt.color, background: `${fmt.color}15`, border: `1px solid ${fmt.color}30`, padding: '1px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{fmt.ext}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleExport(fmt)}
                        disabled={isExporting}
                        style={{
                          background: isExporting ? 'rgba(124,106,247,0.1)' : `${fmt.color}15`,
                          border: `1px solid ${isExporting ? 'rgba(124,106,247,0.3)' : `${fmt.color}30`}`,
                          color: isExporting ? '#a78bfa' : fmt.color,
                          width: 32, height: 32, borderRadius: 7, cursor: isExporting ? 'not-allowed' : 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                      >
                        {isExporting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={14} />}
                      </button>
                    </div>
                  );
                })}
                <div style={{ padding: '14px 16px' }}>
                  <button
                    onClick={handleExportAll}
                    style={{ width: '100%', background: '#7C6AF7', border: 'none', color: '#fff', padding: '11px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                  >
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
