import type { Municipality, MunicipalityStage, AIMaturityLevel, LearningTrack, Leader, Deliverable } from '../types'

interface SeedDef {
  name: string
  state: string
  region: Municipality['region']
  populationSize: Municipality['populationSize']
  population: number
  mayorOrSponsor: string
  focalPoint: string
  focalPointContact: string
  stage: MunicipalityStage
  maturityLevel: AIMaturityLevel
  scores: [number, number, number, number] // dataGovernance, ethicsAndLGPD, technicalCapacity, practicalApplication
  track: LearningTrack
  attention?: {
    category: 'presenca' | 'entrega' | 'engajamento' | 'infraestrutura'
    reason: string
    supportAction: string
  }
  biweekly: {
    lastMeetingDaysAgo: number
    nextMeetingDaysAhead: number
    attendanceRate: number
    summary: string
    actionItems: string[]
    status: 'em_dia' | 'atencao' | 'agendado'
  }
  multiplicationProgress: number
}

const standardRoles = [
  { role: 'Secretário(a) de Administração', dept: 'Administração e Gestão' },
  { role: 'Diretor(a) de Tecnologia da Informação', dept: 'TI e Transformação Digital' },
  { role: 'Coordenador(a) de Planejamento e Dados', dept: 'Planejamento e Orçamento' },
  { role: 'Ponto Focal de Inovação Pública', dept: 'Gabinete do Prefeito' },
  { role: 'Gestor(a) de Políticas Educacionais', dept: 'Educação' },
  { role: 'Coordenador(a) de Regulação e Saúde', dept: 'Saúde Pública' },
  { role: 'Assessor(a) de Governança e Transparência', dept: 'Controladoria Geral' },
  { role: 'Especialista em Atendimento ao Cidadão', dept: 'Serviços ao Cidadão' },
  { role: 'Líder de Projetos de Simplificação', dept: 'Fazenda e Arrecadação' },
  { role: 'Multiplicador(a) Pedagógico', dept: 'Escola de Governo / RH' },
]

const stateDddMap: Record<string, string> = {
  AC: '68', AL: '82', AM: '92', AP: '96', BA: '71', CE: '85', DF: '61', ES: '27',
  GO: '62', MA: '98', MG: '31', MS: '67', MT: '65', PA: '91', PB: '83', PE: '81',
  PI: '86', PR: '41', RJ: '21', RN: '84', RO: '69', RR: '95', RS: '51', SC: '48',
  SE: '79', SP: '11', TO: '63',
}

function generateLeaders(municipalityName: string, state: string): Leader[] {
  const firstNames = ['Ana', 'Carlos', 'Beatriz', 'Marcos', 'Juliana', 'Rodrigo', 'Camila', 'Eduardo', 'Fernanda', 'Lucas']
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Lima', 'Carvalho', 'Ribeiro', 'Almeida', 'Costa']
  const cleanCity = municipalityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
  const ddd = stateDddMap[state] || '11'
  
  return standardRoles.map((item, idx) => {
    const firstName = firstNames[idx]
    const lastName = lastNames[(idx + municipalityName.length) % lastNames.length]
    const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
    const phoneSuffix = 1000 + (idx * 73 + municipalityName.length * 19) % 8999

    return {
      id: `leader-${idx + 1}`,
      name: `${firstName} ${lastName}`,
      role: item.role,
      department: item.dept,
      engagement: idx < 6 ? 'alto' : idx < 9 ? 'medio' : 'baixo',
      email: `${emailPrefix}@${cleanCity}.${state.toLowerCase()}.gov.br`,
      phone: `(${ddd}) 9${8100 + ((idx * 31) % 1800)}-${phoneSuffix.toString().padStart(4, '0')}`,
    }
  })
}

function generateDeliverables(currentStage: MunicipalityStage): Deliverable[] {
  const stages: MunicipalityStage[] = ['alinhamento', 'diagnostico', 'formacao', 'multiplicacao', 'concluido']
  const currentIndex = stages.indexOf(currentStage)

  const items = [
    { stage: 'alinhamento' as MunicipalityStage, title: 'Termo de Compromisso e Equipe de 10 Líderes', desc: 'Adesão formalizada e indicação das lideranças que multiplicarão o conhecimento.' },
    { stage: 'diagnostico' as MunicipalityStage, title: 'Diagnóstico de Maturidade em IA', desc: 'Avaliação da prontidão institucional, governança de dados e seleção da trilha de IA.' },
    { stage: 'formacao' as MunicipalityStage, title: 'Oficinas e Capacitação no Portal RIL', desc: 'Participação ativa nas oficinas de aprendizagem e conclusão das trilhas pelos líderes.' },
    { stage: 'multiplicacao' as MunicipalityStage, title: 'Plano de Aplicação e Multiplicação Local', desc: 'Execução do caso de uso de IA na prefeitura e repasse dos aprendizados aos servidores.' },
    { stage: 'concluido' as MunicipalityStage, title: 'Síntese de Resultados e Troca entre Pares', desc: 'Evidências consolidadas, síntese para a liderança RIL e integração à comunidade de governos.' },
  ]

  return items.map((item, idx) => {
    let status: Deliverable['status'] = 'pendente'
    if (idx < currentIndex) {
      status = 'entregue'
    } else if (idx === currentIndex) {
      status = 'em_andamento'
    }
    return {
      id: `deliv-${idx + 1}`,
      title: item.title,
      description: item.desc,
      stage: item.stage,
      status,
    }
  })
}

const rawMunicipalities: SeedDef[] = [
  // 1. Entrada & Alinhamento (8 municípios)
  {
    name: 'Sobral', state: 'CE', region: 'Nordeste', populationSize: 'Médio Porte', population: 212000,
    mayorOrSponsor: 'Secretaria de Gestão e Inovação', focalPoint: 'Mariana Duarte', focalPointContact: 'mariana.duarte@sobral.ce.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [42, 50, 38, 30], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 4, nextMeetingDaysAhead: 10, attendanceRate: 90, summary: 'Apresentação da metodologia RIL e validação dos 10 nomes da equipe municipal.', actionItems: ['Homologar portaria com as 10 lideranças municipais', 'Agendar preenchimento do formulário de diagnóstico'], status: 'em_dia' },
    multiplicationProgress: 5,
  },
  {
    name: 'Pelotas', state: 'RS', region: 'Sul', populationSize: 'Médio Porte', population: 343000,
    mayorOrSponsor: 'Gabinete da Prefeita', focalPoint: 'Tiago Antunes', focalPointContact: 'tiago.antunes@pelotas.rs.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [35, 40, 45, 25], track: 'uso_estrategico',
    attention: { category: 'presenca', reason: 'Dificuldade de conciliar agenda com a equipe de saúde no primeiro encontro.', supportAction: 'Acionar coordenador da RIL para reagendamento conjunto de sensibilização.' },
    biweekly: { lastMeetingDaysAgo: 12, nextMeetingDaysAhead: 2, attendanceRate: 60, summary: 'Primeiro contato realizado com ausência de representantes da Saúde.', actionItems: ['Reagendar alinhamento focal com Secretaria de Saúde', 'Revisar indicação dos 2 suplentes'], status: 'atencao' },
    multiplicationProgress: 0,
  },
  {
    name: 'Araguaina', state: 'TO', region: 'Norte', populationSize: 'Médio Porte', population: 183000,
    mayorOrSponsor: 'Secretaria de Administração', focalPoint: 'Patricia Nogueira', focalPointContact: 'patricia@araguaina.to.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [38, 42, 35, 28], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 3, nextMeetingDaysAhead: 11, attendanceRate: 100, summary: 'Lideranças engajadas e calendário quinzenal pactuado sem ressalvas.', actionItems: ['Criar grupo de comunicação no Portal RIL', 'Iniciar questionário de maturidade'], status: 'em_dia' },
    multiplicationProgress: 10,
  },
  {
    name: 'Colatina', state: 'ES', region: 'Sudeste', populationSize: 'Médio Porte', population: 124000,
    mayorOrSponsor: 'Secretaria de Fazenda e Planejamento', focalPoint: 'Vinicius Ramos', focalPointContact: 'vinicius.ramos@colatina.es.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [45, 48, 40, 32], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 6, nextMeetingDaysAhead: 8, attendanceRate: 80, summary: 'Mapeamento preliminar de processos do atendimento ao contribuinte.', actionItems: ['Confirmar ponto focal técnico de TI', 'Completar perfis das lideranças'], status: 'em_dia' },
    multiplicationProgress: 5,
  },
  {
    name: 'Rondonopolis', state: 'MT', region: 'Centro-Oeste', populationSize: 'Médio Porte', population: 244000,
    mayorOrSponsor: 'Superintendência de TI', focalPoint: 'Renata Lins', focalPointContact: 'renata.lins@rondonopolis.mt.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [40, 44, 38, 30], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 5, nextMeetingDaysAhead: 9, attendanceRate: 90, summary: 'Definição de cronograma e metas de multiplicação para servidores da prefeitura.', actionItems: ['Enviar termo de compromisso assinado', 'Acessar trilhas introdutórias'], status: 'em_dia' },
    multiplicationProgress: 5,
  },
  {
    name: 'Parnaiba', state: 'PI', region: 'Nordeste', populationSize: 'Médio Porte', population: 162000,
    mayorOrSponsor: 'Secretaria de Governo', focalPoint: 'Fabio Meireles', focalPointContact: 'fabio.meireles@parnaiba.pi.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [32, 38, 30, 20], track: 'otimizacao_servicos',
    attention: { category: 'engajamento', reason: 'Falta confirmação de 3 lideranças da equipe municipal para fechar os 10 nomes.', supportAction: 'Ligar para o secretário patrocinador reforçando a importância da equipe multidisciplinar.' },
    biweekly: { lastMeetingDaysAgo: 10, nextMeetingDaysAhead: 4, attendanceRate: 70, summary: 'Pendência na indicação dos representantes da Educação e Assistência Social.', actionItems: ['Encaminhar nomes restantes', 'Alinhar com facilitadora na quarta-feira'], status: 'atencao' },
    multiplicationProgress: 0,
  },
  {
    name: 'Bento Goncalves', state: 'RS', region: 'Sul', populationSize: 'Médio Porte', population: 123000,
    mayorOrSponsor: 'Secretaria de Modernização Administrativa', focalPoint: 'Clarissa Ferrari', focalPointContact: 'clarissa.ferrari@bentogoncalves.rs.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [50, 52, 45, 35], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 2, nextMeetingDaysAhead: 12, attendanceRate: 100, summary: 'Alinhamento completo e grande expectativa da equipe com a ferramenta de IA.', actionItems: ['Liberar acessos ao Portal RIL', 'Preencher autodiagnóstico'], status: 'em_dia' },
    multiplicationProgress: 10,
  },
  {
    name: 'Crato', state: 'CE', region: 'Nordeste', populationSize: 'Médio Porte', population: 133000,
    mayorOrSponsor: 'Secretaria de Planejamento e Gestão', focalPoint: 'Joao Paulo Teles', focalPointContact: 'joao.teles@crato.ce.gov.br',
    stage: 'alinhamento', maturityLevel: 'iniciante', scores: [36, 40, 32, 26], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 7, nextMeetingDaysAhead: 7, attendanceRate: 85, summary: 'Apresentação do programa aos secretários com presença da liderança RIL.', actionItems: ['Formalizar adesão institucional', 'Cadastrar equipe no portal'], status: 'em_dia' },
    multiplicationProgress: 5,
  },

  // 2. Diagnóstico de IA (8 municípios)
  {
    name: 'Juiz de Fora', state: 'MG', region: 'Sudeste', populationSize: 'Grande Porte', population: 540000,
    mayorOrSponsor: 'Secretaria de Transformação Digital', focalPoint: 'Guilherme Toledo', focalPointContact: 'guilherme.toledo@pjf.mg.gov.br',
    stage: 'diagnostico', maturityLevel: 'intermediario', scores: [62, 58, 65, 50], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 5, nextMeetingDaysAhead: 9, attendanceRate: 95, summary: 'Diagnóstico aplicado em 4 secretarias; dados mostram prontidão para automação de protocolos.', actionItems: ['Consolidar relatório de maturidade com a facilitadora', 'Escolher os 2 casos de uso do piloto'], status: 'em_dia' },
    multiplicationProgress: 25,
  },
  {
    name: 'Anapolis', state: 'GO', region: 'Centro-Oeste', populationSize: 'Grande Porte', population: 398000,
    mayorOrSponsor: 'Secretaria de Economia e Planejamento', focalPoint: 'Debora Magalhaes', focalPointContact: 'debora.m@anapolis.go.gov.br',
    stage: 'diagnostico', maturityLevel: 'iniciante', scores: [48, 52, 42, 38], track: 'uso_estrategico',
    attention: { category: 'entrega', reason: 'Atraso de 8 dias na entrega do questionário de segurança de dados e LGPD.', supportAction: 'Oferecer sessão técnica individual de 30 min para tirar dúvidas da Controladoria.' },
    biweekly: { lastMeetingDaysAgo: 11, nextMeetingDaysAhead: 3, attendanceRate: 75, summary: 'Dúvidas jurídicas sobre compartilhamento de bases para diagnóstico.', actionItems: ['Concluir seção LGPD do diagnóstico', 'Realizar alinhamento com procuradoria'], status: 'atencao' },
    multiplicationProgress: 15,
  },
  {
    name: 'Caruaru', state: 'PE', region: 'Nordeste', populationSize: 'Grande Porte', population: 378000,
    mayorOrSponsor: 'Secretaria de Políticas Digitais', focalPoint: 'Marcos Vinicio', focalPointContact: 'marcos.vinicio@caruaru.pe.gov.br',
    stage: 'diagnostico', maturityLevel: 'intermediario', scores: [58, 60, 54, 48], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 4, nextMeetingDaysAhead: 10, attendanceRate: 90, summary: 'Interpretação conjunta dos resultados do diagnóstico de IA.', actionItems: ['Submeter síntese no Portal RIL', 'Iniciar módulo introdutório da trilha'], status: 'em_dia' },
    multiplicationProgress: 30,
  },
  {
    name: 'Criciuma', state: 'SC', region: 'Sul', populationSize: 'Médio Porte', population: 215000,
    mayorOrSponsor: 'Secretaria de Fazenda e Inovação', focalPoint: 'Aline Bitencourt', focalPointContact: 'aline.b@criciuma.sc.gov.br',
    stage: 'diagnostico', maturityLevel: 'intermediario', scores: [64, 66, 60, 55], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 3, nextMeetingDaysAhead: 11, attendanceRate: 100, summary: 'Diagnóstico 100% preenchido com excelente índice de prontidão digital.', actionItems: ['Agendar primeira oficina da trilha', 'Distribuir guias de facilitação'], status: 'em_dia' },
    multiplicationProgress: 35,
  },
  {
    name: 'Linhares', state: 'ES', region: 'Sudeste', populationSize: 'Médio Porte', population: 173000,
    mayorOrSponsor: 'Gabinete do Prefeito', focalPoint: 'Robson Siqueira', focalPointContact: 'robson.siqueira@linhares.es.gov.br',
    stage: 'diagnostico', maturityLevel: 'iniciante', scores: [44, 46, 38, 32], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 6, nextMeetingDaysAhead: 8, attendanceRate: 85, summary: 'Fase de coleta de percepção dos servidores sobre IA no atendimento.', actionItems: ['Finalizar coleta com professores da rede', 'Consolidar diagnóstico'], status: 'em_dia' },
    multiplicationProgress: 20,
  },
  {
    name: 'Sinop', state: 'MT', region: 'Centro-Oeste', populationSize: 'Médio Porte', population: 196000,
    mayorOrSponsor: 'Secretaria de Gestão e Governo Digital', focalPoint: 'Larissa Moura', focalPointContact: 'larissa.moura@sinop.mt.gov.br',
    stage: 'diagnostico', maturityLevel: 'iniciante', scores: [52, 55, 48, 40], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 8, nextMeetingDaysAhead: 6, attendanceRate: 90, summary: 'Mapeamento de sistemas legados da secretaria de finanças.', actionItems: ['Avaliar interoperabilidade de dados', 'Concluir relatório RIL'], status: 'em_dia' },
    multiplicationProgress: 25,
  },
  {
    name: 'Mossoro', state: 'RN', region: 'Nordeste', populationSize: 'Grande Porte', population: 300000,
    mayorOrSponsor: 'Secretaria de Inovação e Comunicação', focalPoint: 'Daniel Gondim', focalPointContact: 'daniel.g@mossoro.rn.gov.br',
    stage: 'diagnostico', maturityLevel: 'intermediario', scores: [56, 54, 52, 45], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 2, nextMeetingDaysAhead: 12, attendanceRate: 90, summary: 'Oficina de interpretação do diagnóstico concluída com sucesso.', actionItems: ['Definir trilha temática prioritária', 'Preparar oficinas presenciais'], status: 'em_dia' },
    multiplicationProgress: 30,
  },
  {
    name: 'Ji-Parana', state: 'RO', region: 'Norte', populationSize: 'Médio Porte', population: 130000,
    mayorOrSponsor: 'Secretaria de Administração e Planejamento', focalPoint: 'Sandra Vasconcelos', focalPointContact: 'sandra.v@jiparana.ro.gov.br',
    stage: 'diagnostico', maturityLevel: 'iniciante', scores: [40, 42, 36, 28], track: 'uso_estrategico',
    attention: { category: 'infraestrutura', reason: 'Oscilações de conectividade nas unidades escolares atrasaram as respostas do questionário.', supportAction: 'Disponibilizar versão offline/planilha do diagnóstico para preenchimento manual.' },
    biweekly: { lastMeetingDaysAgo: 13, nextMeetingDaysAhead: 1, attendanceRate: 70, summary: 'Problemas de rede identificados; formulário em preenchimento manual.', actionItems: ['Subir respostas consolidadas', 'Alinhar próxima quinzena'], status: 'atencao' },
    multiplicationProgress: 15,
  },

  // 3. Formação & Trilhas (10 municípios)
  {
    name: 'Santos', state: 'SP', region: 'Sudeste', populationSize: 'Grande Porte', population: 433000,
    mayorOrSponsor: 'Secretaria de Governança e Transformação Digital', focalPoint: 'Renata Albuquerque', focalPointContact: 'renata.albuquerque@santos.sp.gov.br',
    stage: 'formacao', maturityLevel: 'avancado', scores: [78, 82, 75, 70], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 3, nextMeetingDaysAhead: 11, attendanceRate: 100, summary: 'Líderes completaram oficina de IA generativa aplicada ao atendimento público.', actionItems: ['Desenhar protótipo do fluxo de triagem inteligente', 'Organizar oficina com multiplicadores'], status: 'em_dia' },
    multiplicationProgress: 60,
  },
  {
    name: 'Londrina', state: 'PR', region: 'Sul', populationSize: 'Grande Porte', population: 580000,
    mayorOrSponsor: 'Secretaria de Gestão Pública', focalPoint: 'Bruno Furtado', focalPointContact: 'bruno.furtado@londrina.pr.gov.br',
    stage: 'formacao', maturityLevel: 'avancado', scores: [74, 76, 72, 68], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 5, nextMeetingDaysAhead: 9, attendanceRate: 95, summary: 'Oficina sobre análise preditiva de evasão escolar realizada com os líderes.', actionItems: ['Subir plano de aplicação no portal', 'Compartilhar boas práticas no fórum RIL'], status: 'em_dia' },
    multiplicationProgress: 55,
  },
  {
    name: 'Uberaba', state: 'MG', region: 'Sudeste', populationSize: 'Grande Porte', population: 340000,
    mayorOrSponsor: 'Secretaria de Administração e Recursos Humanos', focalPoint: 'Helena Paiva', focalPointContact: 'helena.paiva@uberaba.mg.gov.br',
    stage: 'formacao', maturityLevel: 'intermediario', scores: [65, 68, 62, 58], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 4, nextMeetingDaysAhead: 10, attendanceRate: 90, summary: 'Conclusão dos módulos 1 e 2 da trilha com 9 dos 10 líderes certificados.', actionItems: ['Concluir módulo final com líder pendente', 'Validar escopo da aplicação prática'], status: 'em_dia' },
    multiplicationProgress: 50,
  },
  {
    name: 'Joinville', state: 'SC', region: 'Sul', populationSize: 'Grande Porte', population: 616000,
    mayorOrSponsor: 'Secretaria de Inovação e Assuntos Internacionais', focalPoint: 'Marcio Guedes', focalPointContact: 'marcio.guedes@joinville.sc.gov.br',
    stage: 'formacao', maturityLevel: 'avancado', scores: [80, 85, 78, 72], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 2, nextMeetingDaysAhead: 12, attendanceRate: 100, summary: 'Líderes desenvolveram guia prático de prompts para secretarias municipais.', actionItems: ['Agendar visita técnica presencial da RIL', 'Testar IA em fila de consultas'], status: 'em_dia' },
    multiplicationProgress: 65,
  },
  {
    name: 'Campina Grande', state: 'PB', region: 'Nordeste', populationSize: 'Grande Porte', population: 419000,
    mayorOrSponsor: 'Secretaria de Ciência, Tecnologia e Inovação', focalPoint: 'Priscila Cavalcanti', focalPointContact: 'priscila.c@campinagrande.pb.gov.br',
    stage: 'formacao', maturityLevel: 'intermediario', scores: [68, 70, 64, 56], track: 'uso_estrategico',
    attention: { category: 'entrega', reason: 'Atraso na entrega das atividades do módulo 3 da trilha formativa.', supportAction: 'Disponibilizar mentoria com facilitador especialista em dados para apoio.' },
    biweekly: { lastMeetingDaysAgo: 11, nextMeetingDaysAhead: 3, attendanceRate: 80, summary: 'Dificuldade de tempo relatada pelos líderes da área de Saúde.', actionItems: ['Entregar síntese da trilha até sexta', 'Revisar cronograma da oficina'], status: 'atencao' },
    multiplicationProgress: 40,
  },
  {
    name: 'Araraquara', state: 'SP', region: 'Sudeste', populationSize: 'Médio Porte', population: 242000,
    mayorOrSponsor: 'Secretaria de Planejamento e Participação Popular', focalPoint: 'Luciana Brandao', focalPointContact: 'luciana.brandao@araraquara.sp.gov.br',
    stage: 'formacao', maturityLevel: 'intermediario', scores: [60, 64, 58, 52], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 6, nextMeetingDaysAhead: 8, attendanceRate: 90, summary: 'Oficinas sobre uso responsável de IA e proteção de dados em andamento.', actionItems: ['Participar do encontro mensal da comunidade RIL', 'Elaborar roteiro de multiplicação'], status: 'em_dia' },
    multiplicationProgress: 45,
  },
  {
    name: 'Rio Verde', state: 'GO', region: 'Centro-Oeste', populationSize: 'Médio Porte', population: 241000,
    mayorOrSponsor: 'Secretaria de Governo', focalPoint: 'Otavio Barros', focalPointContact: 'otavio.barros@rioverde.go.gov.br',
    stage: 'formacao', maturityLevel: 'intermediario', scores: [62, 60, 56, 50], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 7, nextMeetingDaysAhead: 7, attendanceRate: 85, summary: 'Trilha de dados com foco na integração da folha e suprimentos.', actionItems: ['Finalizar módulo 2 no portal', 'Mapear servidores para receber multiplicação'], status: 'em_dia' },
    multiplicationProgress: 45,
  },
  {
    name: 'Dourados', state: 'MS', region: 'Centro-Oeste', populationSize: 'Médio Porte', population: 243000,
    mayorOrSponsor: 'Secretaria de Administração', focalPoint: 'Sergio Arruda', focalPointContact: 'sergio.arruda@dourados.ms.gov.br',
    stage: 'formacao', maturityLevel: 'iniciante', scores: [50, 54, 46, 38], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 5, nextMeetingDaysAhead: 9, attendanceRate: 90, summary: 'Oficina presencial da RIL confirmada com grande mobilização das lideranças.', actionItems: ['Confirmar local e infraestrutura para a oficina', 'Revisar material impresso'], status: 'em_dia' },
    multiplicationProgress: 40,
  },
  {
    name: 'Santarem', state: 'PA', region: 'Norte', populationSize: 'Grande Porte', population: 331000,
    mayorOrSponsor: 'Secretaria de Gestão e Orçamento', focalPoint: 'Juliana Picanço', focalPointContact: 'juliana.p@santarem.pa.gov.br',
    stage: 'formacao', maturityLevel: 'iniciante', scores: [52, 56, 48, 42], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 3, nextMeetingDaysAhead: 11, attendanceRate: 95, summary: 'Líderes concluíram oficina de ferramentas generativas para redação oficial.', actionItems: ['Elaborar minuta do guia municipal de IA', 'Organizar workshop interno'], status: 'em_dia' },
    multiplicationProgress: 45,
  },
  {
    name: 'Vitoria da Conquista', state: 'BA', region: 'Nordeste', populationSize: 'Grande Porte', population: 370000,
    mayorOrSponsor: 'Secretaria de Transparência e Controle', focalPoint: 'Ewerton Prado', focalPointContact: 'ewerton.prado@pmvc.ba.gov.br',
    stage: 'formacao', maturityLevel: 'intermediario', scores: [64, 68, 60, 54], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 4, nextMeetingDaysAhead: 10, attendanceRate: 90, summary: 'Aprofundamento em governança ética de IA no setor público.', actionItems: ['Finalizar módulo 3', 'Registrar plano de ação no Portal RIL'], status: 'em_dia' },
    multiplicationProgress: 50,
  },

  // 4. Aplicação & Multiplicação (8 municípios)
  {
    name: 'Maringa', state: 'PR', region: 'Sul', populationSize: 'Grande Porte', population: 436000,
    mayorOrSponsor: 'Secretaria de Inovação e Aceleração Econômica', focalPoint: 'Flavia Castilho', focalPointContact: 'flavia.c@maringa.pr.gov.br',
    stage: 'multiplicacao', maturityLevel: 'avancado', scores: [82, 86, 80, 78], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 2, nextMeetingDaysAhead: 12, attendanceRate: 100, summary: 'Os 10 líderes já capacitaram 65 servidores na ponta; piloto de IA em operação no protocolo.', actionItems: ['Documentar métricas de redução no tempo de atendimento', 'Preparar apresentação de caso'], status: 'em_dia' },
    multiplicationProgress: 80,
  },
  {
    name: 'Volta Redonda', state: 'RJ', region: 'Sudeste', populationSize: 'Grande Porte', population: 273000,
    mayorOrSponsor: 'Secretaria de Planejamento e Transparência', focalPoint: 'Marcelo Coimbra', focalPointContact: 'marcelo.c@voltaredonda.rj.gov.br',
    stage: 'multiplicacao', maturityLevel: 'intermediario', scores: [70, 72, 68, 64], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 4, nextMeetingDaysAhead: 10, attendanceRate: 90, summary: 'Multiplicação ativa na Secretaria de Educação; 42 professores capacitados no uso de IA.', actionItems: ['Concluir rodada na Secretaria de Saúde', 'Preencher relatório de impacto'], status: 'em_dia' },
    multiplicationProgress: 75,
  },
  {
    name: 'Arapiraca', state: 'AL', region: 'Nordeste', populationSize: 'Médio Porte', population: 234000,
    mayorOrSponsor: 'Secretaria de Gestão Pública', focalPoint: 'Camila Tenorio', focalPointContact: 'camila.t@arapiraca.al.gov.br',
    stage: 'multiplicacao', maturityLevel: 'intermediario', scores: [66, 68, 62, 58], track: 'uso_estrategico',
    attention: { category: 'presenca', reason: 'Queda de frequência no último encontro quinzenal por conflito com o fechamento do orçamento.', supportAction: 'Agendar checkpoint individual com o ponto focal para repactuar entregas.' },
    biweekly: { lastMeetingDaysAgo: 14, nextMeetingDaysAhead: 1, attendanceRate: 65, summary: 'Participação comprometida pela votação da LOA no município.', actionItems: ['Retomar oficinas de multiplicação', 'Enviar lista de servidores capacitados'], status: 'atencao' },
    multiplicationProgress: 60,
  },
  {
    name: 'Paragominas', state: 'PA', region: 'Norte', populationSize: 'Médio Porte', population: 115000,
    mayorOrSponsor: 'Secretaria de Meio Ambiente e Inovação', focalPoint: 'Alan Medeiros', focalPointContact: 'alan.medeiros@paragominas.pa.gov.br',
    stage: 'multiplicacao', maturityLevel: 'iniciante', scores: [55, 58, 50, 46], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 5, nextMeetingDaysAhead: 9, attendanceRate: 95, summary: 'Piloto de IA para triagem de denúncias ambientais em fase de testes reais.', actionItems: ['Acompanhar primeiras 100 análises', 'Validar acurácia com os fiscais'], status: 'em_dia' },
    multiplicationProgress: 70,
  },
  {
    name: 'Santa Maria', state: 'RS', region: 'Sul', populationSize: 'Grande Porte', population: 285000,
    mayorOrSponsor: 'Secretaria de Município de Inovação e TI', focalPoint: 'Tiago Sanchotene', focalPointContact: 'tiago.s@santamaria.rs.gov.br',
    stage: 'multiplicacao', maturityLevel: 'avancado', scores: [78, 80, 75, 72], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 3, nextMeetingDaysAhead: 11, attendanceRate: 95, summary: 'Oficinas de multiplicação atingiram 55 servidores em 3 secretarias.', actionItems: ['Submeter evidências fotográficas e listas de presença', 'Preparar síntese'], status: 'em_dia' },
    multiplicationProgress: 85,
  },
  {
    name: 'Itabuna', state: 'BA', region: 'Nordeste', populationSize: 'Médio Porte', population: 214000,
    mayorOrSponsor: 'Secretaria de Gestão e Inovação', focalPoint: 'Valeria Simoes', focalPointContact: 'valeria.s@itabuna.ba.gov.br',
    stage: 'multiplicacao', maturityLevel: 'intermediario', scores: [64, 66, 60, 55], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 6, nextMeetingDaysAhead: 8, attendanceRate: 85, summary: 'Adoção de IA no resumo de processos legislativos locais com bons resultados.', actionItems: ['Capacitar equipe da Procuradoria', 'Apresentar dados no encontro da RIL'], status: 'em_dia' },
    multiplicationProgress: 70,
  },
  {
    name: 'Chapeco', state: 'SC', region: 'Sul', populationSize: 'Médio Porte', population: 254000,
    mayorOrSponsor: 'Secretaria de Governo e Inovação', focalPoint: 'Eduardo Bresolin', focalPointContact: 'eduardo.b@chapeco.sc.gov.br',
    stage: 'multiplicacao', maturityLevel: 'avancado', scores: [82, 84, 78, 76], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 1, nextMeetingDaysAhead: 13, attendanceRate: 100, summary: 'Mais de 80 servidores já participaram das oficinas de multiplicação.', actionItems: ['Consolidar depoimentos de servidores', 'Elaborar termo de encerramento do ciclo'], status: 'em_dia' },
    multiplicationProgress: 90,
  },
  {
    name: 'Petrolina', state: 'PE', region: 'Nordeste', populationSize: 'Grande Porte', population: 386000,
    mayorOrSponsor: 'Secretaria de Planejamento e Orçamento', focalPoint: 'Lucas Alencar', focalPointContact: 'lucas.alencar@petrolina.pe.gov.br',
    stage: 'multiplicacao', maturityLevel: 'intermediario', scores: [72, 75, 70, 66], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 4, nextMeetingDaysAhead: 10, attendanceRate: 90, summary: 'Líderes conduzindo workshops setoriais com apoio da facilitadora.', actionItems: ['Finalizar relatório de multiplicação', 'Enviar indicadores consolidados'], status: 'em_dia' },
    multiplicationProgress: 75,
  },

  // 5. Ciclo Concluído (6 municípios)
  {
    name: 'Curitiba', state: 'PR', region: 'Sul', populationSize: 'Capital', population: 1770000,
    mayorOrSponsor: 'Agência de Inovação de Curitiba', focalPoint: 'Cibele Schmidt', focalPointContact: 'cibele.schmidt@curitiba.pr.gov.br',
    stage: 'concluido', maturityLevel: 'avancado', scores: [92, 95, 90, 88], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 8, nextMeetingDaysAhead: 20, attendanceRate: 100, summary: 'Ciclo completo com sucesso; 120 servidores capacitados e política municipal de IA publicada.', actionItems: ['Apresentar case na cúpula internacional da RIL', 'Participar como mentor da próxima edição'], status: 'em_dia' },
    multiplicationProgress: 100,
  },
  {
    name: 'Recife', state: 'PE', region: 'Nordeste', populationSize: 'Capital', population: 1480000,
    mayorOrSponsor: 'Empresa Municipal de Informática (EMPREL)', focalPoint: 'Felipe Cabral', focalPointContact: 'felipe.cabral@recife.pe.gov.br',
    stage: 'concluido', maturityLevel: 'avancado', scores: [90, 92, 88, 86], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 10, nextMeetingDaysAhead: 20, attendanceRate: 100, summary: 'IA integrada ao atendimento no portal cidadão; equipe institucionalizada.', actionItems: ['Documentar aprendizados na biblioteca RIL', 'Compartilhar repositório aberto de prompts'], status: 'em_dia' },
    multiplicationProgress: 100,
  },
  {
    name: 'Florianopolis', state: 'SC', region: 'Sul', populationSize: 'Capital', population: 537000,
    mayorOrSponsor: 'Secretaria Municipal de Meio Ambiente e TI', focalPoint: 'Marina Silveira', focalPointContact: 'marina.s@pmf.sc.gov.br',
    stage: 'concluido', maturityLevel: 'avancado', scores: [88, 90, 85, 82], track: 'otimizacao_servicos',
    biweekly: { lastMeetingDaysAgo: 9, nextMeetingDaysAhead: 20, attendanceRate: 95, summary: 'Entregas validadas com redução comprovada de 40% no tempo de análise de processos.', actionItems: ['Publicar síntese de resultados', 'Integrar grupo permanente de governança digital'], status: 'em_dia' },
    multiplicationProgress: 100,
  },
  {
    name: 'Belo Horizonte', state: 'MG', region: 'Sudeste', populationSize: 'Capital', population: 2310000,
    mayorOrSponsor: 'Secretaria de Planejamento e TI (Prodabel)', focalPoint: 'Leonardo Rezende', focalPointContact: 'leonardo.r@pbh.gov.br',
    stage: 'concluido', maturityLevel: 'avancado', scores: [94, 96, 92, 90], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 12, nextMeetingDaysAhead: 20, attendanceRate: 100, summary: 'Guia de IA ética para servidores homologado pelo comitê de governança.', actionItems: ['Receber certificado de conclusão RIL', 'Disponibilizar material na comunidade'], status: 'em_dia' },
    multiplicationProgress: 100,
  },
  {
    name: 'Campo Grande', state: 'MS', region: 'Centro-Oeste', populationSize: 'Capital', population: 898000,
    mayorOrSponsor: 'Agência Municipal de Tecnologia (Agetec)', focalPoint: 'Patricia Wanderley', focalPointContact: 'patricia.w@campogrande.ms.gov.br',
    stage: 'concluido', maturityLevel: 'avancado', scores: [84, 88, 80, 78], track: 'analise_dados',
    biweekly: { lastMeetingDaysAgo: 7, nextMeetingDaysAhead: 20, attendanceRate: 95, summary: 'Ciclo encerrado com 95 servidores capacitados em inteligência de dados.', actionItems: ['Concluir relatório final de acompanhamento', 'Participar de sessão de troca entre capitais'], status: 'em_dia' },
    multiplicationProgress: 100,
  },
  {
    name: 'Palmas', state: 'TO', region: 'Norte', populationSize: 'Capital', population: 302000,
    mayorOrSponsor: 'Secretaria de Transparência e Inovação', focalPoint: 'Marcos Aurelio', focalPointContact: 'marcos.aurelio@palmas.to.gov.br',
    stage: 'concluido', maturityLevel: 'intermediario', scores: [80, 82, 76, 74], track: 'uso_estrategico',
    biweekly: { lastMeetingDaysAgo: 11, nextMeetingDaysAhead: 20, attendanceRate: 90, summary: 'Síntese de impacto aprovada com menção honrosa pela mobilização dos servidores.', actionItems: ['Emitir relatório de encerramento', 'Integrar rede de egressos RIL'], status: 'em_dia' },
    multiplicationProgress: 100,
  },
]

export function buildSeedMunicipalities(): Municipality[] {
  return rawMunicipalities.map((item, index) => {
    const id = `mun-${index + 1}`
    return {
      id,
      name: item.name,
      state: item.state,
      region: item.region,
      populationSize: item.populationSize,
      population: item.population,
      mayorOrSponsor: item.mayorOrSponsor,
      focalPoint: item.focalPoint,
      focalPointContact: item.focalPointContact,
      stage: item.stage,
      maturityLevel: item.maturityLevel,
      maturityScores: {
        dataGovernance: item.scores[0],
        ethicsAndLGPD: item.scores[1],
        technicalCapacity: item.scores[2],
        practicalApplication: item.scores[3],
      },
      track: item.track,
      leaders: generateLeaders(item.name, item.state),
      biweeklyMeeting: {
        lastMeetingDate: new Date(Date.now() - item.biweekly.lastMeetingDaysAgo * 86400000).toISOString(),
        nextMeetingDate: new Date(Date.now() + item.biweekly.nextMeetingDaysAhead * 86400000).toISOString(),
        attendanceRate: item.biweekly.attendanceRate,
        summary: item.biweekly.summary,
        actionItems: item.biweekly.actionItems,
        status: item.biweekly.status,
      },
      deliverables: generateDeliverables(item.stage),
      attention: item.attention
        ? { hasAttention: true, ...item.attention }
        : { hasAttention: false },
      multiplicationProgress: item.multiplicationProgress,
      updatedAt: new Date().toISOString(),
    }
  })
}
