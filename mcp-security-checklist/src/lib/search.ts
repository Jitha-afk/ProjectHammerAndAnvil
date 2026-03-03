import type { ChecklistItem } from '@/types'

export function searchItems(query: string, items: ChecklistItem[]): string[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return items.map((item) => item.id)
  }

  return items
    .filter((item) => {
      const searchableText = [item.title, item.description, ...item.tags]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
    .map((item) => item.id)
}