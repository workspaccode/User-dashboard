import { useNavigate, useParams } from 'react-router';
import { useState, useCallback } from 'react';
import {
  MousePointer2, Square, Circle, Type, Image, Minus, ArrowRight,
  Layers, Undo2, Redo2, ZoomIn, ZoomOut, Download, Box,
  Eye, EyeOff, Lock, Unlock, Trash2, Copy, Group, Loader2,
  ChevronDown, ChevronRight as ChevronR
} from 'lucide-react';
import { toast } from 'sonner';
import { apiJson } from '../lib/api';

type Tool = 'select' | 'rect' | 'circle' | 'text' | 'image' | 'line' | 'arrow' | 'container';

interface CanvasItem {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  label?: string;
  visible: boolean;
  locked: boolean;
  radius?: number;
}

const INITIAL_ITEMS: CanvasItem[] = [
  { id: 'bg', type: 'rect', x: 60, y: 40, w: 320, h: 480, fill: '#111118', label: 'App Frame', visible: true, locked: false, radius: 16 },
  { id: 'nav', type: 'rect', x: 60, y: 40, w: 320, h: 52, fill: '#0e0e16', label: 'NavBar', visible: true, locked: false },
  { id: 'logo', type: 'rect', x: 80, y: 55, w: 22, h: 22, fill: '#7C6AF7', label: 'Logo', visible: true, locked: false, radius: 6 },
  { id: 'hero', type: 'rect', x: 80, y: 120, w: 280, h: 140, fill: 'rgba(124,106,247,0.08)', label: 'Hero Section', visible: true, locked: false, radius: 12 },
  { id: 'btn', type: 'rect', x: 120, y: 320, w: 200, h: 44, fill: '#7C6AF7', label: 'PrimaryButton', visible: true, locked: false, radius: 8 },
  { id: 'card1', type: 'rect', x: 80, y: 390, w: 120, h: 100, fill: '#16161f', label: 'ProductCard', visible: true, locked: false, radius: 10 },
  { id: 'card2', type: 'rect', x: 220, y: 390, w: 120, h: 100, fill: '#16161f', label: 'ProductCard', visible: true, locked: false, radius: 10 },
];

const TOOL_BTNS: { id: Tool; icon: any; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'rect', icon: Square, label: 'Rectangle (R)' },
  { id: 'circle', icon: Circle, label: 'Circle (O)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
  { id: 'image', icon: Image, label: 'Image (I)' },
  { id: 'line', icon: Minus, label: 'Line (L)' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { id: 'container', icon: Group, label: 'Container' },
];

export function CanvasPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [items, setItems] = useState<CanvasItem[]>(INITIAL_ITEMS);
  const [selected, setSelected] = useState<string | null>('btn');
  const [zoom, setZoom] = useState(100);
  const [layersOpen, setLayersOpen] = useState(true);
  const [exporting, setExporting] = useState(false);

  const selectedItem = items.find(i => i.id === selected);

  const handleExportFlutter = useCallback(async () => {
    setExporting(true);
    try {
      const componentTree = {
        id: 'canvas-export',
        name: 'CanvasComponent',
        type: 'container',
        children: items.filter(i => i.visible).map(item => ({
          id: item.id,
          type: item.type,
          styles: {
            bg: item.fill,
            w: item.w,
            h: item.h,
            x: item.x,
            y: item.y,
            radius: item.radius,
          },
        })),
      };
      const data = await apiJson('/generate/flutter', {
        method: 'POST',
        body: JSON.stringify({ component_tree: componentTree }),
      });
      toast.success('Flutter code generated!');
      navigator.clipboard.writeText(data.code);
      toast.success('Code copied to clipboard');
    } catch {
      toast.error('Failed to generate Flutter code');
    } finally {
      setExporting(false);
    }
  }, [items]);

  const toggleVisibility = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, visible: !i.visible } : i));
  };

  const toggleLock = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, locked: !i.locked } : i));
  };

  const updateProp = (key: keyof CanvasItem, value: any) => {
    if (!selected) return;
    setItems(items.map(i => i.id === selected ? { ...i, [key]: value } : i));
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: '#0a0a0f', fontFamily: 'var(--font-sans)', overflow: 'hidden', color: '#e8e8f0' }}>
      {/* Left: Tools + Layers */}
      <div style={{ width: 52, flexShrink: 0, background: '#0e0e16', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 4 }}>
        {TOOL_BTNS.map(btn => {
          const Icon = btn.icon;
          const active = activeTool === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTool(btn.id)}
              title={btn.label}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: active ? 'rgba(124,106,247,0.2)' : 'none',
                border: active ? '1px solid rgba(124,106,247,0.4)' : '1px solid transparent',
                color: active ? '#a78bfa' : '#6b6b8a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e8e8f0'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6b6b8a'; } }}
            >
              <Icon size={16} />
            </button>
          );
        })}

        <div style={{ flex: 1 }} />
        <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 8 }} />

        {/* 3D mode */}
        <button
          onClick={() => navigate(`/project/${id}/canvas/3d`)}
          title="Switch to 3D Mode"
          style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.2)', color: '#fbbf24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box size={16} />
        </button>
      </div>

      {/* Layers panel */}
      <div style={{ width: 200, flexShrink: 0, background: '#0e0e16', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{ padding: '12px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          onClick={() => setLayersOpen(v => !v)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#c8c8e0' }}>
            <Layers size={14} />
            Layers
          </div>
          {layersOpen ? <ChevronDown size={13} color="#4a4a6a" /> : <ChevronR size={13} color="#4a4a6a" />}
        </div>
        {layersOpen && (
          <div style={{ flex: 1, overflow: 'auto', padding: '6px 6px' }}>
            {[...items].reverse().map((item, i) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: selected === item.id ? 'rgba(124,106,247,0.12)' : 'none',
                  cursor: 'pointer',
                  marginBottom: 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (selected !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (selected !== item.id) e.currentTarget.style.background = 'none'; }}
              >
                <Square size={11} color={selected === item.id ? '#a78bfa' : '#4a4a6a'} />
                <span style={{ flex: 1, fontSize: 12, color: selected === item.id ? '#a78bfa' : '#c8c8e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-mono)' }}>
                  {item.label || item.type}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); toggleVisibility(item.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a4a6a', padding: 2, display: 'flex' }}
                >
                  {item.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); toggleLock(item.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a4a6a', padding: 2, display: 'flex' }}
                >
                  {item.locked ? <Lock size={11} /> : <Unlock size={11} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Canvas toolbar */}
        <div style={{ height: 44, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, background: 'rgba(10,10,15,0.8)' }}>
          <button style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', padding: 5, borderRadius: 5 }}><Undo2 size={15} /></button>
          <button style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', padding: 5, borderRadius: 5 }}><Redo2 size={15} /></button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)' }} />
          <button onClick={() => setZoom(z => Math.max(25, z - 25))} style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', padding: 5, borderRadius: 5 }}><ZoomOut size={15} /></button>
          <span style={{ fontSize: 13, color: '#6b6b8a', minWidth: 40, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(400, z + 25))} style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', padding: 5, borderRadius: 5 }}><ZoomIn size={15} /></button>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleExportFlutter}
            disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: exporting ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: exporting ? '#6b6b8a' : '#10b981', padding: '5px 12px', borderRadius: 7, cursor: exporting ? 'not-allowed' : 'pointer', fontSize: 13 }}>
            {exporting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={13} />}
            {exporting ? 'Generating...' : 'Export'}
          </button>
        </div>

        {/* Canvas area */}
        <div style={{ flex: 1, background: '#0e0e18', overflow: 'hidden', position: 'relative', cursor: activeTool === 'select' ? 'default' : 'crosshair' }}>
          {/* Grid */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Canvas content */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${zoom / 100})`, transformOrigin: 'center', transition: 'transform 0.1s' }}>
            {items.filter(i => i.visible).map(item => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                style={{
                  position: 'absolute',
                  left: item.x,
                  top: item.y,
                  width: item.w,
                  height: item.h,
                  background: item.fill,
                  borderRadius: item.radius || 0,
                  border: selected === item.id ? '1.5px solid #7C6AF7' : '1px solid transparent',
                  cursor: 'move',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.1s',
                  userSelect: 'none',
                }}
              >
                {item.id === 'btn' && (
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Get Started</span>
                )}
                {item.id === 'logo' && (
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>B</span>
                )}
                {(item.id === 'card1' || item.id === 'card2') && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(124,106,247,0.15)', borderRadius: 8, margin: '0 auto 6px' }} />
                    <div style={{ width: 60, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }} />
                  </div>
                )}
                {item.id === 'hero' && (
                  <div style={{ textAlign: 'center', padding: 16 }}>
                    <div style={{ width: 140, height: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 6, margin: '0 auto 8px' }} />
                    <div style={{ width: 100, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 6, margin: '0 auto' }} />
                  </div>
                )}
                {selected === item.id && (
                  <>
                    <div style={{ position: 'absolute', width: 7, height: 7, background: '#fff', border: '1.5px solid #7C6AF7', borderRadius: 1, top: -4, left: -4 }} />
                    <div style={{ position: 'absolute', width: 7, height: 7, background: '#fff', border: '1.5px solid #7C6AF7', borderRadius: 1, top: -4, right: -4 }} />
                    <div style={{ position: 'absolute', width: 7, height: 7, background: '#fff', border: '1.5px solid #7C6AF7', borderRadius: 1, bottom: -4, left: -4 }} />
                    <div style={{ position: 'absolute', width: 7, height: 7, background: '#fff', border: '1.5px solid #7C6AF7', borderRadius: 1, bottom: -4, right: -4 }} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Properties */}
      <div style={{ width: 240, flexShrink: 0, background: '#0e0e16', borderLeft: '1px solid rgba(255,255,255,0.05)', overflow: 'auto', fontSize: 13 }}>
        {selectedItem ? (
          <div>
            {/* Element info */}
            <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e8f0', marginBottom: 2 }}>{selectedItem.label || selectedItem.type}</div>
              <div style={{ fontSize: 11, color: '#6b6b8a', fontFamily: 'var(--font-mono)' }}>{selectedItem.type}</div>
            </div>

            {/* Transform */}
            <Section title="Transform">
              <Row2 label="X" value={selectedItem.x} unit="px" />
              <Row2 label="Y" value={selectedItem.y} unit="px" />
              <Row2 label="W" value={selectedItem.w} unit="px" />
              <Row2 label="H" value={selectedItem.h} unit="px" />
            </Section>

            {/* Fill */}
            <Section title="Fill">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: selectedItem.fill, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', flexShrink: 0 }} />
                <input
                  value={selectedItem.fill}
                  onChange={e => updateProp('fill', e.target.value)}
                  style={{ flex: 1, background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '6px 8px', color: '#e8e8f0', fontSize: 12, outline: 'none', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </Section>

            {/* Border */}
            <Section title="Border Radius">
              <Row2 label="Radius" value={selectedItem.radius || 0} unit="px" />
            </Section>

            {/* Shadow */}
            <Section title="Shadow">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b6b8a', fontSize: 12 }}>
                <span>+ Add shadow</span>
              </div>
            </Section>

            {/* Spacing */}
            <Section title="Spacing">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['Padding T', 'Padding B', 'Padding L', 'Padding R'].map(label => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: '#4a4a6a', marginBottom: 3 }}>{label}</div>
                    <div style={{ background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '5px 8px', color: '#c8c8e0', fontSize: 12, fontFamily: 'var(--font-mono)' }}>0</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Actions */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b6b8a', padding: '7px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <Copy size={12} /> Duplicate
              </button>
              <button style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '7px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: 20, color: '#4a4a6a', fontSize: 13, textAlign: 'center' }}>
            Select an element to edit its properties
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: 11, color: '#4a4a6a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Row2({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <span style={{ width: 16, fontSize: 11, color: '#6b6b8a', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 12, color: '#c8c8e0', fontFamily: 'var(--font-mono)', flex: 1 }}>{value}</span>
        <span style={{ fontSize: 11, color: '#4a4a6a' }}>{unit}</span>
      </div>
    </div>
  );
}
