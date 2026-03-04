import { ArrowLeft, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import checklistData from '@/data/checklist.json'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { ChecklistData, SavedState } from '@/types'

const typedChecklistData = checklistData as ChecklistData

export function SharePage() {
  const itemStates = useChecklistStore((state) => state.itemStates)
  const selectedSectionIds = useChecklistStore((state) => state.selectedSectionIds)

  const handleExport = () => {
    const exportData: SavedState = {
      schemaVersion: 1,
      contentVersion: typedChecklistData.version,
      savedAt: new Date().toISOString(),
      items: itemStates,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mcp-security-checklist-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const totalItems = Object.keys(itemStates).length
  const checkedCount = Object.values(itemStates).filter(
    (state) => state.status === 'checked',
  ).length
  const naCount = Object.values(itemStates).filter(
    (state) => state.status === 'na',
  ).length

  return (
    <div className="animate-page-enter">
      <div className="mx-auto max-w-[var(--page-width)] px-6 py-16 md:px-[var(--page-padding)] md:py-24">
        <Button
          asChild
          className="mb-8 h-9 rounded-sm px-3 font-normal"
          variant="ghost"
        >
          <a href="#/">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to checklist
          </a>
        </Button>

        <h1 className="font-light text-foreground" style={{ fontSize: 'var(--font-size-display)', lineHeight: 'var(--line-height-display)' }}>
          Share your progress
        </h1>

        <p className="mt-4 max-w-xl text-[var(--foreground-secondary)]" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
          Export your checklist progress as a JSON file. You can share it with your team or
          import it later to resume where you left off.
        </p>

        {/* Progress summary */}
        <div className="mt-8 rounded-sm border border-[var(--border)] bg-[var(--background-secondary)] p-6">
          <h2 className="font-normal uppercase text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
            Current progress
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-6">
            <div>
              <p className="font-light tabular-nums text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>{checkedCount}</p>
              <p className="mt-1 text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>Completed</p>
            </div>
            <div>
              <p className="font-light tabular-nums text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>{naCount}</p>
              <p className="mt-1 text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>Not applicable</p>
            </div>
            <div>
              <p className="font-light tabular-nums text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>{selectedSectionIds.length}</p>
              <p className="mt-1 text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>Sections selected</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            className="rounded-sm px-8 font-normal"
            onClick={handleExport}
            style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)', height: '56px' }}
            type="button"
          >
            <Download className="mr-2 size-4" />
            Export as JSON
          </Button>
          {totalItems === 0 && (
            <p className="mt-3 text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
              No progress to export yet. Start the checklist to track your progress.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
