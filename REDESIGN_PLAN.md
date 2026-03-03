# Redesign: MCP Security Checklist — Editorial Adventure UI

> **Branch:** `feat/redesign-adventure-ui`
> **Base:** `feat/phase1-layout-checklist-progress` (commit `88a6c2c`)
> **Reference:** [designsystemchecklist.com](https://designsystemchecklist.com) ([GitHub](https://github.com/ardakaracizmeli/design-system-checklist))
> **Status:** Complete (pending visual QA)

---

## Summary

A full visual and UX redesign of the MCP Security Checklist app, closely matching the editorial, minimal aesthetic of designsystemchecklist.com. The home page is a bare-list "pick your adventure" screen where users select security sections to complete. Each section renders in a single-column reading layout with prev/next navigation. The sidebar has been removed entirely.

## Design Principles

- **Warm cream backgrounds** — NOT cold white. oklch with hue 85-90 (light) and warm dark tones (dark mode)
- **Teal accent preserved** — NOT switching to the reference's tan/beige accent. Green used for completion only
- **Near-zero border-radius** — 2px globally
- **Bare list items** — No card borders on home or checklist items
- **720px content width** — With 48px page padding
- **Font-light display titles** — Weight 300 for hero/section headings, 400 for body
- **Minimal animations** — 0.15s ease-in-out transitions only, page-enter fade, no heavy keyframes
- **Single-column layout** — No sidebar, pure linear book-like flow

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Task granularity | Section = Task | 8 top-level sections are the "adventure" choices |
| Section 8 | Reference-only | Shown on home with no progress fill, marked "Reference Only" |
| Layout | No sidebar, 720px single column | Matches reference site's editorial flow |
| Checklist items | Bare checkbox + label | No card wrappers, custom SVG checkbox, indented content |
| Home items | Bare title + 3px progress bar | No cards, hover arrow, selected indicator dot |
| Section headers | Sticky on scroll | `position: sticky; top: 56px` |
| Navigation | Prev/Next at bottom | 2-column grid, text-only links with hover teal |
| Existing features | All preserved | Tri-state, toolbar, milestones, dark mode, priority badges, search/filter |
| Header | 90px, minimal | No mobile hamburger (no sidebar to open), breadcrumb-style navigation |

---

## Changes Made

### `src/index.css`
- Warm cream backgrounds using oklch (hue 85-90 light, warm dark mode)
- Teal accent kept, green for completion indicators only
- `--border-radius: 2px` globally
- `--page-padding: 48px`, `--page-width: 720px`
- Typography: letter-spacing rules for headings, font-light utility
- Removed heavy keyframe animations (kept page-enter + toast only)
- `@custom-variant dark` syntax for dark mode

### `src/components/layout/Home.tsx`
- Complete rewrite to bare list items
- Each section: title + thin 3px progress bar + hover arrow
- Selected indicator dot (teal)
- Font-light hero h1 with subtitle
- Section 8 marked "Reference Only" — no progress fill, not selectable
- Select all / Clear selection bulk actions
- Start button with selected count

### `src/components/checklist/ChecklistItem.tsx`
- Stripped card wrapper entirely
- Custom SVG checkbox (24x24, 2px border, teal fill when checked)
- `pl-13` content indent for wrapped text
- `text-lg` / `text-xl` titles
- Clean expanded details layout

### `src/components/checklist/SubSection.tsx`
- Sticky section title (`top-14`)
- Inline 3px progress bar in header
- Grid layout with `gap-8`
- No card/border on section header

### `src/components/layout/CategoryView.tsx` (new)
- Font-light display title with section number
- Inline 3px progress bar
- `space-y-8` subsections
- Clean single-column reading layout
- Integrates Toolbar and MilestoneStrip

### `src/components/layout/CategoryNav.tsx` (new)
- Text-only prev/next links
- 2-column grid with `gap-12`
- Hover transitions to teal
- Overline labels ("Previous" / "Next")

### `src/components/layout/Header.tsx`
- 90px height
- No backdrop blur
- Removed mobile hamburger button and `onOpenMobileNav` prop
- Breadcrumb-style section indicator

### `src/App.tsx`
- Removed Sidebar import and all sidebar state (open/close, mobile drawer)
- Single-column `max-w-[var(--page-width)]` centered layout
- View routing: Home -> CategoryView with section navigation

### `src/components/layout/Footer.tsx`
- Warm secondary background
- Constrained to `--page-width`
- Generous vertical padding

### Deleted Files
- `src/components/layout/Sidebar.tsx` — Orphaned after sidebar removal
- `src/components/checklist/Section.tsx` — Bypassed by CategoryView rendering SubSections directly
- `src/components/checklist/SectionList.tsx` — Bypassed by CategoryView

## What Did NOT Change

- `src/store/useChecklistStore.ts` — No changes needed (already had `selectedSectionIds`)
- `src/types/index.ts` — No type changes
- `src/lib/progress.ts` — `computeProgress`, `isDone` used as-is
- `src/lib/search.ts` — `searchItems` used as-is
- `src/data/checklist.json` — 228 items untouched
- `src/components/ui/*` — shadcn/ui primitives untouched
- `src/components/progress/MilestoneStrip.tsx` — Used as-is by CategoryView
- `src/components/progress/ProgressBar.tsx` — Still used by MilestoneStrip
- `src/components/toolbar/Toolbar.tsx` — Used as-is by CategoryView
- `src/components/ui/PriorityBadge.tsx` — Used as-is by ChecklistItem
- No dependency changes, no config changes, no build tool changes

## Build Verification

- `npm run build` — zero type errors, zero warnings (builds in ~2.3s)
- `npm run lint` — zero lint errors
