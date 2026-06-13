import { useNavigate } from 'react-router';
import { useState } from 'react';
import {
  Zap, Code2, Layers, Palette, Box, FileCode2, ArrowRight,
  Check, Star, Github, Twitter, ChevronRight, Play,
  Figma, Globe, Sparkles, Component, Cpu, Wand2
} from 'lucide-react';

const FEATURES = [
  {
    icon: Figma,
    title: 'Universal File Import',
    desc: 'Import .fig, .html, or .svg files. Our parser extracts every component, style, and layout into a structured tree.',
    color: '#a78bfa',
  },
  {
    icon: Cpu,
    title: 'AI Flutter Code Generator',
    desc: 'GPT-4o converts your ComponentTree into clean, production-ready Flutter widgets following Material 3 best practices.',
    color: '#34d399',
  },
  {
    icon: Component,
    title: 'Component Gallery',
    desc: 'Browse all parsed components with live previews, variant switching, and instant Flutter code — with RTL support.',
    color: '#60a5fa',
  },
  {
    icon: Palette,
    title: 'Design System Generator',
    desc: 'Generate a full token set — colors, typography, spacing, elevation — and export as Flutter ThemeData, CSS vars, or JSON.',
    color: '#f472b6',
  },
  {
    icon: Layers,
    title: '2D Canvas Editor',
    desc: 'Draw components from scratch with Fabric.js. Use smart snap guides, layer management, and export directly to Flutter.',
    color: '#fbbf24',
  },
  {
    icon: Box,
    title: '3D Scene Builder',
    desc: 'Create 3D scenes with Three.js and render the same scene in Flutter using the three_js Dart package — zero divergence.',
    color: '#fb923c',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Import Your Design',
    desc: 'Upload a Figma file, HTML page, or SVG. Brillance parses it in seconds into a structured ComponentTree.',
  },
  {
    num: '02',
    title: 'AI Generates Code',
    desc: 'Our AI engine produces clean Flutter widgets with proper ThemeData, RTL support, and responsive layouts.',
  },
  {
    num: '03',
    title: 'Export & Ship',
    desc: 'Copy individual widgets, export the full design system, or push directly to your Flutter project.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Get started with Flutter code generation.',
    features: [
      '10 AI requests per day',
      '3 active projects',
      'Component Gallery',
      'HTML & SVG import',
      'Basic design system',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'For professional Flutter developers.',
    features: [
      '500 AI requests per day',
      'Unlimited projects',
      'Figma .fig import',
      '2D + 3D canvas editor',
      'Full design system export',
      'API key access',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    desc: 'For product teams shipping Flutter apps.',
    features: [
      'Unlimited AI requests',
      'Unlimited projects',
      'Team workspace',
      'Role management',
      'Version history',
      'Priority support',
    ],
    cta: 'Start Team Trial',
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Amir Al-Rashid',
    role: 'Lead Flutter Dev @ Noon',
    text: 'Brillance cut our design-to-code time by 70%. The RTL support is flawless for our Arabic app.',
    avatar: 'AR',
  },
  {
    name: 'Sarah Chen',
    role: 'Product Designer @ Grab',
    text: 'The design system generator is incredible. I exported our entire token set to Flutter ThemeData in minutes.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Osei',
    role: 'CTO @ Paystack',
    text: 'We ship 3x faster now. The component gallery with live previews is a game-changer for our team.',
    avatar: 'MO',
  },
];

function CodePreview() {
  return (
    <div style={{
      background: '#0e0e16',
      border: '1px solid rgba(124,106,247,0.2)',
      borderRadius: 12,
      overflow: 'hidden',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
    }}>
      <div style={{ background: '#16161f', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ marginLeft: 8, color: '#6b6b8a', fontSize: 12 }}>primary_button.dart</span>
      </div>
      <div style={{ padding: '16px 20px', lineHeight: 1.7 }}>
        <div><span style={{ color: '#6b6b8a' }}>/// Primary action button</span></div>
        <div><span style={{ color: '#a78bfa' }}>class</span> <span style={{ color: '#60a5fa' }}>PrimaryButton</span> <span style={{ color: '#a78bfa' }}>extends</span> <span style={{ color: '#60a5fa' }}>StatelessWidget</span> {'{'}</div>
        <div style={{ paddingLeft: 20 }}><span style={{ color: '#a78bfa' }}>const</span> <span style={{ color: '#60a5fa' }}>PrimaryButton</span>({'{'}</div>
        <div style={{ paddingLeft: 40 }}><span style={{ color: '#a78bfa' }}>super</span>.key,</div>
        <div style={{ paddingLeft: 40 }}><span style={{ color: '#34d399' }}>required</span> <span style={{ color: '#a78bfa' }}>this</span>.label,</div>
        <div style={{ paddingLeft: 40 }}><span style={{ color: '#a78bfa' }}>this</span>.onPressed,</div>
        <div style={{ paddingLeft: 20 }}>{'}'});</div>
        <div style={{ paddingLeft: 20, marginTop: 4 }}><span style={{ color: '#a78bfa' }}>final</span> <span style={{ color: '#60a5fa' }}>String</span> label;</div>
        <div style={{ paddingLeft: 20 }}><span style={{ color: '#a78bfa' }}>final</span> <span style={{ color: '#60a5fa' }}>VoidCallback</span>? onPressed;</div>
        <div style={{ marginTop: 8, paddingLeft: 20 }}>
          <span style={{ color: '#e2e8f0' }}>@override</span>
        </div>
        <div style={{ paddingLeft: 20 }}><span style={{ color: '#60a5fa' }}>Widget</span> build(<span style={{ color: '#60a5fa' }}>BuildContext</span> context) {'{'}</div>
        <div style={{ paddingLeft: 40 }}><span style={{ color: '#a78bfa' }}>return</span> <span style={{ color: '#60a5fa' }}>FilledButton</span>(</div>
        <div style={{ paddingLeft: 60 }}>onPressed: onPressed,</div>
        <div style={{ paddingLeft: 60 }}>child: <span style={{ color: '#60a5fa' }}>Text</span>(label),</div>
        <div style={{ paddingLeft: 40 }}>);</div>
        <div style={{ paddingLeft: 20 }}>{'}'}</div>
        <div>{'}'}</div>
      </div>
    </div>
  );
}

function ComponentPreview() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    }}>
      {[
        { name: 'PrimaryButton', type: 'button', color: '#7C6AF7' },
        { name: 'ProductCard', type: 'card', color: '#10b981' },
        { name: 'SearchInput', type: 'input', color: '#3b82f6' },
        { name: 'NavBar', type: 'navbar', color: '#f59e0b' },
        { name: 'AlertModal', type: 'modal', color: '#ef4444' },
        { name: 'UserAvatar', type: 'custom', color: '#a78bfa' },
      ].map((comp) => (
        <div key={comp.name} style={{
          background: '#16161f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: comp.color,
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 13, color: '#e8e8f0', fontFamily: 'var(--font-mono)' }}>{comp.name}</div>
            <div style={{ fontSize: 11, color: '#6b6b8a', marginTop: 1 }}>{comp.type}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState('Pro');

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8f0', fontFamily: 'var(--font-sans)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Brillance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginRight: 32 }}>
          {['Features', 'How It Works', 'Pricing', 'Docs'].map(link => (
            <button key={link} style={{
              background: 'none',
              border: 'none',
              color: '#6b6b8a',
              cursor: 'pointer',
              fontSize: 14,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8e8f0')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b6b8a')}
            >{link}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e8e8f0',
              padding: '8px 18px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: '#7C6AF7',
              border: 'none',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#6b59e8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#7C6AF7')}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 32px 80px', maxWidth: 1200, margin: '0 auto', overflow: 'hidden' }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 600,
          background: 'radial-gradient(ellipse at center, rgba(124,106,247,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(124,106,247,0.12)',
            border: '1px solid rgba(124,106,247,0.25)',
            borderRadius: 100,
            padding: '5px 14px',
          }}>
            <Sparkles size={13} color="#a78bfa" />
            <span style={{ fontSize: 13, color: '#a78bfa' }}>Powered by GPT-4o & Claude 3.5 Sonnet</span>
          </div>
        </div>

        <h1 style={{
          textAlign: 'center',
          fontSize: 'clamp(40px, 5vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 24,
          background: 'linear-gradient(180deg, #ffffff 0%, #a89bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Convert Designs to<br />Flutter Code, Instantly
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: 18,
          color: '#6b6b8a',
          maxWidth: 600,
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Import Figma files, HTML, or SVG. Brillance parses your design and generates
          production-ready Flutter widgets with AI — including design tokens, RTL support, and 3D scenes.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 72 }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#7C6AF7',
              border: 'none',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: '0 0 40px rgba(124,106,247,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6b59e8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#7C6AF7'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start Free <ArrowRight size={16} />
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8e8f0',
              padding: '14px 28px',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 15,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(124,106,247,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          >
            <Play size={15} /> Watch Demo
          </button>
        </div>

        {/* App preview */}
        <div style={{
          background: '#111118',
          border: '1px solid rgba(124,106,247,0.15)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,106,247,0.1)',
        }}>
          {/* Window chrome */}
          <div style={{ background: '#0e0e16', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#4a4a6a', fontFamily: 'var(--font-mono)' }}>
              app.brillance.dev/project/3f2a91/gallery
            </div>
          </div>
          {/* App content preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 300px', minHeight: 400 }}>
            {/* Sidebar */}
            <div style={{ background: '#0e0e16', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '16px 12px' }}>
              <div style={{ fontSize: 11, color: '#4a4a6a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, padding: '0 8px' }}>Components</div>
              {['PrimaryButton', 'SecondaryButton', 'ProductCard', 'SearchInput', 'NavBar', 'AlertModal', 'UserAvatar', 'DataTable'].map((name, i) => (
                <div key={name} style={{
                  padding: '7px 10px',
                  borderRadius: 6,
                  fontSize: 13,
                  color: i === 0 ? '#a78bfa' : '#6b6b8a',
                  background: i === 0 ? 'rgba(124,106,247,0.1)' : 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 2,
                }}>
                  {name}
                </div>
              ))}
            </div>
            {/* Main */}
            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#4a4a6a', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>PREVIEW</div>
                <div style={{
                  background: '#16161f',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ background: '#7C6AF7', color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Get Started</div>
                    <div style={{ background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.3)', color: '#a78bfa', padding: '12px 24px', borderRadius: 8, fontSize: 14 }}>Learn More</div>
                  </div>
                </div>
              </div>
              <ComponentPreview />
            </div>
            {/* Code panel */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', padding: 16 }}>
              <div style={{ fontSize: 11, color: '#4a4a6a', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>FLUTTER CODE</div>
              <CodePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#a78bfa' }}>12,000+</div>
          <div style={{ fontSize: 13, color: '#6b6b8a' }}>Flutter developers</div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#34d399' }}>4.8M+</div>
          <div style={{ fontSize: 13, color: '#6b6b8a' }}>Widgets generated</div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#60a5fa' }}>98%</div>
          <div style={{ fontSize: 13, color: '#6b6b8a' }}>Code accuracy rate</div>
        </div>
        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fbbf24' }}>&lt; 3s</div>
          <div style={{ fontSize: 13, color: '#6b6b8a' }}>Code generation</div>
        </div>
      </div>

      {/* Features */}
      <section style={{ padding: '100px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 13, color: '#a78bfa', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Everything You Need</div>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            The complete Flutter dev toolkit
          </h2>
          <p style={{ color: '#6b6b8a', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            From design file to shipped Flutter app — every step covered.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: 28,
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,106,247,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${feat.color}18`,
                  border: `1px solid ${feat.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                }}>
                  <Icon size={20} color={feat.color} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{feat.title}</h3>
                <p style={{ fontSize: 14, color: '#6b6b8a', lineHeight: 1.7 }}>{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 32px', background: 'rgba(124,106,247,0.04)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, color: '#a78bfa', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Workflow</div>
            <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}>
              From design to Flutter in 3 steps
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, position: 'relative' }}>
            {/* Connector */}
            <div style={{ position: 'absolute', top: 28, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, rgba(124,106,247,0.3), rgba(124,106,247,0.3))', zIndex: 0 }} />
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  boxShadow: '0 0 30px rgba(124,106,247,0.3)',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#6b6b8a', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '100px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 13, color: '#a78bfa', marginBottom: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</div>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: '#6b6b8a', fontSize: 16 }}>Start free. Upgrade when you need more power.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlight ? 'linear-gradient(180deg, rgba(124,106,247,0.15), rgba(124,106,247,0.05))' : '#111118',
              border: plan.highlight ? '1px solid rgba(124,106,247,0.4)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: 28,
              position: 'relative',
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#7C6AF7',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 12px',
                  borderRadius: 100,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: 6, color: '#6b6b8a', fontSize: 13 }}>{plan.name}</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em' }}>{plan.price}</span>
                <span style={{ color: '#6b6b8a', fontSize: 14 }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 24, lineHeight: 1.6 }}>{plan.desc}</p>
              <div style={{ marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Check size={14} color="#10b981" />
                    <span style={{ fontSize: 14, color: '#c8c8e0' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  background: plan.highlight ? '#7C6AF7' : 'transparent',
                  color: plan.highlight ? '#fff' : '#e8e8f0',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (plan.highlight) e.currentTarget.style.background = '#6b59e8'; }}
                onMouseLeave={e => { if (plan.highlight) e.currentTarget.style.background = '#7C6AF7'; }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 32px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>Loved by Flutter teams</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: 24,
              }}>
                <div style={{ display: 'flex', marginBottom: 12, gap: 2 }}>
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: '#c8c8e0', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#6b6b8a' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(124,106,247,0.12)',
            border: '1px solid rgba(124,106,247,0.25)',
            borderRadius: 100,
            padding: '5px 14px',
            marginBottom: 24,
          }}>
            <Wand2 size={13} color="#a78bfa" />
            <span style={{ fontSize: 13, color: '#a78bfa' }}>Free to start, no credit card required</span>
          </div>
          <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.1 }}>
            Ready to ship Flutter apps faster?
          </h2>
          <p style={{ fontSize: 16, color: '#6b6b8a', marginBottom: 36, lineHeight: 1.7 }}>
            Join 12,000+ Flutter developers using Brillance to turn designs into code in seconds.
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#7C6AF7',
              border: 'none',
              color: '#fff',
              padding: '16px 36px',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 700,
              boxShadow: '0 0 60px rgba(124,106,247,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6b59e8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#7C6AF7'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start Building for Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 32px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Brillance</span>
            <span style={{ color: '#4a4a6a', fontSize: 13, marginLeft: 12 }}>© 2026 Brillance Inc.</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Docs', 'Blog', 'Status'].map(link => (
              <button key={link} style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', fontSize: 14 }}>{link}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Github size={18} color="#6b6b8a" style={{ cursor: 'pointer' }} />
            <Twitter size={18} color="#6b6b8a" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </footer>
    </div>
  );
}
