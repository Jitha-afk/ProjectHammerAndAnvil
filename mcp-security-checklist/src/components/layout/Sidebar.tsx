import { Download, Upload } from 'lucide-react'

import { ProgressBar } from '@/components/progress/ProgressBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { computeProgress } from '@/lib/progress'
import type { ChecklistData, ItemState } from '@/types'

interface SidebarProps {
  checklistData: ChecklistData
  itemStates: Record<string, ItemState>
  totalItems: number
  securedCount: number
  selectedSectionIds: string[]
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onEditScope: () => void
  isMobileOpen: boolean
  onCloseMobileNav: () => void
}

function SidebarContent({
  checklistData,
  itemStates,
  totalItems,
  securedCount,
  selectedSectionIds,
  isDarkMode,
  onToggleDarkMode,
  onEditScope,
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">Global progress</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm font-medium text-foreground">
            {securedCount}/{totalItems} controls
          </p>
          <div className="mt-2">
            <ProgressBar label="Global checklist progress" size="sidebar" value={globalProgress} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{globalProgress}% complete</p>
        </CardContent>
      </Card>

      <nav aria-label="Section navigation" className="space-y-2">
        {checklistData.sections.map((section) => {
          const isReferenceOnly = section.id === 'tools'
          const isInScope = isReferenceOnly || selectedSectionIds.includes(section.id)
          const sectionItems = section.subsections.flatMap((subSection) => subSection.items)
          const progressValue =
            isReferenceOnly || !isInScope
              ? null
              : computeProgress(sectionItems, itemStates)

          return (
            <Card className={cn(!isInScope && 'opacity-60')} key={section.id}>
              <Button asChild className="h-auto w-full justify-start p-0" variant="ghost">
                <a className="block p-2 text-left" href={`#section-${section.id}`}>
                  <p className="text-sm font-medium text-foreground">{section.number}. {section.title}</p>
                  {isReferenceOnly ? (
                    <p className="mt-1 text-xs text-muted-foreground">Reference only</p>
                  ) : !isInScope ? (
                    <p className="mt-1 text-xs font-medium text-muted-foreground">Not in scope</p>
                  ) : (
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
              </Button>
            </Card>
          )
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <Button
          className="min-h-11 w-full"
          onClick={onEditScope}
          type="button"
          variant="outline"
        >
          Edit scope
        </Button>
        <Button
          className="min-h-11 w-full"
          type="button"
          variant="outline"
        >
          <Download className="size-4" />
          Export JSON
        </Button>
        <Button
          className="min-h-11 w-full"
          type="button"
          variant="outline"
        >
          <Upload className="size-4" />
          Import JSON
        </Button>
        <Button
          className="min-h-11 w-full"
          onClick={onToggleDarkMode}
          type="button"
          variant="outline"
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>
      </div>
    </div>
  )
}

export function Sidebar({
  checklistData,
  itemStates,
  totalItems,
  securedCount,
  selectedSectionIds,
  isDarkMode,
  onToggleDarkMode,
  onEditScope,
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
          onEditScope={onEditScope}
          onToggleDarkMode={onToggleDarkMode}
          selectedSectionIds={selectedSectionIds}
          securedCount={securedCount}
          totalItems={totalItems}
        />
      </aside>

      <Sheet onOpenChange={(isOpen) => !isOpen && onCloseMobileNav()} open={isMobileOpen}>
        <SheetContent className="w-[280px] border-r border-border p-0 md:hidden" showCloseButton side="left">
          <SidebarContent
            checklistData={checklistData}
            isDarkMode={isDarkMode}
            itemStates={itemStates}
            onEditScope={onEditScope}
            onToggleDarkMode={onToggleDarkMode}
            selectedSectionIds={selectedSectionIds}
            securedCount={securedCount}
            totalItems={totalItems}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}