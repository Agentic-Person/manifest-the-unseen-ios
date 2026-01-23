/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in the component tree and displays
 * a fallback UI instead of crashing the app.
 *
 * Reports errors to Sentry for monitoring.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureException, addBreadcrumb } from '../services/crashReportingService';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary
 *
 * Wrap your app or critical sections with this component
 * to catch and handle errors gracefully.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Add breadcrumb with component stack
    addBreadcrumb({
      category: 'error',
      message: 'Error boundary caught error',
      level: 'error',
      data: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Capture the error with Sentry
    captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // Log in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback or default ErrorFallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
