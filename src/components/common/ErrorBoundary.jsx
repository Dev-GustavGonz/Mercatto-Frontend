import React from 'react'
import { AlertCircle, RefreshCw, RotateCcw, Home } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400 flex items-center justify-center mx-auto">
              <AlertCircle size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Ocurrió un inconveniente al cargar
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Hemos detectado un problema temporal al sincronizar los componentes de la vista.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-left text-xs text-rose-700 dark:text-rose-300 font-mono break-all max-h-36 overflow-y-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition cursor-pointer"
              >
                <RotateCcw size={16} />
                <span>Reintentar Vista</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Home size={16} />
                <span>Ir al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
