# 🏛️ RIL Projetos IA: Gestão e Facilitação Municipal

Plataforma executiva de governança e acompanhamento de carteira desenvolvida para a facilitação do programa **Governos na Era da IA**, promovido pela **Rede de Inovação Local (RIL)** no Brasil.

**Responsável Técnica e Metodológica:** Thayâne Carvalho (Gestão de Projetos & PMO)  
**Acesso em Produção:** [https://thaycarv.github.io/ril-projetos-ia/](https://thaycarv.github.io/ril-projetos-ia/)

---

## 🎯 Propósito da Aplicação

O sistema foi estruturado para atender às necessidades reais do papel de facilitação pública, permitindo o acompanhamento simultâneo de **40 municípios brasileiros** e **400 lideranças locais** (10 multiplicadores por município), organizando a jornada de inovação aberta, inteligência artificial e transformação digital nas prefeituras.

---

## 🧭 Decisões de Design, Arquitetura e Governança

Todas as diretrizes de interface e experiência foram alinhadas e consolidadas para proporcionar clareza executiva e eliminar ruídos visuais:

### 1. Nomenclaturas Oficiais e Estrutura de Navegação
* **Alternador do Topo:** Rótulos diretos e objetivos: **Visão Geral** (Kanban interativo da carteira) e **Municípios** (Ficha executiva do município).
* **Subtítulo Institucional:** Definido como `Gestão e facilitação municipal.` logo abaixo da marca *RIL Projetos IA*.
* **Contador de Monitoramento:** Rodapé da barra lateral formatado em duas linhas para máxima legibilidade:
  > **Acompanhamento:**  
  > **40 municípios**
* **Papéis Estratégicos nos Municípios:**
  * **Liderança institucional:** autoridade máxima do município ou secretário(a) patrocinador(a) da iniciativa (substituindo o antigo termo "Patrocinador").
  * **Articulador(a) local:** ponto de contato operacional e facilitador técnico interno na prefeitura (substituindo o antigo termo "Ponto Focal").

### 2. Selo Informativo de Etapa (Fim do Controle Burocrático)
* O antigo menu suspenso de seleção manual de etapa foi substituído por um **Selo de Marco de Etapa** com ícone temático:
  `Etapa no Programa: [X. Nome da Etapa Atual]`
* A mudança elimina cliques sem efeito prático na tela e consolida a ficha como um instrumento analítico em tempo real.

### 3. Ficha Executiva Despoluída e Janela Modal das 10 Lideranças
* O grid estático com 10 cartões permanentes foi retirado do centro da página para evitar poluição visual.
* No rodapé da ficha, foi inserida uma barra com o botão **Equipe de 10 Lideranças Municipais (10 multiplicadores)**.
* Ao clicar, abre-se uma **janela flutuante modal (balão de informação)** que sobrepõe a tela suavemente sem alterar a estrutura da página.
* **Contatos úteis e completos para cada multiplicador:**
  * **Nome, Cargo e Secretaria/Órgão**.
  * **Nível de Engajamento** (Alto, Médio, Baixo).
  * **E-mail governamental:** gerado no padrão oficial (`nome.sobrenome@cidade.uf.gov.br`), com link clicável `mailto:`.
  * **Telefone e WhatsApp:** gerado com DDD real do estado correspondente no padrão `(XX) 9XXXX-XXXX`, com link clicável `tel:`.
* Fechamento simplificado via botão `X`, botão `Fechar janela`, clique no fundo desfocado ou tecla `Esc`.

### 4. Relatório Executivo do Município em PDF
* Posicionado logo abaixo do selo de etapa, o botão **Baixar / Imprimir Relatório (PDF)** permite a exportação imediata do diagnóstico.
* Folha de estilo de impressão dedicada (`@media print`):
  * Oculta automaticamente menus laterais, alternadores, botões interativos e modais.
  * Formata a ficha para folha A4 com alto contraste.
  * Inclui uma tabela completa com os 10 multiplicadores municipais no documento impresso.

### 5. Seletor Suspenso Flutuante e Faixa de KPIs Clicáveis
* **Seletor Suspenso:** Permite trocar rapidamente de município sem poluir a tela com colunas laterais fixas, contando com busca em tempo real e setas anterior/próximo (`<` e `>`).
* **KPIs Clicáveis:** 4 cartões no topo que funcionam como filtros de 1 clique:
  1. *Municípios na Carteira* (40 municípios).
  2. *Pontos de Atenção* (filtra prefeituras com pendências críticas).
  3. *Diagnósticos Realizados* (avaliações de maturidade concluídas).
  4. *Ciclos Concluídos* (municípios que finalizaram a jornada).

---

## 🎨 Identidade Visual: Paleta Oliva Institucional Executivo

A interface adota a paleta **Oliva Institucional Executivo**, combinando sobriedade de governo, rigor técnico e conforto para uso contínuo:

| Elemento | Tom / Código Hex | Função na Interface |
| :--- | :--- | :--- |
| **Oliva Estratégico** | `#3D5C45` / `#4A6D53` | Cor primária, botões de ação e estados ativos |
| **Oliva Nobre Profundo** | `#1E2E23` / `#17231A` | Barra lateral, tipografia principal e contrastes fortes |
| **Sálvia Suave** | `#E5EDE6` | Fundo de selos, tags ativas e destaques delicados |
| **Fundo Cinza-Linho** | `#F4F6F4` | Fundo geral da aplicação com leitura suave |
| **Branco Puro** | `#FFFFFF` | Cartões executivos e superfícies destacadas |
| **Âmbar Ocre** | `#B8732A` | Pontos de atenção e alertas de alinhamento |
| **Verde Esmeralda Terroso**| `#2E7D52` | Ciclos concluídos e entregas validadas |

A aplicação conta também com suporte a Dark Mode coordenado em tons de oliva escuro e musgo noturno.

---

## 📊 As 5 Etapas Oficiais da Jornada RIL Brasil

1. **1. Entrada & Alinhamento:** Adesão formalizada, indicação dos 10 líderes municipais e primeiro encontro de sensibilização.
2. **2. Diagnóstico de IA:** Aplicação da matriz de maturidade em 4 dimensões (Governança, Ética/LGPD, Capacidade Técnica e Aplicação Prática) e escolha da trilha.
3. **3. Formação & Trilhas:** Oficinas práticas no Portal RIL e capacitação dos servidores multiplicadores.
4. **4. Aplicação & Multiplicação:** Experimentação do caso de uso de IA na prefeitura e repasse de metodologia às equipes.
5. **5. Ciclo Concluído:** Resultados consolidados, síntese para a liderança e integração à comunidade de governos inovadores.

---

## 🛠️ Tecnologias e Arquitetura

* **React 19** + **TypeScript** (arquitetura modular com Context API para persistência local)
* **Vite 6** (build rápido e otimizado)
* **Lucide React** (iconografia padronizada e acessível)
* **Vitest** + **Testing Library** (suíte de testes automatizados com cobertura de fluxos)
* **GitHub Actions** + **GitHub Pages** (esteira de CI/CD para deploy contínuo na branch `main`)

---

## 📦 Como Executar o Projeto Localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/thaycarv/ril-projetos-ia.git

# 2. Acessar a pasta do projeto
cd ril-projetos-ia

# 3. Instalar dependências
npm install

# 4. Executar os testes automatizados
npm test

# 5. Iniciar o ambiente de desenvolvimento local
npm run dev

# 6. Gerar a compilação final de produção
npm run build
```
