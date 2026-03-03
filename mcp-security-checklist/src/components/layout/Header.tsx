import { ArrowLeft, Github, Moon, Shield, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface HeaderProps {
  totalItems: number
  securedCount: number
  isDarkMode: boolean
  activeSectionTitle: string | null
  onToggleDarkMode: () => void
  onEditScope: () => void
}

export function Header({
  totalItems,
  securedCount,
  isDarkMode,
  activeSectionTitle,
  onToggleDarkMode,
  onEditScope,
}: HeaderProps) {
  const progress = totalItems === 0 ? 0 : Math.round((securedCount / totalItems) * 100)

  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]">
      <div className="mx-auto flex h-[90px] max-w-[var(--page-width)] items-center justify-between gap-4 px-6 md:px-[var(--page-padding)]">
        {/* Left: Logo + breadcrumb */}
        <div className="flex min-w-0 items-center gap-3">
          <Shield className="size-5 shrink-0 text-[var(--accent)]" strokeWidth={1.5} />
          <span className="text-base font-normal text-foreground">MCP Security</span>

          {activeSectionTitle && (
            <>
              <span className="text-[var(--foreground-muted)]">/</span>
              <span className="truncate text-base text-[var(--foreground-muted)]">
                {activeSectionTitle}
              </span>
            </>
          )}
        </div>

        {/* Right: Progress + actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm tabular-nums text-[var(--foreground-muted)]">
            {securedCount}/{totalItems}
            {progress > 0 && ` (${progress}%)`}
          </span>

          <Button
            className="min-h-9 rounded-sm text-sm font-normal"
            onClick={onEditScope}
            type="button"
            variant="ghost"
          >
            <ArrowLeft className="size-3.5" />
            Edit scope
          </Button>

          <Button asChild className="min-h-9 min-w-9 rounded-sm" size="icon" variant="ghost">
            <a
              aria-label="Open GitHub repository"
              href="https://github.com"
              rel="noreferrer"
              target="_blank"
            >
              <Github className="size-4" />
            </a>
          </Button>

          <Button
            aria-label="Toggle dark mode"
            className="min-h-9 min-w-9 rounded-sm"
            onClick={onToggleDarkMode}
            size="icon"
            type="button"
            variant="ghost"
          >
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
