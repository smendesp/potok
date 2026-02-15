# Conceito de Design — Potok

Documento baseado nas referências visuais da pasta `.insprirações`: telas de app em dark mode e paleta de cores.

---

## Paleta de cores

| Uso | Hex | Aplicação |
|-----|-----|-----------|
| **Background escuro** | `#06141B` | Fundo principal (dark mode) |
| **Surface / cards escuro** | `#11212D` | Cards, headers, superfícies elevadas |
| **Surface secundário** | `#253745` | Painéis, áreas secundárias |
| **Bordas / muted** | `#4A5C6A` | Bordas, textos secundários, estados inativos |
| **Texto claro / fundo claro** | `#9BA8AB` | Texto em dark, fundos em light |
| **Background claro** | `#CCD0CF` | Fundo principal (light mode), conteúdo |

**Accent (destaque):** manter um verde ou amarelo-dourado para CTAs e estados positivos, em linha com as referências de app (ex.: verde para “seguro/ativo”, amarelo para foco).

---

## Princípios visuais (telas de referência)

- **Dark-first:** priorizar tema escuro; fundo profundo (#06141B / #11212D), texto claro.
- **Cards:** cantos arredondados, superfície ligeiramente mais clara que o fundo, sombra sutil ou borda discreta para profundidade.
- **Hierarquia tipográfica:** números e títulos em peso forte; labels e descrições menores e mais leves.
- **Ícones:** linha/minimalistas; branco ou cinza claro no escuro.
- **Espaçamento:** agrupamento em blocos; respiro entre seções e dentro dos cards.
- **Dados e estado:** uma cor de destaque (verde/amarelo) para valores positivos, links e ações principais.

---

## Aplicação no Potok

- **Background:** `#06141B` (dark) / `#CCD0CF` (light).
- **Cards / header / footer:** `#11212D` (dark) com bordas ou sombra suave.
- **Texto:** branco/cinza claro no escuro; cinza escuro no claro.
- **Primary (botões, links, ícone de cadeado):** verde ou amarelo-dourado conforme referência.
- **Bordas e divisores:** `#253745` / `#4A5C6A` no dark; equivalentes claros no light.
- Manter **Tailwind + shadcn + Font Awesome** e **temas** (dark, light, high contrast, sepia, blue) conforme `use.md`.

Este conceito mantém o comportamento atual do frontend e orienta apenas decisões visuais.
