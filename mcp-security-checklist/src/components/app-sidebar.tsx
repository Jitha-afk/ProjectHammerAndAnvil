import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Toolbar } from "@/components/toolbar/Toolbar"
import type { Section } from "@/types"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSectionId: string
  sections: Section[]
  searchInputRef: React.RefObject<HTMLInputElement | null>
  onNavigate: (sectionId: string) => void
  onResetRequested: () => void
}

export function AppSidebar({
  activeSectionId,
  sections,
  searchInputRef,
  onNavigate,
  onResetRequested,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-1">
              {sections.map((section) => (
                <Button
                  className="h-auto min-h-11 w-full justify-start text-left whitespace-normal"
                  key={section.id}
                    onClick={() => onNavigate(section.id)}
                    type="button"
                    variant={section.id === activeSectionId ? 'secondary' : 'ghost'}
                  >
                    <span className="font-medium">{section.number}. {section.title}</span>
                  </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Toolbar
          onResetRequested={onResetRequested}
          searchInputRef={searchInputRef}
          sections={sections}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
