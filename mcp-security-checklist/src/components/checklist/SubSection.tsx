import { computeProgress } from '@/lib/progress'
import { searchItems } from '@/lib/search'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { ItemState, SubSection as SubSectionType } from '@/types'

import { ChecklistItem } from './ChecklistItem'

interface SubSectionProps {
  subSection: SubSectionType
  itemStates: Record<string, ItemState>
}

const priorityRank = {
  CRITICAL: 0,
  HIGH: 1,
  RECOMMENDED: 2,
} as const

export function SubSection({ subSection, itemStates }: SubSectionProps) {
  const searchQuery = useChecklistStore((state) => state.searchQuery)
  const priorityFilter = useChecklistStore((state) => state.priorityFilter)
  const roleFilter = useChecklistStore((state) => state.roleFilter)

  const sortedItems = [...subSection.items].sort(
    (left, right) => priorityRank[left.priority] - priorityRank[right.priority],
  )

  const matchedItemIds = new Set(searchItems(searchQuery, sortedItems))

  const passesPriorityFilter = (priority: 'CRITICAL' | 'HIGH' | 'RECOMMENDED') => {
    if (priorityFilter === 'all') {
      return true
    }

    if (priorityFilter === 'CRITICAL') {
      return priority === 'CRITICAL'
    }

    return priority === 'CRITICAL' || priority === 'HIGH'
  }

  const progress = computeProgress(sortedItems, itemStates)
  const totalItems = sortedItems.length

  return (
    <section id={`subsection-${subSection.id}`}>
      {/* Sticky section title — like the reference site */}
      <header className="sticky top-[6.5rem] z-10 -mx-6 bg-[var(--background)]/95 px-6 py-4 backdrop-blur-sm md:-mx-[var(--page-padding)] md:px-[var(--page-padding)]">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-normal text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
            {subSection.number} {subSection.title}
          </h3>
          <span className={`shrink-0 tabular-nums ${
            progress === 100
              ? 'font-normal text-[var(--progress-complete)]'
              : 'text-[var(--foreground-muted)]'
          }`} style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            {progress === 100 ? 'Completed' : `${totalItems} controls`}
          </span>
        </div>

        {/* Subsection description */}
        {subSection.description && (
          <p className="mt-1.5 max-w-2xl text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            {subSection.description}
          </p>
        )}

        {/* Thin progress bar */}
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-[1px] bg-[var(--progress-track)]">
          <div
            className={`h-full transition-all duration-150 ease-in-out ${
              progress === 100 ? 'bg-[var(--progress-complete)]' : 'bg-[var(--accent)]'
            }`}
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
      </header>

      {/* Checklist items — grid layout with generous gap */}
      <div className="mt-6 grid gap-8">
        {sortedItems.map((item, index) => {
          const isSearchMatch = matchedItemIds.has(item.id)
          const isPriorityMatch = passesPriorityFilter(item.priority)
          const isRoleMatch = roleFilter === 'all' || item.roles.includes(roleFilter)

          return (
            <ChecklistItem
              isDimmed={!isRoleMatch}
              isHidden={!isSearchMatch || !isPriorityMatch}
              isHighlighted={searchQuery.trim().length > 0 && isSearchMatch}
              item={item}
              key={item.id}
              shouldPulse={subSection.number === '1.1' && index === 0}
            />
          )
        })}
      </div>
    </section>
  )
}
