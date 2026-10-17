import { Columns3, FileText } from 'lucide-react'
import { GeneralPortfolioReport } from './GeneralPortfolioReport'

interface TopBarProps {
  currentView: 'kanban' | 'detail'
  onViewChange: (view: 'kanban' | 'detail') => void
}

export function TopBar({ currentView, onViewChange }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar__title">
        <h1>{currentView === 'kanban' ? 'Visão Geral dos 40 Municípios' : 'Ficha Executiva do Município'}</h1>
        <p>Acompanhamento da jornada de transformação digital e IA</p>
      </div>

      <div className="top-bar__actions">
        {currentView === 'kanban' && <GeneralPortfolioReport />}

        <div className="view-toggle" role="group" aria-label="Modo de visualização">
          <button
            type="button"
            className={`view-toggle-btn ${currentView === 'kanban' ? 'is-active' : ''}`}
            onClick={() => onViewChange('kanban')}
          >
            <Columns3 size={15} />
            <span>Visão Geral</span>
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${currentView === 'detail' ? 'is-active' : ''}`}
            onClick={() => onViewChange('detail')}
          >
            <FileText size={15} />
            <span>Municípios</span>
          </button>
        </div>
      </div>
    </header>
  )
}
