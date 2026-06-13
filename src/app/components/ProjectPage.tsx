import { useNavigate, useParams } from 'react-router';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Filter, Copy, Check, Moon, Sun, AlignRight,
  Layers, Code2, PenTool, Box, ChevronRight, Download,
  ExternalLink, Eye, Layout, Type, Square, Circle, Hash,
  Globe, MousePointer, Loader2, PanelRightClose, PanelRightOpen,
  Figma, Upload, EyeOff, X, FileUp
} from 'lucide-react';
import { toast } from 'sonner';
import { GallerySkeleton, CodeSkeleton } from './Skeletons';
import { NoComponents } from './EmptyStates';

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
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied to clipboard');
    }).catch(() => {});
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
  
  // HTML Preview states
  const [htmlPreviewMode, setHtmlPreviewMode] = useState(false);
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [elementFlutterCode, setElementFlutterCode] = useState('');
  const [elementLoading, setElementLoading] = useState(false);
  const [savedComponents, setSavedComponents] = useState<any[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savingComponent, setSavingComponent] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Figma import states
  const [showFigmaImport, setShowFigmaImport] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [figmaImporting, setFigmaImporting] = useState(false);
  const [figmaError, setFigmaError] = useState('');
  const [figmaFileUploading, setFigmaFileUploading] = useState(false);
  const [galleryLoading] = useState(false);

  // SVG import state
  const [svgImporting, setSvgImporting] = useState(false);

  const handleSvgImport = useCallback(async (file: File) => {
    setSvgImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/parse/svg', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('SVG parse failed');
      const data = await res.json();
      const svgComps = (Array.isArray(data) ? data : data.components || []).map((c: any) => ({
        ...c,
        color: c.styles?.bg || '#10b981',
        source: 'svg',
      }));
      if (svgComps.length > 0) {
        setComponentsList(prev => [...svgComps, ...prev]);
        setSelected(svgComps[0]);
        toast.success(`Imported ${svgComps.length} component(s) from SVG`);
      }
    } catch (err: any) {
      console.error('SVG import error:', err);
      toast.error('SVG import failed', 'Make sure the backend is running');
    } finally {
      setSvgImporting(false);
    }
  }, []);

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
        toast.error('Could not load project', 'Using fallback data');
        
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

  // Fetch raw HTML for preview
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/projects/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.raw_html) setRawHtml(data.raw_html);
      })
      .catch(() => { toast.error('Failed to load HTML preview', 'Check backend connection'); });
  }, [id]);

  // Fetch saved components
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/projects/${id}/selected-components`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setSavedComponents(data))
      .catch(() => { toast.error('Failed to load saved components', 'Check backend connection'); });
  }, [id]);

  // Listen for iframe postMessage
  const fetchElementCode = useCallback(async (data: any) => {
    setElementLoading(true);
    try {
      const cssStr = Object.entries(data.computedStyles || {})
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
        .join('; ');

      const res = await fetch('http://localhost:8000/parse/html/element', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: data.html,
          context_css: cssStr,
          project_id: id,
        }),
      });
      if (!res.ok) throw new Error('Parse failed');
      const result = await res.json();
      setSelectedElement(result.component);
      setElementFlutterCode(result.flutter_code);
      toast.success('Element parsed successfully');
    } catch (err) {
      console.error(err);
      setElementFlutterCode('// Failed to generate code\n// Make sure the backend is running');
      toast.error('Failed to parse HTML element');
    } finally {
      setElementLoading(false);
    }
  }, [id]);

  // Figma import handler
  const handleFigmaImport = useCallback(async () => {
    setFigmaImporting(true);
    setFigmaError('');
    try {
      const res = await fetch('http://localhost:8000/parse/figma/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          figma_url: figmaUrl,
          access_token: figmaToken,
          project_id: id,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Figma import failed');
      }
      const data = await res.json();
      const figmaComps = data.components.map((c: any) => ({
        ...c,
        color: c.styles?.bg || '#7C6AF7',
        source: 'figma',
        figma_url: figmaUrl,
      }));
      setComponentsList(prev => [...figmaComps, ...prev]);
      if (figmaComps.length > 0) setSelected(figmaComps[0]);
      setShowFigmaImport(false);
      setFigmaUrl('');
      setFigmaToken('');
      toast.success(`Imported ${figmaComps.length} component(s) from Figma`);
    } catch (err: any) {
      setFigmaError(err.message || 'Figma import failed');
      toast.error('Figma import failed', err.message);
    } finally {
      setFigmaImporting(false);
    }
  }, [figmaUrl, figmaToken, id]);

  // Figma file upload handler
  const handleFigmaFileUpload = useCallback(async (file: File) => {
    setFigmaFileUploading(true);
    setFigmaError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/parse/figma/file', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Fig file import failed');
      }
      const data = await res.json();
      const figmaComps = data.components.map((c: any) => ({
        ...c,
        color: c.styles?.bg || '#7C6AF7',
        source: 'figma',
      }));
      setComponentsList(prev => [...figmaComps, ...prev]);
      if (figmaComps.length > 0) setSelected(figmaComps[0]);
      setShowFigmaImport(false);
      toast.success(`Imported ${figmaComps.length} component(s) from .fig file`);
    } catch (err: any) {
      setFigmaError(err.message || 'Fig file import failed');
      toast.error('.fig import failed', err.message);
    } finally {
      setFigmaFileUploading(false);
    }
  }, [id]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'ELEMENT_SELECTED') {
        fetchElementCode(event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [fetchElementCode]);

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
        toast.error('Failed to generate Flutter code', 'Backend may be unavailable');
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
              <button
                onClick={() => setShowFigmaImport(true)}
                title="Import from Figma"
                style={{ background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.2)', color: '#0a84ff', padding: 6, borderRadius: 6, cursor: 'pointer' }}
              >
                <Figma size={14} />
              </button>
              <input
                type="file" id="html-file-input" accept=".html,.htm"
                style={{ display: 'none' }}
                onChange={async e => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const formData = new FormData();
                    formData.append('file', f);
                    try {
                      const res = await fetch('http://localhost:8000/parse/html', { method: 'POST', body: formData });
                      if (res.ok) {
                        const comps = await res.json();
                        const mapped = comps.map((c: any) => ({ ...c, color: c.styles?.bg || '#7C6AF7', source: 'html' }));
                        setComponentsList(prev => [...mapped, ...prev]);
                        if (mapped.length > 0) setSelected(mapped[0]);
                        toast.success(`Imported ${mapped.length} component(s) from HTML`);
                      }
                    } catch (err) {
                      toast.error('HTML import failed');
                    }
                  }
                  e.target.value = '';
                }}
              />
              <input
                type="file" id="svg-file-input" accept=".svg"
                style={{ display: 'none' }}
                onChange={async e => {
                  const f = e.target.files?.[0];
                  if (f) await handleSvgImport(f);
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => document.getElementById('svg-file-input')?.click()}
                disabled={svgImporting}
                title="Import from SVG"
                style={{ background: svgImporting ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: svgImporting ? '#6b6b8a' : '#10b981', padding: 6, borderRadius: 6, cursor: svgImporting ? 'not-allowed' : 'pointer' }}
              >
                {svgImporting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FileUp size={14} />}
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

        {/* Saved components */}
        {htmlPreviewMode && savedComponents.length > 0 && (
          <div style={{ padding: '8px 8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 11, color: '#3a3a52', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px', marginBottom: 6 }}>
              Saved Components ({savedComponents.length})
            </div>
            {savedComponents.map(sc => (
              <div key={sc.id} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                borderRadius: 6, fontSize: 12, color: '#c8c8e0',
              }}>
                <Check size={11} color="#34d399" />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sc.component_name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Component list */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 8px' }}>
          {galleryLoading ? (
            <GallerySkeleton count={6} />
          ) : filtered.length === 0 ? (
            <NoComponents onUpload={(type) => {
              if (type === 'figma') setShowFigmaImport(true);
              else if (type === 'svg') document.getElementById('svg-file-input')?.click();
              else if (type === 'html') document.getElementById('html-file-input')?.click();
            }} />
          ) : filtered.map(comp => (
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
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                {comp.source === 'figma' && (
                  <span style={{
                    fontSize: 9, color: '#0a84ff', background: 'rgba(10,132,255,0.12)',
                    border: '1px solid rgba(10,132,255,0.2)', padding: '2px 5px',
                    borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2,
                  }}>
                    <Figma size={9} /> Figma
                  </span>
                )}
                {comp.source === 'svg' && (
                  <span style={{
                    fontSize: 9, color: '#10b981', background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.2)', padding: '2px 5px',
                    borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2,
                  }}>
                    <FileUp size={9} /> SVG
                  </span>
                )}
                <span style={{
                  fontSize: 10,
                  color: TYPE_COLORS[comp.type] || '#6b6b8a',
                  background: `${TYPE_COLORS[comp.type] || '#6b6b8a'}15`,
                  border: `1px solid ${TYPE_COLORS[comp.type] || '#6b6b8a'}25`,
                  padding: '2px 7px',
                  borderRadius: 4,
                  flexShrink: 0,
                }}>{comp.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Preview toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
          {selected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{selected.name}</span>
              <ChevronRight size={14} color="#4a4a6a" style={{ display: 'inline' }} />
              <span style={{ fontSize: 13, color: '#6b6b8a' }}>{selected.type}</span>
              {selected.source === 'figma' && (
                <a
                  href={selected.figma_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11, color: '#0a84ff', textDecoration: 'none',
                    background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.2)',
                    padding: '3px 8px', borderRadius: 5, display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <Figma size={12} /> View in Figma
                </a>
              )}
            </div>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setHtmlPreviewMode(m => !m);
                setSelectedElement(null);
                setElementFlutterCode('');
              }}
              style={{
                background: htmlPreviewMode ? 'rgba(124,106,247,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${htmlPreviewMode ? 'rgba(124,106,247,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: htmlPreviewMode ? '#a78bfa' : '#6b6b8a',
                padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <MousePointer size={13} />
              {htmlPreviewMode ? 'Interactive Mode' : 'HTML Preview'}
            </button>
            {!htmlPreviewMode && (
              <button
                onClick={() => setDarkPreview(d => !d)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b6b8a', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {darkPreview ? <Moon size={13} /> : <Sun size={13} />}
                {darkPreview ? 'Dark' : 'Light'}
              </button>
            )}
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
          flex: htmlPreviewMode ? '1' : '0 0 auto',
          background: htmlPreviewMode ? '#fff' : (darkPreview ? '#0e0e16' : '#f5f5f7'),
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: htmlPreviewMode ? 'stretch' : 'center',
          justifyContent: htmlPreviewMode ? 'stretch' : 'center',
          padding: htmlPreviewMode ? 0 : 40,
          minHeight: htmlPreviewMode ? 0 : 200,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {htmlPreviewMode ? (
            rawHtml ? (
              <iframe
                ref={iframeRef}
                src={`http://localhost:8000/preview/${id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: '#fff',
                }}
                title="HTML Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div style={{ color: '#6b6b8a', fontSize: 14, alignSelf: 'center', margin: 'auto' }}>
                No HTML content available. Upload an HTML file first.
              </div>
            )
          ) : (
            selected ? (
              <DynamicComponentPreview component={selected} darkTheme={darkPreview} />
            ) : (
              <div style={{ color: '#6b6b8a', fontSize: 14 }}>No component selected</div>
            )
          )}
        </div>

        {/* Element info bar (shown in HTML Preview mode when element selected) */}
        {htmlPreviewMode && selectedElement && (
          <div style={{
            padding: '8px 20px',
            background: 'rgba(124,106,247,0.08)',
            borderBottom: '1px solid rgba(124,106,247,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 13,
          }}>
            <MousePointer size={14} color="#a78bfa" />
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>{selectedElement.name}</span>
            <span style={{ color: '#6b6b8a' }}>·</span>
            <span style={{ color: '#6b6b8a' }}>{selectedElement.type}</span>
            {elementLoading && (
              <>
                <span style={{ color: '#6b6b8a' }}>·</span>
                <Loader2 size={14} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#6b6b8a' }}>Generating Flutter code...</span>
              </>
            )}
            {!elementLoading && elementFlutterCode && (
              <>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => {
                    setSaveName(selectedElement.name || 'CustomComponent');
                    setShowSaveDialog(true);
                  }}
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    color: '#34d399',
                    padding: '4px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Check size={12} />
                  Save Component
                </button>
              </>
            )}
          </div>
        )}

        {/* Save dialog */}
        {showSaveDialog && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
            onClick={() => setShowSaveDialog(false)}
          >
            <div style={{
              background: '#16161f',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 24,
              width: 380,
              maxWidth: '90vw',
            }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e8f0', marginBottom: 4 }}>Save Component</div>
              <div style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 16 }}>
                Give your component a name to save it to the project.
              </div>
              <input
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                placeholder="Component name"
                style={{
                  width: '100%',
                  background: '#1a1a28',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  color: '#e8e8f0',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: 16,
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#6b6b8a',
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!saveName.trim()) return;
                    setSavingComponent(true);
                    try {
                      const res = await fetch(`http://localhost:8000/api/projects/${id}/selected-components`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          element_html: selectedElement?.content || '',
                          flutter_code: elementFlutterCode,
                          component_name: saveName.trim(),
                        }),
                      });
                      if (res.ok) {
                        const saved = await res.json();
                        setSavedComponents(prev => [saved, ...prev]);
                        setShowSaveDialog(false);
                        toast.success(`Component "${saveName.trim()}" saved`);
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error('Failed to save component');
                    } finally {
                      setSavingComponent(false);
                    }
                  }}
                  disabled={!saveName.trim() || savingComponent}
                  style={{
                    background: saveName.trim() ? '#7C6AF7' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: saveName.trim() ? '#fff' : '#4a4a6a',
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: saveName.trim() ? 'pointer' : 'not-allowed',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {savingComponent ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={13} />}
                  {savingComponent ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

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
            loadingCode ? <CodeSkeleton lines={14} /> : <CodeBlock code={flutterCode} />
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

      {/* Figma Import Modal */}
      {showFigmaImport && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setShowFigmaImport(false)}>
          <div style={{
            background: '#16161f', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
            padding: 28, width: 480, maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(10,132,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Figma size={18} color="#0a84ff" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e8f0' }}>Import from Figma</div>
                <div style={{ fontSize: 12, color: '#6b6b8a' }}>Paste a Figma URL or upload a .fig file</div>
              </div>
              <button onClick={() => setShowFigmaImport(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            {/* Method A: Figma URL */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#a89bfa', marginBottom: 6, display: 'block' }}>Figma File URL</label>
              <input
                value={figmaUrl}
                onChange={e => setFigmaUrl(e.target.value)}
                placeholder="https://www.figma.com/file/XXXXX/MyDesign"
                style={{ width: '100%', background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px', color: '#e8e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#a89bfa', marginBottom: 6, display: 'block' }}>Personal Access Token</label>
              <input
                type="password"
                value={figmaToken}
                onChange={e => setFigmaToken(e.target.value)}
                placeholder="figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                style={{ width: '100%', background: '#1a1a28', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px', color: '#e8e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-mono)' }}
              />
              <div style={{ fontSize: 11, color: '#4a4a6a', marginTop: 4 }}>
                Get your token from Figma Settings → Account → Personal Access Tokens.
                <span style={{ color: '#f87171', marginLeft: 4 }}>Not stored on our server.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  if (!figmaUrl.trim() || !figmaToken.trim()) {
                    setFigmaError('Please enter both the Figma URL and access token');
                    return;
                  }
                  handleFigmaImport();
                }}
                disabled={figmaImporting}
                style={{
                  flex: 1, background: figmaImporting ? 'rgba(10,132,255,0.5)' : '#0a84ff',
                  border: 'none', color: '#fff', padding: '11px', borderRadius: 8,
                  cursor: figmaImporting ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
              >
                {figmaImporting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Figma size={15} />}
                {figmaImporting ? 'Importing...' : 'Import from URL'}
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 12, color: '#4a4a6a' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Method B: .fig file upload */}
            <div>
              <input
                type="file"
                id="fig-file-input"
                accept=".fig"
                style={{ display: 'none' }}
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) await handleFigmaFileUpload(file);
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => document.getElementById('fig-file-input')?.click()}
                disabled={figmaFileUploading}
                style={{
                  width: '100%', background: figmaFileUploading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.04)',
                  border: '1px dashed rgba(255,255,255,0.15)', color: '#6b6b8a', padding: '16px', borderRadius: 8,
                  cursor: figmaFileUploading ? 'not-allowed' : 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {figmaFileUploading ? (
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <FileUp size={16} />
                )}
                {figmaFileUploading ? 'Uploading and parsing...' : 'Upload .fig file instead'}
              </button>
            </div>

            {/* Error */}
            {figmaError && (
              <div style={{ fontSize: 13, color: '#f87171', marginTop: 12, padding: 8, background: 'rgba(248,113,113,0.08)', borderRadius: 6 }}>
                {figmaError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
