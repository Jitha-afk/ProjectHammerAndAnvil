import type { ChecklistItem, ItemState } from '@/types'

export type Milestone = 'none' | 'baseline' | 'hardened' | 'comprehensive'

export function computeProgress(
  items: ChecklistItem[],
  states: Record<string, ItemState>,
): number | null {
  const applicableItems = items.filter((item) => states[item.id]?.status !== 'na')

  if (applicableItems.length === 0) {
    return null
  }

  const completedCount = applicableItems.filter(
    (item) => states[item.id]?.status === 'checked',
  ).length

  return Math.round((completedCount / applicableItems.length) * 100)
}

export function isDone(states: Record<string, ItemState>, id: string): boolean {
  const status = states[id]?.status
  return status === 'checked' || status === 'na'
}

function allDone(
  states: Record<string, ItemState>,
  items: ChecklistItem[],
): boolean {
  if (items.length === 0) {
    return false
  }

  return items.every((item) => isDone(states, item.id))
}

export function getMilestone(
  states: Record<string, ItemState>,
  allItems: ChecklistItem[],
): Milestone {
  const criticalItems = allItems.filter((item) => item.priority === 'CRITICAL')
  const hardenedItems = allItems.filter((item) => item.priority !== 'RECOMMENDED')

  if (allDone(states, allItems)) {
    return 'comprehensive'
  }

  if (allDone(states, hardenedItems)) {
    return 'hardened'
  }

  if (allDone(states, criticalItems)) {
    return 'baseline'
  }

  return 'none'
}