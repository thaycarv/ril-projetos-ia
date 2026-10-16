import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react'
import type { Municipality, MunicipalityStage, Deliverable, ProgramIndicators } from '../types'
import { buildSeedMunicipalities } from '../data/municipalitiesSeed'

const STORAGE_KEY = 'ril.program.v1'

interface ProgramContextValue {
  municipalities: Municipality[]
  selectedMunicipalityId: string
  selectedMunicipality: Municipality | undefined
  indicators: ProgramIndicators
  searchQuery: string
  setSearchQuery: (q: string) => void
  onlyAttention: boolean
  setOnlyAttention: (val: boolean) => void
  selectedRegion: string
  setSelectedRegion: (region: string) => void
  selectMunicipality: (id: string) => void
  updateDeliverableStatus: (municipalityId: string, deliverableId: string, status: Deliverable['status']) => void
  toggleAttention: (municipalityId: string, reason?: string, supportAction?: string) => void
  updateStage: (municipalityId: string, newStage: MunicipalityStage) => void
  resetToDefaults: () => void
}

const ProgramContext = createContext<ProgramContextValue | null>(null)

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback to fresh seed
    }
    return buildSeedMunicipalities()
  })

  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState<string>(() => {
    return municipalities[0]?.id || 'mun-1'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [onlyAttention, setOnlyAttention] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('Todas')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(municipalities))
    } catch {
      // Storage unavailable
    }
  }, [municipalities])

  const selectedMunicipality = useMemo(() => {
    return municipalities.find(m => m.id === selectedMunicipalityId) || municipalities[0]
  }, [municipalities, selectedMunicipalityId])

  const indicators = useMemo<ProgramIndicators>(() => {
    const totalMunicipalities = municipalities.length
    const totalLeaders = municipalities.reduce((acc, m) => acc + (m.leaders?.length || 0), 0)
    const attentionCount = municipalities.filter(m => m.attention.hasAttention).length
    const diagnosticsCompleted = municipalities.filter(m => ['formacao', 'multiplicacao', 'concluido'].includes(m.stage)).length
    const multiplicationActive = municipalities.filter(m => m.stage === 'multiplicacao').length
    const completedCycle = municipalities.filter(m => m.stage === 'concluido').length

    return {
      totalMunicipalities,
      totalLeaders,
      attentionCount,
      diagnosticsCompleted,
      multiplicationActive,
      completedCycle,
    }
  }, [municipalities])

  const selectMunicipality = (id: string) => {
    setSelectedMunicipalityId(id)
  }

  const updateDeliverableStatus = (municipalityId: string, deliverableId: string, status: Deliverable['status']) => {
    setMunicipalities(prev =>
      prev.map(m => {
        if (m.id !== municipalityId) return m
        const deliverables = m.deliverables.map(d =>
          d.id === deliverableId ? { ...d, status } : d
        )
        return { ...m, deliverables, updatedAt: new Date().toISOString() }
      })
    )
  }

  const toggleAttention = (municipalityId: string, reason?: string, supportAction?: string) => {
    setMunicipalities(prev =>
      prev.map(m => {
        if (m.id !== municipalityId) return m
        const hasAttention = !m.attention.hasAttention
        return {
          ...m,
          attention: {
            hasAttention,
            category: hasAttention ? 'engajamento' : undefined,
            reason: hasAttention ? reason || 'Ponto de atenção registrado pela facilitadora.' : undefined,
            supportAction: hasAttention ? supportAction || 'Acionar liderança RIL para alinhamento.' : undefined,
          },
          updatedAt: new Date().toISOString(),
        }
      })
    )
  }

  const updateStage = (municipalityId: string, newStage: MunicipalityStage) => {
    setMunicipalities(prev =>
      prev.map(m => {
        if (m.id !== municipalityId) return m
        return { ...m, stage: newStage, updatedAt: new Date().toISOString() }
      })
    )
  }

  const resetToDefaults = () => {
    if (window.confirm('Deseja restaurar a carteira dos 40 municípios para o estado inicial da RIL?')) {
      const fresh = buildSeedMunicipalities()
      setMunicipalities(fresh)
      setSelectedMunicipalityId(fresh[0]?.id || 'mun-1')
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <ProgramContext.Provider
      value={{
        municipalities,
        selectedMunicipalityId,
        selectedMunicipality,
        indicators,
        searchQuery,
        setSearchQuery,
        onlyAttention,
        setOnlyAttention,
        selectedRegion,
        setSelectedRegion,
        selectMunicipality,
        updateDeliverableStatus,
        toggleAttention,
        updateStage,
        resetToDefaults,
      }}
    >
      {children}
    </ProgramContext.Provider>
  )
}

export function useProgram() {
  const context = useContext(ProgramContext)
  if (!context) {
    throw new Error('useProgram deve ser utilizado dentro de ProgramProvider')
  }
  return context
}
