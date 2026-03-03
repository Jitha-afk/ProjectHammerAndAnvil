import { Bot, Brain, ChevronDown, Monitor, Network, Scale, Shield, Wallet, Wrench } from 'lucide-react'

import { ProgressBar } from '@/components/progress/ProgressBar'
import { computeProgress } from '@/lib/progress'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { ItemState, Section as SectionType } from '@/types'

import { SubSection } from './SubSection'

interface SectionProps {
  section: SectionType
  itemStates: Record<string, ItemState>
}

const iconMap = {
  Shield,
  Monitor,
  Network,
  Bot,
  Brain,
  Scale,
  Wallet,
  Wrench,
} as const

export function Section({ section, itemStates }: SectionProps) {
  const expandedSections = useChecklistStore((state) => state.expandedSections)
  const toggleSection = useChecklistStore((state) => state.toggleSection)

  const sectionItems = section.subsections.flatMap((subSection) => subSection.items)
  const sectionProgress =
    section.id === 'tools' ? null : computeProgress(sectionItems, itemStates)

  const isExpanded = expandedSections[section.id] ?? false
  const Icon = iconMap[section.icon as keyof typeof iconMap] ?? Shield
  const contentId = `section-content-${section.id}`

  return (
    <section className="space-y-3" id={`section-${section.id}`}>
      <header className={`z-10 rounded-md border border-border bg-background/95 ${isExpanded ? 'sticky top-16' : ''}`}>
        <button
          aria-controls={contentId}
          aria-expanded={isExpanded}
          className="flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left"
          onClick={() => toggleSection(section.id)}
          type="button"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Icon className="size-4 shrink-0" />
            <p className="truncate text-sm font-semibold text-foreground">
              {section.number}. {section.title}
            </p>
          </div>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {section.id !== 'tools' && (
          <div className="border-t border-border px-3 pb-3 pt-2">
            <ProgressBar label={`${section.title} section progress`} size="medium" value={sectionProgress} />
            <p className="mt-1 text-xs text-muted-foreground">
              {sectionProgress === null ? 'N/A' : `${sectionProgress}%`} · {sectionItems.length} items
            </p>
          </div>
        )}
      </header>

      {isExpanded && (
        <div className="space-y-5 pl-2 md:pl-6" id={contentId}>
          {section.id === 'tools' ? (
            <div className="rounded-md border border-border bg-card/40 p-4 text-sm text-muted-foreground">
              <p>{section.description}</p>
              <p className="mt-2">Reference-only section: no checklist items or progress tracking.</p>
            </div>
          ) : (
            section.subsections.map((subSection) => (
              <SubSection
                itemStates={itemStates}
                key={subSection.id}
                subSection={subSection}
              />
            ))
          )}
        </div>
      )}
    </section>
  )
}