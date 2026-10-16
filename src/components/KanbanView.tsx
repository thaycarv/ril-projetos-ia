import { Search, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import { useProgram } from '../context/ProgramContext'
import type { MunicipalityStage, Municipality } from '../types'

const STAGES_CONFIG: Array<{ id: MunicipalityStage; title: string; desc: string }> = [
  { id: 'alinhamento', title: '1. Entrada & Alinhamento', desc: 'Adesão formalizada e indicação dos 10 líderes municipais.' },
  { id: 'diagnostico', title: '2. Diagnóstico de IA', desc: 'Avaliação de maturidade em dados/IA e escolha da trilha.' },
  { id: 'formacao', title: '3. Formação & Trilhas', desc: 'Participação nas oficinas e capacitação no Portal RIL.' },
  { id: 'multiplicacao', title: '4. Aplicação & Multiplicação', desc: 'Prática em campo e multiplicação para outros servidores.' },
  { id: 'concluido', title: '5. Ciclo Concluído', desc: 'Entregas validadas, síntese registrada e rede de pares.' },
]

interface KanbanViewProps {
  onOpenDetail: (municipalityId: string) => void
}

export function KanbanView({ onOpenDetail }: KanbanViewProps) {
  const {
    municipalities,
    searchQuery,
    setSearchQuery,
    kpiFilter,
    onlyAttention,
    setOnlyAttention,
    selectedRegion,
    setSelectedRegion,
  } = useProgram()

  const filteredMunicipalities = municipalities.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.focalPoint.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesKpi = true
    if (kpiFilter === 'attention') {
      matchesKpi = m.attention.hasAttention
    } else if (kpiFilter === 'diagnostics') {
      matchesKpi = ['formacao', 'multiplicacao', 'concluido'].includes(m.stage)
    } else if (kpiFilter === 'completed') {
      matchesKpi = m.stage === 'concluido'
    }

    const matchesRegion = selectedRegion === 'Todas' ? true : m.region === selectedRegion

    return matchesSearch && matchesKpi && matchesRegion
  })

  const getStageMunicipalities = (stage: MunicipalityStage): Municipality[] => {
    return filteredMunicipalities.filter(m => m.stage === stage)
  }

  const regions = ['Todas', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

  return (
    <div className="kanban-wrapper">
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={16} color="var(--muted)" />
          <input
            type="text"
            placeholder="Buscar por município, estado ou líder..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            type="button"
            className={`pill-btn ${onlyAttention ? 'is-attention-active' : ''}`}
            onClick={() => setOnlyAttention(!onlyAttention)}
          >
            <AlertTriangle size={14} />
            <span>Apenas Pontos de Atenção</span>
          </button>

          {regions.map(reg => (
            <button
              key={reg}
              type="button"
              className={`pill-btn ${selectedRegion === reg ? 'is-active' : ''}`}
              onClick={() => setSelectedRegion(reg)}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      <div className="kanban-container">
        {STAGES_CONFIG.map(col => {
          const colItems = getStageMunicipalities(col.id)
          return (
            <div className="kanban-col" key={col.id}>
              <div className="kanban-col__header">
                <div className="kanban-col__top">
                  <h3 className="kanban-col__title">{col.title}</h3>
                  <span className="kanban-col__badge">{colItems.length}</span>
                </div>
                <p className="kanban-col__desc">{col.desc}</p>
              </div>

              <div className="kanban-col__cards">
                {colItems.map(municipality => {
                  const completedDeliverables = municipality.deliverables.filter(d => d.status === 'entregue').length
                  return (
                    <article
                      key={municipality.id}
                      className="municipality-card"
                      onClick={() => onOpenDetail(municipality.id)}
                    >
                      <div className="municipality-card__header">
                        <div>
                          <strong className="municipality-card__name">{municipality.name}</strong>
                          <p className="municipality-card__track">Ponto focal: {municipality.focalPoint}</p>
                        </div>
                        <span className="municipality-card__state">{municipality.state}</span>
                      </div>

                      {municipality.attention.hasAttention ? (
                        <div className="status-tag status-tag--attention">
                          <AlertTriangle size={12} />
                          <span>Ponto de Atenção: Verificar</span>
                        </div>
                      ) : (
                        <div className="status-tag status-tag--ok">
                          <CheckCircle2 size={12} />
                          <span>Encontros em dia</span>
                        </div>
                      )}

                      <div className="municipality-card__footer">
                        <span>Entregas: {completedDeliverables} de {municipality.deliverables.length}</span>
                        <ChevronRight size={14} />
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
