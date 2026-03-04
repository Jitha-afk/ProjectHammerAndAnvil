import type { ReactNode } from 'react'

interface FuzzyTextProps {
  children: ReactNode
  fontSize?: string | number
  fontWeight?: number
  fontFamily?: string
  color?: string
  enableHover?: boolean
  baseIntensity?: number
  hoverIntensity?: number
}

declare const FuzzyText: React.FC<FuzzyTextProps>
export default FuzzyText
