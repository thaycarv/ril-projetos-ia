import { LayoutDashboard, Building2, RotateCcw, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useProgram } from '../context/ProgramContext'

interface SidebarProps {
  currentView: 'kanban' | 'detail'
  onViewChange: (view: 'kanban' | 'detail') => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ currentView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) {
  const { resetToDefaults, indicators } = useProgram()

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar__header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
          <div className="brand-badge">
            <div className="brand-logo-icon">RIL</div>
            {!collapsed && <span>Projetos IA</span>}
          </div>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expandir lateral' : 'Recolher lateral'}
            aria-label={collapsed ? 'Expandir lateral' : 'Recolher lateral'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
        {!collapsed && <p className="brand-sub">Programa Governos na Era da IA</p>}
      </div>

      <nav className="sidebar__nav" aria-label="Navegação do programa">
        <button
          type="button"
          className={`nav-item ${currentView === 'kanban' ? 'is-active' : ''}`}
          onClick={() => onViewChange('kanban')}
          title={collapsed ? 'Visão Geral' : undefined}
        >
          <LayoutDashboard size={18} />
          {!collapsed && <span>Visão Geral</span>}
        </button>

        <button
          type="button"
          className={`nav-item ${currentView === 'detail' ? 'is-active' : ''}`}
          onClick={() => onViewChange('detail')}
          title={collapsed ? 'Municípios' : undefined}
        >
          <Building2 size={18} />
          {!collapsed && <span>Municípios</span>}
        </button>
      </nav>

      <div className="sidebar__footer">
        {!collapsed && (
          <div className="facilitator-card">
            <small>Facilitador(a) RIL</small>
            <strong>Carteira: {indicators.totalMunicipalities} Municípios</strong>
          </div>
        )}

        <button
          className="btn-reset"
          type="button"
          onClick={resetToDefaults}
          title={collapsed ? 'Restaurar dados' : undefined}
        >
          <RotateCcw size={14} />
          {!collapsed && <span>Restaurar dados</span>}
        </button>
      </div>
    </aside>
  )
}
