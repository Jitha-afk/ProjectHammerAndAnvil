import type { Section } from '@/types'

interface CategoryNavProps {
  sections: Section[]
  currentSectionId: string
  onNavigate: (sectionId: string) => void
  onBackToHome: () => void
}

export function CategoryNav({
  sections,
  currentSectionId,
  onNavigate,
  onBackToHome,
}: CategoryNavProps) {
  const currentIndex = sections.findIndex((section) => section.id === currentSectionId)
  const previousSection = currentIndex > 0 ? sections[currentIndex - 1] : null
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null

  return (
    <nav aria-label="Section navigation" className="mt-24 grid grid-cols-2 gap-12">
      {/* Previous */}
      <div>
        {previousSection ? (
          <button
            className="group block w-full text-left"
            onClick={() => onNavigate(previousSection.id)}
            type="button"
          >
            <span className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
              Previous
            </span>
            <span className="mt-1 block font-normal text-foreground transition-colors duration-150 group-hover:text-[var(--accent)]" style={{ fontSize: 'var(--font-size-subtitle)', lineHeight: 'var(--line-height-subtitle)' }}>
              {previousSection.number}. {previousSection.title}
            </span>
          </button>
        ) : (
          <button
            className="group block w-full text-left"
            onClick={onBackToHome}
            type="button"
          >
            <span className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
              Back
            </span>
            <span className="mt-1 block font-normal text-foreground transition-colors duration-150 group-hover:text-[var(--accent)]" style={{ fontSize: 'var(--font-size-subtitle)', lineHeight: 'var(--line-height-subtitle)' }}>
              Home
            </span>
          </button>
        )}
      </div>

      {/* Next */}
      <div className="text-right">
        {nextSection ? (
          <button
            className="group block w-full text-right"
            onClick={() => onNavigate(nextSection.id)}
            type="button"
          >
            <span className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
              Next
            </span>
            <span className="mt-1 block font-normal text-foreground transition-colors duration-150 group-hover:text-[var(--accent)]" style={{ fontSize: 'var(--font-size-subtitle)', lineHeight: 'var(--line-height-subtitle)' }}>
              {nextSection.number}. {nextSection.title}
            </span>
          </button>
        ) : (
          <button
            className="group block w-full text-right"
            onClick={onBackToHome}
            type="button"
          >
            <span className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
              Done
            </span>
            <span className="mt-1 block font-normal text-foreground transition-colors duration-150 group-hover:text-[var(--accent)]" style={{ fontSize: 'var(--font-size-subtitle)', lineHeight: 'var(--line-height-subtitle)' }}>
              Back to Home
            </span>
          </button>
        )}
      </div>
    </nav>
  )
}
