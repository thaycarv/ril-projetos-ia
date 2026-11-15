# Diretrizes de Contribuição

Este repositório segue fluxo rastreável para alterações de código, interface e documentação.

## Fluxo via Issue e Pull Request
1. Crie uma **Issue** usando `.github/ISSUE_TEMPLATE/`.
2. Trabalhe em uma branch dedicada (`fix/`, `feat/` ou `refactor/`).
3. Abra um **Pull Request** referenciando a Issue (`Resolve #N`).

## Portões de Qualidade
Antes do merge, confirme localmente e no GitHub Actions:
- `npm run lint` (`oxlint`)
- `npm test` (`vitest run`)
- `npm run build` (`tsc -b && vite build`)

Preserve `prefers-reduced-motion: reduce`, o `ErrorBoundary` na raiz e nunca versione arquivos de build incremental (`*.tsbuildinfo`).
