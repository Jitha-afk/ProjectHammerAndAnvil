import type { RefObject } from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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

const priorityOptions: Array<{ value: 'all' | 'CRITICAL' | 'HIGH+'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'CRITICAL', label: 'CRITICAL Only' },
  { value: 'HIGH+', label: 'HIGH+' },
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
    <section className="space-y-3" aria-label="Checklist toolbar">
      <div className="grid gap-2">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Priority filter"
              className="min-h-11 w-full justify-between"
              variant="outline"
            >
              <span>{priorityOptions.find((option) => option.value === priorityFilter)?.label ?? 'All'}</span>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
            <DropdownMenuRadioGroup
              onValueChange={(value) => setPriorityFilter(value as 'all' | 'CRITICAL' | 'HIGH+')}
              value={priorityFilter}
            >
              {priorityOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Role filter"
              className="min-h-11 w-full justify-between"
              variant="outline"
            >
              <span>{roleOptions.find((option) => option.value === roleFilter)?.label ?? 'All Roles'}</span>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
            <DropdownMenuRadioGroup
              onValueChange={(value) => setRoleFilter(value as Role | 'all')}
              value={roleFilter}
            >
              {roleOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-2">
        <Button
          className="min-h-11 w-full"
          onClick={() => expandSections(sectionIds)}
          type="button"
          variant="outline"
        >
          Expand all
        </Button>
        <Button
          className="min-h-11 w-full"
          onClick={() => collapseSections(sectionIds)}
          type="button"
          variant="outline"
        >
          Collapse all
        </Button>
        <Button
          className="min-h-11 w-full"
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
