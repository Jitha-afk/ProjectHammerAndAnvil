import type { RefObject } from 'react'
import { useMemo } from 'react'

import { SubSection } from '@/components/checklist/SubSection'
import { CategoryNav } from '@/components/layout/CategoryNav'
import { MilestoneStrip } from '@/components/progress/MilestoneStrip'
import { Toolbar } from '@/components/toolbar/Toolbar'
import { computeProgress, isDone } from '@/lib/progress'
import type { ChecklistData, ItemState, Section } from '@/types'

interface CategoryViewProps {
  checklistData: ChecklistData
  section: Section
  itemStates: Record<string, ItemState>
  selectedSections: Section[]
  onNavigate: (sectionId: string) => void
  onBackToHome: () => void
  onMilestoneReached: (message: string) => void
  searchInputRef: RefObject<HTMLInputElement | null>
  onResetRequested: () => void
  allSelectedItems: { id: string; priority: string }[]
}

export function CategoryView({
  checklistData,
  section,
  itemStates,
  selectedSections,
  onNavigate,
  onBackToHome,
  onMilestoneReached,
  searchInputRef,
  onResetRequested,
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
        <span className="text-sm text-[var(--foreground-muted)]">
          Section {section.number}
        </span>

        <h2 className="mt-2 text-3xl font-light leading-tight tracking-tight text-foreground md:text-[40px] md:leading-[52px]">
          {section.title}
        </h2>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--foreground-secondary)]">
          {section.description}
        </p>

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
          <span className={`text-sm tabular-nums ${
            sectionProgress === 100
              ? 'font-medium text-[var(--progress-complete)]'
              : 'text-[var(--foreground-muted)]'
          }`}>
            {sectionProgress === 100 ? 'Completed' : `${doneCount}/${sectionItems.length}`}
          </span>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mb-6">
        <Toolbar
          onResetRequested={onResetRequested}
          searchInputRef={searchInputRef}
          sections={checklistData.sections}
        />
      </div>

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
