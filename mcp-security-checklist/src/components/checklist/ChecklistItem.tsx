import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { Checkbox } from '@/components/ui/checkbox'
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
  const checkedValue = status === 'checked' ? true : status === 'na' ? 'indeterminate' : false
  const note = itemStates[item.id]?.note ?? ''
  const isExpanded = expandedItemId === item.id

  const titleClassName = status === 'checked'
    ? 'line-through opacity-70'
    : status === 'na'
      ? 'italic text-muted-foreground'
      : 'text-foreground'

  return (
    <article
      className={cn(
        'rounded-md border border-border bg-card/40',
        isHidden && 'hidden',
        isDimmed && 'opacity-40',
        isHighlighted && 'border-foreground/50 bg-accent/10',
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <Checkbox
          aria-label={`Mark ${item.title}`}
          checked={checkedValue}
          className={cn(
            'mt-0.5 size-11 rounded-md border-border data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white data-[state=indeterminate]:bg-muted data-[state=indeterminate]:text-muted-foreground',
            shouldPulse && 'animate-pulse',
          )}
          onCheckedChange={() => {
            toggleItem(item.id)
          }}
        />

        <div className="min-w-0 flex-1">
          <button
            className={`text-left text-sm font-medium ${titleClassName}`}
            onClick={() => setExpandedItem(isExpanded ? null : item.id)}
            type="button"
          >
            {item.title}
          </button>

          <div className="mt-2 md:mt-0 md:inline-flex md:align-middle md:pl-2">
            <PriorityBadge priority={item.priority} />
          </div>
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