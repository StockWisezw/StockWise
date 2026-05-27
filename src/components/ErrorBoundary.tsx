import { Component, ReactNode, ErrorInfo } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[App Critical Error Captured]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 font-sans">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-full text-rose-500 dark:text-rose-400">
                <ShieldAlert className="w-10 h-10" />
              </div>
            </div>
            
            <h1 className="text-xl font-semibold text-center text-zinc-900 dark:text-zinc-50 tracking-tight">
              An unexpected error occurred
            </h1>
            
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mt-2 mb-6 leading-relaxed">
              Tareza ERP ran into an issue while loading this component. Your session data remains safe.
            </p>

            {this.state.error && (
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-4 mb-6 border border-zinc-100 dark:border-zinc-900 overflow-x-auto max-h-40">
                <p className="text-xs font-mono text-rose-600 dark:text-rose-400 whitespace-pre">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset & Return to Safety
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
