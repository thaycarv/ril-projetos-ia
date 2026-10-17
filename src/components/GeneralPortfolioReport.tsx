import { useState, useRef } from 'react'
import { flushSync, createPortal } from 'react-dom'
import {
  FileDown,
  X,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react'
import { useProgram } from '../context/ProgramContext'
import type { MunicipalityStage } from '../types'

const STAGE_LABELS: Record<MunicipalityStage, string> = {
  alinhamento: '1. Entrada & Alinhamento',
  diagnostico: '2. Diagnóstico de IA',
  formacao: '3. Formação & Trilhas',
  multiplicacao: '4. Aplicação & Multiplicação',
  concluido: '5. Ciclo Concluído',
}

export function GeneralPortfolioReport() {
  const { municipalities, indicators } = useProgram()
  const [modalOpen, setModalOpen] = useState(false)
  const [reportType, setReportType] = useState<'sintetico' | 'analitico'>('sintetico')
  const reportRef = useRef<HTMLElement>(null)

  // Metricas agregadas para o relatorio
  const totalMun = municipalities.length
  const totalPop = municipalities.reduce((acc, m) => acc + (m.population || 0), 0)
  const totalLeaders = municipalities.reduce((acc, m) => acc + (m.leaders?.length || 0), 0)
  const attentionCount = municipalities.filter(m => m.attention?.hasAttention).length

  // Media de presenca nos encontros quinzenais
  const avgAttendance = Math.round(
    municipalities.reduce((acc, m) => acc + (m.biweeklyMeeting?.attendanceRate || 0), 0) / (totalMun || 1)
  )

  // Medias das 4 dimensoes de maturidade em IA
  const avgScores = {
    gov: (municipalities.reduce((acc, m) => acc + (m.maturityScores?.dataGovernance || 0), 0) / totalMun).toFixed(1),
    lgpd: (municipalities.reduce((acc, m) => acc + (m.maturityScores?.ethicsAndLGPD || 0), 0) / totalMun).toFixed(1),
    tec: (municipalities.reduce((acc, m) => acc + (m.maturityScores?.technicalCapacity || 0), 0) / totalMun).toFixed(1),
    app: (municipalities.reduce((acc, m) => acc + (m.maturityScores?.practicalApplication || 0), 0) / totalMun).toFixed(1),
  }

  // Contagem por etapa
  const stageCounts: Record<MunicipalityStage, number> = {
    alinhamento: municipalities.filter(m => m.stage === 'alinhamento').length,
    diagnostico: municipalities.filter(m => m.stage === 'diagnostico').length,
    formacao: municipalities.filter(m => m.stage === 'formacao').length,
    multiplicacao: municipalities.filter(m => m.stage === 'multiplicacao').length,
    concluido: municipalities.filter(m => m.stage === 'concluido').length,
  }

  // Contagem por regiao
  const regionCounts = {
    Norte: municipalities.filter(m => m.region === 'Norte').length,
    Nordeste: municipalities.filter(m => m.region === 'Nordeste').length,
    'Centro-Oeste': municipalities.filter(m => m.region === 'Centro-Oeste').length,
    Sudeste: municipalities.filter(m => m.region === 'Sudeste').length,
    Sul: municipalities.filter(m => m.region === 'Sul').length,
  }

  // Divisao dos 40 municipios em 2 colunas de 20 linhas para a Pagina 2
  const sortedMunicipalities = [...municipalities].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  const halfLength = Math.ceil(sortedMunicipalities.length / 2)
  const firstHalf = sortedMunicipalities.slice(0, halfLength)
  const secondHalf = sortedMunicipalities.slice(halfLength)

  const handleTriggerPrint = (type: 'sintetico' | 'analitico') => {
    const originalTitle = document.title
    document.title = `Relatorio-Geral-Carteira-${type === 'sintetico' ? 'Sintetico' : 'Analitico'}-RIL-Projetos-IA`

    flushSync(() => {
      setReportType(type)
      setModalOpen(false)
    })

    window.print()
    document.title = originalTitle
  }

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* Botao de Acao na Interface da Visao Geral */}
      <button
        type="button"
        className="btn-download-pdf btn-download-pdf--general"
        onClick={() => setModalOpen(true)}
        title="Baixar ou imprimir relatório geral consolidado da carteira em PDF"
      >
        <FileDown size={15} />
        <span>Relatório Geral da Carteira (PDF)</span>
      </button>

      {/* Modal de Escolha do Tipo de Relatório */}
      {modalOpen && (
        <div
          className="report-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="general-report-modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div className="report-modal-window" onClick={e => e.stopPropagation()}>
            <header className="report-modal-header">
              <div className="report-modal-header__text">
                <h4 id="general-report-modal-title">Relatório Geral da Carteira RIL Projetos IA</h4>
                <p>Selecione a modalidade de relatório para exportação ou impressão em PDF</p>
              </div>
              <button
                type="button"
                className="picker-arrow-btn"
                onClick={() => setModalOpen(false)}
                title="Fechar seleção"
                aria-label="Fechar janela"
              >
                <X size={16} />
              </button>
            </header>

            <div className="report-modal-body">
              <p className="report-modal-intro">
                Em conformidade com os padrões executivos da Rede de Inovação Local (RIL), os relatórios consolidam o avanço das 40 cidades participantes na jornada Governos na Era da IA, combinando dados quantitativos, matriz de riscos e governança federativa.
              </p>

              <div className="report-options-grid">
                {/* Opcao 1: Relatorio Sintetico (1 Pagina) */}
                <div className="report-choice-card">
                  <div className="report-choice-card__badge report-choice-card__badge--simple">
                    Página Única (One-Page)
                  </div>
                  <div className="report-choice-card__content">
                    <div className="report-choice-card__header">
                      <FileCheck2 size={24} color="var(--primary)" />
                      <div>
                        <h5>Relatório Sintético Executivo</h5>
                        <small style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>
                          Visão de Alto Nível para Gabinetes e Lideranças
                        </small>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: 'var(--ink-secondary)', margin: '4px 0' }}>
                      Resumo estratégico condensado em 1 página contendo indicadores globais, distribuição pelo funil de 5 etapas, cobertura regional, médias de maturidade e lista de pontos de atenção ativos.
                    </p>
                    <div className="report-choice-card__items">
                      <span className="report-choice-card__items-title">Conteúdo Selecionado:</span>
                      <ul>
                        <li>Cabeçalho Institucional RIL Brasil & Meta-Dados</li>
                        <li>Painel de 6 Indicadores Estratégicos Globais</li>
                        <li>Funil de Maturidade das 5 Etapas do Programa</li>
                        <li>Distribuição Regional e Médias de Maturidade em IA</li>
                        <li>Mapeamento Sintético de Pontos de Atenção Ativos</li>
                      </ul>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-generate-report btn-generate-report--primary"
                    onClick={() => handleTriggerPrint('sintetico')}
                  >
                    <FileDown size={14} />
                    <span>Gerar Relatório Sintético (1 Pág)</span>
                  </button>
                </div>

                {/* Opcao 2: Relatorio Analitico Completo (2 Paginas) */}
                <div className="report-choice-card report-choice-card--complete">
                  <div className="report-choice-card__badge report-choice-card__badge--complete">
                    Dossiê Consolidado (2 Páginas)
                  </div>
                  <div className="report-choice-card__content">
                    <div className="report-choice-card__header">
                      <FileSpreadsheet size={24} color="#92400e" />
                      <div>
                        <h5>Relatório Analítico Completo</h5>
                        <small style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>
                          Governança Nacional & Rastreabilidade dos 40 Municípios
                        </small>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: 'var(--ink-secondary)', margin: '4px 0' }}>
                      Dossiê completo diagramado rigorosamente em 2 páginas. Inclui o panorama estratégico na página 1 e a tabela analítica dos 40 municípios (em 2 colunas), matriz nacional de riscos e validação institucional na página 2.
                    </p>
                    <div className="report-choice-card__items">
                      <span className="report-choice-card__items-title">Estrutura Diagramada (2 Páginas):</span>
                      <ul>
                        <li><strong>Pág. 1:</strong> KPIs globais, funil de etapas, diagnóstico de IA e atenção</li>
                        <li><strong>Pág. 2:</strong> Quadro analítico dos 40 municípios em 2 colunas</li>
                        <li><strong>Pág. 2:</strong> Matriz de Riscos Operacionais do Programa Nacional</li>
                        <li><strong>Pág. 2:</strong> Parecer da Coordenação RIL e Assinaturas Formais</li>
                      </ul>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-generate-report btn-generate-report--complete"
                    onClick={() => handleTriggerPrint('analitico')}
                  >
                    <FileDown size={14} />
                    <span>Gerar Dossiê Completo (2 Págs)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dossiê de Impressao Formal da Carteira Geral (Visivel Somente no @media print) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <article
            ref={reportRef}
            className={`print-dossier print-portfolio-dossier print-portfolio-dossier--${reportType}`}
            aria-label="Dossiê Executivo da Carteira Geral"
          >
            {/* Cabecalho Institucional Padrao RIL Brasil */}
            <header className="print-dossier__header">
          <div className="print-dossier__brand">
            <span className="print-dossier__badge">REDE DE INOVAÇÃO LOCAL (RIL BRASIL)</span>
            <span style={{ fontSize: '7pt', color: '#475569', fontWeight: 600 }}>
              PROGRAMA GOVERNOS NA ERA DA IA (2026)
            </span>
          </div>
          <h1 className="print-dossier__title">
            {reportType === 'sintetico'
              ? 'RELATÓRIO SINTÉTICO EXECUTIVO DA CARTEIRA DE 40 MUNICÍPIOS'
              : 'DOSSIÊ ANALÍTICO DE GESTÃO DA CARTEIRA NACIONAL (40 MUNICÍPIOS)'}
          </h1>
          <div className="print-dossier__meta-strip">
            <span><strong>Data de Emissão:</strong> {currentDate}</span>
            <span><strong>Escopo:</strong> 40 Municípios Brasileiros Participantes</span>
            <span><strong>População Impactada:</strong> {totalPop.toLocaleString('pt-BR')} habitantes</span>
            <span><strong>Lideranças Mobilizadas:</strong> {totalLeaders} multiplicadores</span>
            <span><strong>Facilitadora Responsável:</strong> Thayâne Carvalho</span>
          </div>
        </header>

        {/* Bloco 1: Indicadores Estratégicos Globais da Carteira */}
        <section className="print-dossier__section">
          <h2 className="print-dossier__section-title">I. INDICADORES ESTRATÉGICOS CONSOLIDADOS DO PROGRAMA</h2>
          <table className="print-dossier__table">
            <thead>
              <tr>
                <th style={{ width: '16.6%', textAlign: 'center' }}>Total de Cidades</th>
                <th style={{ width: '16.6%', textAlign: 'center' }}>Líderes Ativos</th>
                <th style={{ width: '16.6%', textAlign: 'center' }}>Diagnósticos de IA</th>
                <th style={{ width: '16.6%', textAlign: 'center' }}>Multiplicação Ativa</th>
                <th style={{ width: '16.6%', textAlign: 'center' }}>Ciclos Concluídos</th>
                <th style={{ width: '16.6%', textAlign: 'center' }}>Pontos de Atenção</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center', fontSize: '9pt', fontWeight: 800 }}>{indicators.totalMunicipalities}</td>
                <td style={{ textAlign: 'center', fontSize: '9pt', fontWeight: 800 }}>{indicators.totalLeaders}</td>
                <td style={{ textAlign: 'center', fontSize: '9pt', fontWeight: 800, color: '#0369a1' }}>
                  {indicators.diagnosticsCompleted} ({Math.round((indicators.diagnosticsCompleted / totalMun) * 100)}%)
                </td>
                <td style={{ textAlign: 'center', fontSize: '9pt', fontWeight: 800, color: '#9d174d' }}>
                  {indicators.multiplicationActive} ({Math.round((indicators.multiplicationActive / totalMun) * 100)}%)
                </td>
                <td style={{ textAlign: 'center', fontSize: '9pt', fontWeight: 800, color: '#166534' }}>
                  {indicators.completedCycle} ({Math.round((indicators.completedCycle / totalMun) * 100)}%)
                </td>
                <td style={{ textAlign: 'center', fontSize: '9pt', fontWeight: 800, color: '#b45309' }}>
                  {indicators.attentionCount} ({Math.round((indicators.attentionCount / totalMun) * 100)}%)
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Bloco 2: Pipeline de Evolucao nas 5 Etapas do Funil RIL */}
        <section className="print-dossier__section">
          <h2 className="print-dossier__section-title">II. DISTRIBUIÇÃO DA CARTEIRA PELAS 5 ETAPAS DA JORNADA RIL</h2>
          <table className="print-dossier__table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>1. Entrada & Alinhamento</th>
                <th style={{ width: '20%' }}>2. Diagnóstico de IA</th>
                <th style={{ width: '20%' }}>3. Formação & Trilhas</th>
                <th style={{ width: '20%' }}>4. Aplicação & Multiplicação</th>
                <th style={{ width: '20%' }}>5. Ciclo Concluído</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'top' }}>
                  <strong>{stageCounts.alinhamento} cidades</strong> ({Math.round((stageCounts.alinhamento / totalMun) * 100)}%)
                  <p style={{ fontSize: '6pt', color: '#475569', margin: '2pt 0 0 0' }}>
                    Adesão formalizada e nomeação dos 10 multiplicadores locais.
                  </p>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <strong>{stageCounts.diagnostico} cidades</strong> ({Math.round((stageCounts.diagnostico / totalMun) * 100)}%)
                  <p style={{ fontSize: '6pt', color: '#475569', margin: '2pt 0 0 0' }}>
                    Mapeamento de repositórios, prontidão de dados e escolha da trilha.
                  </p>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <strong>{stageCounts.formacao} cidades</strong> ({Math.round((stageCounts.formacao / totalMun) * 100)}%)
                  <p style={{ fontSize: '6pt', color: '#475569', margin: '2pt 0 0 0' }}>
                    Oficinas práticas no Portal RIL e casos de uso prioritários.
                  </p>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <strong>{stageCounts.multiplicacao} cidades</strong> ({Math.round((stageCounts.multiplicacao / totalMun) * 100)}%)
                  <p style={{ fontSize: '6pt', color: '#475569', margin: '2pt 0 0 0' }}>
                    Disseminação interna entre secretarias e prática em campo.
                  </p>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <strong>{stageCounts.concluido} cidades</strong> ({Math.round((stageCounts.concluido / totalMun) * 100)}%)
                  <p style={{ fontSize: '6pt', color: '#475569', margin: '2pt 0 0 0' }}>
                    Entregáveis validados e síntese executiva homologada.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Bloco 3: Panorama Consolidado de Maturidade em IA e Cobertura Territorial */}
        <section className="print-dossier__section">
          <h2 className="print-dossier__section-title">III. PANORAMA DE MATURIDADE EM IA & COBERTURA REGIONAL</h2>
          <table className="print-dossier__table">
            <thead>
              <tr>
                <th colSpan={4} style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>Médias Nacionais nas 4 Dimensões de IA (Escala 0 a 10)</th>
                <th colSpan={5} style={{ textAlign: 'center', backgroundColor: '#e2e8f0' }}>Distribuição Territorial por Macrorregião</th>
              </tr>
              <tr>
                <th style={{ width: '12%', textAlign: 'center' }}>Governança</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Ética & LGPD</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Capacidade Téc.</th>
                <th style={{ width: '14%', textAlign: 'center' }}>Aplicação Prática</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Norte</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Nordeste</th>
                <th style={{ width: '10%', textAlign: 'center' }}>C.-Oeste</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Sudeste</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Sul</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 800 }}>{avgScores.gov} / 10</td>
                <td style={{ textAlign: 'center', fontWeight: 800 }}>{avgScores.lgpd} / 10</td>
                <td style={{ textAlign: 'center', fontWeight: 800 }}>{avgScores.tec} / 10</td>
                <td style={{ textAlign: 'center', fontWeight: 800 }}>{avgScores.app} / 10</td>
                <td style={{ textAlign: 'center' }}>{regionCounts.Norte} mun.</td>
                <td style={{ textAlign: 'center' }}>{regionCounts.Nordeste} mun.</td>
                <td style={{ textAlign: 'center' }}>{regionCounts['Centro-Oeste']} mun.</td>
                <td style={{ textAlign: 'center' }}>{regionCounts.Sudeste} mun.</td>
                <td style={{ textAlign: 'center' }}>{regionCounts.Sul} mun.</td>
              </tr>
            </tbody>
          </table>
          <div className="print-dossier__text-box" style={{ marginTop: '2pt' }}>
            <p>
              <strong>Diagnóstico Sintético da Carteira:</strong> A dimensão de Ética & LGPD apresenta o maior índice médio ({avgScores.lgpd}/10), refletindo a maturidade prévia dos municípios em salvaguardas regulatórias. A dimensão de Capacidade Técnica ({avgScores.tec}/10) constitui o principal gargalo formativo, demandando suporte direcionado na estruturação de dados públicos antes da escalada de modelos preditivos.
            </p>
          </div>
        </section>

        {/* Bloco 4: Monitoramento Crítico & Pontos de Atenção Ativos */}
        <section className="print-dossier__section">
          <h2 className="print-dossier__section-title">IV. MONITORAMENTO CRÍTICO & PONTOS DE ATENÇÃO DA CARTEIRA</h2>
          <table className="print-dossier__table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Município (UF)</th>
                <th style={{ width: '16%' }}>Etapa Atual</th>
                <th style={{ width: '14%' }}>Categoria</th>
                <th style={{ width: '24%' }}>Diagnóstico do Ponto de Atenção</th>
                <th style={{ width: '24%' }}>Diretriz de Suporte Pactuada</th>
              </tr>
            </thead>
            <tbody>
              {municipalities
                .filter(m => m.attention?.hasAttention)
                .slice(0, reportType === 'sintetico' ? 5 : 4)
                .map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.name} ({m.state})</strong></td>
                    <td>{STAGE_LABELS[m.stage]}</td>
                    <td>
                      <span style={{ color: '#b45309', fontWeight: 700 }}>
                        {m.attention.category ? m.attention.category.toUpperCase() : 'GERAL'}
                      </span>
                    </td>
                    <td>{m.attention.reason || 'Necessidade de alinhamento com equipe de articulação.'}</td>
                    <td>{m.attention.supportAction || 'Reunião extraordinária com articulador local.'}</td>
                  </tr>
                ))}
              {attentionCount === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#166534', fontWeight: 700 }}>
                    Nenhum ponto de atenção crítico ativo. Todas as 40 cidades estão com cronograma e encontros em dia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Seção Exclusiva da Página 1 para o Relatório Sintético: Parecer Geral e Assinatura */}
        {reportType === 'sintetico' && (
          <section className="print-dossier__section" style={{ marginTop: '4pt' }}>
            <h2 className="print-dossier__section-title">V. PARECER EXECUTIVO & CHANCELAMENTO INSTITUCIONAL</h2>
            <div className="print-dossier__text-box">
              <p>
                A carteira nacional do Programa RIL Governos na Era da IA demonstra progresso operacional acelerado, com {Math.round(((stageCounts.formacao + stageCounts.multiplicacao + stageCounts.concluido) / totalMun) * 100)}% dos municípios já integrados às oficinas de formação ou estágios avançados de multiplicação. A assiduidade média nos encontros quinzenais atinge {avgAttendance}%, ratificando o alto compromisso dos articuladores locais e a perenidade dos 10 multiplicadores indicados por cada município.
              </p>
            </div>

            <div className="print-signatures-grid" style={{ marginTop: '10pt' }}>
              <div className="print-signature-box">
                <div className="print-signature-line" />
                <strong>Thayâne Carvalho</strong>
                <span>Facilitadora Nacional & Gestão de Projetos RIL</span>
                <small>Rede de Inovação Local (RIL Brasil)</small>
              </div>
              <div className="print-signature-box">
                <div className="print-signature-line" />
                <strong>Coordenação Geral de Transformação Digital</strong>
                <span>Comitê Gestor Governos na Era da IA</span>
                <small>Conselho Institucional RIL Brasil</small>
              </div>
            </div>
          </section>
        )}

        {/* Seções Adicionais Exclusivas do Relatório Analítico na Página 2 */}
        {reportType === 'analitico' && (
          <>
            {/* Bloco 5 (Início da Página 2): Quadro Analítico dos 40 Municípios em 2 Colunas */}
            <section className="print-dossier__section print-break-before">
              <h2 className="print-dossier__section-title">V. QUADRO ANALÍTICO CONSOLIDADO DOS 40 MUNICÍPIOS PARTICIPANTES</h2>
              <div className="print-portfolio-grid-2col">
                {/* Coluna Esquerda: Primeiros 20 Municipios */}
                <table className="print-dossier__table print-portfolio-table-half">
                  <thead>
                    <tr>
                      <th style={{ width: '38%' }}>Município (UF)</th>
                      <th style={{ width: '32%' }}>Etapa no Programa</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>Presença</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firstHalf.map(m => (
                      <tr key={m.id}>
                        <td>
                          <strong>{m.name}</strong> <span style={{ color: '#64748b' }}>({m.state})</span>
                        </td>
                        <td style={{ fontSize: '6pt' }}>{STAGE_LABELS[m.stage]}</td>
                        <td style={{ textAlign: 'center', fontSize: '6.2pt' }}>
                          {m.biweeklyMeeting?.attendanceRate}%
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            color: m.attention?.hasAttention ? '#b45309' : '#166534',
                            fontWeight: 700,
                            fontSize: '6pt'
                          }}>
                            {m.attention?.hasAttention ? 'Atenção' : 'Regular'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Coluna Direita: Segundos 20 Municipios */}
                <table className="print-dossier__table print-portfolio-table-half">
                  <thead>
                    <tr>
                      <th style={{ width: '38%' }}>Município (UF)</th>
                      <th style={{ width: '32%' }}>Etapa no Programa</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>Presença</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secondHalf.map(m => (
                      <tr key={m.id}>
                        <td>
                          <strong>{m.name}</strong> <span style={{ color: '#64748b' }}>({m.state})</span>
                        </td>
                        <td style={{ fontSize: '6pt' }}>{STAGE_LABELS[m.stage]}</td>
                        <td style={{ textAlign: 'center', fontSize: '6.2pt' }}>
                          {m.biweeklyMeeting?.attendanceRate}%
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            color: m.attention?.hasAttention ? '#b45309' : '#166534',
                            fontWeight: 700,
                            fontSize: '6pt'
                          }}>
                            {m.attention?.hasAttention ? 'Atenção' : 'Regular'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bloco 6: Matriz de Riscos do Programa Nacional RIL */}
            <section className="print-dossier__section">
              <h2 className="print-dossier__section-title">VI. MATRIZ DE RISCOS DA CARTEIRA & DIRETRIZES DE MITIGAÇÃO</h2>
              <table className="print-dossier__table print-dossier__table--risks">
                <thead>
                  <tr>
                    <th style={{ width: '24%' }}>Fator de Risco Mapeado</th>
                    <th style={{ width: '12%', textAlign: 'center' }}>Severidade</th>
                    <th style={{ width: '64%' }}>Estratégia Nacional de Mitigação & Salvaguarda</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Assimetria de Capacidade Técnica</strong></td>
                    <td style={{ textAlign: 'center', color: '#b45309', fontWeight: 700 }}>Alta</td>
                    <td>Nivelamento através de 3 trilhas adaptadas ao porte municipal e mentorias direcionadas com especialistas da coordenação RIL.</td>
                  </tr>
                  <tr>
                    <td><strong>Descontinuidade e Transição Política</strong></td>
                    <td style={{ textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Média</td>
                    <td>Institucionalização da comissão dos 10 multiplicadores locais com portaria municipal e repositório digital compartilhado em nuvem.</td>
                  </tr>
                  <tr>
                    <td><strong>Conformidade e Sigilo Governamental</strong></td>
                    <td style={{ textAlign: 'center', color: '#b45309', fontWeight: 700 }}>Alta</td>
                    <td>Protocolo estrito de segurança vedando dados tributários ou de saúde descaracterizados em ambientes abertos de LLM.</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Bloco 7: Parecer da Coordenação RIL e Assinaturas Formais de Homologação */}
            <section className="print-dossier__section print-break-inside-avoid">
              <h2 className="print-dossier__section-title">VII. TERMO DE CIÊNCIA E VALIDAÇÃO DA COORDENAÇÃO NACIONAL</h2>
              <div className="print-dossier__text-box">
                <p>
                  Certificamos que as métricas aqui expostas representam com exatidão o estado operacional da carteira de 40 municípios atendidos pela Rede de Inovação Local no ciclo Governos na Era da IA. A facilitação contínua assegura a integridade metodológica e o alcance das metas de capacitação e inovação pública pactuadas com os gestores municipais.
                </p>
              </div>

              <div className="print-signatures-grid" style={{ marginTop: '12pt' }}>
                <div className="print-signature-box">
                  <div className="print-signature-line" />
                  <strong>Thayâne Carvalho</strong>
                  <span>Facilitadora Nacional & Gestão de Projetos RIL</span>
                  <small>Rede de Inovação Local (RIL Brasil)</small>
                </div>
                <div className="print-signature-box">
                  <div className="print-signature-line" />
                  <strong>Comitê de Governança & Transformação Digital</strong>
                  <span>Representação das Cidades Participantes</span>
                  <small>Programa Governos na Era da IA (2026)</small>
                </div>
              </div>
            </section>
          </>
        )}
      </article>,
      document.body
    )}
    </>
  )
}
