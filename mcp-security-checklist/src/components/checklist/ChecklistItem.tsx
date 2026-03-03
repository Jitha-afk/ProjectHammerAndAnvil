import { Check, Minus } from 'lucide-react'

import { useChecklistStore } from '@/store/useChecklistStore'
import type { ChecklistItem as ChecklistItemType } from '@/types'

interface ChecklistItemProps {
  item: ChecklistItemType
  shouldPulse: boolean
}

function getAriaChecked(status: 'unchecked' | 'checked' | 'na'): 'true' | 'false' | 'mixed' {
  if (status === 'na') {
    return 'mixed'
  }

  return status === 'checked' ? 'true' : 'false'
}

export function ChecklistItem({ item, shouldPulse }: ChecklistItemProps) {
  const itemStates = useChecklistStore((state) => state.itemStates)
  const toggleItem = useChecklistStore((state) => state.toggleItem)
  const setNote = useChecklistStore((state) => state.setNote)
  const expandedItemId = useChecklistStore((state) => state.expandedItemId)
  const setExpandedItem = useChecklistStore((state) => state.setExpandedItem)

  const status = itemStates[item.id]?.status ?? 'unchecked'
  const note = itemStates[item.id]?.note ?? ''
  const isExpanded = expandedItemId === item.id

  const titleClassName = status === 'checked'
    ? 'line-through opacity-70'
    : status === 'na'
      ? 'italic text-muted-foreground'
      : 'text-foreground'

  return (
    <article className="rounded-md border border-border bg-card/40">
      <div className="flex items-start gap-3 p-3">
        <button
          aria-checked={getAriaChecked(status)}
          aria-label={`Mark ${item.title}`}
          className={`mt-0.5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border ${shouldPulse ? 'animate-pulse' : ''}`}
          onClick={() => toggleItem(item.id)}
          onKeyDown={(event) => {
            if (event.key !== ' ' && event.key !== 'Enter') {
              return
            }

            event.preventDefault()
            toggleItem(item.id)
          }}
          role="checkbox"
          type="button"
        >
          {status === 'checked' && <Check className="size-4 text-emerald-500" />}
          {status === 'na' && <Minus className="size-4 text-muted-foreground" />}
        </button>

        <div className="min-w-0 flex-1">
          <button
            className={`text-left text-sm font-medium ${titleClassName}`}
            onClick={() => setExpandedItem(isExpanded ? null : item.id)}
            type="button"
          >
            {item.title}
          </button>

          <span className="ml-2 inline-flex rounded-md border border-border px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            {item.priority}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border px-4 py-3 text-sm">
          <p className="text-foreground">{item.description}</p>

          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Sources</p>
              <ul className="list-disc pl-5">
                {item.sources.map((source) => (
                  <li key={`${item.id}-${source.label}`}>
                    {source.url ? (
                      <a className="underline" href={source.url} rel="noreferrer" target="_blank">
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
                <p className="font-medium text-foreground">Incident refs</p>
                <p>{item.incidentRefs.join(', ')}</p>
              </div>
            )}

            <div>
              <p className="font-medium text-foreground">Tags</p>
              <p>{item.tags.join(', ')}</p>
            </div>
          </div>

          <label className="mt-3 block text-xs font-medium text-foreground" htmlFor={`note-${item.id}`}>
            Notes
          </label>
          <textarea
            className="mt-1 min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            id={`note-${item.id}`}
            onChange={(event) => setNote(item.id, event.target.value)}
            placeholder="Add context, decision notes, or remediation details..."
            value={note}
          />
        </div>
      )}
    </article>
  )
}