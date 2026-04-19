import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center p-4 transition-colors">
          <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Application Error
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              An unexpected error occurred in the analytics engine. We've logged the issue.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 dark:bg-dark-900 p-4 rounded-lg text-left overflow-auto text-sm text-gray-700 dark:text-gray-300 font-mono mb-6 max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-colors"
            >
              <RefreshCw size={18} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
