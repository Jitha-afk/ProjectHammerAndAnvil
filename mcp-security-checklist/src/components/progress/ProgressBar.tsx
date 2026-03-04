import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  value: number | null
  label: string
  size?: 'thin' | 'medium' | 'sidebar'
}

function getToneClass(value: number | null): string {
  if (value === null) {
    return 'bg-muted-foreground/40'
  }

  if (value < 33) {
    return 'bg-red-500'
  }

  if (value <= 66) {
    return 'bg-amber-500'
  }

  return 'bg-emerald-500'
}

export function ProgressBar({ value, label, size = 'medium' }: ProgressBarProps) {
  const barHeightClass =
    size === 'thin' ? 'h-1.5' : size === 'sidebar' ? 'h-2' : 'h-2.5'

  const normalizedValue = value === null ? 0 : Math.max(0, Math.min(100, value))

  return (
    <Progress
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value === null ? 0 : normalizedValue}
      aria-valuetext={value === null ? 'N/A' : `${normalizedValue}%`}
      className={`overflow-hidden rounded-full bg-muted ${barHeightClass}`}
      indicatorClassName={`rounded-full ${getToneClass(value)}`}
      role="progressbar"
      value={normalizedValue}
    />
  )
}