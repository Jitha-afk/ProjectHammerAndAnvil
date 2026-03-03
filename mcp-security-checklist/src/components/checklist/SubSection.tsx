import { ProgressBar } from '@/components/progress/ProgressBar'
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

  return (
    <section className="space-y-3" id={`subsection-${subSection.id}`}>
      <header className="rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-foreground">
            {subSection.number} {subSection.title}
          </h4>
          <p className="text-xs text-muted-foreground">{sortedItems.length} items</p>
        </div>
        <div className="mt-2">
          <ProgressBar label={`${subSection.title} subsection progress`} size="thin" value={progress} />
        </div>
      </header>

      <div className="space-y-2">
        {sortedItems.map((item, index) => {
          const isSearchMatch = matchedItemIds.has(item.id)
          const isPriorityMatch = passesPriorityFilter(item.priority)
          const isRoleMatch = roleFilter === 'all' || item.roles.includes(roleFilter)

          return (
          <ChecklistItem
            item={item}
            isDimmed={!isRoleMatch}
            isHidden={!isSearchMatch || !isPriorityMatch}
            isHighlighted={searchQuery.trim().length > 0 && isSearchMatch}
            key={item.id}
            shouldPulse={subSection.number === '1.1' && index === 0}
          />
          )
        })}
      </div>
    </section>
  )
}