import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import {
  Plus, Upload, Wand2, FolderOpen, MoreHorizontal, Component,
  Clock, Zap, TrendingUp, FileCode2, Palette, ArrowUpRight, Search, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { ProjectCardSkeleton } from './Skeletons';
import { NoProjects } from './EmptyStates';

const PROJECTS = [
  {
    id: '1',
    name: 'Noon E-Commerce App',
    desc: 'Mobile shopping app with product listings, cart, checkout',
    components: 24,
    updated: '2 hours ago',
    files: ['.fig', '.html'],
    status: 'active',
    color: '#7C6AF7',
  },
  {
    id: '2',
    name: 'Paystack Dashboard',
    desc: 'Financial dashboard with charts, tables, transaction flow',
    components: 47,
    updated: '1 day ago',
    files: ['.html'],
    status: 'active',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Grab Mobile UI',
    desc: 'Ride-hailing app components — booking, map, driver cards',
    components: 31,
    updated: '3 days ago',
    files: ['.fig', '.svg'],
    status: 'active',
    color: '#60a5fa',
  },
  {
    id: '4',
    name: 'Careem Design System',
    desc: 'Complete design token library for the Careem brand',
    components: 86,
    updated: '1 week ago',
    files: ['.fig'],
    status: 'system',
    color: '#f472b6',
  },
];

const ACTIVITY = [
  { icon: Component, text: 'PrimaryButton generated for Noon App', time: '12m ago', color: '#7C6AF7' },
  { icon: FileCode2, text: '47 components parsed from Paystack HTML', time: '1h ago', color: '#10b981' },
  { icon: Palette, text: 'Grab design system tokens exported', time: '3h ago', color: '#60a5fa' },
  { icon: Zap, text: 'NavBar widget code generated', time: '5h ago', color: '#fbbf24' },
  { icon: Upload, text: 'careem-brand.fig file uploaded', time: '1d ago', color: '#f472b6' },
];

const STATS = [
  { label: 'Components generated', value: '1,284', delta: '+23%', color: '#7C6AF7' },
  { label: 'Projects', value: '4', delta: '+1 this week', color: '#10b981' },
  { label: 'AI requests today', value: '47', delta: '453 remaining', color: '#60a5fa' },
  { label: 'Avg gen time', value: '2.1s', delta: '-0.3s', color: '#fbbf24' },
];

function ProjectCard({ project, onDelete }: { project: any; onDelete: (id: string) => void }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  // Fallback files list if not defined in database
  const filesList = project.files || ['.html'];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#111118',
        border: `1px solid ${hovered ? 'rgba(124,106,247,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${project.color || '#7C6AF7'}20`,
            border: `1px solid ${project.color || '#7C6AF7'}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FolderOpen size={18} color={project.color || '#7C6AF7'} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#e8e8f0' }}>{project.name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {filesList.map((f: string) => (
                <span key={f} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  padding: '2px 7px',
                  fontSize: 11,
                  color: '#6b6b8a',
                  fontFamily: 'var(--font-mono)',
                }}>{f}</span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
              onDelete(project.id);
            }
          }}
          style={{ background: 'none', border: 'none', color: '#4a4a6a', cursor: 'pointer', padding: 4 }}
          title="Delete Project"
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color = '#4a4a6a'}
        >
          <Trash2 size={15} />
        </button>
      </div>
      <p style={{ fontSize: 13, color: '#6b6b8a', marginBottom: 16, lineHeight: 1.6 }}>{project.description || project.desc || 'No description provided.'}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Component size={13} color="#4a4a6a" />
            <span style={{ fontSize: 13, color: '#6b6b8a' }}>{project.components || 0} components</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={13} color="#4a4a6a" />
            <span style={{ fontSize: 13, color: '#6b6b8a' }}>{project.updated || 'Just now'}</span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/project/${project.id}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'rgba(124,106,247,0.1)',
            border: '1px solid rgba(124,106,247,0.2)',
            color: '#a78bfa',
            padding: '5px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,106,247,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,106,247,0.1)')}
        >
          Open <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/projects');
        if (!response.ok) throw new Error();
        const data = await response.json();
        // If empty on a fresh database, show fallback static list
        if (data.length === 0) {
          setProjects(PROJECTS);
        } else {
          setProjects(data);
        }
      } catch (err) {
        console.warn('FastAPI backend connection failed. Falling back to static list.');
        setProjects(PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    const name = prompt('Enter project name:');
    if (!name) return;
    const desc = prompt('Enter project description (optional):') || '';
    
    const colors = ['#7C6AF7', '#10b981', '#3b82f6', '#f472b6', '#fbbf24', '#ef4444'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    try {
      const response = await fetch('http://localhost:8000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: desc, color }),
      });
      if (response.ok) {
        const newProj = await response.json();
        setProjects(prev => [newProj, ...prev]);
        toast.success(`Project "${name}" created`);
      } else {
        toast.error('Failed to create project');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error creating project', 'Ensure backend is running');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        toast.success('Project deleted');
      } else {
        setProjects(prev => prev.filter(p => p.id !== id));
        toast.success('Project deleted (local)');
      }
    } catch (err) {
      console.error(err);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted (local)');
    }
  };

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '28px 32px', color: '#e8e8f0', fontFamily: 'var(--font-sans)', maxWidth: 1300, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Good morning, Amir 👋
        </h1>
        <p style={{ fontSize: 14, color: '#6b6b8a' }}>You have 453 AI requests remaining today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {STATS.map(stat => (
          <div key={stat.label} style={{
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 12, color: '#6b6b8a', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: stat.color, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{stat.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={12} color="#10b981" />
              <span style={{ fontSize: 12, color: '#10b981' }}>{stat.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {[
          { icon: Plus, label: 'New Project', color: '#7C6AF7', bg: 'linear-gradient(135deg, #7C6AF7, #a78bfa)', action: handleCreateProject },
          { icon: Upload, label: 'Import File', color: '#10b981', bg: 'rgba(16,185,129,0.1)', action: () => navigate('/onboarding') },
          { icon: Wand2, label: 'New Design System', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', action: () => navigate('/design-system/new') },
          { icon: FileCode2, label: 'Generate Flutter Code', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', action: () => {
              if (projects.length > 0) navigate(`/project/${projects[0].id}`);
              else alert('Please create or import a project first!');
            }
          },
        ].map(action => {
          const Icon = action.icon;
          const isPrimary = action.label === 'New Project';
          return (
            <button
              key={action.label}
              onClick={action.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isPrimary ? action.bg : '#111118',
                border: isPrimary ? 'none' : '1px solid rgba(255,255,255,0.07)',
                color: isPrimary ? '#fff' : action.color,
                padding: '10px 18px',
                borderRadius: 9,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isPrimary) e.currentTarget.style.borderColor = `${action.color}40`; }}
              onMouseLeave={e => { if (!isPrimary) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <Icon size={15} />
              {action.label}
            </button>
          );
        })}
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
        {/* Projects */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>Projects</h2>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#4a4a6a" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                style={{
                  background: '#111118',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8,
                  padding: '7px 12px 7px 32px',
                  color: '#e8e8f0',
                  fontSize: 13,
                  outline: 'none',
                  width: 200,
                }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {loading ? (
              <ProjectCardSkeleton count={2} />
            ) : filtered.length === 0 ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <NoProjects onNew={handleCreateProject} />
              </div>
            ) : filtered.map(p => <ProjectCard key={p.id} project={p} onDelete={handleDelete} />)}
          </div>
        </div>

        {/* Activity */}
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Recent Activity</h2>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
            {ACTIVITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '14px 16px',
                  borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: `${item.color}15`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon size={14} color={item.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#c8c8e0', lineHeight: 1.5 }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: '#4a4a6a', marginTop: 2 }}>{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
