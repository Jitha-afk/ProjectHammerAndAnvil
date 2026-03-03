import { Download, Upload, X } from 'lucide-react'

import { ProgressBar } from '@/components/progress/ProgressBar'
import { computeProgress } from '@/lib/progress'
import type { ChecklistData, ItemState } from '@/types'

interface SidebarProps {
  checklistData: ChecklistData
  itemStates: Record<string, ItemState>
  totalItems: number
  securedCount: number
  isDarkMode: boolean
  onToggleDarkMode: () => void
  isMobileOpen: boolean
  onCloseMobileNav: () => void
}

function SidebarContent({
  checklistData,
  itemStates,
  totalItems,
  securedCount,
  isDarkMode,
  onToggleDarkMode,
}: Omit<SidebarProps, 'isMobileOpen' | 'onCloseMobileNav'>) {
  const globalProgress = totalItems === 0
    ? 0
    : Math.round((securedCount / totalItems) * 100)

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <div>
        <h1 className="text-base font-semibold text-foreground">MCP Security Checklist</h1>
        <p className="mt-1 text-xs text-muted-foreground">Version {checklistData.version}</p>
      </div>

      <section className="rounded-md border border-border p-3">
        <p className="text-xs text-muted-foreground">Global progress</p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {securedCount}/{totalItems} controls
        </p>
        <div className="mt-2">
          <ProgressBar label="Global checklist progress" size="sidebar" value={globalProgress} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{globalProgress}% complete</p>
      </section>

      <nav aria-label="Section navigation" className="space-y-2">
        {checklistData.sections.map((section) => {
          const sectionItems = section.subsections.flatMap((subSection) => subSection.items)
          const progressValue =
            section.id === 'tools'
              ? null
              : computeProgress(sectionItems, itemStates)

          return (
            <a
              className="block rounded-md border border-border p-2 hover:bg-muted/40"
              href={`#section-${section.id}`}
              key={section.id}
            >
              <p className="text-sm font-medium text-foreground">{section.number}. {section.title}</p>
              {section.id !== 'tools' && (
                <>
                  <div className="mt-2">
                    <ProgressBar
                      label={`${section.title} progress`}
                      size="thin"
                      value={progressValue}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {progressValue === null ? 'N/A' : `${progressValue}%`}
                  </p>
                </>
              )}
            </a>
          )
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border px-3 text-sm"
          type="button"
        >
          <Download className="size-4" />
          Export JSON
        </button>
        <button
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border px-3 text-sm"
          type="button"
        >
          <Upload className="size-4" />
          Import JSON
        </button>
        <button
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border px-3 text-sm"
          onClick={onToggleDarkMode}
          type="button"
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </div>
  )
}

export function Sidebar({
  checklistData,
  itemStates,
  totalItems,
  securedCount,
  isDarkMode,
  onToggleDarkMode,
  isMobileOpen,
  onCloseMobileNav,
}: SidebarProps) {
  return (
    <>
      <aside className="hidden h-[calc(100vh-3.5rem)] w-60 border-r border-border md:block">
        <SidebarContent
          checklistData={checklistData}
          isDarkMode={isDarkMode}
          itemStates={itemStates}
          onToggleDarkMode={onToggleDarkMode}
          securedCount={securedCount}
          totalItems={totalItems}
        />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" role="presentation">
          <aside className="h-full w-[280px] border-r border-border bg-background">
            <div className="flex h-14 items-center justify-end border-b border-border px-2">
              <button
                aria-label="Close navigation"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border"
                onClick={onCloseMobileNav}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
            <SidebarContent
              checklistData={checklistData}
              isDarkMode={isDarkMode}
              itemStates={itemStates}
              onToggleDarkMode={onToggleDarkMode}
              securedCount={securedCount}
              totalItems={totalItems}
            />
          </aside>
        </div>
      )}
    </>
  )
}