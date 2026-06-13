import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 48, gap: 16, textAlign: 'center', minHeight: 200,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(248,113,113,0.12)', color: '#f87171',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>⚠</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e8e8f0', marginBottom: 4 }}>
              Something went wrong
            </div>
            <div style={{ fontSize: 13, color: '#6b6b8a', maxWidth: 360 }}>
              We couldn't load this section. Your data is safe.
              {this.state.error && (
                <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, fontSize: 11, color: '#4a4a6a', fontFamily: 'monospace', wordBreak: 'break-word' }}>
                  {this.state.error.message}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={this.handleRetry} style={{
              background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.2)',
              color: '#a78bfa', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>
              Try Again
            </button>
            <button onClick={() => window.history.pushState({}, '', '/dashboard')} style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.07)',
              color: '#6b6b8a', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
            }}>
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
