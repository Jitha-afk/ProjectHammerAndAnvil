import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface HeaderProps {
  totalItems: number
  securedCount: number
  activeSectionTitle: string | null
  onEditScope: () => void
}

export function Header({
  totalItems,
  securedCount,
  activeSectionTitle,
  onEditScope,
}: HeaderProps) {
  const progress = totalItems === 0 ? 0 : Math.round((securedCount / totalItems) * 100)

  return (
    <header className="sticky top-14 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
      <div className="mx-auto flex h-12 max-w-[var(--page-width)] items-center justify-between gap-4 px-6 md:px-[var(--page-padding)]">
        {/* Left: Breadcrumb */}
        <div className="flex min-w-0 items-center gap-2">
          <Button
            className="h-8 rounded-sm px-2 font-normal"
            onClick={onEditScope}
            type="button"
            variant="ghost"
          >
            <ArrowLeft className="mr-1 size-3.5" />
            Sections
          </Button>

          {activeSectionTitle && (
            <>
              <span className="text-[var(--foreground-muted)]">/</span>
              <span className="truncate text-[var(--foreground-muted)]">
                {activeSectionTitle}
              </span>
            </>
          )}
        </div>

        {/* Right: Progress count */}
        <span className="shrink-0 tabular-nums text-[var(--foreground-muted)]">
          {securedCount}/{totalItems}
          {progress > 0 && ` (${progress}%)`}
        </span>
      </div>
    </header>
  )
}
