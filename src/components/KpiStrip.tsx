import { Building2, AlertTriangle, FileCheck, Award } from 'lucide-react'
import { useProgram } from '../context/ProgramContext'

export function KpiStrip() {
  const { indicators, setOnlyAttention, onlyAttention } = useProgram()

  return (
    <section className="kpi-strip" aria-label="Indicadores do Programa">
      <article className="kpi-card">
        <div className="kpi-card__top">
          <span>Municípios na Carteira</span>
          <Building2 size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.totalMunicipalities}</strong>
      </article>



      <article
        className={`kpi-card is-attention ${onlyAttention ? 'is-selected' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => setOnlyAttention(!onlyAttention)}
        title="Clique para filtrar apenas municípios que exigem atenção"
      >
        <div className="kpi-card__top">
          <span>Pontos de Atenção</span>
          <AlertTriangle size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.attentionCount}</strong>
      </article>

      <article className="kpi-card">
        <div className="kpi-card__top">
          <span>Diagnósticos Realizados</span>
          <FileCheck size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.diagnosticsCompleted}</strong>
      </article>

      <article className="kpi-card is-success">
        <div className="kpi-card__top">
          <span>Ciclos Concluídos</span>
          <Award size={16} />
        </div>
        <strong className="kpi-card__value">{indicators.completedCycle}</strong>
      </article>
    </section>
  )
}
