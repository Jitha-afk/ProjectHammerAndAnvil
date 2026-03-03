import { Button } from '@/components/ui/button'

interface FooterProps {
  version: string
  lastSavedAt: string | null
}

export function Footer({ version, lastSavedAt }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="mx-auto flex max-w-[var(--page-width)] flex-col gap-2 px-6 py-8 text-sm text-[var(--foreground-muted)] md:flex-row md:items-center md:justify-between md:px-[var(--page-padding)] md:py-10">
        <p>Version {version}</p>
        <p>
          Sources:{' '}
          <Button asChild className="h-auto p-0 text-sm" variant="link">
            <a href="https://owasp.org" rel="noreferrer" target="_blank">
              OWASP
            </a>
          </Button>
          {' · '}
          <Button asChild className="h-auto p-0 text-sm" variant="link">
            <a href="https://github.com/slowmist/MCP-Security-Checklist" rel="noreferrer" target="_blank">
              SlowMist
            </a>
          </Button>
        </p>
        <p>
          Last saved:{' '}
          {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Not saved yet'}
        </p>
      </div>
    </footer>
  )
}
