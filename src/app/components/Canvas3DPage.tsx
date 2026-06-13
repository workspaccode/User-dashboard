import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import {
  Box, Circle, Layers, RotateCw, ZoomIn, ZoomOut,
  Sun, Lightbulb, Download, Code2, Eye, Grid3X3, PenTool,
  Sliders, Copy, ChevronDown, Plus, Minus
} from 'lucide-react';

interface SceneObject {
  id: string;
  type: 'Box' | 'Sphere' | 'Cylinder' | 'Plane' | 'Torus';
  color: string;
  roughness: number;
  metalness: number;
  x: number;
  y: number;
  z: number;
  label: string;
}

const INITIAL_OBJECTS: SceneObject[] = [
  { id: 'box1', type: 'Box', color: '#7C6AF7', roughness: 0.4, metalness: 0.6, x: 0, y: 0, z: 0, label: 'Main Cube' },
  { id: 'plane1', type: 'Plane', color: '#1a1a28', roughness: 0.9, metalness: 0, x: 0, y: -1, z: 0, label: 'Ground Plane' },
  { id: 'sphere1', type: 'Sphere', color: '#10b981', roughness: 0.2, metalness: 0.8, x: 2, y: 0, z: -1, label: 'Accent Sphere' },
];

const PRIMITIVES = [
  { type: 'Box', icon: Box, color: '#7C6AF7' },
  { type: 'Sphere', icon: Circle, color: '#10b981' },
  { type: 'Cylinder', icon: Minus, color: '#60a5fa' },
  { type: 'Plane', icon: Grid3X3, color: '#6b6b8a' },
  { type: 'Torus', icon: RotateCw, color: '#f472b6' },
];

function ThreeDScene({ objects, selected }: { objects: SceneObject[]; selected: string | null }) {
  return (
    <svg viewBox="0 0 500 380" style={{ width: '100%', height: '100%' }}>
      {/* Background */}
      <defs>
        <radialGradient id="sceneBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </radialGradient>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C6AF7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7C6AF7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="500" height="380" fill="url(#sceneBg)" />

      {/* Grid lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i}>
          <line
            x1={50 + i * 36}
            y1={200}
            x2={250 + i * 18}
            y2={320}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.8"
          />
          <line
            x1={50 + i * 36}
            y1={200}
            x2={50 - i * 18}
            y2={320}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.8"
          />
        </g>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1={50 + i * 33}
          y1={200 + i * 20}
          x2={450 - i * 33}
          y2={200 + i * 20}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.8"
        />
      ))}

      {/* Accent sphere */}
      <ellipse cx={360} cy={170} rx={60} ry={60} fill="url(#glow2)" />
      <ellipse cx={360} cy={170} rx={42} ry={42} fill="#10b981" fillOpacity={0.85} />
      <ellipse cx={346} cy={156} rx={12} ry={8} fill="white" fillOpacity={0.3} />
      {objects.find(o => o.id === 'sphere1') && selected === 'sphere1' && (
        <ellipse cx={360} cy={170} rx={46} ry={46} fill="none" stroke="#7C6AF7" strokeWidth="1.5" strokeDasharray="4 2" />
      )}

      {/* Main cube — isometric box */}
      <ellipse cx={215} cy={200} rx={100} ry={35} fill="url(#glow1)" />
      {/* Bottom face */}
      <polygon
        points="155,240 215,270 275,240 215,210"
        fill={selected === 'box1' ? '#6b59e8' : '#5b4fd8'}
        opacity={0.9}
      />
      {/* Left face */}
      <polygon
        points="155,160 155,240 215,270 215,190"
        fill={selected === 'box1' ? '#7C6AF7' : '#6b5ee0'}
        opacity={0.9}
      />
      {/* Right face */}
      <polygon
        points="275,160 275,240 215,270 215,190"
        fill={selected === 'box1' ? '#9070f8' : '#7C6AF7'}
        opacity={0.9}
      />
      {/* Top face */}
      <polygon
        points="155,160 215,130 275,160 215,190"
        fill={selected === 'box1' ? '#a589fa' : '#8f7bf7'}
        opacity={0.95}
      />
      {/* Highlight */}
      <polygon
        points="165,165 205,145 245,165 205,185"
        fill="white"
        opacity={0.08}
      />
      {selected === 'box1' && (
        <polygon
          points="155,160 215,130 275,160 275,240 215,270 155,240"
          fill="none"
          stroke="#7C6AF7"
          strokeWidth="1.5"
        />
      )}

      {/* Ground shadow */}
      <ellipse cx={215} cy={282} rx={68} ry={12} fill="black" fillOpacity={0.3} />

      {/* Axes */}
      <line x1="30" y1="340" x2="80" y2="340" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowR)" />
      <line x1="30" y1="340" x2="30" y2="290" stroke="#10b981" strokeWidth="1.5" />
      <line x1="30" y1="340" x2="55" y2="316" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="85" y="344" fill="#ef4444" fontSize="10" fontFamily="monospace">X</text>
      <text x="25" y="285" fill="#10b981" fontSize="10" fontFamily="monospace">Y</text>
      <text x="58" y="313" fill="#3b82f6" fontSize="10" fontFamily="monospace">Z</text>

      {/* Labels */}
      <text x="215" y="125" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="10" fontFamily="monospace">Main Cube</text>
      <text x="365" y="125" textAnchor="middle" fill="#10b981" fillOpacity="0.7" fontSize="10" fontFamily="monospace">Sphere</text>
    </svg>
  );
}

const FLUTTER_3D = `// Generated Flutter widget using three_js
// pub.dev/packages/three_js

import 'package:three_js/three_js.dart';

class BrillanceScene3D extends StatefulWidget {
  const BrillanceScene3D({
    super.key,
    required this.sceneJson,
    this.width = double.infinity,
    this.height = 300,
    this.allowOrbit = true,
  });

  final Map<String, dynamic> sceneJson;
  final double width;
  final double height;
  final bool allowOrbit;

  @override
  State<BrillanceScene3D> createState()
      => _BrillanceScene3DState();
}

class _BrillanceScene3DState
    extends State<BrillanceScene3D> {
  late ThreeJS threeJs;

  @override
  void initState() {
    super.initState();
    threeJs = ThreeJS(
      onSetupComplete: _buildScene,
      settings: Settings(height: widget.height),
    );
  }

  void _buildScene() {
    final scene = threeJs.scene;
    final camera = threeJs.camera;
    camera.position.setValues(0, 0, 5);

    // Build from JSON
    for (final obj in widget.sceneJson['objects']) {
      final geo = _createGeometry(obj['type'],
          obj['args'].cast<double>());
      final mat = MeshStandardMaterial(
        color: Color(int.parse(
            obj['material']['color']
            .replaceFirst('#', '0xFF'))),
        roughness: obj['material']['roughness'],
        metalness: obj['material']['metalness'],
      );
      final mesh = Mesh(geo, mat);
      final pos = obj['position'];
      mesh.position.setValues(
          pos[0], pos[1], pos[2]);
      scene.add(mesh);
    }

    // Lights
    scene.add(AmbientLight(0xffffff, 0.5));
    final dir = DirectionalLight(0xffffff, 1);
    dir.position.setValues(5, 10, 5);
    scene.add(dir);
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: threeJs.build(),
    );
  }
}`;

export function Canvas3DPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [objects, setObjects] = useState<SceneObject[]>(INITIAL_OBJECTS);
  const [selected, setSelected] = useState<string>('box1');
  const [showCode, setShowCode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const sel = objects.find(o => o.id === selected);

  const addObject = (type: SceneObject['type'], color: string) => {
    const newObj: SceneObject = {
      id: `${type.toLowerCase()}${Date.now()}`,
      type,
      color,
      roughness: 0.5,
      metalness: 0.3,
      x: Math.random() * 4 - 2,
      y: 0,
      z: Math.random() * 2 - 1,
      label: `New ${type}`,
    };
    setObjects(prev => [...prev, newObj]);
    setSelected(newObj.id);
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: '#0a0a0f', fontFamily: 'var(--font-sans)', overflow: 'hidden', color: '#e8e8f0' }}>
      {/* Left panel */}
      <div style={{ width: 200, flexShrink: 0, background: '#0e0e16', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Primitives */}
        <div style={{ padding: '12px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 11, color: '#4a4a6a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Add Primitive</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {PRIMITIVES.map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.type}
                  onClick={() => addObject(p.type as SceneObject['type'], p.color)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 6,
                    padding: '6px 8px',
                    cursor: 'pointer',
                    color: '#c8c8e0',
                    fontSize: 12,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${p.color}50`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  <Icon size={12} color={p.color} />
                  {p.type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scene objects */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 8px' }}>
          <div style={{ fontSize: 11, color: '#4a4a6a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, padding: '0 6px' }}>Scene Objects</div>
          {objects.map(obj => (
            <button
              key={obj.id}
              onClick={() => setSelected(obj.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 8px',
                borderRadius: 6,
                border: 'none',
                background: selected === obj.id ? 'rgba(124,106,247,0.12)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 2, background: obj.color, flexShrink: 0 }} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, color: selected === obj.id ? '#a78bfa' : '#c8c8e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{obj.label}</div>
                <div style={{ fontSize: 10, color: '#4a4a6a' }}>{obj.type}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Lighting presets */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 11, color: '#4a4a6a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Lighting</div>
          {[
            { label: 'Ambient', icon: Sun, value: '0.5' },
            { label: 'Directional', icon: Lightbulb, value: '1.0' },
          ].map(light => {
            const Icon = light.icon;
            return (
              <div key={light.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={13} color="#6b6b8a" />
                <span style={{ fontSize: 12, color: '#6b6b8a', flex: 1 }}>{light.label}</span>
                <div style={{ background: '#1a1a28', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#c8c8e0', fontFamily: 'var(--font-mono)' }}>{light.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center: 3D viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ height: 44, flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, background: 'rgba(10,10,15,0.8)' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.25)', borderRadius: 7, padding: '4px 12px', color: '#fbbf24', fontSize: 12, fontWeight: 600, alignItems: 'center', gap: 6 }}>
            <Box size={13} />
            3D Mode
          </div>
          <button
            onClick={() => navigate(`/project/${id}/canvas`)}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <PenTool size={13} />
            Switch to 2D
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setShowGrid(v => !v)}
            style={{ background: showGrid ? 'rgba(124,106,247,0.1)' : 'none', border: '1px solid rgba(255,255,255,0.07)', color: showGrid ? '#a78bfa' : '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Grid3X3 size={13} />
            Grid
          </button>
          <button
            onClick={() => setShowCode(v => !v)}
            style={{ background: showCode ? 'rgba(16,185,129,0.1)' : 'none', border: '1px solid rgba(255,255,255,0.07)', color: showCode ? '#10b981' : '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Code2 size={13} />
            Flutter Code
          </button>
          <button style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)', color: '#a78bfa', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Download size={13} />
            Export PNG
          </button>
        </div>

        {/* 3D + Code split */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 3D view */}
          <div style={{ flex: 1, position: 'relative', background: '#0a0a12', overflow: 'hidden' }}>
            <ThreeDScene objects={objects} selected={selected} />

            {/* Orbit controls hint */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 8 }}>
              {['Orbit: Drag', 'Zoom: Scroll', 'Pan: Middle'].map(hint => (
                <div key={hint} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 5, padding: '4px 10px', fontSize: 11, color: '#6b6b8a' }}>{hint}</div>
              ))}
            </div>

            {/* Camera controls */}
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { icon: ZoomIn, label: 'Zoom In' },
                { icon: ZoomOut, label: 'Zoom Out' },
                { icon: RotateCw, label: 'Reset Camera' },
              ].map(ctrl => {
                const Icon = ctrl.icon;
                return (
                  <button
                    key={ctrl.label}
                    title={ctrl.label}
                    style={{ width: 32, height: 32, background: 'rgba(10,10,15,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#6b6b8a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code panel */}
          {showCode && (
            <div style={{ width: 340, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.05)', background: '#0a0a0f', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>Flutter Widget</span>
                <button style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Copy size={12} /> Copy
                </button>
              </div>
              <div style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
                {FLUTTER_3D.split('\n').map((line, i) => {
                  const colored = line
                    .replace(/(\/\/.*)/g, '<span style="color:#4a4a6a">$1</span>')
                    .replace(/\b(import|class|extends|const|final|required|override|return|void|super|late|for|in)\b/g, '<span style="color:#a78bfa">$1</span>')
                    .replace(/\b(ThreeJS|Settings|MeshStandardMaterial|Color|Mesh|AmbientLight|DirectionalLight|StatefulWidget|State|Widget|BuildContext|SizedBox|Map|List|String|double|bool|dynamic)\b/g, '<span style="color:#60a5fa">$1</span>')
                    .replace(/'([^']*)'/g, '<span style="color:#34d399">\'$1\'</span>');

                  return (
                    <div key={i} style={{ display: 'flex' }}>
                      <span style={{ width: 36, textAlign: 'right', color: '#2a2a42', fontSize: 11, paddingRight: 12, paddingLeft: 8, flexShrink: 0, userSelect: 'none', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#c8c8e0', whiteSpace: 'pre', flex: 1, paddingRight: 12 }} dangerouslySetInnerHTML={{ __html: colored }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Properties */}
      <div style={{ width: 220, flexShrink: 0, background: '#0e0e16', borderLeft: '1px solid rgba(255,255,255,0.05)', overflow: 'auto', fontSize: 13 }}>
        {sel ? (
          <>
            <div style={{ padding: '14px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{sel.label}</div>
              <div style={{ fontSize: 11, color: '#6b6b8a', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{sel.type}Geometry</div>
            </div>

            <PropSection title="Material">
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#4a4a6a', marginBottom: 6 }}>Color</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: sel.color, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  <div style={{ flex: 1, background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '6px 8px', fontSize: 12, color: '#c8c8e0', fontFamily: 'var(--font-mono)' }}>{sel.color}</div>
                </div>
              </div>
              <SliderRow label="Roughness" value={sel.roughness} />
              <SliderRow label="Metalness" value={sel.metalness} />
            </PropSection>

            <PropSection title="Position">
              <NumRow label="X" value={sel.x} />
              <NumRow label="Y" value={sel.y} />
              <NumRow label="Z" value={sel.z} />
            </PropSection>

            <PropSection title="Rotation">
              <NumRow label="Rx" value={0} />
              <NumRow label="Ry" value={0.3} />
              <NumRow label="Rz" value={0} />
            </PropSection>

            <div style={{ padding: '12px 14px' }}>
              <button style={{ width: '100%', background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)', color: '#a78bfa', padding: '9px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Eye size={14} />
                View in Flutter
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: 20, color: '#4a4a6a', fontSize: 13 }}>Select an object to edit</div>
        )}
      </div>
    </div>
  );
}

function PropSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: 11, color: '#4a4a6a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function SliderRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#6b6b8a' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#c8c8e0', fontFamily: 'var(--font-mono)' }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ position: 'relative', height: 4, background: '#1a1a28', borderRadius: 2 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${value * 100}%`, background: '#7C6AF7', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: '50%', left: `${value * 100}%`, transform: 'translate(-50%, -50%)', width: 12, height: 12, borderRadius: '50%', background: '#fff', border: '2px solid #7C6AF7', cursor: 'pointer' }} />
      </div>
    </div>
  );
}

function NumRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <span style={{ width: 16, fontSize: 11, color: '#6b6b8a', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '5px 8px', fontSize: 12, color: '#c8c8e0', fontFamily: 'var(--font-mono)' }}>
        {value.toFixed(2)}
      </div>
    </div>
  );
}
