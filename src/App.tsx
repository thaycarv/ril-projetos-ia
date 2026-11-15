import { useState } from 'react'
import { ProgramProvider, useProgram } from './context/ProgramContext'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { KpiStrip } from './components/KpiStrip'
import { KanbanView } from './components/KanbanView'
import { MunicipalityDetailView } from './components/MunicipalityDetailView'
import './styles/theme.css'

function ProgramApp() {
  const [currentView, setCurrentView] = useState<'kanban' | 'detail'>('kanban')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { selectMunicipality } = useProgram()

  const handleOpenDetail = (municipalityId: string) => {
    selectMunicipality(municipalityId)
    setCurrentView('detail')
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="main-content">
        <TopBar currentView={currentView} onViewChange={setCurrentView} />
        {currentView === 'kanban' ? (
          <>
            <KpiStrip />
            <KanbanView onOpenDetail={handleOpenDetail} />
          </>
        ) : (
          <MunicipalityDetailView />
        )}
        <footer className="app-inspiration-note">
          Projeto conceitual inspirado no programa Governos na Era da IA (RIL).
        </footer>
      </div>
    </div>
  )
}

export function App() {
  return (
    <ProgramProvider>
      <ProgramApp />
    </ProgramProvider>
  )
}

export default App
