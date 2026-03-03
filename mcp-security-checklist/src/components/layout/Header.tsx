import { Github, Menu, Moon, Sun } from 'lucide-react'

interface HeaderProps {
  totalItems: number
  securedCount: number
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onOpenMobileNav: () => void
}

export function Header({
  totalItems,
  securedCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileNav,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            aria-label="Open navigation"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border md:hidden"
            onClick={onOpenMobileNav}
            type="button"
          >
            <Menu className="size-5" />
          </button>
          <p className="truncate text-sm font-medium text-foreground">
            You&apos;ve secured {securedCount} of {totalItems} controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            aria-label="Open GitHub repository"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border"
            href="https://github.com"
            rel="noreferrer"
            target="_blank"
          >
            <Github className="size-4" />
          </a>
          <button
            aria-label="Toggle dark mode"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border"
            onClick={onToggleDarkMode}
            type="button"
          >
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}