# AGENTS.md

## Project Overview

MCP Security Checklist — a single-page React app (Vite + TypeScript) providing an interactive 228-item security checklist for Model Context Protocol deployments. Deployed to GitHub Pages.

The app code lives in `mcp-security-checklist/hammer&anvil/` (note the `&` — requires shell escaping). The `plan.md` calls for flattening this to `mcp-security-checklist/` but this has not happened yet.

Current state: pre-development scaffold. `App.tsx` is still the default Vite counter demo. See `plan.md` for the full implementation plan and `prd.md` for the product spec.

## Build / Lint / Test Commands

All commands must be run from the app directory. Shell-escape the `&`:

```bash
cd "mcp-security-checklist/hammer&anvil"
```

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check (`tsc -b`) then Vite production build |
| `npm run lint` | ESLint across all TS/TSX files |
| `npm run preview` | Preview production build locally |

### Type checking only

```bash
npx tsc -b
```

### Running a single lint rule or file

```bash
npx eslint src/path/to/file.tsx
```

### Testing

No test runner is configured yet. The plan specifies **Vitest + React Testing Library** (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`). When tests are added:

```bash
npx vitest run                        # run all tests once
npx vitest run src/lib/progress.test.ts  # run a single test file
npx vitest --watch                    # watch mode
```

### Content validation (planned)

```bash
npm run validate-content              # validate checklist.json schema (not yet created)
```

## Tech Stack

- **Runtime:** React 19.2.0, TypeScript ~5.9.3
- **Build:** Vite 7.3.1
- **Styling:** Tailwind CSS v4.2.1 (via `@tailwindcss/vite` plugin, NOT PostCSS)
- **Components:** shadcn/ui (new-york style, Radix UI primitives)
- **State (planned):** Zustand with localStorage persist middleware
- **Icons:** lucide-react
- **Utilities:** `clsx`, `tailwind-merge`, `class-variance-authority`
- **Package manager:** npm (do NOT use yarn/pnpm/bun)

## Code Style Guidelines

### TypeScript

- **Strict mode enabled.** `tsconfig.app.json` has `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`, `verbatimModuleSyntax`, `erasableSyntaxOnly`.
- Target: ES2022, module: ESNext, moduleResolution: bundler.
- Use `type` imports when importing only types: `import type { Foo } from './foo'` (enforced by `verbatimModuleSyntax`).
- Prefer `interface` for object shapes, `type` for unions/intersections/utility types.
- No `any` — use `unknown` and narrow.
- All component props should be explicitly typed.

### Imports

- Use the `@/` path alias for all `src/` imports: `import { cn } from "@/lib/utils"`.
- Order: React/external packages first, then `@/` project imports, then relative imports, then CSS.
- Use `import type` for type-only imports (required by `verbatimModuleSyntax`).

### File & Directory Naming

- **Components:** PascalCase files (`Header.tsx`, `ChecklistItem.tsx`).
- **Utilities/hooks/stores:** camelCase files (`useChecklistStore.ts`, `progress.ts`, `utils.ts`).
- **Types:** `src/types/index.ts` for shared type definitions.
- **Test files:** co-located, named `*.test.ts` or `*.test.tsx`.
- shadcn/ui components go in `src/components/ui/`.
- Custom components go in `src/components/<category>/` (e.g., `layout/`, `checklist/`, `toolbar/`, `progress/`).
- Hooks go in `src/hooks/`.
- Utility functions go in `src/lib/`.

### Component Conventions

- Use function declarations for components (`function App()` not `const App = () =>`).
- Export components as default exports for page-level, named exports for reusable components.
- Use `cn()` from `@/lib/utils` for conditional class merging (clsx + tailwind-merge).
- Use `cva` (class-variance-authority) for component variants.
- Prop types use `interface` with descriptive names: `interface ChecklistItemProps`.
- Destructure props in function parameters.

### Styling (Tailwind CSS v4)

- Tailwind v4 — configured via `@tailwindcss/vite` plugin, NOT a `tailwind.config.ts`.
- Theme customization is done in `src/index.css` using `@theme inline` and CSS custom properties (oklch color space).
- Use Tailwind utility classes directly. Avoid custom CSS except for `@font-face`, `@media print`, and CSS custom properties.
- Use `dark:` variant for dark mode styles.
- Use shadcn/ui CSS variable tokens (`--background`, `--foreground`, `--primary`, etc.).
- Responsive: mobile-first. Use `md:` breakpoint (768px) for desktop layouts.

### React Patterns

- React 19 — no need for `forwardRef` in new components (ref is a regular prop in React 19).
- Use `useState`, `useEffect`, `useMemo`, `useCallback` from React.
- State management via Zustand stores (not prop drilling or Context for global state).
- Error boundaries: wrap major UI sections with `ErrorBoundary` component.
- Accessibility: all interactive elements need proper ARIA attributes, keyboard support, and focus management.

### Error Handling

- Wrap JSON.parse calls in try/catch (especially for localStorage).
- Use ErrorBoundary components for render error recovery.
- Corrupted localStorage: catch, clear the key, show a user-facing banner.
- Compute functions should handle edge cases gracefully (e.g., all items N/A returns null, not NaN).

### ESLint

Flat config in `eslint.config.js` with:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` (enforces Rules of Hooks)
- `eslint-plugin-react-refresh` (ensures components are HMR-compatible)
- Scope: `**/*.{ts,tsx}` files only
- Ignores: `dist/`

### Formatting

No Prettier or EditorConfig is configured. Follow the existing code style:
- 2-space indentation.
- Single quotes for JS/TS string literals.
- Double quotes for JSX attribute values.
- No trailing semicolons (mixed in scaffold — prefer consistent semicolons if adding new code).
- Trailing commas in multi-line structures.

## Accessibility Requirements

- Tri-state checkboxes: `role="checkbox"` with `aria-checked="true"/"false"/"mixed"`.
- Progress bars: `role="progressbar"` + `aria-valuenow` + `aria-label`.
- Collapsible sections: `aria-expanded` + `aria-controls`.
- Toasts: `role="status"` + `aria-live="polite"`.
- All interactive elements: visible focus rings, minimum 44x44px touch targets on mobile.
- `prefers-reduced-motion`: disable all CSS transitions/animations.
- Color is never the sole indicator — always pair with icons/text.
- Minimum 4.5:1 contrast ratio for all text in both light and dark modes.

## Agent Skills

The `.agents/skills/` directory contains three installed skills:

1. **frontend-design** — Guides creation of distinctive UIs. Key rule: AVOID generic "AI slop" aesthetics (no Inter/Roboto fonts, no purple-on-white gradients, no cookie-cutter layouts).
2. **shadcn-ui** — Reference for shadcn/ui component patterns, installation (`npx shadcn@latest add <component>`), and best practices.
3. **web-design-guidelines** — Vercel's Web Interface Guidelines compliance checker. Fetch rules from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` before reviewing.

## Key Architecture Decisions

- **228 items, not 142** — PRD placeholder count was wrong; actual count from `docs/checklist.md`.
- **Section 8 is reference-only** — no checkboxes, no progress tracking, excluded from milestones.
- **Tri-state checkbox** — unchecked -> checked -> N/A -> unchecked cycle.
- **`Record<string, boolean>` for expandedSections** — not `Set<string>` (serialization issues).
- **Substring search, not fuzzy** — case-insensitive `includes()` on title + description + tags.
- **Milestone toast queue** — on simultaneous milestones, show only the highest tier.
- **localStorage key:** `"mcp-checklist-v1"` — persist only `itemStates` and `isDarkMode`.
- **Shell escaping:** The `hammer&anvil` directory name contains `&`. Always quote paths.
