import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CategoryView } from '@/components/layout/CategoryView'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Home } from '@/components/layout/Home'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Modal } from '@/components/ui/Modal'
import { Toast } from '@/components/ui/Toast'
import checklistData from '@/data/checklist.json'
import { isDone } from '@/lib/progress'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { ChecklistData } from '@/types'

const typedChecklistData = checklistData as ChecklistData

const CORE_SECTION_IDS = typedChecklistData.sections
  .filter((section) => section.id !== 'tools')
  .map((section) => section.id)

function App() {
  const [isEditingScope, setIsEditingScope] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const itemStates = useChecklistStore((state) => state.itemStates)
  const isDarkMode = useChecklistStore((state) => state.isDarkMode)
  const toggleDarkMode = useChecklistStore((state) => state.toggleDarkMode)
  const resetAll = useChecklistStore((state) => state.resetAll)
  const setExpandedItem = useChecklistStore((state) => state.setExpandedItem)
  const setSearch = useChecklistStore((state) => state.setSearch)
  const searchQuery = useChecklistStore((state) => state.searchQuery)
  const toastMessage = useChecklistStore((state) => state.toastMessage)
  const showToast = useChecklistStore((state) => state.showToast)
  const selectedSectionIds = useChecklistStore((state) => state.selectedSectionIds)
  const hasCompletedOnboarding = useChecklistStore((state) => state.hasCompletedOnboarding)
  const setSelectedSectionIds = useChecklistStore((state) => state.setSelectedSectionIds)
  const completeOnboarding = useChecklistStore((state) => state.completeOnboarding)

  const showHome = !hasCompletedOnboarding || isEditingScope || selectedSectionIds.length === 0
  const showChecklist = !showHome && activeSectionId !== null

  const selectedSectionSet = useMemo(
    () => new Set(selectedSectionIds),
    [selectedSectionIds],
  )

  const selectedSections = useMemo(
    () => typedChecklistData.sections.filter((section) => selectedSectionSet.has(section.id)),
    [selectedSectionSet],
  )

  const selectedItems = useMemo(
    () =>
      selectedSections
        .flatMap((section) => section.subsections)
        .flatMap((subsection) => subsection.items),
    [selectedSections],
  )

  const activeSection = useMemo(
    () => typedChecklistData.sections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId],
  )

  const securedCount = useMemo(
    () => selectedItems.filter((item) => isDone(itemStates, item.id)).length,
    [selectedItems, itemStates],
  )

  const selectedTotalItems = selectedItems.length

  const latestSavedAt = useMemo(() => {
    const timestamps = Object.values(itemStates)
      .map((itemState) => itemState.updatedAt)
      .filter((updatedAt): updatedAt is string => Boolean(updatedAt))
      .sort((left, right) => right.localeCompare(left))

    return timestamps[0] ?? null
  }, [itemStates])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleNavigateSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId)
    setExpandedItem(null)
    setSearch('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setExpandedItem, setSearch])

  // Keyboard shortcuts for checklist view
  useEffect(() => {
    if (!showChecklist) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

      if ((event.key === '/' && !isTypingTarget) || (event.ctrlKey && event.key.toLowerCase() === 'k')) {
        event.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (event.key === 'Escape') {
        setExpandedItem(null)
        if (searchQuery) {
          setSearch('')
        }
        return
      }

      if (isTypingTarget) {
        return
      }

      // Navigate between sections with [ and ]
      if (event.key === '[' || event.key === ']') {
        event.preventDefault()
        const currentIndex = selectedSections.findIndex((s) => s.id === activeSectionId)
        if (currentIndex === -1) {
          return
        }
        const direction = event.key === '[' ? -1 : 1
        const nextIndex = Math.min(selectedSections.length - 1, Math.max(0, currentIndex + direction))
        if (nextIndex !== currentIndex) {
          handleNavigateSection(selectedSections[nextIndex].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showChecklist, activeSectionId, selectedSections, searchQuery, setExpandedItem, setSearch, handleNavigateSection])

  const handleToggleScopeSection = (sectionId: string) => {
    const nextSelection = selectedSectionIds.includes(sectionId)
      ? selectedSectionIds.filter((id) => id !== sectionId)
      : [...selectedSectionIds, sectionId]

    setSelectedSectionIds(nextSelection)
  }

  const handleSelectAllCoreSections = () => {
    setSelectedSectionIds(CORE_SECTION_IDS)
  }

  const handleClearScopeSelection = () => {
    setSelectedSectionIds([])
  }

  const handleStartChecklist = () => {
    completeOnboarding(selectedSectionIds)
    setIsEditingScope(false)
    // Navigate to first selected section
    if (selectedSectionIds.length > 0) {
      const firstSelected = typedChecklistData.sections.find(
        (section) => selectedSectionIds.includes(section.id),
      )
      if (firstSelected) {
        setActiveSectionId(firstSelected.id)
      }
    }
  }

  const handleEditScope = () => {
    setActiveSectionId(null)
    setIsEditingScope(true)
  }

  const handleBackToHome = () => {
    setActiveSectionId(null)
    setIsEditingScope(true)
  }

  const handleResetConfirmed = () => {
    resetAll()
    setExpandedItem(null)
    setIsResetModalOpen(false)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--background)] text-foreground">
        {showHome ? (
          <Home
            checklistData={typedChecklistData}
            itemStates={itemStates}
            onClearSelection={handleClearScopeSelection}
            onSelectAllCore={handleSelectAllCoreSections}
            onStartChecklist={handleStartChecklist}
            onToggleSection={handleToggleScopeSection}
            selectedSectionIds={selectedSectionIds}
          />
        ) : (
          <>
            <Header
              activeSectionTitle={activeSection?.title ?? null}
              isDarkMode={isDarkMode}
              onEditScope={handleEditScope}
              onToggleDarkMode={toggleDarkMode}
              securedCount={securedCount}
              totalItems={selectedTotalItems}
            />

            {/* Single-column reading layout — no sidebar */}
            <main className="mx-auto max-w-[var(--page-width)] px-6 pb-20 pt-8 md:px-[var(--page-padding)] md:pb-36">
              {activeSection ? (
                <CategoryView
                  allSelectedItems={selectedItems}
                  checklistData={typedChecklistData}
                  itemStates={itemStates}
                  onBackToHome={handleBackToHome}
                  onMilestoneReached={showToast}
                  onNavigate={handleNavigateSection}
                  onResetRequested={() => setIsResetModalOpen(true)}
                  searchInputRef={searchInputRef}
                  section={activeSection}
                  selectedSections={selectedSections}
                />
              ) : (
                <div className="flex min-h-[50vh] items-center justify-center">
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Select a section to begin.
                  </p>
                </div>
              )}
            </main>

            <Modal
              confirmLabel="Reset all"
              description="This clears all item statuses and notes."
              isOpen={isResetModalOpen}
              onCancel={() => setIsResetModalOpen(false)}
              onConfirm={handleResetConfirmed}
              title="Reset checklist progress?"
            />
          </>
        )}

        <Footer lastSavedAt={latestSavedAt} version={checklistData.version} />
        <Toast message={toastMessage} onDismiss={() => showToast(null)} />
      </div>
    </ErrorBoundary>
  )
}

export default App
