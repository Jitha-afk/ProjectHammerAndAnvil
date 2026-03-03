import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Priority } from '@/types'

interface PriorityBadgeProps {
  priority: Priority
}

const priorityStyles: Record<Priority, string> = {
  CRITICAL: 'border-[color:var(--critical)] bg-[color:var(--critical-light)] text-[color:var(--critical-foreground)]',
  HIGH: 'border-[color:var(--high)] bg-[color:var(--high-light)] text-[color:var(--high-foreground)]',
  RECOMMENDED: 'border-[color:var(--recommended)] bg-[color:var(--recommended-light)] text-[color:var(--recommended-foreground)]',
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const label = priority === 'CRITICAL'
    ? 'Priority: Critical'
    : priority === 'HIGH'
      ? 'Priority: High'
      : 'Priority: Recommended'

  return (
    <Badge
      aria-label={label}
      className={cn(
        'rounded-md border px-2 py-0.5 text-[11px] uppercase tracking-wide',
        priorityStyles[priority],
      )}
      variant="outline"
    >
      {priority}
    </Badge>
  )
}
