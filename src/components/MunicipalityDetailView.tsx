import { useState, useRef, useEffect } from 'react'
import {
  Building2,
  Users,
  Brain,
  CalendarCheck,
  CheckSquare,
  AlertTriangle,
  Mail,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useProgram } from '../context/ProgramContext'
import type { MunicipalityStage, Deliverable } from '../types'

const STAGE_LABELS: Record<MunicipalityStage, string> = {
  alinhamento: '1. Entrada & Alinhamento',
  diagnostico: '2. Diagnóstico de IA',
  formacao: '3. Formação & Trilhas',
  multiplicacao: '4. Aplicação & Multiplicação',
  concluido: '5. Ciclo Concluído',
}

const TRACK_LABELS = {
  uso_estrategico: 'Uso Estratégico e Responsável de IA',
  otimizacao_servicos: 'Otimização de Serviços Públicos',
  analise_dados: 'Análise e Governança de Dados',
}

export function MunicipalityDetailView() {
  const {
    municipalities,
    selectedMunicipality,
    selectMunicipality,
    updateStage,
    updateDeliverableStatus,
    toggleAttention,
  } = useProgram()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownSearch, setDropdownSearch] = useState('')
  const [onlyAttentionInDropdown, setOnlyAttentionInDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  if (!selectedMunicipality) {
    return <div className="page-empty">Nenhum município selecionado.</div>
  }

  const currentIndex = municipalities.findIndex(m => m.id === selectedMunicipality.id)

  const handlePrev = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : municipalities.length - 1
    selectMunicipality(municipalities[prevIndex].id)
  }

  const handleNext = () => {
    const nextIndex = currentIndex < municipalities.length - 1 ? currentIndex + 1 : 0
    selectMunicipality(municipalities[nextIndex].id)
  }

  const filteredDropdownList = municipalities.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      m.state.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      m.focalPoint.toLowerCase().includes(dropdownSearch.toLowerCase())

    const matchesAttention = onlyAttentionInDropdown ? m.attention.hasAttention : true
    return matchesSearch && matchesAttention
  })

  const handleNextStatus = (deliverable: Deliverable) => {
    const sequence: Deliverable['status'][] = ['pendente', 'em_andamento', 'entregue']
    const nextIndex = (sequence.indexOf(deliverable.status) + 1) % sequence.length
    updateDeliverableStatus(selectedMunicipality.id, deliverable.id, sequence[nextIndex])
  }

  return (
    <div className="detail-view--full">
      {/* Barra Suspensa de Navegação e Filtragem dos Municípios */}
      <div className="municipality-picker-bar">
        <div className="picker-main-group" ref={dropdownRef}>
          <button
            type="button"
            className="picker-trigger-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <Building2 size={16} color="var(--primary)" />
            <strong>{selectedMunicipality.name} ({selectedMunicipality.state})</strong>
            <span className="municipality-card__state">{STAGE_LABELS[selectedMunicipality.stage]}</span>
            <ChevronDown size={14} color="var(--muted)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Menu Dropdown Suspenso */}
          {dropdownOpen && (
            <div className="suspended-dropdown" role="listbox">
              <div className="suspended-dropdown__search">
                <Search size={14} color="var(--muted)" />
                <input
                  type="text"
                  placeholder="Buscar entre os 40 municípios..."
                  value={dropdownSearch}
                  onChange={e => setDropdownSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`pill-btn ${onlyAttentionInDropdown ? 'is-attention-active' : ''}`}
                  onClick={() => setOnlyAttentionInDropdown(!onlyAttentionInDropdown)}
                  style={{ fontSize: '0.68rem', padding: '4px 8px' }}
                >
                  <AlertTriangle size={12} />
                  <span>Apenas Pontos de Atenção</span>
                </button>
              </div>

              <div className="suspended-dropdown__list">
                {filteredDropdownList.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className={`suspended-item-btn ${m.id === selectedMunicipality.id ? 'is-active' : ''}`}
                    onClick={() => {
                      selectMunicipality(m.id)
                      setDropdownOpen(false)
                    }}
                    role="option"
                    aria-selected={m.id === selectedMunicipality.id}
                  >
                    <div>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--ink)' }}>{m.name}</strong>
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted)', marginLeft: '6px' }}>({m.state})</span>
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '2px' }}>{STAGE_LABELS[m.stage]}</p>
                    </div>

                    {m.attention.hasAttention ? (
                      <span className="status-tag status-tag--attention">
                        <AlertTriangle size={10} /> Verificar
                      </span>
                    ) : (
                      <span className="municipality-card__state">{m.region}</span>
                    )}
                  </button>
                ))}
                {filteredDropdownList.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', padding: '12px', textAlign: 'center' }}>
                    Nenhum município encontrado.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Setas Anterior / Próximo */}
          <div className="picker-nav-arrows">
            <button
              type="button"
              className="picker-arrow-btn"
              onClick={handlePrev}
              title="Município anterior"
              aria-label="Município anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="picker-arrow-btn"
              onClick={handleNext}
              title="Próximo município"
              aria-label="Próximo município"
            >
              <ChevronRight size={16} />
            </button>
            <span className="picker-counter">
              {currentIndex + 1} de {municipalities.length}
            </span>
          </div>
        </div>

        {/* Informação Rápida da Região e Porte */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="municipality-card__state">{selectedMunicipality.populationSize}</span>
          <span className="municipality-card__state">Região {selectedMunicipality.region}</span>
        </div>
      </div>

      {/* Ficha One-Page do Município Selecionado em Largura Total */}
      <main className="municipality-fiche">
        <header className="fiche-header">
          <div className="fiche-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>{selectedMunicipality.name}</h2>
              <span className="municipality-card__state">{selectedMunicipality.state}</span>
              <span className="municipality-card__state">{selectedMunicipality.region}</span>
              <span className="municipality-card__state">{selectedMunicipality.population.toLocaleString('pt-BR')} hab.</span>
            </div>
            <p>
              Patrocinador: <strong>{selectedMunicipality.mayorOrSponsor}</strong> | Ponto Focal: <strong>{selectedMunicipality.focalPoint}</strong>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <Mail size={13} color="var(--muted)" />
              <span>{selectedMunicipality.focalPointContact}</span>
            </p>
          </div>

          <div className="fiche-stage-selector">
            <label htmlFor="stage-select" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)' }}>
              Etapa RIL:
            </label>
            <select
              id="stage-select"
              className="stage-select"
              value={selectedMunicipality.stage}
              onChange={e => updateStage(selectedMunicipality.id, e.target.value as MunicipalityStage)}
            >
              {Object.entries(STAGE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Ponto de Atenção Banner */}
        {selectedMunicipality.attention.hasAttention ? (
          <div className="attention-box">
            <strong>
              <AlertTriangle size={16} /> Ponto de Atenção Ativo: Verificar
            </strong>
            <p>{selectedMunicipality.attention.reason}</p>
            <small>
              <strong>Ação combinada com a liderança RIL:</strong> {selectedMunicipality.attention.supportAction}
            </small>
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                className="pill-btn"
                onClick={() => toggleAttention(selectedMunicipality.id)}
              >
                <CheckCircle2 size={13} />
                <span>Marcar como resolvido</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="pill-btn"
              onClick={() => toggleAttention(selectedMunicipality.id, 'Ponto de atenção sinalizado pela facilitadora no acompanhamento quinzenal.')}
            >
              <AlertTriangle size={13} />
              <span>Sinalizar Ponto de Atenção</span>
            </button>
          </div>
        )}

        <div className="fiche-grid">
          {/* Seção 1: Diagnóstico de Maturidade em IA */}
          <section className="fiche-section">
            <h3 className="fiche-section__title">
              <Brain size={18} />
              <span>Diagnóstico de Maturidade em IA</span>
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <small style={{ color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  Nível de Maturidade
                </small>
                <strong style={{ display: 'block', fontSize: '1rem', textTransform: 'capitalize' }}>
                  {selectedMunicipality.maturityLevel}
                </strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <small style={{ color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  Trilha do Programa
                </small>
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                  {TRACK_LABELS[selectedMunicipality.track]}
                </span>
              </div>
            </div>

            <div className="maturity-bars">
              <div className="maturity-row">
                <div className="maturity-row__head">
                  <span>Governança de Dados</span>
                  <strong>{selectedMunicipality.maturityScores.dataGovernance}%</strong>
                </div>
                <div className="maturity-bar-bg">
                  <div className="maturity-bar-fill" style={{ width: `${selectedMunicipality.maturityScores.dataGovernance}%` }} />
                </div>
              </div>

              <div className="maturity-row">
                <div className="maturity-row__head">
                  <span>Prontidão Ética e LGPD</span>
                  <strong>{selectedMunicipality.maturityScores.ethicsAndLGPD}%</strong>
                </div>
                <div className="maturity-bar-bg">
                  <div className="maturity-bar-fill" style={{ width: `${selectedMunicipality.maturityScores.ethicsAndLGPD}%` }} />
                </div>
              </div>

              <div className="maturity-row">
                <div className="maturity-row__head">
                  <span>Capacidade Técnica da Equipe</span>
                  <strong>{selectedMunicipality.maturityScores.technicalCapacity}%</strong>
                </div>
                <div className="maturity-bar-bg">
                  <div className="maturity-bar-fill" style={{ width: `${selectedMunicipality.maturityScores.technicalCapacity}%` }} />
                </div>
              </div>

              <div className="maturity-row">
                <div className="maturity-row__head">
                  <span>Aplicação Prática no Serviço Público</span>
                  <strong>{selectedMunicipality.maturityScores.practicalApplication}%</strong>
                </div>
                <div className="maturity-bar-bg">
                  <div className="maturity-bar-fill" style={{ width: `${selectedMunicipality.maturityScores.practicalApplication}%` }} />
                </div>
              </div>
            </div>
          </section>

          {/* Seção 2: Acompanhamento Quinzenal */}
          <section className="fiche-section">
            <h3 className="fiche-section__title">
              <CalendarCheck size={18} />
              <span>Encontros Quinzenais & Próximos Passos</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <small style={{ color: 'var(--muted)', fontSize: '0.65rem', fontWeight: 700, display: 'block' }}>
                  Presença das Lideranças
                </small>
                <strong style={{ fontSize: '1.1rem', color: selectedMunicipality.biweeklyMeeting.attendanceRate < 75 ? 'var(--warning)' : 'var(--success)' }}>
                  {selectedMunicipality.biweeklyMeeting.attendanceRate}%
                </strong>
              </div>
              <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                <small style={{ color: 'var(--muted)', fontSize: '0.65rem', fontWeight: 700, display: 'block' }}>
                  Multiplicação na Rede
                </small>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {selectedMunicipality.multiplicationProgress}%
                </strong>
              </div>
            </div>

            <div>
              <small style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.68rem', display: 'block' }}>
                Resumo do Último Encontro:
              </small>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                {selectedMunicipality.biweeklyMeeting.summary}
              </p>
            </div>

            <div>
              <small style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.68rem', display: 'block' }}>
                Próximos Passos Combinados:
              </small>
              <ul style={{ paddingLeft: '16px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--ink-secondary)' }}>
                {selectedMunicipality.biweeklyMeeting.actionItems.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Seção 3: Equipe de 10 Lideranças Municipais */}
        <section className="fiche-section">
          <h3 className="fiche-section__title">
            <Users size={18} />
            <span>Equipe de 10 Lideranças Municipais (Multiplicadores)</span>
          </h3>

          <div className="leaders-grid">
            {selectedMunicipality.leaders.map(leader => (
              <div className="leader-item" key={leader.id}>
                <span className="leader-name">{leader.name}</span>
                <span className="leader-role">{leader.role}</span>
                <span className="leader-dept">{leader.department}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Seção 4: Entregas do Programa RIL */}
        <section className="fiche-section">
          <h3 className="fiche-section__title">
            <CheckSquare size={18} />
            <span>Entregas do Programa RIL (Clique para alternar status)</span>
          </h3>

          <div className="deliverables-list">
            {selectedMunicipality.deliverables.map(deliv => (
              <div
                key={deliv.id}
                className={`deliverable-card ${deliv.status === 'entregue' ? 'is-entregue' : ''}`}
              >
                <div className="deliverable-info">
                  <strong>{deliv.title}</strong>
                  <small>{deliv.description}</small>
                </div>

                <button
                  type="button"
                  className="deliverable-status-btn"
                  onClick={() => handleNextStatus(deliv)}
                  style={{
                    backgroundColor:
                      deliv.status === 'entregue'
                        ? 'var(--success)'
                        : deliv.status === 'em_andamento'
                        ? 'var(--warning)'
                        : 'var(--surface)',
                    color: deliv.status === 'pendente' ? 'var(--ink)' : 'white',
                    borderColor: deliv.status === 'pendente' ? 'var(--line-strong)' : 'transparent',
                  }}
                >
                  {deliv.status === 'entregue'
                    ? 'Entregue'
                    : deliv.status === 'em_andamento'
                    ? 'Em Andamento'
                    : 'Pendente'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
