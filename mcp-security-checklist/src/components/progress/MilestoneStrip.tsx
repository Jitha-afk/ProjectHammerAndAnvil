import { Check } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

import { getMilestone, type Milestone } from '@/lib/progress'
import type { ChecklistItem, ItemState } from '@/types'

interface MilestoneStripProps {
  items: ChecklistItem[]
  itemStates: Record<string, ItemState>
  onMilestoneReached: (message: string) => void
}

interface MilestoneBadge {
  key: Exclude<Milestone, 'none'>
  label: string
  done: boolean
}

const milestoneRank: Record<Milestone, number> = {
  none: 0,
  baseline: 1,
  hardened: 2,
  comprehensive: 3,
}

function getMilestoneMessage(milestone: Exclude<Milestone, 'none'>): string {
  if (milestone === 'comprehensive') {
    return 'Comprehensive milestone reached: all selected controls are done.'
  }

  if (milestone === 'hardened') {
    return 'Hardened milestone reached: all critical and high controls are done.'
  }

  return 'Baseline milestone reached: all critical controls are done.'
}

export function MilestoneStrip({ items, itemStates, onMilestoneReached }: MilestoneStripProps) {
  const milestone = useMemo(() => getMilestone(itemStates, items), [itemStates, items])
  const previousMilestoneRef = useRef<Milestone>('none')
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      previousMilestoneRef.current = milestone
      return
    }

    const previous = previousMilestoneRef.current

    if (milestoneRank[milestone] > milestoneRank[previous] && milestone !== 'none') {
      onMilestoneReached(getMilestoneMessage(milestone))
    }

    previousMilestoneRef.current = milestone
  }, [milestone, onMilestoneReached])

  const badges: MilestoneBadge[] = [
    {
      key: 'baseline',
      label: 'Baseline',
      done: milestoneRank[milestone] >= milestoneRank.baseline,
    },
    {
      key: 'hardened',
      label: 'Hardened',
      done: milestoneRank[milestone] >= milestoneRank.hardened,
    },
    {
      key: 'comprehensive',
      label: 'Comprehensive',
      done: milestoneRank[milestone] >= milestoneRank.comprehensive,
    },
  ]

  return (
    <section className="grid gap-2 md:grid-cols-3" aria-label="Milestone progress">
      {badges.map((badge) => (
        <div
          className={`flex min-h-11 items-center justify-between rounded-md border px-3 py-2 text-sm transition-transform ${
            badge.done
              ? 'border-foreground bg-accent/10 md:scale-[1.05]'
              : 'border-border bg-card/40 text-muted-foreground'
          }`}
          key={badge.key}
        >
          <span className="font-medium">{badge.label}</span>
          <Check className={`size-4 ${badge.done ? 'opacity-100' : 'opacity-20'}`} />
        </div>
      ))}
    </section>
  )
}
