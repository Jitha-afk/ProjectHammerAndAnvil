import { useMemo } from 'react'

import { SubSection } from '@/components/checklist/SubSection'
import { CategoryNav } from '@/components/layout/CategoryNav'
import { MilestoneStrip } from '@/components/progress/MilestoneStrip'
import { computeProgress, isDone } from '@/lib/progress'
import type { ItemState, Section } from '@/types'

interface CategoryViewProps {
  section: Section
  itemStates: Record<string, ItemState>
  selectedSections: Section[]
  onNavigate: (sectionId: string) => void
  onBackToHome: () => void
  onMilestoneReached: (message: string) => void
  allSelectedItems: { id: string; priority: string }[]
}

export function CategoryView({
  section,
  itemStates,
  selectedSections,
  onNavigate,
  onBackToHome,
  onMilestoneReached,
  allSelectedItems,
}: CategoryViewProps) {
  const sectionItems = useMemo(
    () => section.subsections.flatMap((sub) => sub.items),
    [section],
  )
  const sectionProgress = computeProgress(sectionItems, itemStates)
  const doneCount = sectionItems.filter((item) => isDone(itemStates, item.id)).length

  return (
    <div className="animate-page-enter">
      {/* Section title */}
      <header className="mb-12">
        <span className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
          Section {section.number}
        </span>

        <h2 className="mt-2 font-light text-foreground" style={{ fontSize: 'var(--font-size-display)', lineHeight: 'var(--line-height-display)' }}>
          {section.title}
        </h2>

        <p className="mt-3 max-w-2xl text-[var(--foreground-secondary)]" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
          {section.description}
        </p>

        {/* Why it matters callout */}
        {section.whyItMatters && (
          <div className="mt-4 border-l-2 border-[var(--accent)] pl-4">
            <p className="italic text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
              {section.whyItMatters}
            </p>
          </div>
        )}

        {/* Section progress */}
        <div className="mt-5 flex items-center gap-4">
          <div className="h-[3px] max-w-xs flex-1 overflow-hidden rounded-[1px] bg-[var(--progress-track)]">
            <div
              className={`h-full transition-all duration-150 ease-in-out ${
                sectionProgress === 100 ? 'bg-[var(--progress-complete)]' : 'bg-[var(--accent)]'
              }`}
              style={{ width: `${sectionProgress ?? 0}%` }}
            />
          </div>
          <span className={`tabular-nums ${
            sectionProgress === 100
              ? 'font-normal text-[var(--progress-complete)]'
              : 'text-[var(--foreground-muted)]'
          }`} style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            {sectionProgress === 100 ? 'Completed' : `${doneCount}/${sectionItems.length}`}
          </span>
        </div>
      </header>

      {/* Milestones — scoped to ALL selected items across sections */}
      <div className="mb-10">
        <MilestoneStrip
          itemStates={itemStates}
          items={allSelectedItems as import('@/types').ChecklistItem[]}
          onMilestoneReached={onMilestoneReached}
        />
      </div>

      {/* Subsections */}
      <div className="space-y-8">
        {section.subsections.map((subSection) => (
          <SubSection
            itemStates={itemStates}
            key={subSection.id}
            subSection={subSection}
          />
        ))}
      </div>

      {/* Prev / Next navigation */}
      <CategoryNav
        currentSectionId={section.id}
        onBackToHome={onBackToHome}
        onNavigate={onNavigate}
        sections={selectedSections}
      />
    </div>
  )
}
