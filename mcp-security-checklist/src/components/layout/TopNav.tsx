import { ArrowLeft, Github, Menu, Moon, Shield, Sun, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface ChecklistContext {
  activeSectionTitle: string | null
  securedCount: number
  totalItems: number
  onEditScope: () => void
}

interface TopNavProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  checklistContext?: ChecklistContext
}

export function TopNav({ isDarkMode, onToggleDarkMode, checklistContext }: TopNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChecklistMenuOpen, setIsChecklistMenuOpen] = useState(false)
  const isChecklistMode = Boolean(checklistContext)

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
      {isChecklistMode && checklistContext ? (
        <div className="mx-auto grid h-14 max-w-[var(--page-width)] grid-cols-[auto_1fr_auto] items-center gap-3 px-6 md:px-[var(--page-padding)]">
          <div className="justify-self-start">
            <Button
              className="h-8 rounded-sm px-2 font-normal"
              onClick={checklistContext.onEditScope}
              type="button"
              variant="ghost"
            >
              <ArrowLeft className="mr-1 size-3.5" aria-hidden="true" />
              Sections
            </Button>
          </div>

          <div className="min-w-0 justify-self-center text-center">
            <span className="block truncate text-[var(--foreground-muted)]">
              {checklistContext.activeSectionTitle ?? 'Checklist'}
            </span>
          </div>

          <div className="relative flex items-center justify-self-end gap-1">
            <span className="tabular-nums text-[var(--foreground-muted)]">
              {checklistContext.securedCount}/{checklistContext.totalItems}
            </span>
            <div className="ml-1 h-4 w-px bg-[var(--border)]" />
            <Button
              aria-expanded={isChecklistMenuOpen}
              aria-label="Toggle quick links"
              className="h-9 w-9 rounded-sm"
              onClick={() => setIsChecklistMenuOpen((previous) => !previous)}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isChecklistMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
            <Button
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-9 w-9 rounded-sm"
              onClick={onToggleDarkMode}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            {isChecklistMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-40 rounded-sm border border-[var(--border)] bg-[var(--background)] p-1 shadow-sm">
                <a
                  className="block rounded-sm px-2 py-1.5 text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
                  href="#/about"
                  onClick={() => setIsChecklistMenuOpen(false)}
                >
                  About
                </a>
                <a
                  className="block rounded-sm px-2 py-1.5 text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
                  href="#/share"
                  onClick={() => setIsChecklistMenuOpen(false)}
                >
                  Share
                </a>
                <a
                  className="block rounded-sm px-2 py-1.5 text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
                  href="https://github.com/jitesh-a/mcp-security-checklist"
                  onClick={() => setIsChecklistMenuOpen(false)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Contribute
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto flex h-14 max-w-[var(--page-width)] items-center justify-between px-6 md:px-[var(--page-padding)]">
          <a
            className="flex items-center gap-2.5 text-foreground transition-colors duration-150 hover:text-[var(--accent)]"
            href="#/"
          >
            <Shield className="size-5 text-[var(--accent)]" strokeWidth={1.5} />
            <span className="font-normal">MCP Security Checklist</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            <Button asChild className="h-9 rounded-sm px-3 font-normal" variant="ghost">
              <a href="#/about">About</a>
            </Button>
            <Button asChild className="h-9 rounded-sm px-3 font-normal" variant="ghost">
              <a href="#/share">Share</a>
            </Button>
            <Button asChild className="h-9 rounded-sm px-3 font-normal" variant="ghost">
              <a
                href="https://github.com/jitesh-a/mcp-security-checklist"
                rel="noreferrer"
                target="_blank"
              >
                Contribute
              </a>
            </Button>

            <div className="ml-1 h-4 w-px bg-[var(--border)]" />

            <Button asChild className="h-9 w-9 rounded-sm" size="icon" variant="ghost">
              <a
                aria-label="GitHub repository"
                href="https://github.com/jitesh-a/mcp-security-checklist"
                rel="noreferrer"
                target="_blank"
              >
                <Github className="size-4" />
              </a>
            </Button>

            <Button
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-9 w-9 rounded-sm"
              onClick={onToggleDarkMode}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-9 w-9 rounded-sm"
              onClick={onToggleDarkMode}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            <Button
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="h-9 w-9 rounded-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              size="icon"
              type="button"
              variant="ghost"
            >
              {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <a
              className="rounded-sm px-3 py-2 text-foreground transition-colors hover:bg-[var(--background-secondary)]"
              href="#/about"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}
            >
              About
            </a>
            <a
              className="rounded-sm px-3 py-2 text-foreground transition-colors hover:bg-[var(--background-secondary)]"
              href="#/share"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}
            >
              Share
            </a>
            <a
              className="rounded-sm px-3 py-2 text-foreground transition-colors hover:bg-[var(--background-secondary)]"
              href="https://github.com/jitesh-a/mcp-security-checklist"
              onClick={() => setIsMobileMenuOpen(false)}
              rel="noreferrer"
              style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}
              target="_blank"
            >
              Contribute
            </a>
            <a
              className="rounded-sm px-3 py-2 text-foreground transition-colors hover:bg-[var(--background-secondary)]"
              href="https://github.com/jitesh-a/mcp-security-checklist"
              onClick={() => setIsMobileMenuOpen(false)}
              rel="noreferrer"
              style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
