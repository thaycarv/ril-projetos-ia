import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro de renderização:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f4f6f4', color: '#1e2e23', fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif' }}>
          <div style={{ maxWidth: 440, width: '100%', background: '#fff', border: '1px solid #d9e1da', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: '#b8732a' }}>
              <AlertTriangle size={20} />
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e2e23' }}>Não foi possível exibir o painel</h1>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.5, color: '#4a5a4f' }}>
              Ocorreu uma falha inesperada na interface. Recarregue a página para continuar.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#3d5c45', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <RotateCcw size={14} />
              <span>Recarregar</span>
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
