export type MunicipalityStage =
  | 'alinhamento'
  | 'diagnostico'
  | 'formacao'
  | 'multiplicacao'
  | 'concluido'

export type AIMaturityLevel = 'iniciante' | 'intermediario' | 'avancado'

export type LearningTrack =
  | 'uso_estrategico'
  | 'otimizacao_servicos'
  | 'analise_dados'

export interface Leader {
  id: string
  name: string
  role: string
  department: string
  engagement: 'alto' | 'medio' | 'baixo'
  email: string
  phone: string
}

export interface BiweeklyMeeting {
  lastMeetingDate: string
  nextMeetingDate: string
  attendanceRate: number
  summary: string
  actionItems: string[]
  status: 'em_dia' | 'atencao' | 'agendado'
}

export interface Deliverable {
  id: string
  title: string
  description: string
  stage: MunicipalityStage
  status: 'pendente' | 'em_andamento' | 'entregue'
}

export interface AttentionPoint {
  hasAttention: boolean
  category?: 'presenca' | 'entrega' | 'engajamento' | 'infraestrutura'
  reason?: string
  supportAction?: string
}

export interface Municipality {
  id: string
  name: string
  state: string
  region: 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'
  populationSize: 'Pequeno Porte' | 'Médio Porte' | 'Grande Porte' | 'Capital'
  population: number
  mayorOrSponsor: string
  focalPoint: string
  focalPointContact: string
  stage: MunicipalityStage
  maturityLevel: AIMaturityLevel
  maturityScores: {
    dataGovernance: number
    ethicsAndLGPD: number
    technicalCapacity: number
    practicalApplication: number
  }
  track: LearningTrack
  leaders: Leader[]
  biweeklyMeeting: BiweeklyMeeting
  deliverables: Deliverable[]
  attention: AttentionPoint
  multiplicationProgress: number
  updatedAt: string
}

export interface ProgramIndicators {
  totalMunicipalities: number
  totalLeaders: number
  attentionCount: number
  diagnosticsCompleted: number
  multiplicationActive: number
  completedCycle: number
}
