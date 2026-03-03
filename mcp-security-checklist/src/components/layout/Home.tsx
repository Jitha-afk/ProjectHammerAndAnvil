import { ArrowRight, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { computeProgress } from '@/lib/progress'
import { isDone } from '@/lib/progress'
import type { ChecklistData, ItemState } from '@/types'

interface HomeProps {
  checklistData: ChecklistData
  selectedSectionIds: string[]
  itemStates: Record<string, ItemState>
  onToggleSection: (sectionId: string) => void
  onSelectAllCore: () => void
  onClearSelection: () => void
  onStartChecklist: () => void
}

export function Home({
  checklistData,
  selectedSectionIds,
  itemStates,
  onToggleSection,
  onSelectAllCore,
  onClearSelection,
  onStartChecklist,
}: HomeProps) {
  const selectableSections = checklistData.sections.filter((section) => section.id !== 'tools')
  const referenceSection = checklistData.sections.find((section) => section.id === 'tools')

  const selectedCount = selectedSectionIds.length
  const totalSelectable = selectableSections.length

  return (
    <div className="animate-page-enter">
      {/* Hero */}
      <div className="mx-auto max-w-[var(--page-width)] px-6 pt-16 md:px-[var(--page-padding)] md:pt-24">
        <div className="flex items-center gap-2.5">
          <Shield className="size-5 text-[var(--accent)]" strokeWidth={1.5} />
          <span className="text-sm font-medium text-[var(--foreground-muted)]">
            MCP Security Checklist
          </span>
        </div>

        <h1 className="mt-6 text-balance text-4xl font-light leading-[1.15] tracking-tight text-foreground md:text-[48px] md:leading-[64px]">
          An interactive security checklist for the AI tool ecosystem
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--foreground-secondary)] md:text-lg md:leading-relaxed">
          Select the security domains relevant to your deployment. Track your progress
          across {checklistData.totalItems} controls derived from OWASP, SlowMist, and
          recent academic research.
        </p>
      </div>

      {/* Bulk actions */}
      <div className="mx-auto mt-8 flex max-w-[var(--page-width)] items-center gap-3 px-6 md:px-[var(--page-padding)]">
        <Button
          className="min-h-11 rounded-sm text-sm"
          onClick={selectedCount === totalSelectable ? onClearSelection : onSelectAllCore}
          type="button"
          variant="outline"
        >
          {selectedCount === totalSelectable ? 'Clear selection' : 'Select all'}
        </Button>
        {selectedCount > 0 && (
          <span className="text-sm text-[var(--foreground-muted)]">
            {selectedCount} of {totalSelectable} selected
          </span>
        )}
      </div>

      {/* Section list */}
      <ul className="mx-auto mt-12 max-w-[var(--page-width)] space-y-6 px-6 pb-20 md:px-[var(--page-padding)] md:pb-36">
        {selectableSections.map((section) => {
          const isSelected = selectedSectionIds.includes(section.id)
          const sectionItems = section.subsections.flatMap((sub) => sub.items)
          const totalItems = sectionItems.length
          const progress = computeProgress(sectionItems, itemStates)
          const doneCount = sectionItems.filter(
            (item) => isDone(itemStates, item.id),
          ).length

          return (
            <li key={section.id}>
              <button
                aria-pressed={isSelected}
                className="group relative block w-full text-left"
                onClick={() => onToggleSection(section.id)}
                type="button"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className={`text-xl font-normal leading-snug tracking-tight md:text-2xl md:leading-8 ${
                    isSelected ? 'text-foreground' : 'text-[var(--foreground-secondary)]'
                  }`}>
                    {section.number}. {section.title}
                  </h2>
                  <span className={`shrink-0 text-sm tabular-nums ${
                    progress === 100
                      ? 'font-medium text-[var(--progress-complete)]'
                      : 'text-[var(--foreground-muted)]'
                  }`}>
                    {progress === 100 ? 'Completed' : `${doneCount}/${totalItems}`}
                  </span>
                </div>

                {/* Thin progress bar */}
                <div className="mt-3 h-[3px] w-full overflow-hidden rounded-[1px] bg-[var(--progress-track)]">
                  <div
                    className={`h-full transition-all duration-150 ease-in-out ${
                      progress === 100 ? 'bg-[var(--progress-complete)]' : 'bg-[var(--accent)]'
                    }`}
                    style={{ width: `${progress ?? 0}%` }}
                  />
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute -left-5 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--accent)] md:block" />
                )}

                {/* Hover arrow */}
                <ArrowRight
                  className="absolute right-0 top-1/2 size-5 -translate-y-1/2 text-[var(--foreground-muted)] opacity-0 transition-all duration-150 ease-in-out group-hover:-translate-x-0 group-hover:opacity-100 -translate-x-3"
                  strokeWidth={1.5}
                />
              </button>
            </li>
          )
        })}

        {/* Reference-only section 8 */}
        {referenceSection && (
          <li className="opacity-50">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-normal leading-snug tracking-tight text-[var(--foreground-muted)] md:text-2xl md:leading-8">
                {referenceSection.number}. {referenceSection.title}
              </h2>
              <span className="shrink-0 rounded-sm bg-[var(--background-tertiary)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Reference only
              </span>
            </div>
            <div className="mt-3 h-[3px] w-full rounded-[1px] bg-[var(--progress-track)]" />
          </li>
        )}

        {/* Start CTA */}
        <li className="pt-8">
          {selectedCount === 0 ? (
            <p className="text-sm text-[var(--foreground-muted)]">
              Select at least one security domain to begin.
            </p>
          ) : (
            <Button
              className="min-h-14 rounded-sm px-10 text-base font-normal"
              onClick={onStartChecklist}
              type="button"
            >
              Start Checklist ({selectedCount} {selectedCount === 1 ? 'section' : 'sections'})
            </Button>
          )}
        </li>
      </ul>
    </div>
  )
}
