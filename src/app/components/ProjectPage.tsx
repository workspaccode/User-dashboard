import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import {
  Search, Filter, Copy, Check, Moon, Sun, AlignRight,
  Layers, Code2, PenTool, Box, ChevronRight, Download,
  ExternalLink, Eye, Layout, Type, Square, Circle, Hash
} from 'lucide-react';

// Fallback initial list
const COMPONENTS = [
  {
    id: '1', name: 'PrimaryButton', type: 'button', variants: 4, color: '#7C6AF7',
  },
  {
    id: '2', name: 'ProductCard', type: 'card', variants: 3, color: '#10b981',
  },
  {
    id: '3', name: 'SearchInput', type: 'input', variants: 2, color: '#60a5fa',
  },
  {
    id: '4', name: 'NavBar', type: 'navbar', variants: 2, color: '#fbbf24',
  },
  {
    id: '5', name: 'AlertModal', type: 'modal', variants: 3, color: '#ef4444',
  },
  {
    id: '6', name: 'UserAvatar', type: 'custom', variants: 2, color: '#a78bfa',
  },
  {
    id: '7', name: 'DataTable', type: 'custom', variants: 1, color: '#34d399',
  },
  {
    id: '8', name: 'BadgeChip', type: 'custom', variants: 5, color: '#fb923c',
  },
];

function DynamicComponentPreview({ component, darkTheme }: { component: any; darkTheme: boolean }) {
  if (!component) return null;
  const styles = component.styles || {};
  const bounds = component.bounds || {};
  const type = component.type;
  const content = component.content || "";

  const bg = styles.bg || (type === 'button' ? '#7C6AF7' : type === 'card' ? '#16161f' : '#111118');
  const color = styles.color || '#ffffff';
  const radius = styles.radius !== undefined ? styles.radius : 8;
  const padding = styles.padding || [12, 24];
  const w = bounds.w || 200;
  const h = bounds.h || 44;

  if (type === 'button') {
    return (
      <button style={{
        background: bg,
        color: color,
        border: 'none',
        padding: `${padding[0]}px ${padding[1] !== undefined ? padding[1] : padding[0]}px`,
        borderRadius: radius,
        fontSize: styles.fontSize || 14,
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      }}>
        {content || 'Button'}
      </button>
    );
  }

  if (type === 'input') {
    return (
      <input
        type="text"
        placeholder={content || 'Enter text...'}
        disabled
        style={{
          background: bg,
          color: color,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: `${padding[0]}px ${padding[1] !== undefined ? padding[1] : padding[0]}px`,
          borderRadius: radius,
          fontSize: styles.fontSize || 14,
          width: w || 220,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    );
  }

  if (type === 'card') {
    return (
      <div style={{
        background: bg,
        borderRadius: radius,
        padding: `${padding[0]}px`,
        width: w || 240,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        textAlign: 'left',
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: color, marginBottom: 8 }}>{content || 'Card Title'}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Dynamic parsed component style details.</div>
      </div>
    );
  }

  if (type === 'navbar') {
    return (
      <div style={{
        background: bg,
        width: '100%',
        maxWidth: 320,
        height: h || 52,
        padding: `0 16px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: radius,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: '#fff', opacity: 0.8 }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{content || 'Brand'}</span>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: '#fff', opacity: 0.8 }} />
      </div>
    );
  }

  return (
    <div style={{
      background: bg,
      borderRadius: radius,
      padding: `${padding[0]}px`,
      width: w || 200,
      color: color,
      fontSize: styles.fontSize || 13,
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {content || 'Custom Section Content'}
    </div>
  );
}

type Tab = 'widget' | 'tokens' | 'usage';

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lines = code.split('\n');
  return (
    <div style={{ position: 'relative', background: '#0a0a0f', borderRadius: 8, overflow: 'hidden', height: '100%' }}>
      <button
        onClick={copyCode}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
          color: copied ? '#10b981' : '#6b6b8a',
          padding: '4px 10px',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          zIndex: 1,
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div style={{ overflow: 'auto', height: '100%', padding: '16px 0' }}>
        {lines.map((line, i) => {
          const colored = line
            .replace(/\/(\/.*)/g, '<span style="color:#4a4a6a">/$1</span>')
            .replace(/\b(class|extends|const|final|required|override|return|this|null|true|false|void|super)\b/g, '<span style="color:#a78bfa">$1</span>')
            .replace(/\b(Widget|BuildContext|StatelessWidget|FilledButton|SizedBox|RoundedRectangleBorder|BorderRadius|EdgeInsets|CircularProgressIndicator|Text|Theme|ColorScheme|String|bool|double)\b/g, '<span style="color:#60a5fa">$1</span>')
            .replace(/'([^']*)'/g, '<span style="color:#34d399">\'$1\'</span>');

          return (
            <div key={i} style={{ display: 'flex', paddingLeft: 0 }}>
              <span style={{ width: 40, textAlign: 'right', color: '#3a3a52', fontSize: 12, paddingRight: 16, paddingLeft: 12, flexShrink: 0, userSelect: 'none', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
              <span
                style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#c8c8e0', whiteSpace: 'pre', flex: 1, paddingRight: 16 }}
                dangerouslySetInnerHTML={{ __html: colored }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  button: '#7C6AF7', card: '#10b981', input: '#60a5fa',
  navbar: '#fbbf24', modal: '#ef4444', custom: '#a78bfa',
};

export function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Dynamic component states
  const [componentsList, setComponentsList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('widget');
  const [darkPreview, setDarkPreview] = useState(true);
  const [flutterCode, setFlutterCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);
  const [projectName, setProjectName] = useState('Noon E-Commerce');

  // Load components and metadata dynamically
  useEffect(() => {
    if (!id) return;

    const loadProjectAndComponents = async () => {
      try {
        // Fetch project metadata
        const projectRes = await fetch(`http://localhost:8000/api/projects/${id}`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProjectName(projectData.name);
        } else {
          const fallbackNames: Record<string, string> = {
            '1': 'Noon E-Commerce App',
            '2': 'Paystack Dashboard',
            '3': 'Grab Mobile UI',
            '4': 'Careem Design System',
          };
          setProjectName(fallbackNames[id] || 'Custom Project');
        }

        // Fetch project components
        const componentsRes = await fetch(`http://localhost:8000/api/projects/${id}/components`);
        if (componentsRes.ok) {
          const componentsData = await componentsRes.json();
          if (componentsData && componentsData.length > 0) {
            setComponentsList(componentsData);
            setSelected(componentsData[0]);
            return;
          }
        }
        throw new Error('Fallback to static components');
      } catch (err) {
        console.warn('Backend fetch failed, using fallback component lists.');
        
        // Try reading local storage first
        const stored = localStorage.getItem('brillance_parsed_components');
        const storedName = localStorage.getItem('brillance_project_name');
        
        if (stored && (storedName === id || id === '1')) {
          const parsed = JSON.parse(stored);
          setComponentsList(parsed);
          setSelected(parsed[0]);
        } else {
          // Fallback to static sample components
          const initial = COMPONENTS.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            variants: c.variants,
            color: c.color,
            content: c.name === 'PrimaryButton' ? 'Get Started' : c.name === 'SearchInput' ? 'Search components...' : 'Sample content',
            styles: {
              bg: c.color,
              color: '#ffffff',
              radius: 8,
              padding: [12, 24]
            },
            bounds: {
              w: c.name === 'NavBar' ? 260 : 180,
              h: 44
            }
          }));
          setComponentsList(initial);
          setSelected(initial[0]);
        }
      }
    };

    loadProjectAndComponents();
  }, [id]);

  // Fetch Flutter code dynamically when selected component changes
  useEffect(() => {
    if (!selected) return;
    
    const fetchCode = async () => {
      setLoadingCode(true);
      try {
        const response = await fetch('http://localhost:8000/generate/flutter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            component_tree: selected,
            options: {
              rtl: false,
              theme: 'material3',
            },
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to generate code');
        }
        const data = await response.json();
        setFlutterCode(data.code);
      } catch (err) {
        console.error(err);
        setFlutterCode(`// Fallback generated Flutter Widget\nclass ${selected.name} extends StatelessWidget {\n  const ${selected.name}({super.key});\n  @override\n  Widget build(BuildContext context) {\n    return Container();\n  }\n}`);
      } finally {
        setLoadingCode(false);
      }
    };
    
    fetchCode();
  }, [selected]);

  const types = ['all', 'button', 'card', 'input', 'navbar', 'modal', 'custom'];
  const filtered = componentsList.filter(c =>
    (filter === 'all' || c.type === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'var(--font-sans)', color: '#e8e8f0', overflow: 'hidden' }}>
      {/* Left: Component list */}
      <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: '#0e0e16', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{projectName}</div>
              <div style={{ fontSize: 12, color: '#6b6b8a' }}>{componentsList.length} components</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => navigate(`/project/${id}/canvas`)}
                title="Open Canvas"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b6b8a', padding: 6, borderRadius: 6, cursor: 'pointer' }}
              >
                <PenTool size={14} />
              </button>
              <button
                onClick={() => navigate(`/project/${id}/canvas/3d`)}
                title="3D Canvas"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b6b8a', padding: 6, borderRadius: 6, cursor: 'pointer' }}
              >
                <Box size={14} />
              </button>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={13} color="#4a4a6a" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ width: '100%', background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '7px 10px 7px 30px', color: '#e8e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Type filters */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                background: filter === t ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filter === t ? 'rgba(124,106,247,0.3)' : 'rgba(255,255,255,0.07)'}`,
                color: filter === t ? '#a78bfa' : '#6b6b8a',
                padding: '3px 10px',
                borderRadius: 100,
                cursor: 'pointer',
                fontSize: 12,
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Component list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 8px' }}>
          {filtered.map(comp => (
            <button
              key={comp.id}
              onClick={() => setSelected(comp)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 8,
                border: 'none',
                background: selected && selected.id === comp.id ? 'rgba(124,106,247,0.1)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!selected || selected.id !== comp.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!selected || selected.id !== comp.id) e.currentTarget.style.background = 'none'; }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: comp.color || '#7C6AF7', flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, color: selected && selected.id === comp.id ? '#a78bfa' : '#c8c8e0', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{comp.name}</div>
                <div style={{ fontSize: 11, color: '#4a4a6a' }}>{comp.variants || 1} variant{comp.variants !== 1 ? 's' : ''}</div>
              </div>
              <span style={{
                fontSize: 10,
                color: TYPE_COLORS[comp.type] || '#6b6b8a',
                background: `${TYPE_COLORS[comp.type] || '#6b6b8a'}15`,
                border: `1px solid ${TYPE_COLORS[comp.type] || '#6b6b8a'}25`,
                padding: '2px 7px',
                borderRadius: 4,
                flexShrink: 0,
              }}>{comp.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Preview toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
          {selected && (
            <div>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{selected.name}</span>
              <ChevronRight size={14} color="#4a4a6a" style={{ display: 'inline', marginLeft: 6 }} />
              <span style={{ fontSize: 13, color: '#6b6b8a' }}>{selected.type}</span>
            </div>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              onClick={() => setDarkPreview(d => !d)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {darkPreview ? <Moon size={13} /> : <Sun size={13} />}
              {darkPreview ? 'Dark' : 'Light'}
            </button>
            <button
              onClick={() => navigate(`/project/${id}/canvas`)}
              style={{ background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)', color: '#a78bfa', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <PenTool size={13} />
              Edit in Canvas
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div style={{
          flex: '0 0 auto',
          background: darkPreview ? '#0e0e16' : '#f5f5f7',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          minHeight: 200,
        }}>
          {selected ? (
            <DynamicComponentPreview component={selected} darkTheme={darkPreview} />
          ) : (
            <div style={{ color: '#6b6b8a', fontSize: 14 }}>No component selected</div>
          )}
        </div>

        {/* Tabs + code */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 20px', gap: 4 }}>
          {(['widget', 'tokens', 'usage'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #7C6AF7' : '2px solid transparent',
                color: activeTab === tab ? '#a78bfa' : '#6b6b8a',
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                textTransform: 'capitalize',
                transition: 'color 0.15s',
              }}
            >
              {tab === 'widget' ? 'Widget Code' : tab === 'tokens' ? 'Theme Tokens' : 'Usage Example'}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '12px 20px', paddingBottom: 0 }}>
          {activeTab === 'widget' && (
            <CodeBlock code={loadingCode ? 'Generating Flutter code from ComponentTree...' : flutterCode} />
          )}
          {activeTab === 'tokens' && selected && (
            <div style={{ height: '100%', overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.8 }}>
              {[
                ['styles.bg', selected.styles?.bg || '#7C6AF7', '#color'],
                ['styles.color', selected.styles?.color || '#ffffff', '#color'],
                ['styles.radius', `${selected.styles?.radius !== undefined ? selected.styles.radius : 8}px`, '#shape'],
                ['styles.padding', JSON.stringify(selected.styles?.padding || [12, 24]), '#spacing'],
                ['bounds.w', `${selected.bounds?.w || 200}px`, '#layout'],
                ['bounds.h', `${selected.bounds?.h || 44}px`, '#layout'],
              ].map(([key, val, kind]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#a78bfa', flex: 1 }}>{key}</span>
                  <span style={{ color: '#34d399' }}>{val}</span>
                  <span style={{ color: '#4a4a6a', fontSize: 11 }}>{kind}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'usage' && selected && (
            <CodeBlock code={`// Usage example - drop into any widget tree
@override
Widget build(BuildContext context) {
  return Scaffold(
    body: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          ${selected.name}(),
          const SizedBox(height: 12),
          Text(
            'Rendered inside ${projectName}',
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    ),
  );
}`} />
          )}
        </div>
      </div>
    </div>
  );
}
