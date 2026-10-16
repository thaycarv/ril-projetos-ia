import { Building2, AlertTriangle, FileCheck, Award } from 'lucide-react'
import { useProgram } from '../context/ProgramContext'

export function KpiStrip() {
  const { indicators, kpiFilter, setKpiFilter, toggleKpiFilter } = useProgram()

  return (
    <section className="kpi-strip" aria-label="Indicadores do Programa">
      <article
        className={`kpi-card is-clickable ${kpiFilter === 'all' ? 'is-active-filter' : ''}`}
        onClick={() => setKpiFilter('all')}
        title="Clique para ver todos os 40 municípios da carteira"
        role="button"
        tabIndex={0}
      >
        <div className="kpi-card__top">
          <span>Municípios na Carteira</span>
          <Building2 size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.totalMunicipalities}</strong>
      </article>

      <article
        className={`kpi-card is-attention is-clickable ${kpiFilter === 'attention' ? 'is-active-filter' : ''}`}
        onClick={() => toggleKpiFilter('attention')}
        title="Clique para filtrar apenas municípios com Pontos de Atenção"
        role="button"
        tabIndex={0}
      >
        <div className="kpi-card__top">
          <span>Pontos de Atenção</span>
          <AlertTriangle size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.attentionCount}</strong>
      </article>

      <article
        className={`kpi-card is-clickable ${kpiFilter === 'diagnostics' ? 'is-active-filter' : ''}`}
        onClick={() => toggleKpiFilter('diagnostics')}
        title="Clique para filtrar municípios com Diagnósticos de IA realizados"
        role="button"
        tabIndex={0}
      >
        <div className="kpi-card__top">
          <span>Diagnósticos Realizados</span>
          <FileCheck size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.diagnosticsCompleted}</strong>
      </article>

      <article
        className={`kpi-card is-success is-clickable ${kpiFilter === 'completed' ? 'is-active-filter' : ''}`}
        onClick={() => toggleKpiFilter('completed')}
        title="Clique para filtrar municípios com Ciclos Concluídos"
        role="button"
        tabIndex={0}
      >
        <div className="kpi-card__top">
          <span>Ciclos Concluídos</span>
          <Award size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.completedCycle}</strong>
      </article>
    </section>
  )
}
