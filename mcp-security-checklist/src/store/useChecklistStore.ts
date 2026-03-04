import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { ItemState, ItemStatus, Role } from '@/types'

type PriorityFilter = 'all' | 'CRITICAL' | 'HIGH+'

interface ChecklistStore {
  itemStates: Record<string, ItemState>
  isDarkMode: boolean
  selectedSectionIds: string[]
  hasCompletedOnboarding: boolean

  toggleItem: (id: string) => void
  setNote: (id: string, note: string) => void
  resetAll: () => void
  importStates: (states: Record<string, ItemState>) => void
  setSelectedSectionIds: (ids: string[]) => void
  completeOnboarding: (ids: string[]) => void

  expandedSections: Record<string, boolean>
  expandedItemId: string | null
  priorityFilter: PriorityFilter
  roleFilter: Role | 'all'
  searchQuery: string
  toastMessage: string | null

  toggleSection: (id: string) => void
  expandSections: (ids: string[]) => void
  collapseSections: (ids: string[]) => void
  setExpandedItem: (id: string | null) => void
  setPriorityFilter: (filter: PriorityFilter) => void
  setRoleFilter: (role: Role | 'all') => void
  setSearch: (query: string) => void
  toggleDarkMode: () => void
  showToast: (message: string | null) => void
}

const STORAGE_KEY = 'mcp-checklist-v1'

function getNextStatus(current: ItemStatus): ItemStatus {
  if (current === 'unchecked') {
    return 'checked'
  }

  if (current === 'checked') {
    return 'na'
  }

  return 'unchecked'
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      itemStates: {},
      isDarkMode: false,
      selectedSectionIds: [],
      hasCompletedOnboarding: false,

      toggleItem: (id) =>
        set((state) => {
          const currentStatus = state.itemStates[id]?.status ?? 'unchecked'
          const nextStatus = getNextStatus(currentStatus)

          return {
            itemStates: {
              ...state.itemStates,
              [id]: {
                status: nextStatus,
                note: state.itemStates[id]?.note,
                updatedAt: new Date().toISOString(),
              },
            },
          }
        }),

      setNote: (id, note) =>
        set((state) => ({
          itemStates: {
            ...state.itemStates,
            [id]: {
              status: state.itemStates[id]?.status ?? 'unchecked',
              note,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      resetAll: () =>
        set({
          itemStates: {},
        }),

      importStates: (states) =>
        set({
          itemStates: states,
        }),

      setSelectedSectionIds: (ids) =>
        set({
          selectedSectionIds: ids,
        }),

      completeOnboarding: (ids) =>
        set({
          selectedSectionIds: ids,
          hasCompletedOnboarding: true,
        }),

      expandedSections: {
        'mcp-server': true,
      },
      expandedItemId: null,
      priorityFilter: 'all',
      roleFilter: 'all',
      searchQuery: '',
      toastMessage: null,

      toggleSection: (id) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [id]: !state.expandedSections[id],
          },
        })),

      expandSections: (ids) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            ...Object.fromEntries(ids.map((id) => [id, true])),
          },
        })),

      collapseSections: (ids) =>
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            ...Object.fromEntries(ids.map((id) => [id, false])),
          },
        })),

      setExpandedItem: (id) =>
        set({
          expandedItemId: id,
        }),

      setPriorityFilter: (filter) =>
        set({
          priorityFilter: filter,
        }),

      setRoleFilter: (role) =>
        set({
          roleFilter: role,
        }),

      setSearch: (query) =>
        set({
          searchQuery: query,
        }),

      toggleDarkMode: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      showToast: (message) =>
        set({
          toastMessage: message,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        itemStates: state.itemStates,
        isDarkMode: state.isDarkMode,
        selectedSectionIds: state.selectedSectionIds,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
)