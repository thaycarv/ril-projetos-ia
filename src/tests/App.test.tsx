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
})
