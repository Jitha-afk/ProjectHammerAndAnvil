import { useEffect } from 'react'

import { Section } from '@/components/checklist/Section'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { ChecklistData, ItemState } from '@/types'

interface SectionListProps {
  checklistData: ChecklistData
  itemStates: Record<string, ItemState>
  selectedSectionIds: string[]
}

const QUICK_WIN_ITEM_ID = 'srv-api-001'

export function SectionList({
  checklistData,
  itemStates,
  selectedSectionIds,
}: SectionListProps) {
  const expandedItemId = useChecklistStore((state) => state.expandedItemId)
  const setExpandedItem = useChecklistStore((state) => state.setExpandedItem)

  useEffect(() => {
    if (expandedItemId) {
      return
    }

    setExpandedItem(QUICK_WIN_ITEM_ID)
  }, [expandedItemId, setExpandedItem])

  return (
    <div className="space-y-8">
      {checklistData.sections.map((section) => (
        <Section
          isInScope={section.id === 'tools' || selectedSectionIds.includes(section.id)}
          itemStates={itemStates}
          key={section.id}
          section={section}
        />
      ))}
    </div>
  )
}