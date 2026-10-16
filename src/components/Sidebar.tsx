import { LayoutDashboard, Building2, RotateCcw } from 'lucide-react'
import { useProgram } from '../context/ProgramContext'

interface SidebarProps {
  currentView: 'kanban' | 'detail'
  onViewChange: (view: 'kanban' | 'detail') => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { resetToDefaults, indicators } = useProgram()

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="brand-badge">
          <div className="brand-logo-icon">RIL</div>
          <span>Projetos IA</span>
        </div>
        <p className="brand-sub">Programa Governos na Era da IA</p>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação do programa">
        <button
          type="button"
          className={`nav-item ${currentView === 'kanban' ? 'is-active' : ''}`}
          onClick={() => onViewChange('kanban')}
        >
          <LayoutDashboard size={18} />
          <span>Visão Geral</span>
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'detail' ? 'is-active' : ''}`}
          onClick={() => onViewChange('detail')}
        >
          <Building2 size={18} />
          <span>Municípios</span>
        </button>
      </nav>

      <div className="sidebar__footer">
        <div className="facilitator-card">
          <small>Facilitador(a) RIL</small>
          <strong>Carteira: {indicators.totalMunicipalities} Municípios</strong>
        </div>

        <button className="btn-reset" type="button" onClick={resetToDefaults}>
          <RotateCcw size={14} />
          <span>Restaurar dados</span>
        </button>
      </div>
    </aside>
  )
}
