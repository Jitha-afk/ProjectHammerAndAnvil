import * as React from "react"
import { Github, Info, Share2 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
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
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Selected Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton
                    isActive={section.id === activeSectionId}
                    onClick={() => onNavigate(section.id)}
                    tooltip={`${section.number}. ${section.title}`}
                    type="button"
                  >
                    <span className="font-medium">{section.number}. {section.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <Toolbar
              onResetRequested={onResetRequested}
              searchInputRef={searchInputRef}
              sections={sections}
              showSectionActions={false}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="About">
              <a href="#/about">
                <Info />
                <span>About</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Share">
              <a href="#/share">
                <Share2 />
                <span>Share</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Contribute">
              <a
                href="https://github.com/jitesh-a/mcp-security-checklist"
                rel="noreferrer"
                target="_blank"
              >
                <Github />
                <span>Contribute</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
