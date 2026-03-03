# MCP Security Checklist — Revised Product Specification
**Version:** 2.0 (Simplified for GitHub Pages)
**Date:** March 2026

---

## 1. UX Psychology Framework

Before any component or layout decision, these principles must drive every
design choice. They are the "why" behind every UX detail that follows.

### P1 — The Quick Win (Evernote Pattern)
> "Suck users in with a simple first success to trigger commitment."

**Application:** The first visible section (Server API Security) starts with the 
easiest RECOMMENDED items at the top. Users tick something off within 10 seconds
of landing. This triggers the **commitment & consistency** principle — once they've
checked one box, they're psychologically invested in continuing.

**Implementation:** Sort items within every subsection consistently:
`CRITICAL → HIGH → RECOMMENDED`. To create the quick win, the first
subsection (1.1 API Security) starts with its easiest RECOMMENDED item
pre-expanded (detail panel open) with a subtle pulse animation on its
checkbox, drawing the user's eye to an easy first action. This avoids
breaking the consistent sort order while still triggering commitment.

### P2 — Zeigarnik Effect (Asana Pattern)
> "Incompleteness is motivating. Show users they're almost there."

**Application:** Progress bars must always show a non-zero denominator. 
The sidebar section list shows every section even if 0% complete — the
empty bars create psychological tension that drives users to fill them.
The overall progress counter shows `X of {totalItems}` rather than just a
percentage, making the gap concrete and countable.

**Implementation:** Never hide progress indicators. Show `0 / 18` not
just an empty bar. The header's global counter always reads
`"You've secured X of {totalItems} controls"` where `{totalItems}` is
computed dynamically from `checklistData.totalItems` — **never hardcode
the item count**.

### P3 — Persistent Progress Nudge (Tandem Pattern)
> "Remind without interrupting. The user controls the pace."

**Application:** A sticky progress strip at the top of the content area
(not the header) shows the current section's completion. It scrolls with
the user within a section but doesn't block content.

**Implementation:** Section headers are sticky while scrolling through
their content, showing a live mini progress bar inline.

### P4 — Milestone Celebrations (Acorns Pattern)
> "Set achievable thresholds. Celebrate each one before showing the next."

**Application:** Three milestones tied to CRITICAL items:
- 🏁 **"Baseline Secured"** — All CRITICAL items checked (most urgent)
- 🛡️ **"Hardened"** — All CRITICAL + HIGH items checked
- ✅ **"Comprehensive"** — All items checked or marked N/A

When a milestone is crossed, a subtle toast notification fires:
`"🏁 Baseline Secured — all critical controls are covered."`

### P5 — Flexibility & Non-Prescriptive Flow (Airtable Pattern)
> "Don't force a path. Let users start where they're strongest."

**Application:** No forced linear order. Users can jump to any section.
The Priority Filter lets a security engineer start with all CRITICALs
across every section at once, rather than section-by-section.

### P6 — Clear Long-Term Vision (Acorns Pattern)
> "Show the goal before showing the distance."

**Application:** The hero area above the checklist shows three milestone
badges with their completion thresholds clearly stated upfront, so users
understand the full reward structure before they begin.

---

## 2. Simplified Tech Stack

### Why Not Next.js for GitHub Pages?

Next.js App Router has poor GitHub Pages support — it requires either
a static export workaround or a server. For a pure static site:

| Concern | Decision |
|---|---|
| Framework | **Vite + React 18** — builds to `/dist` folder of pure HTML/CSS/JS |
| Styling | **Tailwind CSS v3** via PostCSS — single CSS file in output |
| State | **Zustand** with `persist` middleware → localStorage |
| Icons | **Lucide React** (tree-shaken, no extra requests) |
| Routing | **None needed** — single page application (SPA), one HTML file |
| Animation | **CSS transitions only** — no Framer Motion (keeps bundle tiny) |
| PDF Export | `window.print()` with `@media print` stylesheet |
| JSON Export | `Blob` + `URL.createObjectURL` download |
| Hosting | **GitHub Pages** via `gh-pages` branch |
| CI/CD | **GitHub Actions** — build on push to `main`, deploy to `gh-pages` |

### Bundle Size Target
dist/
├── index.html ~5 KB
├── assets/
│ ├── index.[hash].js ~120 KB gzipped (React + Zustand + Lucide)
│ ├── index.[hash].css ~15 KB gzipped (Tailwind purged)
│ └── checklist.[hash].js ~25 KB (JSON data, code-split)
Total: ~160 KB gzipped — loads in < 1s on 3G

text

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run validate-content   # Fail if JSON schema broken
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
3. Revised Information Architecture
Single Page Layout (SPA)
No routing needed. Everything lives on one page with three visual zones:

text
┌─────────────────────────────────────────────────────────────┐
│  ZONE A: STICKY HEADER (56px)                               │
│  Logo | "X of {totalItems} secured" | [🔍] [🌙] [GitHub ↗] │
├──────────────┬──────────────────────────────────────────────┤
│  ZONE B:     │  ZONE C: MAIN CONTENT                        │
│  SIDEBAR     │                                              │
│  (240px)     │  [MILESTONE STRIP]                           │
│              │  [TOOLBAR: Filter | Role | Search | Reset]   │
│  Progress    │  [SECTION 1 — sticky header while in view]   │
│  Summary     │    [SubSection 1.1]                          │
│              │      [Items...]                              │
│  Section     │    [SubSection 1.2]                          │
│  Nav List    │      [Items...]                              │
│              │  [SECTION 2...]                              │
│  Export      │  ...                                         │
│  Buttons     │                                              │
└──────────────┴──────────────────────────────────────────────┘
│  FOOTER: Version -  Sources -  Last saved timestamp           │
└─────────────────────────────────────────────────────────────┘
4. Data Model
4.1 Checklist Item (TypeScript)
typescript
type Priority = "CRITICAL" | "HIGH" | "RECOMMENDED";
type ItemStatus = "unchecked" | "checked" | "na";
type Role = "security-engineer" | "architect" | "devops" | "developer" | "compliance";

interface SourceRef {
  label: string;   // "OWASP MCP Dev Guide v1.0"
  url?: string;    // optional deep link
}

interface ChecklistItem {
  id: string;              // stable forever, e.g. "srv-api-001"
  title: string;           // short, action-oriented title
  description: string;     // 2–3 sentences: WHAT + WHY
  priority: Priority;
  roles: Role[];
  tags: string[];
  sources: SourceRef[];
  incidentRefs?: string[]; // real-world CVE/incident names
}

interface SubSection {
  id: string;       // "srv-api"
  number: string;   // "1.1"
  title: string;
  items: ChecklistItem[];
}

interface Section {
  id: string;         // "mcp-server"
  number: number;     // 1
  title: string;
  icon: string;       // Lucide icon name
  description: string;
  subsections: SubSection[];
}

interface ChecklistData {
  version: string;      // "2026.1"
  lastUpdated: string;  // "2026-03-03"
  totalItems: number;   // pre-computed for display; validated at build time
  sections: Section[];
}

// IMPORTANT: totalItems MUST equal the sum of all items across all
// subsections. The validate-content.ts CI script asserts this.
// All UI references to the total count use checklistData.totalItems
// dynamically — never hardcode a number like "142".
4.2 User State (localStorage)
typescript
// Stored at localStorage key: "mcp-checklist-v1"
interface ItemState {
  status: ItemStatus;
  note?: string;
  updatedAt?: string;
}

interface SavedState {
  schemaVersion: 1;            // bump only on breaking change
  contentVersion: string;      // "2026.1" — detect stale state
  savedAt: string;             // ISO timestamp
  items: Record<string, ItemState>; // keyed by item.id
}
4.3 Progress Computation
typescript
// N/A items are excluded from both numerator and denominator
function computeProgress(items: ChecklistItem[], states: Record<string, ItemState>) {
  const applicable = items.filter(i => states[i.id]?.status !== "na");
  const checked = applicable.filter(i => states[i.id]?.status === "checked");
  if (applicable.length === 0) return null; // all N/A — show "N/A"
  return Math.round((checked.length / applicable.length) * 100);
}

// Milestone thresholds
// IMPORTANT: An item is "done" only if explicitly checked or marked N/A.
// Untouched items (not in states, or status undefined) are NOT done.
function isDone(states: Record<string, ItemState>, id: string): boolean {
  const s = states[id]?.status;
  return s === "checked" || s === "na";
}

function getMilestone(states, allItems): "none" | "baseline" | "hardened" | "comprehensive" {
  const criticals = allItems.filter(i => i.priority === "CRITICAL");
  const highs = allItems.filter(i => i.priority !== "RECOMMENDED");
  const allCriticalsDone = criticals.every(i => isDone(states, i.id));
  const allHighsDone = highs.every(i => isDone(states, i.id));
  const allDone = allItems.every(i => isDone(states, i.id));
  if (allDone) return "comprehensive";
  if (allHighsDone) return "hardened";
  if (allCriticalsDone) return "baseline";
  return "none";
}
5. Feature Specification (Simplified)
F-01 Tri-State Checkbox
Click cycles: unchecked → checked → na → unchecked

Unchecked: empty square □

Checked: filled checkbox, green, title struck-through, 70% opacity

N/A: dash —, gray italic title, excluded from progress

Single click on the checkbox cycles state.
Click on the item title expands the detail panel (separate action).

F-02 Item Detail Panel
Clicking the item title (not the checkbox) toggles an inline expansion:

text
[□]  Enforce TLS 1.2+ for all remote connections          [CRITICAL]
     ↓ expanded
     ┌──────────────────────────────────────────────────────────┐
     │ All MCP server remote connections must use TLS 1.2 or   │
     │ higher. Weak cipher suites must be explicitly disabled.  │
     │                                                          │
     │ 📎 Sources:  OWASP MCP Dev Guide v1.0 ↗                 │
     │              arXiv 2506.02040 ↗                          │
     │ 🔴 Incidents: EchoLeak, VS Code RCE Sep 2025            │
     │ 🏷 Tags:      server, tls, transport, remote            │
     │                                                          │
     │ 📝 Notes:                                               │
     │  ┌──────────────────────────────────────────────────┐   │
     │  │ Add a note for your team...                       │   │
     │  └──────────────────────────────────────────────────┘   │
     └──────────────────────────────────────────────────────────┘
Only one detail panel open at a time (clicking another closes the current).

F-03 Progress Bars (everywhere, always visible)
Global header counter: "You've secured X of {totalItems} controls"
updates live on every checkbox click
(where {totalItems} = checklistData.totalItems, computed dynamically)

Sidebar per-section: mini progress bar + X% label

Section header (sticky): ████████░░░░ 58% (34/58 items)
visible while scrolling through section content

Subsection header: thin progress bar + item count

Progress bar color: red (<33%) → amber (33–66%) → green (>66%)

All bars animate with transition: width 400ms ease

F-04 Milestone Strip
A horizontal strip just below the toolbar showing three milestone badges:

text
┌──────────────────────────────────────────────────────────────────┐
│  [🏁 Baseline]  Cover all 🔴 CRITICAL controls   → 0 / {N} done  │
│  [🛡 Hardened]  Cover all 🔴🟡 HIGH+ controls    → 0 / {N} done │
│  [✅ Complete]  Cover all {totalItems} controls  → 0 / {N} done │
└──────────────────────────────────────────────────────────────────┘
All counts ({N}) are computed dynamically from the checklist data,
never hardcoded.
Completed milestone badge fills with its color + checkmark icon

On milestone completion: show a subtle toast for 3 seconds
"🏁 Baseline Secured — all critical controls are covered!"

Toast is non-blocking, appears bottom-right, auto-dismisses

**Toast Queue:** If multiple milestones are crossed simultaneously
(e.g., importing a nearly-complete JSON state), only show the toast for
the highest-tier milestone achieved. Queue: comprehensive > hardened >
baseline. Never show multiple milestone toasts simultaneously.

F-05 Sidebar Navigation
text
MCP Security Checklist     ← site title
━━━━━━━━━━━━━━━━━━━━━━━━
{checked} / {totalItems} secured  ({pct}%)
━━━━━━━━━━━━━━━━━━━━━━━━
Priority:  [All ▾]
━━━━━━━━━━━━━━━━━━━━━━━━
● 1. MCP Server        58%
  ████████████░░░░░░░
  
○ 2. Client / Host     34%
  ██████░░░░░░░░░░░░░
  
○ 3. Architecture        0%
  ░░░░░░░░░░░░░░░░░░░
  
○ 4. Agentic (NEW)       0%
  ░░░░░░░░░░░░░░░░░░░
  
○ 5. LLM Execution       0%
○ 6. Governance          0%
○ 7. Crypto              0%
○ 8. Tools          (ref only)
━━━━━━━━━━━━━━━━━━━━━━━━
[⬇ Export JSON]
[� Import JSON]
[�📄 Export PDF]
━━━━━━━━━━━━━━━━━━━━━━━━
v2026.1  [🌙 Dark Mode]
Clicking a section name: smooth-scrolls to section and expands it.
Active section (in viewport): highlighted with accent color.

F-06 Toolbar
text
[🔍 Search items...] [🔴 All Priorities ▾] [👤 All Roles ▾] [↺ Reset]
Search: Filters items across all sections by title/description/tags.
Results are highlighted in-place (not a separate results page).
Press Escape to clear.

Priority filter: All | 🔴 Critical Only | 🔴🟡 High+ | All
Items below the threshold are hidden (not removed from DOM).

Role filter: All Roles | Security Engineer | Architect |
DevOps / SRE | Developer | Compliance
Items not matching the role are dimmed to 40% opacity (not hidden) —
preserving context while directing focus.

Reset: Opens a confirmation modal; clears all states and notes.

F-07 Priority Badges
Each item displays one badge, right-aligned:

text
[🔴 CRITICAL]    background: red-50,   text: red-700,   border: red-200
[🟡 HIGH]        background: amber-50, text: amber-700, border: amber-200
[🟢 REC]         background: green-50, text: green-700, border: green-200
Dark mode: use dark variants (red-950/red-300 etc.)

F-08 Collapsible Sections
Default state: Section 1 expanded, all others collapsed

Section header is always visible (sticky when expanded, scrolls away when collapsed)

Click section header to toggle collapse/expand with chevron rotation animation

"Expand All / Collapse All" button in toolbar

F-09 localStorage Persistence
typescript
// Auto-save on every state change (debounced 300ms)
// Auto-load on page mount
// Storage key: "mcp-checklist-v1"
// On mount: compare saved contentVersion vs current; if different,
//   show a dismissible banner:
//   "📢 Checklist updated to v2026.2 — 8 new items added as unchecked"
F-10 JSON Export
Clicking "Export JSON" triggers an immediate download:

Filename: mcp-security-checklist-2026-03-03.json

Contents:

json
{
  "meta": {
    "tool": "MCP Security Checklist",
    "version": "2026.1",
    "exportedAt": "2026-03-03T14:30:00Z",
    "url": "https://yourorg.github.io/mcp-security-checklist"
  },
  "summary": {
    "total": 142,         // NOTE: example value; actual is computed dynamically
    "checked": 89,
    "notApplicable": 12,
    "unchecked": 41,
    "progressPercent": 68,
    "milestone": "baseline",
    "criticalChecked": 61,
    "criticalTotal": 61,
    "highChecked": 31,
    "highTotal": 42,
    "recommendedChecked": 0,
    "recommendedTotal": 39,
    "bySectionSummary": [
      { "id": "mcp-server", "title": "MCP Server Security", 
        "checked": 34, "total": 58, "percent": 59 }
    ]
  },
  "items": {
    "srv-api-001": {
      "status": "checked",
      "priority": "CRITICAL",
      "title": "Enforce Input Validation",
      "note": "Implemented with Pydantic v2 — reviewed by @alice",
      "updatedAt": "2026-03-01T10:00:00Z"
    },
    "srv-api-002": {
      "status": "na",
      "priority": "HIGH",
      "title": "Path Traversal Protection",
      "note": "N/A — local-only deployment, no file system exposure"
    }
  }
}
The exported JSON also serves as a re-importable state file.

F-10b JSON Import
Clicking "Import JSON" in the sidebar opens a native file picker
(`<input type="file" accept=".json">`).

Behavior:
1. Parse the selected file as JSON.
2. Validate that it contains `meta.tool === "MCP Security Checklist"`
   and a valid `items` object.
3. If valid, call `importStates()` to load the saved item states.
4. Show a toast: `"✅ Imported {N} item states from {filename}"`.
5. If the imported `meta.version` differs from the current checklist
   version, show the version mismatch banner (F-09 behavior).
6. If invalid JSON or schema mismatch, show an error toast:
   `"❌ Invalid file — expected an MCP Security Checklist export."`

The file picker is hidden; the sidebar button triggers it via
`inputRef.current.click()`.

F-11 PDF / Print Export
Clicking "Export PDF" calls window.print().
A @media print CSS stylesheet produces a clean, structured report:

text
┌──────────────────────────────────────────────────────────────┐
│  MCP SECURITY CHECKLIST — AUDIT REPORT                       │
│  Generated: March 3, 2026 | Version: 2026.1                  │
│  Progress: 68% (89/{totalItems} items) | Milestone: 🏁 Baseline  │
│  ────────────────────────────────────────────────────────    │
│  ✓ 89 Checked   — 41 Unchecked   — 12 N/A                   │
│  ────────────────────────────────────────────────────────    │
│                                                              │
│  SECTION 1: MCP SERVER SECURITY          59% (34/58)         │
│  ─────────────────────────────────────────────────────       │
│  1.1 API Security                                            │
│  ✓ [CRITICAL] Enforce Input Validation                       │
│    Note: Implemented with Pydantic v2                        │
│  ☐ [CRITICAL] Path Traversal Protection                      │
│  ✓ [HIGH]     API Rate Limiting                              │
│  — [HIGH]     Output Encoding                [N/A]           │
│    Note: N/A — local only deployment                         │
│                                                              │
│  [page break between sections]                               │
└──────────────────────────────────────────────────────────────┘
Print stylesheet rules:

White background, black text (forced)

Hide: sidebar, toolbar, header buttons, toast notifications, milestone strip

Show: report header with stats, all sections (expanded), all items

Checked items: ✓ prefix, normal weight

Unchecked items: ☐ prefix, bold (outstanding actions)

N/A items: — prefix, italic gray, [N/A] tag

Notes: indented block under item, italic

Page numbers in footer: Page X of Y

Section headers repeat on page break (break-inside: avoid)

F-12 Dark Mode
Detected from prefers-color-scheme on first visit

Manual toggle persists in localStorage

Tailwind dark: variants throughout

No flash of wrong theme: set class="dark" on <html>
before React hydrates via an inline <script> in index.html:

html
<!-- In index.html <head>, BEFORE any stylesheet or React bundle -->
<script>
  (function() {
    try {
      var stored = JSON.parse(localStorage.getItem('mcp-checklist-v1'));
      if (stored && stored.state && stored.state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else if (!stored && matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
</script>

6. Visual Design
6.1 Color Tokens
css
/* ── Light Mode ──────────────────────────── */
--bg:           #FFFFFF;
--bg-secondary: #F8FAFC;
--bg-tertiary:  #F1F5F9;
--border:       #E2E8F0;
--text-primary: #0F172A;
--text-secondary: #475569;
--text-muted:   #94A3B8;
--accent:       #7C3AED;   /* Purple */
--accent-hover: #6D28D9;

/* ── Dark Mode ───────────────────────────── */
--bg:           #0D1117;
--bg-secondary: #161B22;
--bg-tertiary:  #21262D;
--border:       #30363D;
--text-primary: #F0F6FC;
--text-secondary: #8B949E;
--text-muted:   #484F58;

/* ── Priority (same both modes) ──────────── */
--critical:        #DC2626;
--critical-light:  #FEF2F2;
--critical-dark:   #450A0A;
--high:            #D97706;
--high-light:      #FFFBEB;
--high-dark:       #451A03;
--recommended:     #16A34A;
--recommended-light: #F0FDF4;
--recommended-dark:  #052E16;

/* ── Progress gradient ───────────────────── */
--progress-low:    #DC2626;   /* 0–32%   */
--progress-mid:    #D97706;   /* 33–65%  */
--progress-high:   #16A34A;   /* 66–100% */
6.2 Typography
text
Font:    Inter (self-hosted in public/fonts/ — avoids third-party
         requests to Google Fonts for privacy)
Mono:    JetBrains Mono (self-hosted in public/fonts/)

Load via @font-face in globals.css with `font-display: swap`.
Do NOT use Google Fonts CDN — this is a security tool and should
not leak user visits to third parties.

Scale (rem):
  xs:   0.75    badges, timestamps
  sm:   0.875   metadata, secondary text  
  base: 1.0     body, item titles
  lg:   1.125   subsection titles
  xl:   1.25    section titles
  2xl:  1.5     hero heading
6.3 Key Spacing Rules
8px base grid throughout

Item row: 16px vertical padding, 16px left for checkbox gap

Section content: 24px left indent from section header

Between subsections: 24px gap

Between sections: 40px gap

6.4 Interaction States
text
Checkbox hover:   background lightens, cursor pointer
Item row hover:   bg-secondary background
Detail panel:     slides down with max-height transition (300ms ease)
Progress bar:     width transitions (400ms cubic-bezier(0.4, 0, 0.2, 1))
Milestone badge:  scale(1.05) pop on completion
Sidebar active:   accent left border (3px) + accent text color
Toast:            slides up from bottom-right, fades out after 3s
Checked item:     strikethrough animates left-to-right (300ms)
7. Component Architecture
text
src/
├── App.tsx                  ← Root, provides Zustand store context
├── components/
│   ├── layout/
│   │   ├── Header.tsx       ← Sticky header, global counter, icons
│   │   ├── Sidebar.tsx      ← Section nav, per-section progress, exports
│   │   └── Footer.tsx       ← Version, sources, last saved
│   │
│   ├── checklist/
│   │   ├── SectionList.tsx  ← Maps all sections
│   │   ├── Section.tsx      ← Collapsible section with sticky header
│   │   ├── SubSection.tsx   ← Groups items, shows progress bar
│   │   └── ChecklistItem.tsx← Row + detail panel + tri-state checkbox
│   │
│   ├── toolbar/
│   │   ├── Toolbar.tsx      ← Search + filters + reset
│   │   ├── SearchBar.tsx
│   │   ├── PriorityFilter.tsx
│   │   └── RoleFilter.tsx
│   │
│   ├── progress/
│   │   ├── MilestoneStrip.tsx
│   │   ├── ProgressBar.tsx  ← Reusable, size/color variants
│   │   └── GlobalCounter.tsx
│   │
│   └── ui/
│       ├── PriorityBadge.tsx
│       ├── Toast.tsx
│       ├── Modal.tsx        ← Reset confirmation, import version mismatch
│       └── Tooltip.tsx
│
├── store/
│   └── useChecklistStore.ts ← Zustand store with persist middleware
│
├── lib/
│   ├── progress.ts          ← Progress & milestone computation
│   ├── export-json.ts       ← Build and trigger JSON download
│   ├── export-pdf.ts        ← window.print() wrapper + print CSS trigger
│   ├── storage.ts           ← localStorage read/write + version migration
│   └── search.ts            ← Fuzzy item search logic
│
├── data/
│   ├── checklist.json       ← All content (source of truth)
│   └── changelog.json       ← Version history
│
├── types/
│   └── index.ts             ← All TypeScript interfaces
│
└── styles/
    ├── globals.css          ← Tailwind base + CSS custom properties
    └── print.css            ← @media print stylesheet for PDF export
8. State Management (Zustand)
typescript
// store/useChecklistStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChecklistStore {
  // ── User item states ────────────────────────────────────────
  itemStates: Record<string, ItemState>;
  toggleItem: (id: string) => void;          // cycles unchecked→checked→na
  setNote: (id: string, note: string) => void;
  resetAll: () => void;
  importStates: (states: Record<string, ItemState>) => void;

  // ── UI state (NOT persisted) ────────────────────────────────
  expandedSections: Set<string>;
  expandedItemId: string | null;
  priorityFilter: "all" | "CRITICAL" | "HIGH+";
  roleFilter: Role | "all";
  searchQuery: string;
  isDarkMode: boolean;
  toastMessage: string | null;

  toggleSection: (id: string) => void;
  setExpandedItem: (id: string | null) => void;
  setPriorityFilter: (f: typeof priorityFilter) => void;
  setRoleFilter: (r: Role | "all") => void;
  setSearch: (q: string) => void;
  toggleDarkMode: () => void;
  showToast: (msg: string) => void;
}

// Persist ONLY itemStates (not UI state)
// This avoids stale UI state (open panels, filters) on reload
const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      itemStates: {},
      toggleItem: (id) => set((state) => {
        const current = state.itemStates[id]?.status ?? "unchecked";
        const next = current === "unchecked" ? "checked"
                   : current === "checked"   ? "na"
                   : "unchecked";
        const newStates = {
          ...state.itemStates,
          [id]: { status: next, updatedAt: new Date().toISOString(),
                  note: state.itemStates[id]?.note }
        };
        // Milestone is computed reactively via a selector (see below)
        return { itemStates: newStates };
      }),
      // ... rest of implementation
    }),
    {
      name: "mcp-checklist-v1",           // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({           // only persist these fields
        itemStates: state.itemStates,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// ── Reactive milestone detection (NOT inside toggleItem) ─────────
// In the component that owns milestone display:
//   const milestone = useChecklistStore(state =>
//     getMilestone(state.itemStates, allItems)
//   );
//   useEffect(() => {
//     if (milestone !== prevMilestone && milestone !== "none") {
//       showToast(milestoneMessages[milestone]);
//     }
//   }, [milestone]);
//
// This avoids the race condition from setTimeout(() => checkMilestone(get()), 0)
// and correctly handles rapid clicks and bulk imports.
9. Export Implementation
9.1 JSON Export
typescript
// lib/export-json.ts
export function exportJSON(
  checklistData: ChecklistData,
  itemStates: Record<string, ItemState>
): void {
  const allItems = checklistData.sections
    .flatMap(s => s.subsections)
    .flatMap(ss => ss.items);

  const applicable = allItems.filter(i => itemStates[i.id]?.status !== "na");
  const checked = applicable.filter(i => itemStates[i.id]?.status === "checked");

  const report = {
    meta: {
      tool: "MCP Security Checklist",
      version: checklistData.version,
      exportedAt: new Date().toISOString(),
    },
    summary: {
      total: allItems.length,
      checked: checked.length,
      notApplicable: allItems.filter(i => itemStates[i.id]?.status === "na").length,
      unchecked: allItems.filter(i => !itemStates[i.id] || itemStates[i.id].status === "unchecked").length,
      progressPercent: Math.round((checked.length / applicable.length) * 100),
      milestone: getMilestone(itemStates, allItems),
      criticalChecked: allItems.filter(i => i.priority === "CRITICAL" && itemStates[i.id]?.status === "checked").length,
      criticalTotal: allItems.filter(i => i.priority === "CRITICAL").length,
      bySectionSummary: checklistData.sections.map(s => {
        const items = s.subsections.flatMap(ss => ss.items);
        const app = items.filter(i => itemStates[i.id]?.status !== "na");
        const chk = app.filter(i => itemStates[i.id]?.status === "checked");
        return {
          id: s.id, title: s.title,
          checked: chk.length, total: app.length,
          percent: app.length ? Math.round((chk.length / app.length) * 100) : 0
        };
      }),
    },
    items: Object.fromEntries(
      allItems
        .filter(i => itemStates[i.id])  // only include items the user touched
        .map(i => [i.id, {
          status: itemStates[i.id].status,
          priority: i.priority,
          title: i.title,
          ...(itemStates[i.id].note ? { note: itemStates[i.id].note } : {}),
          ...(itemStates[i.id].updatedAt ? { updatedAt: itemStates[i.id].updatedAt } : {}),
        }])
    ),
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mcp-security-checklist-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
9.2 PDF Export
typescript
// lib/export-pdf.ts
export function exportPDF(): void {
  // The print stylesheet handles all visual transformation
  // Just trigger the browser print dialog
  window.print();
}
css
/* styles/print.css — applied only @media print */
@media print {
  /* Hide all interactive UI */
  header, .sidebar, .toolbar, .milestone-strip,
  .item-detail-actions, .toast, button { display: none !important; }

  /* Show report header (hidden in normal view) */
  .print-report-header { display: block !important; }

  /* Force expand all sections */
  .section-content { display: block !important; max-height: none !important; }
  .item-detail { display: block !important; max-height: none !important; }

  /* Force light background */
  * { background: white !important; color: black !important; }

  /* Priority badges keep color */
  .badge-critical { color: #DC2626 !important; }
  .badge-high     { color: #D97706 !important; }
  .badge-rec      { color: #16A34A !important; }

  /* Page breaks */
  .section { break-before: page; }
  .section:first-child { break-before: avoid; }
  .checklist-item { break-inside: avoid; }

  /* Typography */
  body { font-family: Arial, sans-serif; font-size: 11pt; }
  .item-title.checked { text-decoration: line-through; color: #6B7280 !important; }
  .item-note { font-style: italic; margin-left: 24px; color: #374151 !important; }

  /* Page numbers — note: counter(pages) for total is not standard CSS;
     only counter(page) is reliable cross-browser */
  @page {
    margin: 2cm;
    @bottom-right { content: "Page " counter(page); }
  }
}
10. Version Migration
When the user returns and the saved contentVersion differs from the
current checklist version:

typescript
// lib/storage.ts
function migrateState(saved: SavedState, current: ChecklistData): {
  migratedState: SavedState;
  newItemCount: number;
  removedItemCount: number;
} {
  // New items in current data that aren't in saved state → add as "unchecked"
  // Removed items from current that are in saved state → preserve (hidden, not shown)
  // Never delete saved state — only add or hide
}
On mount, if versions differ, show a dismissible banner (not a modal —
don't interrupt the user):

text
┌────────────────────────────────────────────────────────────────────┐
│ 📢 Checklist updated to v2026.2 — 8 new items added  [Dismiss ×]  │
└────────────────────────────────────────────────────────────────────┘
11. Accessibility
All checkboxes: native <input type="checkbox"> with visible label

Progress bars: role="progressbar" + aria-valuenow + aria-label

Collapsed panels: aria-expanded="false" + aria-controls

Priority badges: aria-label="Priority: Critical"

Toast notifications: role="status" + aria-live="polite"

Color is never the sole indicator (icons + text always accompany color)

Minimum 4.5:1 contrast ratio for all text (both modes)

Focus rings: outline: 2px solid var(--accent) on all interactive elements

prefers-reduced-motion: all transitions disabled when set

Keyboard: Space or Enter to toggle checkbox, Tab through items,
Escape to close detail panel or search

Keyboard shortcuts:
  `/` or `Ctrl+K`:  Focus the search bar
  `Escape`:         Clear search, close detail panel, or close modal
  `[` / `]`:        Navigate between sections (prev / next)

11b. Mobile Responsive Spec

Breakpoint: `<768px` (Tailwind `md:` prefix for desktop styles).

**Sidebar:** Hidden by default on mobile. Hamburger icon (☰) in the
header toggles a full-height slide-in drawer (left, 280px, with
backdrop overlay). Drawer closes on backdrop click, Escape, or
navigation.

**Toolbar:** Stacks vertically. Search bar spans full width.
Filter dropdowns stack below search on their own row.

**Milestone strip:** Stacks badges vertically instead of horizontal.

**Touch targets:** All interactive elements (checkboxes, buttons,
links, filter options) must be at least 44×44px per Apple HIG /
Google Material guidelines.

**Header:** Condensed. Hide the full counter text; show only the
progress percentage. Full counter visible in the drawer.

**Item rows:** Full width, 16px horizontal padding. Priority badge
moves below the title on narrow screens.

11c. Error Handling

**React Error Boundary:** Wrap `<App>` in an error boundary component.
On crash, show a fallback UI:
```
"Something went wrong. Your progress is safely saved.
 [Reload Page]"
```

**Checklist data loading:** Show a skeleton loader while
`checklist.json` is being fetched/parsed. If it fails, show:
```
"Failed to load checklist data. Please refresh or check your
 connection."
```

**localStorage corruption:** If `JSON.parse` fails on stored state,
clear the corrupted key and start fresh. Show a dismissible banner:
```
"⚠️ Saved progress was corrupted and has been reset."
```

**computeProgress null handling:** When `computeProgress()` returns
`null` (all items are N/A), the `ProgressBar` component must render
a gray bar with the label "N/A" instead of 0% or an empty state.

11d. Content Security Policy

Add a `<meta>` CSP tag in `index.html` (GitHub Pages doesn't support
custom response headers):

```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline';
           style-src 'self' 'unsafe-inline'; img-src 'self' data:;
           font-src 'self'; connect-src 'self';">
```

The `'unsafe-inline'` for script-src is required for the dark mode
init script. All fonts are self-hosted, so no external font-src needed.

12. GitHub Pages–Specific Configuration
vite.config.ts
typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: set base to your GitHub repo name
  // e.g. if hosted at github.com/yourorg/mcp-security-checklist
  base: "/mcp-security-checklist/",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Split checklist data into its own chunk
        manualChunks: {
          "checklist-data": ["./src/data/checklist.json"],
        },
      },
    },
  },
});
404.html for SPA on GitHub Pages
GitHub Pages serves 404.html for unknown routes. Since this is a
single-page app with no routing, this is only needed if you plan to use
?query params. Add a public/404.html that redirects to index.html:

xml
<!-- public/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0;url=." />
  </head>
</html>
Custom Domain (optional)
Add public/CNAME with your domain:

text
mcpsecuritychecklist.dev
13. Simplified File Structure
text
mcp-security-checklist/
├── public/
│   ├── favicon.ico
│   ├── og-image.png          (1200×630 for social sharing)
│   ├── 404.html              (SPA redirect for GitHub Pages)
│   └── fonts/
│       ├── inter-*.woff2     (self-hosted, no Google Fonts CDN)
│       └── jetbrains-mono-*.woff2
│
├── src/
│   ├── App.tsx
│   ├── main.tsx              (React entry point)
│   ├── index.css             (Tailwind directives + CSS vars)
│   │
│   ├── data/
│   │   ├── checklist.json    ← THE ONLY CONTENT FILE
│   │   └── changelog.json
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── store/
│   │   └── useChecklistStore.ts
│   │
│   ├── lib/
│   │   ├── progress.ts
│   │   ├── export-json.ts
│   │   ├── export-pdf.ts
│   │   ├── storage.ts
│   │   └── search.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── checklist/
│   │   │   ├── SectionList.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── SubSection.tsx
│   │   │   └── ChecklistItem.tsx
│   │   ├── toolbar/
│   │   │   └── Toolbar.tsx
│   │   ├── progress/
│   │   │   ├── MilestoneStrip.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── ui/
│   │       ├── PriorityBadge.tsx
│   │       ├── Toast.tsx
│   │       ├── Modal.tsx
│   │       └── ErrorBoundary.tsx  ← Catches render errors, shows fallback UI
│   │
│   └── styles/
│       └── print.css
│
├── scripts/
│   └── validate-content.ts   (node script, runs in CI only)
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── index.html                (Vite entry, includes dark mode init script)
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── CONTRIBUTING.md
└── README.md
14. Package.json (Minimal Dependencies)
json
{
  "name": "mcp-security-checklist",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "validate-content": "npx tsx scripts/validate-content.ts",
    "predeploy": "npm run validate-content && npm run test && npm run build"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zustand": "^4.5.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.3.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "jsdom": "^24.0.0",
    "zod": "^3.23.0",
    "tsx": "^4.0.0"
  }
}
Zero runtime dependencies beyond React + Zustand + Lucide.
No date libraries, no compression libraries, no PDF libraries.
Everything is native browser APIs.

14b. validate-content.ts Schema

The `validate-content` script uses Zod to ensure `checklist.json`
is structurally sound at build time. The Zod schema must mirror the
TypeScript interfaces from Section 4.1:

```typescript
// scripts/validate-content.ts
import { z } from "zod";
import data from "../src/data/checklist.json";

const SourceRefSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().optional(),
});

const ChecklistItemSchema = z.object({
  id: z.string().regex(/^[a-z]+-[a-z]+-\d{3}$/),
  title: z.string().min(5),
  description: z.string().min(10),
  priority: z.enum(["CRITICAL", "HIGH", "RECOMMENDED"]),
  roles: z.array(z.enum([
    "security-engineer", "architect", "devops", "developer", "compliance"
  ])).min(1),
  tags: z.array(z.string()).min(1),
  sources: z.array(SourceRefSchema).min(1),
  incidentRefs: z.array(z.string()).optional(),
});

const SubSectionSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  items: z.array(ChecklistItemSchema).min(1),
});

const SectionSchema = z.object({
  id: z.string(),
  number: z.number(),
  title: z.string(),
  icon: z.string(),
  description: z.string(),
  subsections: z.array(SubSectionSchema).min(1),
});

const ChecklistDataSchema = z.object({
  version: z.string(),
  lastUpdated: z.string(),
  totalItems: z.number(),
  sections: z.array(SectionSchema).min(1),
});

const parsed = ChecklistDataSchema.parse(data);

// Validate totalItems matches actual count
const actualTotal = parsed.sections
  .flatMap(s => s.subsections)
  .flatMap(ss => ss.items).length;

if (parsed.totalItems !== actualTotal) {
  throw new Error(
    `totalItems (${parsed.totalItems}) !== actual item count (${actualTotal})`
  );
}

// Validate all item IDs are unique
const ids = parsed.sections
  .flatMap(s => s.subsections)
  .flatMap(ss => ss.items)
  .map(i => i.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length > 0) {
  throw new Error(`Duplicate item IDs: ${dupes.join(", ")}`);
}

console.log(`✅ checklist.json valid: ${actualTotal} items across ${parsed.sections.length} sections`);
```

14c. Test Coverage Requirements

Minimum test coverage before v1.0 launch:

| Area | Framework | Tests Required |
|---|---|---|
| `progress.ts` | Vitest | computeProgress, getMilestone, isDone edge cases |
| `export-json.ts` | Vitest | Output schema matches F-10 spec |
| `storage.ts` | Vitest | Migration, corruption recovery, version mismatch |
| `search.ts` | Vitest | Fuzzy matching, empty queries, special characters |
| `useChecklistStore` | Vitest + RTL | Toggle cycles, import, reset, persistence |
| Smoke test | Vitest | App renders without crashing |

14d. Section 8 Treatment

Section 8 ("Security Tools & Continuous Validation") in the checklist
contains reference recommendations and tooling tables, not discrete
checkable items with priority levels. It is treated as a **reference
appendix**:

- Displayed in the sidebar as "8. Tools (ref only)" with no progress bar
- Rendered as a read-only section with no checkboxes
- **Excluded from all progress calculations and milestone tracking**
- Still visible when printing / exporting PDF
- The `totalItems` count does NOT include Section 8 content

15. Phased Delivery (Simplified)
Week 1 — Foundation
 Vite + React + Tailwind + Zustand scaffolding

 Self-host Inter + JetBrains Mono fonts in public/fonts/

 checklist.json with all 8 sections and items

 validate-content.ts Zod schema + CI integration

 ChecklistItem with tri-state checkbox

 Section / SubSection collapsible structure

 Progress bars (item, subsection, section levels)

 localStorage persistence

 Dark mode (with FOUC-prevention inline script)

 ErrorBoundary component

 GitHub Pages deployment via Actions

Week 2 — Core UX
 Sidebar with section progress

 Global counter in header (X of {totalItems} secured)

 Milestone strip (P4 Appcues principle)

 Milestone toast notifications (with queue — highest tier only)

 Item detail panel (description, sources, notes)

 Priority badges

 Priority filter

 Role filter (dim, not hide)

 JSON import (file picker + validation)

Week 3 — Polish + Output
 Global search with inline highlighting

 JSON export (full report format)

 PDF / print export (styled print CSS)

 Version mismatch banner

 Reset confirmation modal

 Mobile responsive layout (sidebar drawer, stacked toolbar)

 Accessibility audit (keyboard nav, ARIA, keyboard shortcuts)

 Content Security Policy meta tag

 Unit tests (progress, milestones, export, storage, search)

 README + CONTRIBUTING guide

 validate-content.ts CI script