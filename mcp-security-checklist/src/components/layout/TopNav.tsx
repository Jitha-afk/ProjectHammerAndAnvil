import { ArrowLeft, Github, Menu, Shield, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface ChecklistContext {
  activeSectionTitle: string | null
  securedCount: number
  totalItems: number
  onEditScope: () => void
}

interface TopNavProps {
  checklistContext?: ChecklistContext
}

export function TopNav({ checklistContext }: TopNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isChecklistMode = Boolean(checklistContext)
  const navButtonHoverClass = 'border border-transparent bg-transparent text-foreground hover:border-border hover:bg-transparent hover:text-foreground dark:hover:bg-transparent dark:hover:text-foreground'

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
      {isChecklistMode && checklistContext ? (
        <div className="mx-auto grid h-14 max-w-[var(--page-width)] grid-cols-[auto_1fr_auto] items-center gap-3 px-6 md:px-[var(--page-padding)]">
          <div className="justify-self-start">
            <Button
              className={`h-8 rounded-sm px-2 font-normal ${navButtonHoverClass}`}
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
            <Button asChild className={`h-9 rounded-sm px-3 font-normal ${navButtonHoverClass}`} variant="ghost">
              <a href="#/about">About</a>
            </Button>
            <Button asChild className={`h-9 rounded-sm px-3 font-normal ${navButtonHoverClass}`} variant="ghost">
              <a href="#/share">Share</a>
            </Button>
            <Button asChild className={`h-9 rounded-sm px-3 font-normal ${navButtonHoverClass}`} variant="ghost">
              <a
                href="https://github.com/Jitha-afk/ProjectHammerAndAnvil/blob/main/CONTRIBUTING.md"
                rel="noreferrer"
                target="_blank"
              >
                Contribute
              </a>
            </Button>

            <div className="ml-1 h-4 w-px bg-[var(--border)]" />

            <Button asChild className={`h-9 w-9 rounded-sm ${navButtonHoverClass}`} size="icon" variant="ghost">
              <a
                aria-label="GitHub repository"
                href="https://github.com/jitesh-a/mcp-security-checklist"
                rel="noreferrer"
                target="_blank"
              >
                <Github className="size-4" />
              </a>
            </Button>

          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              className={`h-9 w-9 rounded-sm ${navButtonHoverClass}`}
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
              className={`rounded-sm border border-transparent px-3 py-2 text-foreground transition-colors hover:border-border hover:bg-transparent hover:text-foreground`}
              href="#/about"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}
            >
              About
            </a>
            <a
              className={`rounded-sm border border-transparent px-3 py-2 text-foreground transition-colors hover:border-border hover:bg-transparent hover:text-foreground`}
              href="#/share"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}
            >
              Share
            </a>
            <a
              className={`rounded-sm border border-transparent px-3 py-2 text-foreground transition-colors hover:border-border hover:bg-transparent hover:text-foreground`}
              href="https://github.com/Jitha-afk/ProjectHammerAndAnvil/blob/main/CONTRIBUTING.md"
              onClick={() => setIsMobileMenuOpen(false)}
              rel="noreferrer"
              style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}
              target="_blank"
            >
              Contribute
            </a>
            <a
              className={`rounded-sm border border-transparent px-3 py-2 text-foreground transition-colors hover:border-border hover:bg-transparent hover:text-foreground`}
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
