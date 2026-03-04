import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AppSidebar } from '@/components/app-sidebar'
import { CategoryView } from '@/components/layout/CategoryView'
import { Footer } from '@/components/layout/Footer'
import { Home } from '@/components/layout/Home'
import { TopNav } from '@/components/layout/TopNav'
import { AboutPage } from '@/components/pages/AboutPage'
import { SharePage } from '@/components/pages/SharePage'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Modal } from '@/components/ui/Modal'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toast } from '@/components/ui/Toast'
import checklistData from '@/data/checklist.json'
import { isDone } from '@/lib/progress'
import { useHashRoute } from '@/lib/router'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { ChecklistData } from '@/types'

const typedChecklistData = checklistData as ChecklistData

const CORE_SECTION_IDS = typedChecklistData.sections
  .filter((section) => section.id !== 'tools')
  .map((section) => section.id)

function App() {
  const { route, navigate } = useHashRoute()
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

  const effectiveActiveSectionId = useMemo(() => {
    if (activeSectionId !== null) {
      return activeSectionId
    }

    if (route === '/checklist' && hasCompletedOnboarding && selectedSectionIds.length > 0) {
      const firstSelected = typedChecklistData.sections.find(
        (section) => selectedSectionIds.includes(section.id),
      )
      return firstSelected?.id ?? null
    }

    return null
  }, [activeSectionId, route, hasCompletedOnboarding, selectedSectionIds])

  const showHome = route === '/' || isEditingScope || !hasCompletedOnboarding || selectedSectionIds.length === 0
  const showChecklist = !showHome && route === '/checklist' && effectiveActiveSectionId !== null

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
    () => typedChecklistData.sections.find((section) => section.id === effectiveActiveSectionId) ?? null,
    [effectiveActiveSectionId],
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

      if (event.key === '[' || event.key === ']') {
        event.preventDefault()
        const currentIndex = selectedSections.findIndex((section) => section.id === effectiveActiveSectionId)
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
  }, [showChecklist, effectiveActiveSectionId, selectedSections, searchQuery, setExpandedItem, setSearch, handleNavigateSection])

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

    if (selectedSectionIds.length > 0) {
      const firstSelected = typedChecklistData.sections.find(
        (section) => selectedSectionIds.includes(section.id),
      )

      if (firstSelected) {
        setActiveSectionId(firstSelected.id)
        navigate('/checklist')
        window.scrollTo({ top: 0 })
        requestAnimationFrame(() => window.scrollTo({ top: 0 }))
      }
    }
  }

  const handleStartChecklistAtSection = (sectionId: string) => {
    completeOnboarding(selectedSectionIds)
    setIsEditingScope(false)
    setActiveSectionId(sectionId)
    navigate('/checklist')
    window.scrollTo({ top: 0 })
    requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }

  const handleEditScope = () => {
    setActiveSectionId(null)
    setIsEditingScope(true)
    navigate('/')
    window.scrollTo({ top: 0 })
  }

  const handleBackToHome = () => {
    setActiveSectionId(null)
    navigate('/')
    window.scrollTo({ top: 0 })
  }

  const handleResetConfirmed = () => {
    resetAll()
    setExpandedItem(null)
    setIsResetModalOpen(false)
  }

  const renderContent = () => {
    if (route === '/about') {
      return <AboutPage />
    }

    if (route === '/share') {
      return <SharePage />
    }

    if (showHome) {
      return (
        <Home
          checklistData={typedChecklistData}
          hasCompletedOnboarding={hasCompletedOnboarding}
          itemStates={itemStates}
          onClearSelection={handleClearScopeSelection}
          onNavigateSection={handleStartChecklistAtSection}
          onSelectAllCore={handleSelectAllCoreSections}
          onStartChecklist={handleStartChecklist}
          onToggleSection={handleToggleScopeSection}
          selectedSectionIds={selectedSectionIds}
        />
      )
    }

    return (
      <>
        {activeSection ? (
          <SidebarProvider defaultOpen>
            <AppSidebar
              activeSectionId={activeSection.id}
              onNavigate={handleNavigateSection}
              onResetRequested={() => setIsResetModalOpen(true)}
              searchInputRef={searchInputRef}
              sections={selectedSections}
            />

            <SidebarInset className="bg-[var(--background)]">
              <main className="mx-auto w-full max-w-[var(--page-width)] px-6 pb-20 pt-8 md:px-[var(--page-padding)] md:pb-36">
                <div className="mb-4 md:hidden">
                  <SidebarTrigger className="rounded-sm" />
                </div>

                <CategoryView
                  allSelectedItems={selectedItems}
                  itemStates={itemStates}
                  onBackToHome={handleBackToHome}
                  onMilestoneReached={showToast}
                  onNavigate={handleNavigateSection}
                  section={activeSection}
                  selectedSections={selectedSections}
                />
              </main>
            </SidebarInset>
          </SidebarProvider>
        ) : (
          <main className="mx-auto max-w-[var(--page-width)] px-6 pb-20 pt-8 md:px-[var(--page-padding)] md:pb-36">
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                Select a section to begin.
              </p>
            </div>
          </main>
        )}

        <Modal
          confirmLabel="Reset all"
          description="This clears all item statuses and notes."
          isOpen={isResetModalOpen}
          onCancel={() => setIsResetModalOpen(false)}
          onConfirm={handleResetConfirmed}
          title="Reset checklist progress?"
        />
      </>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--background)] text-foreground">
        <TopNav
          checklistContext={showChecklist ? {
            activeSectionTitle: activeSection?.title ?? null,
            securedCount,
            totalItems: selectedTotalItems,
            onEditScope: handleEditScope,
          } : undefined}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {renderContent()}

        <Footer lastSavedAt={latestSavedAt} version={checklistData.version} />
        <Toast message={toastMessage} onDismiss={() => showToast(null)} />
      </div>
    </ErrorBoundary>
  )
}

export default App
