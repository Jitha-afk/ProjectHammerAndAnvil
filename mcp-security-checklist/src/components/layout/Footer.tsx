import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface FooterProps {
  version: string
  lastSavedAt: string | null
}

export function Footer({ version, lastSavedAt }: FooterProps) {
  return (
    <footer className="border-t border-border bg-background/80 px-4 py-3 text-xs text-muted-foreground md:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <p>Version {version}</p>
        <p>
          Sources:{' '}
          <Button asChild className="h-auto p-0 text-xs" variant="link">
            <a href="https://owasp.org" rel="noreferrer" target="_blank">
              OWASP
            </a>
          </Button>
          {' · '}
          <Button asChild className="h-auto p-0 text-xs" variant="link">
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
      <Separator className="mt-3" />
    </footer>
  )
}