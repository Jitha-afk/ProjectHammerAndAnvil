interface FooterProps {
  version: string
  lastSavedAt: string | null
}

export function Footer({ version, lastSavedAt }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--sidebar)]">
      <div className="mx-auto flex max-w-[var(--page-width)] flex-col gap-2 px-6 py-8 text-[var(--foreground-muted)] md:flex-row md:items-center md:justify-between md:px-[var(--page-padding)] md:py-10" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
        <p>Version {version}</p>
        <p>
          Last saved:{' '}
          {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Not saved yet'}
        </p>
      </div>
    </footer>
  )
}
