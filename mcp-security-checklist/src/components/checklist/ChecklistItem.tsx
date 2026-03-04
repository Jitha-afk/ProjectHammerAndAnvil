import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { cn } from '@/lib/utils'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { ChecklistItem as ChecklistItemType } from '@/types'

interface ChecklistItemProps {
  item: ChecklistItemType
  shouldPulse: boolean
  isHidden: boolean
  isDimmed: boolean
  isHighlighted: boolean
}

export function ChecklistItem({
  item,
  shouldPulse,
  isHidden,
  isDimmed,
  isHighlighted,
}: ChecklistItemProps) {
  const itemStates = useChecklistStore((state) => state.itemStates)
  const toggleItem = useChecklistStore((state) => state.toggleItem)
  const setNote = useChecklistStore((state) => state.setNote)
  const expandedItemId = useChecklistStore((state) => state.expandedItemId)
  const setExpandedItem = useChecklistStore((state) => state.setExpandedItem)

  const status = itemStates[item.id]?.status ?? 'unchecked'
  const note = itemStates[item.id]?.note ?? ''
  const isExpanded = expandedItemId === item.id

  return (
    <article
      className={cn(
        'relative',
        isHidden && 'hidden',
        isDimmed && 'opacity-40',
        isHighlighted && '-mx-4 rounded-sm bg-[var(--accent-light)] px-4 py-1',
      )}
    >
      <div className="relative flex items-start gap-0 pl-13 md:pl-13">
        {/* Custom checkbox — positioned to the left of content */}
        <button
          aria-checked={status === 'checked' ? 'true' : status === 'na' ? 'mixed' : 'false'}
          aria-label={`Mark ${item.title}`}
          className={cn(
            'absolute left-0 top-0.5 flex size-6 shrink-0 items-center justify-center rounded-[var(--border-radius)] border-2 transition-all duration-150',
            status === 'checked'
              ? 'border-[var(--accent)] bg-[var(--accent)]'
              : status === 'na'
                ? 'border-[var(--border-hover)] bg-[var(--background-tertiary)]'
                : 'border-[var(--border-hover)] bg-transparent',
            shouldPulse && 'animate-pulse',
          )}
          onClick={() => toggleItem(item.id)}
          role="checkbox"
          type="button"
        >
          {status === 'checked' && (
            <svg className="size-3.5 text-[var(--background)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {status === 'na' && (
            <svg className="size-3 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <button
              className={cn(
                'text-left font-normal',
                status === 'checked' && 'line-through text-[var(--foreground-muted)]',
                status === 'na' && 'italic text-[var(--foreground-muted)]',
                status === 'unchecked' && 'text-foreground',
              )}
              onClick={() => setExpandedItem(isExpanded ? null : item.id)}
              style={{ fontSize: 'var(--font-size-subtitle)', lineHeight: 'var(--line-height-subtitle)' }}
              type="button"
            >
              {item.title}
            </button>
            <PriorityBadge priority={item.priority} />
          </div>

          {/* Expanded detail */}
          {isExpanded && (
            <div className="mt-3" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
              <p className="text-[var(--foreground-secondary)]">
                {item.description}
              </p>

              <div className="mt-4 space-y-3 text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
                <div>
                  <p className="mb-1 font-normal uppercase text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
                    Sources
                  </p>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {item.sources.map((source) => (
                      <li key={`${item.id}-${source.label}`}>
                        {source.url ? (
                          <a
                            className="underline underline-offset-2 transition-colors duration-150 hover:text-[var(--accent)]"
                            href={source.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {source.label}
                          </a>
                        ) : (
                          source.label
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {item.incidentRefs && item.incidentRefs.length > 0 && (
                  <div>
                    <p className="mb-1 font-normal uppercase text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
                      Incident refs
                    </p>
                    <p>{item.incidentRefs.join(', ')}</p>
                  </div>
                )}

                <div>
                  <p className="mb-1 font-normal uppercase text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
                    Tags
                  </p>
                  <p>{item.tags.join(', ')}</p>
                </div>
              </div>

              <label
                className="mt-4 block font-normal uppercase text-[var(--foreground-muted)]"
                htmlFor={`note-${item.id}`}
                style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}
              >
                Notes
              </label>
              <textarea
                className="mt-1.5 min-h-20 w-full rounded-[var(--border-radius)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 placeholder:text-[var(--foreground-muted)]/60 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                id={`note-${item.id}`}
                onChange={(event) => setNote(item.id, event.target.value)}
                placeholder="Add context, decision notes, or remediation details..."
                style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}
                value={note}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
