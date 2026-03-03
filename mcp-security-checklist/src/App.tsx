import { useEffect, useMemo, useState } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { SectionList } from '@/components/checklist/SectionList'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import checklistData from '@/data/checklist.json'
import { isDone } from '@/lib/progress'
import { useChecklistStore } from '@/store/useChecklistStore'

function App() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const itemStates = useChecklistStore((state) => state.itemStates)
  const isDarkMode = useChecklistStore((state) => state.isDarkMode)
  const toggleDarkMode = useChecklistStore((state) => state.toggleDarkMode)

  const allItems = useMemo(
    () =>
      checklistData.sections
        .filter((section) => section.id !== 'tools')
        .flatMap((section) => section.subsections)
        .flatMap((subsection) => subsection.items),
    [],
  )

  const securedCount = useMemo(
    () => allItems.filter((item) => isDone(itemStates, item.id)).length,
    [allItems, itemStates],
  )

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <Header
          isDarkMode={isDarkMode}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onToggleDarkMode={toggleDarkMode}
          securedCount={securedCount}
          totalItems={checklistData.totalItems}
        />

        <div className="mx-auto flex max-w-[1400px]">
          <Sidebar
            checklistData={checklistData}
            isDarkMode={isDarkMode}
            isMobileOpen={isMobileNavOpen}
            itemStates={itemStates}
            onCloseMobileNav={() => setIsMobileNavOpen(false)}
            onToggleDarkMode={toggleDarkMode}
            securedCount={securedCount}
            totalItems={checklistData.totalItems}
          />

          <main className="min-h-[calc(100vh-7rem)] flex-1 px-4 py-6 md:px-6">
            <section className="space-y-4" id="main-content">
              <SectionList checklistData={checklistData} itemStates={itemStates} />
            </section>
          </main>
        </div>

        <Footer lastSavedAt={latestSavedAt} version={checklistData.version} />
      </div>
    </ErrorBoundary>
  )
}

export default App
