interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actions?: { label: string; onClick: () => void; primary?: boolean }[];
}

export function EmptyState({ icon, title, message, actions }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', gap: 16, textAlign: 'center', minHeight: 300,
    }}>
      <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 4 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e8f0', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#6b6b8a', maxWidth: 340 }}>{message}</div>
      </div>
      {actions && actions.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              style={{
                background: a.primary ? 'rgba(124,106,247,0.12)' : 'none',
                border: a.primary ? '1px solid rgba(124,106,247,0.2)' : '1px solid rgba(255,255,255,0.07)',
                color: a.primary ? '#a78bfa' : '#6b6b8a',
                padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                fontWeight: a.primary ? 600 : 400,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NoComponents({ onUpload }: { onUpload: (type: 'html' | 'figma' | 'svg') => void }) {
  return (
    <EmptyState
      icon="🎨"
      title="No components yet"
      message="Import a file to start converting designs to Flutter code"
      actions={[
        { label: 'Upload HTML', onClick: () => onUpload('html'), primary: true },
        { label: 'Import Figma', onClick: () => onUpload('figma') },
        { label: 'Upload SVG', onClick: () => onUpload('svg') },
      ]}
    />
  );
}

export function NoDesignSystems({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon="🎭"
      title="No design systems saved"
      message="Generate your first design system from a brand color and style preset"
      actions={[{ label: 'Create Design System →', onClick: onCreate, primary: true }]}
    />
  );
}

export function NoProjects({ onNew }: { onNew: () => void }) {
  return (
    <EmptyState
      icon="📁"
      title="No projects yet"
      message="Create your first project to start converting designs to Flutter"
      actions={[{ label: 'New Project +', onClick: onNew, primary: true }]}
    />
  );
}
