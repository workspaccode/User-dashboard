import { Skeleton } from './ui/skeleton';

export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', borderRadius: 8, alignItems: 'center' }}>
          <Skeleton style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton style={{ width: `${60 + Math.random() * 30}%`, height: 12, borderRadius: 4 }} />
            <Skeleton style={{ width: `${30 + Math.random() * 20}%`, height: 9, borderRadius: 3 }} />
          </div>
          <Skeleton style={{ width: 48, height: 18, borderRadius: 4, flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

export function CodeSkeleton({ lines = 12 }: { lines?: number }) {
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          style={{
            width: `${40 + Math.random() * 55}%`,
            height: i < 3 ? 10 : 8,
            borderRadius: 4,
          }}
        />
      ))}
    </div>
  );
}

export function ProjectCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background: '#16161f', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
            <Skeleton style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton style={{ width: '60%', height: 14, borderRadius: 4 }} />
              <Skeleton style={{ width: '40%', height: 10, borderRadius: 3 }} />
            </div>
          </div>
          <Skeleton style={{ width: '35%', height: 10, borderRadius: 4, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <Skeleton style={{ width: 60, height: 24, borderRadius: 6 }} />
            <Skeleton style={{ width: 50, height: 24, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
