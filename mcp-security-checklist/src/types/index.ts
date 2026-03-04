export type Priority = 'CRITICAL' | 'HIGH' | 'RECOMMENDED'

export type ItemStatus = 'unchecked' | 'checked' | 'na'

export type Role =
  | 'security-engineer'
  | 'architect'
  | 'devops'
  | 'developer'
  | 'compliance'

export interface SourceRef {
  label: string
  url?: string
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  priority: Priority
  roles: Role[]
  tags: string[]
  sources: SourceRef[]
  incidentRefs?: string[]
}

export interface SubSection {
  id: string
  number: string
  title: string
  description?: string
  items: ChecklistItem[]
}

export interface Section {
  id: string
  number: number
  title: string
  icon: string
  description: string
  whyItMatters?: string
  subsections: SubSection[]
}

export interface SiteMeta {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  siteTitle: string
  siteDescription: string
}

export interface ChecklistData {
  version: string
  lastUpdated: string
  totalItems: number
  meta: SiteMeta
  sections: Section[]
}

export interface ItemState {
  status: ItemStatus
  note?: string
  updatedAt?: string
}

export interface SavedState {
  schemaVersion: 1
  contentVersion: string
  savedAt: string
  items: Record<string, ItemState>
}