import { Github, Menu, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface HeaderProps {
  totalItems: number
  securedCount: number
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onOpenMobileNav: () => void
  onEditScope: () => void
}

export function Header({
  totalItems,
  securedCount,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileNav,
  onEditScope,
}: HeaderProps) {
  const progress = totalItems === 0 ? 0 : Math.round((securedCount / totalItems) * 100)

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            aria-label="Open navigation"
            className="min-h-11 min-w-11 md:hidden"
            onClick={onOpenMobileNav}
            size="icon"
            type="button"
            variant="outline"
          >
            <Menu className="size-5" />
          </Button>
          <p className="hidden truncate text-sm font-medium text-foreground md:block">
            You&apos;ve secured {securedCount} of {totalItems} controls
          </p>
          <p className="text-sm font-medium text-foreground md:hidden">{progress}% secured</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="hidden min-h-11 md:inline-flex"
            onClick={onEditScope}
            type="button"
            variant="outline"
          >
            Edit scope
          </Button>
          <Button asChild className="min-h-11 min-w-11" size="icon" variant="outline">
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
            className="min-h-11 min-w-11"
            onClick={onToggleDarkMode}
            size="icon"
            type="button"
            variant="outline"
          >
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}