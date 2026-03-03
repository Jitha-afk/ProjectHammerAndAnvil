import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChecklistData } from '@/types'

interface HomeProps {
  checklistData: ChecklistData
  selectedSectionIds: string[]
  onToggleSection: (sectionId: string) => void
  onSelectAllCore: () => void
  onClearSelection: () => void
  onStartChecklist: () => void
}

export function Home({
  checklistData,
  selectedSectionIds,
  onToggleSection,
  onSelectAllCore,
  onClearSelection,
  onStartChecklist,
}: HomeProps) {
  const selectableSections = checklistData.sections.filter((section) => section.id !== 'tools')

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <div className="space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            MCP Security Checklist
          </p>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
            Choose your checklist scope
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Select one or more sections to define what counts toward your progress and completion.
            You can edit scope later without losing saved item states.
          </p>
        </header>

        <section aria-label="Checklist scope selection" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              className="min-h-11"
              onClick={onSelectAllCore}
              type="button"
              variant="outline"
            >
              Select all core sections
            </Button>
            <Button
              className="min-h-11"
              onClick={onClearSelection}
              type="button"
              variant="outline"
            >
              Clear selection
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {selectableSections.map((section) => {
              const isSelected = selectedSectionIds.includes(section.id)

              return (
                <Card
                  className={isSelected ? 'border-foreground bg-accent/10' : 'bg-card/40'}
                  key={section.id}
                >
                  <button
                    aria-pressed={isSelected}
                    className="min-h-11 w-full rounded-md p-4 text-left"
                    onClick={() => onToggleSection(section.id)}
                    type="button"
                  >
                    <CardHeader className="p-0">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {section.number}. {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-1 p-0 text-xs text-muted-foreground">
                      {section.subsections.flatMap((subsection) => subsection.items).length} controls
                    </CardContent>
                  </button>
                </Card>
              )
            })}
          </div>

          {selectedSectionIds.length === 0 && (
            <p className="rounded-md border border-border bg-card/40 px-3 py-2 text-sm text-muted-foreground">
              Select at least one section to start the checklist.
            </p>
          )}

          <Button
            className="min-h-11"
            disabled={selectedSectionIds.length === 0}
            onClick={onStartChecklist}
            type="button"
          >
            Start Checklist
          </Button>
        </section>
      </div>
    </main>
  )
}
