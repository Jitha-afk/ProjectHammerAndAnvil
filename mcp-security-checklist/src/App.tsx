import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Home } from '@/components/layout/Home'
import { Sidebar } from '@/components/layout/Sidebar'
import { SectionList } from '@/components/checklist/SectionList'
import { MilestoneStrip } from '@/components/progress/MilestoneStrip'
import { Toolbar } from '@/components/toolbar/Toolbar'
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isEditingScope, setIsEditingScope] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
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

  const selectedSectionSet = useMemo(
    () => new Set(selectedSectionIds),
    [selectedSectionIds],
  )

  const selectedItems = useMemo(
    () =>
      typedChecklistData.sections
        .filter((section) => selectedSectionSet.has(section.id))
        .flatMap((section) => section.subsections)
        .flatMap((subsection) => subsection.items),
    [selectedSectionSet],
  )

  const navigationSectionIds = useMemo(
    () => typedChecklistData.sections.map((section) => section.id),
    [],
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

  const navigateSection = useCallback(
    (direction: -1 | 1) => {
      const sectionElements = navigationSectionIds
        .map((id) => document.getElementById(`section-${id}`))
        .filter((element): element is HTMLElement => element !== null)

      if (sectionElements.length === 0) {
        return
      }

      const currentIndex = sectionElements.reduce((closestIndex, element, index) => {
        const distance = Math.abs(element.getBoundingClientRect().top - 80)
        const currentClosestDistance = Math.abs(
          sectionElements[closestIndex].getBoundingClientRect().top - 80,
        )

        return distance < currentClosestDistance ? index : closestIndex
      }, 0)

      const nextIndex = Math.min(
        sectionElements.length - 1,
        Math.max(0, currentIndex + direction),
      )

      sectionElements[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [navigationSectionIds],
  )

  useEffect(() => {
    if (showHome) {
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

      if (event.key === '[') {
        event.preventDefault()
        navigateSection(-1)
        return
      }

      if (event.key === ']') {
        event.preventDefault()
        navigateSection(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigateSection, searchQuery, setExpandedItem, setSearch, showHome])

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
  }

  const handleEditScope = () => {
    setIsMobileNavOpen(false)
    setIsEditingScope(true)
  }

  const handleResetConfirmed = () => {
    resetAll()
    setExpandedItem(null)
    setIsResetModalOpen(false)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {showHome ? (
          <Home
            checklistData={typedChecklistData}
            onClearSelection={handleClearScopeSelection}
            onSelectAllCore={handleSelectAllCoreSections}
            onStartChecklist={handleStartChecklist}
            onToggleSection={handleToggleScopeSection}
            selectedSectionIds={selectedSectionIds}
          />
        ) : (
          <>
            <Header
              isDarkMode={isDarkMode}
              onEditScope={handleEditScope}
              onOpenMobileNav={() => setIsMobileNavOpen(true)}
              onToggleDarkMode={toggleDarkMode}
              securedCount={securedCount}
              totalItems={selectedTotalItems}
            />

            <div className="mx-auto flex max-w-[1400px]">
              <Sidebar
                checklistData={typedChecklistData}
                isDarkMode={isDarkMode}
                isMobileOpen={isMobileNavOpen}
                itemStates={itemStates}
                onCloseMobileNav={() => setIsMobileNavOpen(false)}
                onEditScope={handleEditScope}
                onToggleDarkMode={toggleDarkMode}
                securedCount={securedCount}
                selectedSectionIds={selectedSectionIds}
                totalItems={selectedTotalItems}
              />

              <main className="min-h-[calc(100vh-7rem)] flex-1 px-4 py-6 md:px-6">
                <section className="space-y-4" id="main-content">
                  <Toolbar
                    onResetRequested={() => setIsResetModalOpen(true)}
                    searchInputRef={searchInputRef}
                    sections={typedChecklistData.sections}
                  />
                  <MilestoneStrip
                    itemStates={itemStates}
                    items={selectedItems}
                    onMilestoneReached={showToast}
                  />
                  <SectionList
                    checklistData={typedChecklistData}
                    itemStates={itemStates}
                    selectedSectionIds={selectedSectionIds}
                  />
                </section>
              </main>
            </div>

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
