import type { ItemState, SavedState } from '@/types'

export const CHECKLIST_STORAGE_KEY = 'mcp-checklist-v1'
export const STATE_SCHEMA_VERSION = 1

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeItemState(value: unknown): ItemState | null {
  if (!isObject(value)) {
    return null
  }

  const status = value.status
  if (status !== 'unchecked' && status !== 'checked' && status !== 'na') {
    return null
  }

  const note = typeof value.note === 'string' ? value.note : undefined
  const updatedAt = typeof value.updatedAt === 'string' ? value.updatedAt : undefined

  return {
    status,
    note,
    updatedAt,
  }
}

function normalizeItems(value: unknown): Record<string, ItemState> {
  if (!isObject(value)) {
    return {}
  }

  const normalizedEntries = Object.entries(value)
    .map(([id, itemState]) => [id, normalizeItemState(itemState)] as const)
    .filter((entry): entry is readonly [string, ItemState] => entry[1] !== null)

  return Object.fromEntries(normalizedEntries)
}

function createDefaultSavedState(contentVersion: string): SavedState {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    contentVersion,
    savedAt: new Date().toISOString(),
    items: {},
  }
}

export function migrateState(saved: unknown, currentContentVersion: string): SavedState {
  if (!isObject(saved)) {
    return createDefaultSavedState(currentContentVersion)
  }

  const items = normalizeItems(saved.items)

  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    contentVersion: currentContentVersion,
    savedAt:
      typeof saved.savedAt === 'string' ? saved.savedAt : new Date().toISOString(),
    items,
  }
}

export interface SavedStateReadResult {
  savedState: SavedState | null
  hadCorruption: boolean
}

export function readAndMigrateSavedState(
  currentContentVersion: string,
): SavedStateReadResult {
  if (typeof window === 'undefined') {
    return {
      savedState: null,
      hadCorruption: false,
    }
  }

  const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY)
  if (!raw) {
    return {
      savedState: null,
      hadCorruption: false,
    }
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    const migrated = migrateState(parsed, currentContentVersion)

    return {
      savedState: migrated,
      hadCorruption: false,
    }
  } catch {
    window.localStorage.removeItem(CHECKLIST_STORAGE_KEY)

    return {
      savedState: null,
      hadCorruption: true,
    }
  }
}