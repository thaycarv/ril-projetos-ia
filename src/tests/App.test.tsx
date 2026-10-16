import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { App } from '../App'

describe('RIL Projetos IA - Governos na Era da IA', () => {
  it('renders brand and 5 RIL stages in kanban view', () => {
    render(<App />)

    expect(screen.getByText('RIL')).toBeInTheDocument()
    expect(screen.getByText('Projetos IA')).toBeInTheDocument()

    expect(screen.getByText('1. Entrada & Alinhamento')).toBeInTheDocument()
    expect(screen.getByText('2. Diagnóstico de IA')).toBeInTheDocument()
    expect(screen.getByText('3. Formação & Trilhas')).toBeInTheDocument()
    expect(screen.getByText('4. Aplicação & Multiplicação')).toBeInTheDocument()
    expect(screen.getByText('5. Ciclo Concluído')).toBeInTheDocument()
  })

  it('switches to Ficha One-Page when a municipality card is clicked', () => {
    render(<App />)

    const sobralCard = screen.getByText('Sobral')
    fireEvent.click(sobralCard)

    expect(screen.getByRole('heading', { name: /ficha executiva do município/i })).toBeInTheDocument()
    expect(screen.getAllByText(/diagnóstico de maturidade em ia/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/equipe de 10 lideranças municipais/i)).toBeInTheDocument()
    expect(screen.getByText(/encontros quinzenais & próximos passos/i)).toBeInTheDocument()
  })

  it('filters only attention points when attention button is clicked', () => {
    render(<App />)

    const attentionBtn = screen.getByRole('button', { name: /apenas pontos de atenção/i })
    fireEvent.click(attentionBtn)

    expect(screen.getByText('Pelotas')).toBeInTheDocument()
    expect(screen.queryByText('Curitiba')).not.toBeInTheDocument()
  })

  it('filters by diagnostics completed and completed cycles when KPI cards are clicked', () => {
    render(<App />)

    // Click Ciclos Concluídos
    const ciclosCard = screen.getByRole('button', { name: /ciclos concluídos/i })
    fireEvent.click(ciclosCard)

    expect(screen.getByText('Curitiba')).toBeInTheDocument()
    expect(screen.queryByText('Sobral')).not.toBeInTheDocument()

    // Click Diagnósticos Realizados
    const diagCard = screen.getByRole('button', { name: /diagnósticos realizados/i })
    fireEvent.click(diagCard)

    expect(screen.getByText('Santos')).toBeInTheDocument()
    expect(screen.queryByText('Sobral')).not.toBeInTheDocument()
  })

  it('allows navigating and selecting municipalities via suspended dropdown in detail view', () => {
    render(<App />)

    // Open detail view via top toggle or sidebar
    const munNavBtns = screen.getAllByRole('button', { name: /municípios/i })
    fireEvent.click(munNavBtns[0])

    // Check trigger button is present
    const triggerBtn = screen.getByRole('button', { name: /sobral/i })
    expect(triggerBtn).toBeInTheDocument()

    // Open suspended dropdown
    fireEvent.click(triggerBtn)
    expect(screen.getByPlaceholderText(/buscar entre os 40 municípios/i)).toBeInTheDocument()

    // Click next arrow
    const nextBtn = screen.getByRole('button', { name: /próximo município/i })
    fireEvent.click(nextBtn)

    expect(screen.getAllByText(/pelotas/i).length).toBeGreaterThanOrEqual(1)
  })

  it('opens and closes the 10 leaders pop-up showing contacts', () => {
    render(<App />)

    // Switch to Sobral
    const sobralCard = screen.getByText('Sobral')
    fireEvent.click(sobralCard)

    // Leaders button in footer
    const openLeadersBtn = screen.getByRole('button', { name: /equipe de 10 lideranças municipais/i })
    expect(openLeadersBtn).toBeInTheDocument()

    // Pop-up not visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Open pop-up
    fireEvent.click(openLeadersBtn)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/10 multiplicadores cadastrados/i)).toBeInTheDocument()

    // Check generated emails and phones (1 focal point + 10 leaders = 11 emails)
    expect(screen.getAllByText(/@sobral\.ce\.gov\.br/i).length).toBe(11)
    expect(screen.getAllByText(/\(85\) 9/i).length).toBeGreaterThanOrEqual(10)

    // Close via close button (X)
    const closeBtn = screen.getByRole('button', { name: /fechar pop-up/i })
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
