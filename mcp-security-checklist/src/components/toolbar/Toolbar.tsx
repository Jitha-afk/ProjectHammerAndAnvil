import type { RefObject } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChecklistStore } from '@/store/useChecklistStore'
import type { Role, Section } from '@/types'

interface ToolbarProps {
  sections: Section[]
  searchInputRef: RefObject<HTMLInputElement | null>
  onResetRequested: () => void
}

const roleOptions: Array<{ value: Role | 'all'; label: string }> = [
  { value: 'all', label: 'All Roles' },
  { value: 'security-engineer', label: 'Security Engineer' },
  { value: 'architect', label: 'Architect' },
  { value: 'devops', label: 'DevOps / SRE' },
  { value: 'developer', label: 'Developer' },
  { value: 'compliance', label: 'Compliance' },
]

export function Toolbar({ sections, searchInputRef, onResetRequested }: ToolbarProps) {
  const priorityFilter = useChecklistStore((state) => state.priorityFilter)
  const roleFilter = useChecklistStore((state) => state.roleFilter)
  const searchQuery = useChecklistStore((state) => state.searchQuery)
  const setPriorityFilter = useChecklistStore((state) => state.setPriorityFilter)
  const setRoleFilter = useChecklistStore((state) => state.setRoleFilter)
  const setSearch = useChecklistStore((state) => state.setSearch)
  const expandSections = useChecklistStore((state) => state.expandSections)
  const collapseSections = useChecklistStore((state) => state.collapseSections)

  const sectionIds = sections.map((section) => section.id)

  return (
    <section className="space-y-3 rounded-md border border-border bg-card/40 p-3" aria-label="Checklist toolbar">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_180px_220px]">
        <Input
          aria-label="Search checklist"
          className="min-h-11"
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              setSearch('')
              searchInputRef.current?.blur()
            }
          }}
          placeholder="Search title, description, or tags"
          ref={searchInputRef}
          value={searchQuery}
        />

        <Select
          onValueChange={(value) => setPriorityFilter(value as 'all' | 'CRITICAL' | 'HIGH+')}
          value={priorityFilter}
        >
          <SelectTrigger aria-label="Priority filter" className="min-h-11 w-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="CRITICAL">CRITICAL Only</SelectItem>
            <SelectItem value="HIGH+">HIGH+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setRoleFilter(value as Role | 'all')}
          value={roleFilter}
        >
          <SelectTrigger aria-label="Role filter" className="min-h-11 w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          className="min-h-11"
          onClick={() => expandSections(sectionIds)}
          type="button"
          variant="outline"
        >
          Expand all
        </Button>
        <Button
          className="min-h-11"
          onClick={() => collapseSections(sectionIds)}
          type="button"
          variant="outline"
        >
          Collapse all
        </Button>
        <Button
          className="min-h-11"
          onClick={onResetRequested}
          type="button"
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </section>
  )
}
