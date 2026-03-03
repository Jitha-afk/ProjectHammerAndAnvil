# MCP Security Checklist — Implementation Plan

**Date:** March 3, 2026
**Based on:** prd.md v2.0, docs/checklist.md, current repo state

---

## Key Decisions & PRD Deviations

| Decision | Rationale |
|---|---|
| **228 items, not 142** | Actual count from `docs/checklist.md`: 65 CRITICAL + 119 HIGH + 44 RECOMMENDED across Sections 1–7. Section 8 has 0 checkable items (reference only). The PRD's "142" was a placeholder. All UI uses `checklistData.totalItems` dynamically. |
| **Flatten directory structure** | Move scaffold from `mcp-security-checklist/hammer&anvil/` up to `mcp-security-checklist/`. The `&` in path causes shell escaping issues. |
| **React 19** | Keep the scaffolded React 19.2.0 instead of downgrading to 18.3.0. Adapt any React 18–specific patterns. |
| **Replace Inter + purple accent** | Per `.agents/skills/frontend-design/SKILL.md`, Inter and purple-on-white are flagged as generic "AI slop." Choose a distinctive font pair and accent color suited to a security-tool context. Self-hosted in `public/fonts/`. |
| **No tests in this plan** | Testing (PRD 14c) is deferred. Can be added as a follow-up. |
| **`Set<string>` → `Record<string, boolean>`** | For `expandedSections` in Zustand store. `Set` doesn't serialize cleanly; `Record` avoids subtle re-render issues. |
| **Tri-state checkbox uses ARIA widget** | Native `<input type="checkbox">` is binary. Use `role="checkbox"` with `aria-checked="true"/"false"/"mixed"` for the N/A state. |
| **Substring search, not fuzzy** | PRD says "fuzzy" but no search library is in deps. Use case-insensitive `includes()` on title + description + tags. |
| **Milestone toast queue** | Per updated PRD: on simultaneous milestones (e.g., bulk import), show only the highest-tier toast. comprehensive > hardened > baseline. |
| **Reactive milestone detection** | Per updated PRD Section 8: Use a Zustand selector + `useEffect` to detect milestone changes instead of `setTimeout` inside `toggleItem`. |
| **Section 8 is reference-only** | Per PRD 14d: no checkboxes, no progress bar, excluded from all progress/milestone calculations. Displayed as read-only appendix. |
| **User-scoped progress model** | Global progress must be computed only from user-selected sections (choose-your-own-adventure), not all 228 controls. Selection is made on a Home page before entering the checklist. |
| **Mobile breakpoint `<768px`** | Per PRD 11b: sidebar becomes hamburger drawer, toolbar stacks vertically, touch targets 44×44px minimum. |
| **Skip PRD formatting fix** | PRD has broken markdown from Section 3 onward; leaving as-is per user decision. |

---

## Repo State Summary

**What exists:**
- `docs/checklist.md` — Complete content (228 items, 8 sections)
- `prd.md` — Full product spec (1,288 lines)
- `mcp-security-checklist/` — Active Vite + React 19 + TS app (flattened; no `hammer&anvil` nesting)
- Core MVP foundation implemented: typed data model, checklist JSON + changelog, content validator, Zustand store, progress/storage/search utilities, layout shell, checklist rendering, reusable progress bar
- `.agents/skills/` — Frontend design + web design guidelines skills
- `LICENSE` — MIT (Jitesh Thakur)

**What still needs to be built:** Phase 3 export/import + migration/polish work (JSON/PDF export, import validation, print stylesheet, version migration, final accessibility/error-handling polish, docs/contributing).

---

## Implementation Status Snapshot (as of March 4, 2026)

Legend: ✅ done · 🟡 partial/in-progress · ⏳ pending

### Phase 1

- ✅ **1.2 TypeScript interfaces** — `src/types/index.ts` created.
- ✅ **1.3 Checklist JSON conversion** — `src/data/checklist.json` and `src/data/changelog.json` generated.
- ✅ **1.4 Content validation** — `scripts/validate-content.ts` + npm script wired.
- ✅ **1.5 Zustand store** — persisted scope-selection fields (`selectedSectionIds`, `hasCompletedOnboarding`) added, plus UI state/filters and section expand/collapse helpers.
- ✅ **1.6 Utility libraries** — `progress.ts`, `storage.ts`, `search.ts` implemented.
- ✅ **1.6a Home page + scope selection** — Home onboarding flow implemented with section selection, quick actions, and Start Checklist gating.
- ✅ **1.7 Core layout** — Two-view flow (Home + Checklist), scope editing, sidebar out-of-scope treatment, and mobile drawer implemented.
- ✅ **1.8 Checklist components** — SectionList/Section/SubSection/ChecklistItem implemented with tri-state + details.
- ✅ **1.9 ProgressBar** — reusable component implemented and wired.
- ✅ **1.10 Dark mode** — persisted toggle + pre-hydration `index.html` script implemented.
- ✅ **1.11 CSP** — CSP meta tag implemented in `index.html`.
- ✅ **1.12 GH Pages files** — `public/404.html` in place.
- ✅ **1.13 GitHub Actions CI/CD** — workflow added at `.github/workflows/deploy.yml`.

### Phase 2 / 3

- ✅ **Phase 2 implemented** — Milestone strip, toast notifications, reactive milestone detection, toolbar (search/priority/role/reset/expand-collapse), priority badges, modal, and keyboard shortcuts are all wired.
- ✅ **shadcn/ui refactor completed for core surfaces** — Home cards, Header, Footer, Sidebar, Progress, and tri-state checkbox upgraded to shadcn primitives.
- ⏳ **Phase 3 pending** — export/import, print/PDF, migration, mobile/accessibility/error-handling polish, docs updates.

---

## Phase 0: Housekeeping

### 0.1 Flatten directory structure
- Move all contents of `mcp-security-checklist/hammer&anvil/` up to `mcp-security-checklist/`
- Delete the empty `hammer&anvil/` directory
- Verify scaffold still runs with `npm run dev`

### 0.2 Clean up scaffold
- Remove default Vite demo files: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`
- Strip default content from `src/App.tsx`, `src/index.css`, `src/main.tsx`
- Remove `babel-plugin-react-compiler` from `package.json` and `vite.config.ts` (not in PRD)
- Update `package.json` name from `"hammer-anvil"` to `"mcp-security-checklist"`

### 0.3 Install dependencies
Add missing dependencies per PRD Section 14:
```
npm install zustand lucide-react
npm install -D tailwindcss@3 postcss autoprefixer zod tsx
```
Note: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` deferred (no tests in this plan).

### 0.4 Configure Tailwind CSS
- Create `tailwind.config.ts` with custom color tokens (see Phase 1 design task)
- Create `postcss.config.js` with tailwind + autoprefixer
- Replace `src/index.css` with Tailwind directives (`@tailwind base/components/utilities`) + CSS custom properties

### 0.5 Configure Vite
Update `vite.config.ts` per PRD Section 12:
- `base: "/mcp-security-checklist/"`
- `build.outDir: "dist"`
- `rollupOptions.output.manualChunks` for checklist data code-splitting

### 0.6 Update root `.gitignore`
- Remove `prd.md` from ignore list (it's tracked but gitignored — confusing)
- Add `mcp-security-checklist/dist/` to ignore list

### 0.7 Update root `README.md`
- Replace "Your one stop shop to trap and defeat the enemy" with actual project description

---

## Phase 1: MVP — Data + Core Checklist + Persistence

**Goal:** A working SPA with Home-page scope selection that renders checklist content with tri-state checkboxes, collapsible sections, progress bars, localStorage persistence, and dark mode. Deployable to GitHub Pages.

### 1.1 Design system selection
Before writing any components, choose:
- **Display font:** A distinctive, characterful typeface (not Inter, not Roboto, not system fonts) suited to a professional security-tool context. Must be available as self-hosted `.woff2`.
- **Body font:** A refined, readable companion font. Self-hosted `.woff2`.
- **Mono font:** JetBrains Mono (keep from PRD — it's distinctive enough for mono).
- **Accent color:** Replace `#7C3AED` purple with a color that fits the security/audit tool aesthetic. Consider deep teal, navy, warm amber, or similar — must pass 4.5:1 contrast in both light and dark modes.
- **Overall tone:** Professional, trustworthy, slightly editorial. Not generic dashboard.

Download chosen fonts to `public/fonts/` and define `@font-face` rules in `src/index.css`.
Update color tokens in `tailwind.config.ts` and CSS custom properties accordingly.

### 1.2 TypeScript interfaces
Create `src/types/index.ts` with all types from PRD Section 4:
- `Priority`, `ItemStatus`, `Role`
- `SourceRef`, `ChecklistItem`, `SubSection`, `Section`, `ChecklistData`
- `ItemState`, `SavedState`

### 1.3 Convert checklist content to JSON
Parse `docs/checklist.md` and produce `src/data/checklist.json` conforming to the `ChecklistData` schema.

**For each of the 228 items, generate:**
- `id`: Stable ID following pattern `{section-abbrev}-{subsection-abbrev}-{NNN}` (e.g., `srv-api-001`, `cli-auth-003`, `agn-hijack-002`)
- `title`: Extract the bold title text (e.g., "Input Validation")
- `description`: Extract the description text after the title
- `priority`: Map emoji (red circle = CRITICAL, yellow circle = HIGH, green circle = RECOMMENDED)
- `roles`: Infer from content context (assign at least 1 role per item)
- `tags`: Extract from content keywords
- `sources`: Map to the document sources cited at top of checklist.md
- `incidentRefs`: Extract any mentioned incidents/CVEs (e.g., "EchoLeak", "VS Code RCE Sep 2025", "Postmark MCP impersonation")

**Section metadata:**
| # | id | title | icon (Lucide) | Items |
|---|---|---|---|---|
| 1 | `mcp-server` | MCP Server Security | `Shield` | 86 |
| 2 | `mcp-client` | MCP Client / Host Security | `Monitor` | 49 |
| 3 | `architecture` | Secure MCP Architecture | `Network` | 16 |
| 4 | `agentic` | Agentic-Specific Security | `Bot` | 46 |
| 5 | `llm-execution` | LLM Secure Execution | `Brain` | 5 |
| 6 | `governance` | Governance & Compliance | `Scale` | 19 |
| 7 | `crypto` | Cryptocurrency-Specific MCP Security | `Wallet` | 7 |
| 8 | `tools` | Security Tools & Continuous Validation | `Wrench` | 0 (reference only) |

Also create `src/data/changelog.json` with initial entry:
```json
{ "versions": [{ "version": "2026.1", "date": "2026-03-03", "changes": ["Initial release with 228 security controls"] }] }
```

### 1.4 Content validation script
Create `scripts/validate-content.ts` per PRD Section 14b:
- Zod schema mirroring TypeScript interfaces
- Assert `totalItems === actual item count` (excluding Section 8)
- Assert all item IDs are unique
- Assert all IDs match `^[a-z]+-[a-z]+-\d{3}$` pattern
- Assert non-empty titles, descriptions, roles, tags, sources
- Run via `npm run validate-content`

### 1.5 Zustand store
Create `src/store/useChecklistStore.ts` per PRD Section 8:
- `itemStates: Record<string, ItemState>` — persisted
- `isDarkMode: boolean` — persisted
- `selectedSectionIds: string[]` — persisted; selected from Home page
- `hasCompletedOnboarding: boolean` — persisted; true after first scope selection
- `toggleItem(id)` — cycles unchecked → checked → na → unchecked
- `setNote(id, note)` — updates note for an item
- `resetAll()` — clears all item states
- `importStates(states)` — bulk import from JSON
- UI state (NOT persisted): `expandedSections: Record<string, boolean>`, `expandedItemId`, `priorityFilter`, `roleFilter`, `searchQuery`, `toastMessage`
- Persist middleware with `partialize` — `itemStates`, `isDarkMode`, `selectedSectionIds`, `hasCompletedOnboarding`
- Storage key: `"mcp-checklist-v1"`

### 1.6a Home page + scope selection
Create a Home page as the user entry point before checklist execution:
- Route `/` renders Home page with checklist scope onboarding UI
- User selects 1+ sections from Sections 1–7 (`tools` excluded)
- CTA: "Start Checklist" stores selected section IDs and opens checklist view
- If no section selected, disable CTA and show inline guidance
- Add quick actions: "Select all core sections" and "Clear selection"
- Add "Edit scope" entry from checklist page to return to Home and adjust scope

Scope semantics:
- Global counters and percentages are derived only from selected sections
- Sidebar section list still shows all sections, but non-selected sections are visibly out-of-scope
- Out-of-scope sections do not contribute to progress, milestones, or completion totals

### 1.6 Utility libraries
Create `src/lib/progress.ts`:
- `computeProgress(items, states)` — returns percentage or null (all N/A)
- `isDone(states, id)` — returns true if checked or na
- `getMilestone(states, allItems)` — returns "none" | "baseline" | "hardened" | "comprehensive"

Create `src/lib/storage.ts`:
- `migrateState(saved, current)` — handles version mismatches
- Corruption recovery: catch JSON.parse errors, clear corrupted key, show banner

Create `src/lib/search.ts`:
- `searchItems(query, items)` — case-insensitive substring match on title + description + tags
- Returns matched item IDs

### 1.7 Core layout components
Create the three-zone layout per PRD Section 3:

**`src/App.tsx`** — Root layout:
- Wraps children in `ErrorBoundary`
- Supports two top-level views: Home (scope selection) and Checklist
- Checklist uses three-zone grid: Header (Zone A), Sidebar (Zone B), Main Content (Zone C), Footer
- Loads `checklist.json` data

**`src/components/ui/ErrorBoundary.tsx`** — per PRD 11c:
- Catches render errors
- Shows fallback: "Something went wrong. Your progress is safely saved. [Reload Page]"

**`src/components/layout/Header.tsx`** — Sticky, 56px:
- Global counter: "You've secured X of {selectedTotalItems} controls" (dynamic by selected scope)
- Dark mode toggle
- GitHub repo link
- Hamburger menu icon (mobile only, `<768px`)

**`src/components/layout/Sidebar.tsx`** — 240px, left side:
- Site title
- Global progress summary (checked / selectedTotalItems, percentage)
- Section navigation list with per-section mini progress bars
- Visual treatment for out-of-scope sections (e.g., muted + label "Not in scope")
- Export/Import buttons (wired in Phase 3)
- Version label + dark mode toggle
- On mobile: hidden; rendered as slide-in drawer (280px) triggered by hamburger

**`src/components/layout/Footer.tsx`**:
- Version, source links, last saved timestamp

### 1.8 Checklist components

**`src/components/checklist/SectionList.tsx`**:
- Maps all sections from `checklistData.sections`
- Passes section data + item states to each `Section`

**`src/components/checklist/Section.tsx`**:
- Collapsible section with sticky header when expanded
- Shows section icon, title, progress bar, item count
- Default: Section 1 expanded, all others collapsed
- Click header to toggle expand/collapse with chevron rotation
- Section 8: render as reference-only (no checkboxes, no progress bar)

**`src/components/checklist/SubSection.tsx`**:
- Groups items with subsection title
- Thin progress bar + item count in header
- Sorts items: CRITICAL → HIGH → RECOMMENDED (consistent for all subsections)

**`src/components/checklist/ChecklistItem.tsx`**:
- Row with tri-state checkbox + title + priority badge
- Checkbox click cycles: unchecked → checked → na
- Uses `role="checkbox"` with `aria-checked="true"/"false"/"mixed"`
- Checked: green check, title struck-through, 70% opacity
- N/A: dash, gray italic, excluded from progress
- Title click: toggles inline detail panel expansion
- Detail panel (F-02): description, sources (with links), incident refs, tags, notes textarea
- Only one detail panel open at a time
- P1 Quick Win: first item in subsection 1.1 starts with detail panel pre-expanded + subtle pulse animation on checkbox

### 1.9 Progress bar component
**`src/components/progress/ProgressBar.tsx`** — Reusable:
- Takes `value` (percentage) or `null` (shows "N/A" gray bar)
- Color: red (<33%) → amber (33–66%) → green (>66%)
- Animated width transition: `400ms cubic-bezier(0.4, 0, 0.2, 1)`
- `role="progressbar"` + `aria-valuenow` + `aria-label`
- Size variants: thin (subsection), medium (section header), sidebar

### 1.10 Dark mode
- Inline `<script>` in `index.html` (before React bundle) to read persisted `isDarkMode` or `prefers-color-scheme` and set `class="dark"` on `<html>` — prevents FOUC
- Tailwind `dark:` variants for all components
- Toggle button in Header (and Sidebar on desktop)
- Persisted in localStorage via Zustand

### 1.11 Content Security Policy
Add `<meta>` CSP tag in `index.html` per PRD 11d:
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline';
           style-src 'self' 'unsafe-inline'; img-src 'self' data:;
           font-src 'self'; connect-src 'self';">
```

### 1.12 GitHub Pages files
- Create `public/404.html` (SPA redirect)
- Create placeholder `public/favicon.ico`
- Defer `public/og-image.png` (nice-to-have)

### 1.13 GitHub Actions CI/CD
Create `.github/workflows/deploy.yml` per PRD Section 2:
- Trigger: push to `main`
- Steps: checkout → setup Node 20 → `npm ci` → `npm run validate-content` → `npm run build` → deploy to `gh-pages` via `peaceiris/actions-gh-pages@v3`

**Phase 1 deliverable:** Working SPA with Home-page scope selection, selected-scope progress semantics, tri-state checkboxes, collapsible sections, progress bars, dark mode, localStorage auto-save, and deployable to GitHub Pages.

---

## Phase 2: Core UX — Toolbar, Milestones, Filters

**Goal:** Add the engagement features: milestone celebrations, search, filtering, and the item detail panel notes.

### 2.1 Milestone strip
**`src/components/progress/MilestoneStrip.tsx`**:
- Horizontal strip below toolbar with three badges
- Baseline: all selected-scope CRITICAL items done
- Hardened: all selected-scope CRITICAL + HIGH items done
- Comprehensive: all selected-scope items done or N/A
- Counts are dynamic from selected sections only
- Completed badge fills with color + checkmark, `scale(1.05)` pop animation
- On mobile (`<768px`): badges stack vertically

### 2.2 Toast notifications
**`src/components/ui/Toast.tsx`**:
- Non-blocking, bottom-right
- Auto-dismiss after 3 seconds
- `role="status"` + `aria-live="polite"`
- Slide-up entry, fade-out exit (CSS transitions)
- Queue logic: if multiple milestones crossed simultaneously, show only highest-tier (comprehensive > hardened > baseline)

### 2.3 Milestone detection
- Reactive: Use Zustand selector `getMilestone(state.itemStates, selectedScopeItems)` in the MilestoneStrip component
- `useEffect` detects transition from previous milestone → current
- Fires toast on upward milestone transition only (not on page load with existing state)

### 2.4 Toolbar
**`src/components/toolbar/Toolbar.tsx`**:
- Search bar, priority filter dropdown, role filter dropdown, reset button, expand all / collapse all
- On mobile: stacks vertically, search spans full width

**Search (integrated into Toolbar):**
- Filters items across all sections by title/description/tags (case-insensitive substring)
- Matched items highlighted in-place; non-matching items hidden
- Press Escape to clear
- `/` or `Ctrl+K` keyboard shortcut to focus search bar

**Priority filter:**
- Options: All | CRITICAL Only | HIGH+
- Items below threshold are hidden (not removed from DOM)

**Role filter:**
- Options: All Roles | Security Engineer | Architect | DevOps / SRE | Developer | Compliance
- Non-matching items dimmed to 40% opacity (not hidden)

**Reset button:**
- Opens `Modal.tsx` confirmation dialog
- On confirm: `resetAll()` clears all item states and notes

### 2.5 Priority badges
**`src/components/ui/PriorityBadge.tsx`**:
- CRITICAL: red background/text/border
- HIGH: amber background/text/border
- RECOMMENDED: green background/text/border
- Dark mode variants
- `aria-label="Priority: Critical"` (etc.)

### 2.6 Modal
**`src/components/ui/Modal.tsx`**:
- Reusable confirmation modal
- Used by: Reset button, Import version mismatch warning
- Backdrop click or Escape to close
- Focus trap inside modal

### 2.7 Keyboard shortcuts
Per PRD Section 11 (Accessibility):
- `Space` or `Enter`: toggle checkbox
- `Tab`: navigate between items
- `Escape`: close detail panel, close modal, clear search
- `/` or `Ctrl+K`: focus search bar
- `[` / `]`: navigate between sections (prev / next)

---

## Phase 3: Export, Import & Polish

**Goal:** Complete all export/import features, print stylesheet, mobile responsive polish, version migration, and accessibility.

### 3.1 JSON export
Create `src/lib/export-json.ts` per PRD Section 9.1:
- Builds full report object with `meta`, `summary`, `items`
- All counts computed dynamically from selected scope
- Include `selectedSectionIds` and `selectedSectionTitles` in `meta`
- Downloads as `mcp-security-checklist-YYYY-MM-DD.json`
- Wire to "Export JSON" button in Sidebar

### 3.2 JSON import
Per PRD F-10b:
- Hidden `<input type="file" accept=".json">` triggered by "Import JSON" button in Sidebar
- Parse uploaded file as JSON
- Validate: `meta.tool === "MCP Security Checklist"` and valid `items` object
- On valid: call `importStates()`, show success toast with count
- If `meta.version` differs: show version mismatch banner
- On invalid: show error toast
- Handle unknown item IDs gracefully (skip them)

### 3.3 PDF / Print export
Create `src/styles/print.css` per PRD Section 9.2:
- `@media print` rules
- Hide: sidebar, toolbar, header buttons, toast, milestone strip
- Show: print report header (hidden in normal view) with stats summary
- Force expand all sections and item details
- Force light background
- Priority badges keep their colors
- Page breaks between sections; `break-inside: avoid` on items
- `@page` margin + page numbers (`counter(page)`)
- Checked items: checkmark prefix; Unchecked: square bold; N/A: dash italic gray

Create `src/lib/export-pdf.ts`:
- `exportPDF()` calls `window.print()`
- Wire to "Export PDF" button in Sidebar

### 3.4 Version migration
Update `src/lib/storage.ts`:
- On mount: compare saved `contentVersion` vs `checklistData.version`
- If different: run `migrateState()` — add new items as unchecked, preserve removed items
- Show dismissible banner: "Checklist updated to vX — N new items added"

### 3.5 Mobile responsive layout
Per PRD Section 11b:
- Breakpoint: `<768px` (Tailwind `md:` for desktop)
- Sidebar: hidden by default; hamburger icon in header toggles slide-in drawer (280px, left, with backdrop overlay)
- Drawer closes on: backdrop click, Escape, or navigation
- Toolbar: stacks vertically; search bar full-width; filters on second row
- Milestone strip: badges stack vertically
- Header: condensed; hide full counter text, show only percentage; full counter in drawer
- Item rows: full width, 16px horizontal padding; priority badge moves below title on narrow screens
- Touch targets: all interactive elements at least 44x44px

### 3.6 Accessibility audit
Per PRD Section 11:
- All checkboxes: `role="checkbox"` with `aria-checked`
- Progress bars: `role="progressbar"` + `aria-valuenow` + `aria-label`
- Collapsed panels: `aria-expanded` + `aria-controls`
- Priority badges: `aria-label`
- Toast: `role="status"` + `aria-live="polite"`
- Focus rings: `outline: 2px solid var(--accent)` on all interactive elements
- `prefers-reduced-motion`: all CSS transitions disabled
- Color is never the sole indicator (icons + text always accompany color)
- Minimum 4.5:1 contrast ratio for all text (both modes)

### 3.7 Error handling
Per PRD Section 11c:
- `ErrorBoundary` wraps `<App>` (done in Phase 1)
- Skeleton loader while `checklist.json` loads; error fallback if it fails
- localStorage corruption: catch `JSON.parse`, clear key, show "progress was corrupted" banner
- `computeProgress()` null → gray bar with "N/A" label

### 3.8 README + CONTRIBUTING
- Replace `mcp-security-checklist/README.md` with project overview, setup instructions, development guide
- Create `CONTRIBUTING.md` with contribution guidelines
- Update root `README.md` with project description

---

## Execution Order Summary

```
Phase 0 (Housekeeping)
  0.1  Flatten directory structure
  0.2  Clean up scaffold
  0.3  Install dependencies
  0.4  Configure Tailwind
  0.5  Configure Vite
  0.6  Update root .gitignore
  0.7  Update root README.md

Phase 1 (MVP)
  1.1  Design system selection (fonts + colors)
  1.2  TypeScript interfaces
  1.3  Convert checklist.md → checklist.json (228 items)
  1.4  Content validation script
  1.5  Zustand store
  1.6  Utility libraries (progress, storage, search)
  1.6a Home page + scope selection
  1.7  Core layout (Home + Checklist views, ErrorBoundary, Header, Sidebar, Footer)
  1.8  Checklist components (SectionList, Section, SubSection, ChecklistItem)
  1.9  ProgressBar component
  1.10 Dark mode
  1.11 CSP meta tag
  1.12 GitHub Pages files (404.html, favicon)
  1.13 GitHub Actions CI/CD

Phase 2 (Core UX)
  2.1  MilestoneStrip
  2.2  Toast notifications
  2.3  Milestone detection (reactive)
  2.4  Toolbar (search, priority filter, role filter, reset)
  2.5  PriorityBadge
  2.6  Modal (confirmation)
  2.7  Keyboard shortcuts

Phase 3 (Export, Import & Polish)
  3.1  JSON export
  3.2  JSON import
  3.3  PDF / Print export
  3.4  Version migration
  3.5  Mobile responsive layout
  3.6  Accessibility audit
  3.7  Error handling polish
  3.8  README + CONTRIBUTING
```

---

## Item Count Reference

| Section | ID | Checkable Items | CRITICAL | HIGH | REC |
|---|---|---|---|---|---|
| 1. MCP Server Security | `mcp-server` | 86 | — | — | — |
| 2. MCP Client / Host Security | `mcp-client` | 49 | — | — | — |
| 3. Secure MCP Architecture | `architecture` | 16 | — | — | — |
| 4. Agentic-Specific Security | `agentic` | 46 | — | — | — |
| 5. LLM Secure Execution | `llm-execution` | 5 | — | — | — |
| 6. Governance & Compliance | `governance` | 19 | — | — | — |
| 7. Crypto-Specific MCP Security | `crypto` | 7 | — | — | — |
| 8. Security Tools (ref only) | `tools` | 0 | — | — | — |
| **Total** | | **228** | **65** | **119** | **44** |

---

## Out of Scope (Deferred)

- Unit tests and component tests (PRD 14c) — add as follow-up
- `og-image.png` social sharing image
- Custom domain / CNAME
- `Tooltip.tsx` component (PRD Section 7 mentions it but no feature references it)
- `GlobalCounter.tsx` as separate component (integrated into Header instead)
- `SearchBar.tsx`, `PriorityFilter.tsx`, `RoleFilter.tsx` as separate files (integrated into Toolbar instead)
