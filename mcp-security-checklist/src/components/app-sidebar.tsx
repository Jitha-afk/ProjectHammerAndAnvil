import * as React from "react"
import { lazy, Suspense, useEffect, useState } from "react"
import { Github, Info, LifeBuoy, Share2 } from 'lucide-react'

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Silk from "@/components/Silk"
import StarBorder from "@/components/StarBorder"
import { Toolbar } from "@/components/toolbar/Toolbar"
import type { Section } from "@/types"

const ASCIIText = lazy(() => import("@/components/ASCIIText"))

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
  const [helpOpen, setHelpOpen] = useState(false)
  const [showCredit, setShowCredit] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    updatePreference()
    media.addEventListener('change', updatePreference)

    return () => media.removeEventListener('change', updatePreference)
  }, [])

  const handleGetHelp = () => {
    setHelpOpen(true)
    setShowCredit(false)
    setTimeout(() => setShowCredit(true), 3000)
  }

  return (
    <>
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

          <SidebarGroup className="group-data-[collapsible=icon]:hidden flex-1">
            <SidebarGroupLabel>Security Team Upgrade</SidebarGroupLabel>
            <SidebarGroupContent className="h-full">
              <div className="relative flex h-full min-h-52 overflow-hidden rounded-lg border border-sidebar-border bg-sidebar/30 p-3">
                {!prefersReducedMotion && (
                  <div className="pointer-events-none absolute inset-0">
                    <Silk
                      speed={5}
                      scale={1}
                      color="#7B7481"
                      noiseIntensity={1.5}
                      rotation={0}
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-sidebar/75" />

                <div className="relative z-10 flex h-full flex-col gap-3">
                  <p className="text-lg font-semibold text-sidebar-foreground">
                    Need more than a checklist?
                  </p>
                  <div className="flex flex-1 items-center">
                    <p className="text-xs leading-relaxed text-sidebar-foreground/80">
                      Teams use this guide to build secure-by-default AI systems. If you want faster, deeper protection,
                      explore tooling that scans your stack and flags high-risk issues automatically.
                    </p>
                  </div>
                  <StarBorder
                    as="a"
                    href="https://www.linkedin.com/in/jithamsft/"
                    rel="noreferrer"
                    target="_blank"
                    color="cyan"
                    speed="8s"
                    thickness={3}
                    className="w-full"
                  >
                    Learn More
                  </StarBorder>
                </div>
              </div>
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
                  href="https://github.com/Jitha-afk/ProjectHammerAndAnvil/blob/main/CONTRIBUTING.md"
                  rel="noreferrer"
                  target="_blank"
                >
                  <Github />
                  <span>Contribute</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Get Help" onClick={handleGetHelp}>
                <LifeBuoy />
                <span>Get Help</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent
          className="sm:max-w-[720px] h-[480px] bg-black border-zinc-800 flex flex-col cursor-pointer"
          showCloseButton={false}
          onClick={() => window.open('https://github.com/Jitha-afk', '_blank')}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">Credits</DialogTitle>
          </DialogHeader>
          <div className="relative flex-1 w-full overflow-hidden">
            <Suspense fallback={null}>
              {!showCredit ? (
                <ASCIIText
                  key="made-by"
                  text="Made by"
                  enableWaves={true}
                  asciiFontSize={6}
                  textFontSize={168}
                  planeBaseHeight={6}
                  textColor="#f5f1e8"
                />
              ) : (
                <ASCIIText
                  key="jitha"
                  text="JithaAFK"
                  enableWaves={false}
                  asciiFontSize={7}
                  textFontSize={220}
                  planeBaseHeight={7}
                  textColor="#fff5de"
                />
              )}
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
