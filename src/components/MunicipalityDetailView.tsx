import { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import {
  Building2,
  Users,
  Brain,
  CalendarCheck,
  CheckSquare,
  AlertTriangle,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  FileDown,
  Printer,
  ShieldCheck,
  FileText,
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
    updateDeliverableStatus,
    toggleAttention,
  } = useProgram()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [dropdownSearch, setDropdownSearch] = useState('')
  const [onlyAttentionInDropdown, setOnlyAttentionInDropdown] = useState(false)
  const [leadersModalOpen, setLeadersModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportType, setReportType] = useState<'simples' | 'completo'>('simples')

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close popups on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
        setLeadersModalOpen(false)
        setReportModalOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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

  const handleTriggerPrint = (type: 'simples' | 'completo') => {
    const originalTitle = document.title
    const cleanMunName = selectedMunicipality.name.replace(/\s+/g, '-')
    document.title = `Relatorio-${type === 'simples' ? 'Simples' : 'Completo'}-${cleanMunName}-${selectedMunicipality.state}`

    flushSync(() => {
      setReportType(type)
      setReportModalOpen(false)
    })

    window.print()
    document.title = originalTitle
  }

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
              Liderança institucional: <strong>{selectedMunicipality.mayorOrSponsor}</strong> | Articulador(a) local: <strong>{selectedMunicipality.focalPoint}</strong>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <Mail size={13} color="var(--muted)" />
              <span>{selectedMunicipality.focalPointContact}</span>
            </p>
          </div>

          <div className="fiche-header-aside">
            <div className="fiche-stage-badge">
              <Compass size={16} color="var(--primary)" />
              <div>
                <span className="fiche-stage-badge__label">Etapa no Programa</span>
                <strong className="fiche-stage-badge__value">{STAGE_LABELS[selectedMunicipality.stage]}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-download-pdf"
              onClick={() => setReportModalOpen(true)}
              title="Baixar ou imprimir relatório do município em PDF"
            >
              <FileDown size={15} />
              <span>Baixar / Imprimir Relatório (PDF)</span>
            </button>
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

        {/* Seção 3: Entregas do Programa RIL */}
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


        {/* Rodapé da Ficha: Acesso sob demanda à Equipe de 10 Lideranças */}
        <section className="fiche-footer-actions">
          <div className="leaders-trigger-bar">
            <button
              type="button"
              className={`btn-leaders-popover ${leadersModalOpen ? 'is-active' : ''}`}
              onClick={() => setLeadersModalOpen(true)}
              aria-expanded={leadersModalOpen}
            >
              <Users size={16} />
              <span>Equipe de 10 Lideranças Municipais</span>
              <span className="badge-count">10 multiplicadores</span>
            </button>
            <span className="leaders-trigger-hint">
              Clique para abrir a janela com os contatos, cargos e secretarias dos 10 multiplicadores.
            </span>
          </div>
        </section>

        {/* Janela Balão Flutuante Modal das 10 Lideranças (não altera a página) */}
        {leadersModalOpen && (
          <div
            className="leaders-modal-overlay"
            onClick={() => setLeadersModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Equipe de 10 Lideranças Municipais de ${selectedMunicipality.name}`}
          >
            <div
              className="leaders-modal-window"
              onClick={e => e.stopPropagation()}
            >
              <header className="leaders-modal-header">
                <div className="leaders-modal-header__text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--primary)" />
                    <h4>Equipe de Lideranças Municipais</h4>
                  </div>
                  <p>{selectedMunicipality.name} ({selectedMunicipality.state}) | 10 multiplicadores cadastrados</p>
                </div>
                <button
                  type="button"
                  className="popover-close-btn"
                  onClick={() => setLeadersModalOpen(false)}
                  title="Fechar janela"
                  aria-label="Fechar pop-up"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="leaders-modal-body">
                <div className="leaders-modal-grid">
                  {selectedMunicipality.leaders?.map(leader => {
                    const phoneDigits = (leader.phone || '').replace(/[^0-9]/g, '')
                    const displayPhone = leader.phone || '(11) 98000-0000'
                    const displayEmail = leader.email || `${leader.name.toLowerCase().replace(/\s+/g, '.')}@${selectedMunicipality.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${selectedMunicipality.state.toLowerCase()}.gov.br`

                    return (
                      <div className="leader-modal-card" key={leader.id}>
                        <div className="leader-modal-card__header">
                          <div>
                            <strong className="leader-modal-name">{leader.name}</strong>
                            <p className="leader-modal-role">{leader.role}</p>
                            <p className="leader-modal-dept">{leader.department}</p>
                          </div>
                          <span className={`engagement-badge engagement-badge--${leader.engagement || 'medio'}`}>
                            {leader.engagement === 'alto'
                              ? 'Engajamento Alto'
                              : leader.engagement === 'baixo'
                              ? 'Engajamento Baixo'
                              : 'Engajamento Médio'}
                          </span>
                        </div>

                        <div className="leader-modal-contacts">
                          <a
                            href={`mailto:${displayEmail}`}
                            className="leader-contact-link"
                            title={`Enviar e-mail para ${displayEmail}`}
                          >
                            <Mail size={13} />
                            <span>{displayEmail}</span>
                          </a>
                          <a
                            href={phoneDigits ? `tel:${phoneDigits}` : '#'}
                            className="leader-contact-link"
                            title={`Ligar ou enviar WhatsApp para ${displayPhone}`}
                          >
                            <Phone size={13} />
                            <span>{displayPhone}</span>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <footer className="leaders-modal-footer">
                <span className="leaders-modal-footer__info">
                  Multiplicadores capacitados para apoiar a implementação de IA no município.
                </span>
                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setLeadersModalOpen(false)}
                >
                  Fechar janela
                </button>
              </footer>
            </div>
          </div>
        )}
        {/* Modal de Seleção de Tipo de Relatório (PDF) */}
        {reportModalOpen && (
          <div
            className="report-modal-overlay"
            onClick={() => setReportModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Seleção de tipo de relatório para impressão em PDF"
          >
            <div
              className="report-modal-window"
              onClick={e => e.stopPropagation()}
            >
              <header className="report-modal-header">
                <div className="report-modal-header__text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Printer size={18} color="var(--primary)" />
                    <h4>Emissão de Relatório do Município</h4>
                  </div>
                  <p>
                    {selectedMunicipality.name} ({selectedMunicipality.state})
                  </p>
                </div>
                <button
                  type="button"
                  className="popover-close-btn"
                  onClick={() => setReportModalOpen(false)}
                  title="Fechar janela"
                  aria-label="Fechar janela de relatório"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="report-modal-body">
                <p className="report-modal-intro">
                  Escolha as informações que deseja incluir no documento:
                </p>

                <div className="report-options-grid">
                  {/* Opção 1: Relatório Simples */}
                  <div className="report-choice-card">
                    <div className="report-choice-card__content">
                      <div className="report-choice-card__header">
                        <FileText size={20} color="var(--primary)" />
                        <h5>Relatório simples</h5>
                      </div>
                      <div className="report-choice-card__items">
                        <span className="report-choice-card__items-title">Conteúdo incluído:</span>
                        <ul>
                          <li>Identificação</li>
                          <li>Diagnóstico</li>
                          <li>Frequência e ata da última reunião</li>
                          <li>Compromissos e planos de ação</li>
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-generate-report btn-generate-report--simple"
                      onClick={() => handleTriggerPrint('simples')}
                    >
                      <Printer size={15} />
                      <span>Gerar Relatório simples</span>
                    </button>
                  </div>

                  {/* Opção 2: Relatório Completo */}
                  <div className="report-choice-card report-choice-card--complete">
                    <div className="report-choice-card__content">
                      <div className="report-choice-card__header">
                        <ShieldCheck size={20} color="var(--primary)" />
                        <h5>Relatório completo</h5>
                      </div>
                      <div className="report-choice-card__items">
                        <span className="report-choice-card__items-title">Conteúdo incluído:</span>
                        <ul>
                          <li>Todo o conteúdo do Relatório simples</li>
                          <li>Status detalhado dos 4 entregáveis RIL com critérios de aceite</li>
                          <li>Tabela completa dos 10 multiplicadores locais com contatos</li>
                          <li>Matriz de riscos operacionais e estratégias de mitigação</li>
                          <li>Parecer analítico da facilitação e termo de validação</li>
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-generate-report btn-generate-report--complete"
                      onClick={() => handleTriggerPrint('completo')}
                    >
                      <FileDown size={15} />
                      <span>Gerar Relatório completo</span>
                    </button>
                  </div>
                </div>
              </div>

              <footer className="report-modal-footer">
                <span className="report-modal-footer__hint">
                  Dica: na caixa de impressão, selecione "Salvar como PDF" e marque a opção "Gráficos de segundo plano".
                </span>
                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setReportModalOpen(false)}
                >
                  Cancelar
                </button>
              </footer>
            </div>
          </div>
        )}
      </main>

      {/* Dossiê Executivo Formal para Impressão em PDF (Estrutura Institucional Oficial - Não é cópia de tela) */}
      <article className={`print-dossier print-dossier--${reportType}`} aria-hidden="true">
        <header className="print-dossier__header">
          <div className="print-dossier__brand">
            <span className="print-dossier__badge">REDE DE INOVAÇÃO LOCAL (RIL BRASIL)</span>
          </div>
          <h1 className="print-dossier__title">
            DOSSIÊ EXECUTIVO DE GESTÃO MUNICIPAL: {selectedMunicipality.name.toUpperCase()} ({selectedMunicipality.state})
          </h1>
          <div className="print-dossier__meta-strip">
            <div>
              <strong>Modalidade:</strong> {reportType === 'simples' ? 'Relatório simples' : 'Relatório completo'}
            </div>
            <div>
              <strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}
            </div>
            <div>
              <strong>Facilitadora RIL:</strong> Thayâne Carvalho (Gestão de Projetos & Facilitação)
            </div>
          </div>
        </header>

        {/* Bloco 1: Identificação Institucional */}
        <section className="print-dossier__section">
          <h2 className="print-dossier__section-title">I. IDENTIFICAÇÃO E ESTRUTURA INSTITUCIONAL</h2>
          <table className="print-dossier__table">
            <tbody>
              <tr>
                <th style={{ width: '22%' }}>Município / UF:</th>
                <td style={{ width: '28%' }}><strong>{selectedMunicipality.name} ({selectedMunicipality.state})</strong></td>
                <th style={{ width: '22%' }}>Região Geográfica:</th>
                <td style={{ width: '28%' }}>{selectedMunicipality.region}</td>
              </tr>
              <tr>
                <th>Porte Demográfico:</th>
                <td>{selectedMunicipality.populationSize} ({selectedMunicipality.population.toLocaleString('pt-BR')} habitantes)</td>
                <th>Trilha do Programa:</th>
                <td><strong>{TRACK_LABELS[selectedMunicipality.track]}</strong></td>
              </tr>
              <tr>
                <th>Liderança Institucional:</th>
                <td>{selectedMunicipality.mayorOrSponsor}</td>
                <th>Etapa Vigente:</th>
                <td><strong>{STAGE_LABELS[selectedMunicipality.stage]}</strong></td>
              </tr>
              <tr>
                <th>Articulador(a) Local:</th>
                <td>{selectedMunicipality.focalPoint}</td>
                <th>Contato Institucional:</th>
                <td>{selectedMunicipality.focalPointContact}</td>
              </tr>
              <tr>
                <th>Situação Operacional:</th>
                <td colSpan={3}>
                  {selectedMunicipality.attention.hasAttention ? (
                    <span style={{ color: '#b45309', fontWeight: 700 }}>
                      [PONTO DE ATENÇÃO REGISTRADO] {selectedMunicipality.attention.reason} (Encaminhamento pactuado: {selectedMunicipality.attention.supportAction})
                    </span>
                  ) : (
                    <span style={{ color: '#166534', fontWeight: 600 }}>
                      [CONFORME] Operação regular e alinhada ao cronograma pactuado com a facilitação RIL.
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Bloco 2: Diagnóstico de Maturidade em Inteligência Artificial */}
        <section className="print-dossier__section">
          <h2 className="print-dossier__section-title">II. DIAGNÓSTICO DE MATURIDADE EM INTELIGÊNCIA ARTIFICIAL</h2>
          <div className="print-dossier__text-box">
            <p>
              Classificação Geral do Município: <strong>{selectedMunicipality.maturityLevel.toUpperCase()}</strong>. O diagnóstico avalia a prontidão da administração pública municipal em quatro dimensões fundamentais para a implementação ética e sustentável de soluções analíticas.
            </p>
          </div>
          <table className="print-dossier__table" style={{ marginTop: '8px' }}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Dimensão Avaliada</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Pontuação</th>
                <th style={{ width: '20%' }}>Classificação</th>
                <th style={{ width: '35%' }}>Diretriz Técnica RIL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Governança de Dados</strong></td>
                <td style={{ textAlign: 'center' }}><strong>{selectedMunicipality.maturityScores.dataGovernance}%</strong></td>
                <td>{selectedMunicipality.maturityScores.dataGovernance >= 70 ? 'Avançado' : selectedMunicipality.maturityScores.dataGovernance >= 50 ? 'Intermediário' : 'Inicial'}</td>
                <td>Estruturação de repositórios, catalogação e integridade dos bancos cadastrais municipais.</td>
              </tr>
              <tr>
                <td><strong>Prontidão Ética e LGPD</strong></td>
                <td style={{ textAlign: 'center' }}><strong>{selectedMunicipality.maturityScores.ethicsAndLGPD}%</strong></td>
                <td>{selectedMunicipality.maturityScores.ethicsAndLGPD >= 70 ? 'Avançado' : selectedMunicipality.maturityScores.ethicsAndLGPD >= 50 ? 'Intermediário' : 'Inicial'}</td>
                <td>Salvaguardas de privacidade, consentimento informado e auditoria algorítmica de viés.</td>
              </tr>
              <tr>
                <td><strong>Capacidade Técnica da Equipe</strong></td>
                <td style={{ textAlign: 'center' }}><strong>{selectedMunicipality.maturityScores.technicalCapacity}%</strong></td>
                <td>{selectedMunicipality.maturityScores.technicalCapacity >= 70 ? 'Avançado' : selectedMunicipality.maturityScores.technicalCapacity >= 50 ? 'Intermediário' : 'Inicial'}</td>
                <td>Nível de literacia digital, domínio de prompts e capacidade de multiplicação interna.</td>
              </tr>
              <tr>
                <td><strong>Aplicação Prática no Serviço Público</strong></td>
                <td style={{ textAlign: 'center' }}><strong>{selectedMunicipality.maturityScores.practicalApplication}%</strong></td>
                <td>{selectedMunicipality.maturityScores.practicalApplication >= 70 ? 'Avançado' : selectedMunicipality.maturityScores.practicalApplication >= 50 ? 'Intermediário' : 'Inicial'}</td>
                <td>Projetos pilotos implantados para redução de filas e automação de rotinas cidadãs.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Bloco 3: Encontros Quinzenais & Plano de Ação */}
        <section className="print-dossier__section">
          <h2 className="print-dossier__section-title">III. ACOMPANHAMENTO DOS ENCONTROS QUINZENAIS & PLANO DE AÇÃO</h2>
          <table className="print-dossier__table">
            <tbody>
              <tr>
                <th style={{ width: '25%' }}>Presença das Lideranças:</th>
                <td style={{ width: '25%' }}><strong>{selectedMunicipality.biweeklyMeeting.attendanceRate}%</strong></td>
                <th style={{ width: '25%' }}>Multiplicação na Rede:</th>
                <td style={{ width: '25%' }}><strong>{selectedMunicipality.multiplicationProgress}%</strong></td>
              </tr>
              <tr>
                <th>Síntese da Reunião Quinzenal:</th>
                <td colSpan={3}>{selectedMunicipality.biweeklyMeeting.summary}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '8px' }}>
            <h3 className="print-dossier__subtitle">Compromissos Operacionais e Próximos Passos:</h3>
            <table className="print-dossier__table">
              <thead>
                <tr>
                  <th style={{ width: '8%', textAlign: 'center' }}>Item</th>
                  <th style={{ width: '92%' }}>Ação Pactuada e Próximos Passos</th>
                </tr>
              </thead>
              <tbody>
                {selectedMunicipality.biweeklyMeeting.actionItems.map((action, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#2d4533', backgroundColor: '#f8fafc' }}>
                      0{idx + 1}
                    </td>
                    <td style={{ padding: '6pt 10pt', fontSize: '8pt', lineHeight: 1.5 }}>
                      {action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Seções Adicionais Exclusivas do Relatório Completo */}
        {reportType === 'completo' && (
          <>
            {/* Bloco 4: Cronograma de Entregas */}
            <section className="print-dossier__section print-break-before">
              <h2 className="print-dossier__section-title">IV. CRONOGRAMA & STATUS DETALHADO DAS ENTREGAS RIL</h2>
              <table className="print-dossier__table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Entregável Oficial</th>
                    <th style={{ width: '45%' }}>Descrição e Escopo Técnico</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                    <th style={{ width: '15%' }}>Evidência Requerida</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMunicipality.deliverables.map(deliv => (
                    <tr key={deliv.id}>
                      <td><strong>{deliv.title}</strong></td>
                      <td>{deliv.description}</td>
                      <td style={{ textAlign: 'center' }}>
                        <strong style={{
                          color: deliv.status === 'entregue' ? '#166534' : deliv.status === 'em_andamento' ? '#b45309' : '#475569'
                        }}>
                          {deliv.status === 'entregue' ? 'Entregue' : deliv.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                        </strong>
                      </td>
                      <td>{deliv.status === 'entregue' ? 'Documento homologado' : 'Validação com articulador'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Bloco 5: Equipe de Multiplicadores Locais */}
            <section className="print-dossier__section">
              <h2 className="print-dossier__section-title">V. QUADRO DE MULTIPLICADORES LOCAIS</h2>
              <table className="print-dossier__table">
                <thead>
                  <tr>
                    <th style={{ width: '22%' }}>Nome</th>
                    <th style={{ width: '18%' }}>Cargo</th>
                    <th style={{ width: '22%' }}>Secretaria / Órgão</th>
                    <th style={{ width: '22%' }}>E-mail Institucional</th>
                    <th style={{ width: '16%' }}>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMunicipality.leaders?.map(leader => (
                    <tr key={leader.id}>
                      <td><strong>{leader.name}</strong></td>
                      <td>{leader.role}</td>
                      <td>{leader.department}</td>
                      <td>{leader.email}</td>
                      <td>{leader.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Bloco 6: Matriz de Riscos & Diretrizes de Mitigação (Detalhamento Extra) */}
            <section className="print-dossier__section">
              <h2 className="print-dossier__section-title">VI. MATRIZ DE RISCOS & DIRETRIZES DE MITIGAÇÃO</h2>
              <table className="print-dossier__table">
                <thead>
                  <tr>
                    <th style={{ width: '25%' }}>Fator de Risco Mapeado</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>Severidade</th>
                    <th style={{ width: '60%' }}>Estratégia Preventiva e Diretriz de Mitigação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Rotatividade de Servidores</strong></td>
                    <td style={{ textAlign: 'center' }}>Média</td>
                    <td>Formação em rede com 10 multiplicadores cadastrados e repositório documental compartilhado para garantir a perenidade do conhecimento gerado.</td>
                  </tr>
                  <tr>
                    <td><strong>Conformidade e Proteção de Dados (LGPD)</strong></td>
                    <td style={{ textAlign: 'center' }}>Alta</td>
                    <td>Aplicação de salvaguardas prévias, checklists éticos e treinamento dos servidores para vedar o processamento de dados pessoais sensíveis em ferramentas públicas.</td>
                  </tr>
                  <tr>
                    <td><strong>Sobrecarga Operacional nas Secretarias</strong></td>
                    <td style={{ textAlign: 'center' }}>Média</td>
                    <td>Estruturação de encontros quinzenais ágeis de 45 minutos e entrega de modelos pré-configurados de uso imediato na rotina administrativa.</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Bloco 7: Parecer e Termo de Validação Operacional */}
            <section className="print-dossier__section print-break-inside-avoid">
              <h2 className="print-dossier__section-title">VII. TERMO DE CIÊNCIA E VALIDAÇÃO OPERACIONAL</h2>
              <div className="print-dossier__text-box">
                <p>
                  As informações registradas neste dossiê refletem as evidências apuradas nos encontros quinzenais de facilitação, nos diagnósticos de maturidade e no acompanhamento dos entregáveis da jornada de transformação digital e inteligência artificial da Rede de Inovação Local (RIL).
                </p>
              </div>

              <div className="print-signatures-grid">
                <div className="print-signature-box">
                  <div className="print-signature-line" />
                  <strong>Thayâne Carvalho</strong>
                  <span>Facilitadora do Programa & Gestão de Projetos</span>
                  <small>Rede de Inovação Local (RIL Brasil)</small>
                </div>
                <div className="print-signature-box">
                  <div className="print-signature-line" />
                  <strong>{selectedMunicipality.focalPoint}</strong>
                  <span>Articulador(a) Local do Programa</span>
                  <small>Prefeitura Municipal de {selectedMunicipality.name} ({selectedMunicipality.state})</small>
                </div>
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  )
}
