# Brazil Visible — Tako-inspired Redesign

## Context

O site atual tem um design funcional mas não transmite sofisticação. Inspirando-se no tako.ai/pt — estética minimalista premium, monocromática, com tipografia moderna e espaçamento generoso — vamos redesenhar todo o site mantendo a identidade brasileira através do verde como cor de acento.

## Decisões de Design

### Tipografia
- **Font**: Plus Jakarta Sans (Google Fonts, variable) — substituindo Inter
- **Hero H1**: text-5xl md:text-6xl lg:text-7xl, font-bold
- **H2 de seção**: text-3xl md:text-4xl, font-bold
- **Body**: text-base, text-neutral-600
- **Navbar**: text-sm font-medium

### Paleta de Cores

| Uso | Light | Dark |
|-----|-------|------|
| Background | `#ffffff` | `#0a0a0a` |
| Surface/card | `#fafafa` | `#141414` |
| Texto primário | `#171717` (neutral-900) | `#ededed` |
| Texto secundário | `#525252` (neutral-600) | `#a3a3a3` |
| Bordas | `#e5e5e5` (neutral-200) | `#262626` (neutral-800) |
| Acento | `#009C3B` (brazil-green) | `#00cc4e` |

### Componentes

**Navbar**: Branco puro + backdrop-blur. Logo em neutral-900 (não verde). Links em neutral-500 → hover neutral-900. CTA "Explorar" como pill bg-neutral-900.

**Hero**: Fundo branco puro (sem gradientes). Badge pill no topo "93+ fontes de dados". Headline gigante com palavras-chave em verde. CTAs: primário pill preto, secundário ghost.

**Stats**: Números em neutral-900 (não verde). Labels uppercase tracking-wider. Separador vertical fino.

**Cards de Categoria**: border-neutral-200, hover border-neutral-900 + shadow. Icones em neutral-400 com bg-neutral-100.

**Seção Cruzamentos**: bg-neutral-50. CTA verde (único botão verde na landing).

**Footer**: bg-neutral-950. Texto neutral-400. Links hover:text-white.

**Docs Sidebar**: Item ativo com border-l-2 border-neutral-900 (não verde bg).

**Docs Cards (prev/next, category)**: Bordas neutras, hover sutil.

## Escopo de Arquivos

1. `tailwind.config.js` — Remover cores brazil-yellow/blue não usadas; Plus Jakarta Sans
2. `app/layout.tsx` — Trocar Inter → Plus Jakarta Sans; atualizar body colors
3. `app/globals.css` — Atualizar doc-content prose colors para neutrals
4. `app/page.tsx` — Redesign completo: hero, stats, categories, cruzamentos, donate, contribute
5. `app/page.module.css` — Remover gradientes (hero branco puro)
6. `components/navbar.tsx` — Nova estética: logo neutral, CTA pill, hovers neutros
7. `components/footer.tsx` — bg-neutral-950, cores neutras
8. `components/docs-sidebar.tsx` — Active state com border-l ao invés de bg verde
9. `components/breadcrumbs.tsx` — Cores neutras
10. `components/toc.tsx` — Active state neutro
11. `components/doc-nav.tsx` — Hover neutro
12. `app/docs/apis/[category]/page.tsx` — Cards neutros
13. `app/docs/cruzamentos/page.tsx` — Cards neutros
14. `app/docs/apis/[category]/[slug]/page.tsx` — Badges neutros
