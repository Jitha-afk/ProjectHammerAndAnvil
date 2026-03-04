import { ArrowDown, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { computeProgress } from '@/lib/progress'
import { isDone } from '@/lib/progress'
import type { ChecklistData, ItemState } from '@/types'

const UNICORN_PROJECT_ID = 'dnfpoVPMMVxawKTRfS3M'
const UNICORN_SDK_URL = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.0-1/dist/unicornStudio.umd.js'

declare global {
  interface Window {
    UnicornStudio?: {
      addScene?: (config: Record<string, unknown>) => Promise<{ destroy: () => void } | null>
      init?: () => Promise<unknown>
      destroy?: () => void
    }
  }
}

/** Load the Unicorn Studio SDK and initialize a scene into the given ref element. */
function useUnicornBackground(containerRef: React.RefObject<HTMLDivElement | null>) {
  const sceneRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false

    async function loadAndInit() {
      // 1. Load SDK script if not already present
      if (!document.querySelector(`script[src="${UNICORN_SDK_URL}"]`)) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = UNICORN_SDK_URL
          script.async = true
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load UnicornStudio SDK'))
          document.head.appendChild(script)
        })
      } else {
        // Script tag exists — wait until it has loaded
        await new Promise<void>((resolve) => {
          const check = () => {
            if (window.UnicornStudio?.addScene) {
              resolve()
            } else {
              setTimeout(check, 50)
            }
          }
          check()
        })
      }

      if (cancelled) return

      // 2. Wait for layout to settle
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      if (cancelled) return

      // 3. Log diagnostics
      if (!el) return
      console.log('[UnicornScene] SDK loaded:', !!window.UnicornStudio?.addScene)
      console.log('[UnicornScene] Container dimensions:', el.offsetWidth, 'x', el.offsetHeight)

      // 4. Initialize scene — pass `element` directly (not elementId)
      try {
        const scene = await window.UnicornStudio?.addScene?.({
          element: el,
          projectId: UNICORN_PROJECT_ID,
          scale: 1,
          dpi: 1.5,
          fps: 60,
          lazyLoad: false,
          production: false,
        })
        console.log('[UnicornScene] addScene resolved:', scene)
        if (!cancelled && scene) {
          sceneRef.current = scene
        }
      } catch (err) {
        console.error('[UnicornScene] addScene error:', err)
      }
    }

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      loadAndInit()
    }

    return () => {
      cancelled = true
      sceneRef.current?.destroy()
      sceneRef.current = null
    }
  }, [containerRef])
}

interface HomeProps {
  checklistData: ChecklistData
  hasCompletedOnboarding: boolean
  selectedSectionIds: string[]
  itemStates: Record<string, ItemState>
  onToggleSection: (sectionId: string) => void
  onSelectAllCore: () => void
  onClearSelection: () => void
  onStartChecklist: () => void
  onNavigateSection?: (sectionId: string) => void
}

export function Home({
  checklistData,
  hasCompletedOnboarding,
  selectedSectionIds,
  itemStates,
  onToggleSection,
  onSelectAllCore,
  onClearSelection,
  onStartChecklist,
  onNavigateSection,
}: HomeProps) {
  const selectableSections = checklistData.sections.filter((section) => section.id !== 'tools')
  const referenceSection = checklistData.sections.find((section) => section.id === 'tools')

  const selectedCount = selectedSectionIds.length
  const totalSelectable = selectableSections.length

  const handleScrollToSelector = () => {
    const element = document.getElementById('section-selector')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  // For returning users who already completed onboarding, show "Continue" as the CTA
  const heroCta = hasCompletedOnboarding && selectedCount > 0
    ? 'Continue to Checklist'
    : checklistData.meta.ctaText

   // Initialize Unicorn Studio background
  const unicornRef = useRef<HTMLDivElement>(null)
  useUnicornBackground(unicornRef)

  return (
    <div className="animate-page-enter">
      {/* Hero with Unicorn Studio background */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0" ref={unicornRef} />

        {/* Hero content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-16 md:px-[var(--page-padding)] md:pb-20">
          <h1 className="text-balance font-light text-foreground" style={{ fontSize: 'var(--font-size-display)', lineHeight: 'var(--line-height-display)' }}>
            {checklistData.meta.heroTitle}
          </h1>

          <p className="mt-6 max-w-xl text-[var(--foreground-secondary)]" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
            {checklistData.meta.heroSubtitle}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <Button
              className="rounded-sm px-10 font-normal"
              onClick={handleScrollToSelector}
              style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)', height: '56px' }}
              type="button"
            >
              {heroCta}
              <ArrowDown className="ml-2 size-4" />
            </Button>

            <span className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
              {checklistData.totalItems} security controls
            </span>
          </div>
        </div>
      </div>

      {/* Section selector */}
      <div
        className="mx-auto max-w-[var(--page-width)] px-6 md:px-[var(--page-padding)]"
        id="section-selector"
      >
        <div className="pt-16">
          <h2 className="font-normal uppercase text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
            Select security domains
          </h2>
          <p className="mt-2 text-[var(--foreground-secondary)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
            Choose the areas relevant to your deployment. You can always change your selection later.
          </p>

          {/* Bulk actions */}
          <div className="mt-6 flex items-center gap-3">
            <Button
              className="rounded-sm"
              onClick={selectedCount === totalSelectable ? onClearSelection : onSelectAllCore}
              style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)', height: '44px' }}
              type="button"
              variant="outline"
            >
              {selectedCount === totalSelectable ? 'Clear selection' : 'Select all'}
            </Button>
            {selectedCount > 0 && (
              <span className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
                {selectedCount} of {totalSelectable} selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section list */}
      <ul className="mx-auto mt-10 max-w-[var(--page-width)] space-y-6 px-6 pb-20 md:px-[var(--page-padding)] md:pb-36">
        {selectableSections.map((section) => {
          const isSelected = selectedSectionIds.includes(section.id)
          const sectionItems = section.subsections.flatMap((sub) => sub.items)
          const totalItems = sectionItems.length
          const progress = computeProgress(sectionItems, itemStates)
          const doneCount = sectionItems.filter(
            (item) => isDone(itemStates, item.id),
          ).length

          return (
            <li key={section.id}>
              <button
                aria-pressed={isSelected}
                className="group relative block w-full text-left"
                onClick={() => {
                  if (isSelected && onNavigateSection) {
                    onNavigateSection(section.id)
                  } else {
                    onToggleSection(section.id)
                  }
                }}
                type="button"
              >
                {/* Title row — title + hover arrow only */}
                <div className="flex items-center justify-between gap-4 pr-8">
                  <h3 className={`font-normal ${
                    isSelected ? 'text-foreground' : 'text-[var(--foreground-secondary)]'
                  }`} style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
                    {section.number}. {section.title}
                  </h3>

                  {/* Hover arrow — positioned in the padding area */}
                  <ArrowRight
                    className="size-5 shrink-0 text-foreground opacity-0 transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Description */}
                <p className="mt-1.5 text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                  {section.description}
                </p>

                {/* Progress row — count + progress bar below title */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-[3px] flex-1 overflow-hidden rounded-[1px] bg-[var(--progress-track)]">
                    <div
                      className={`h-full transition-all duration-150 ease-in-out ${
                        progress === 100 ? 'bg-[var(--progress-complete)]' : 'bg-[var(--accent)]'
                      }`}
                      style={{ width: `${progress ?? 0}%` }}
                    />
                  </div>
                  <span className={`shrink-0 tabular-nums ${
                    progress === 100
                      ? 'font-normal text-[var(--progress-complete)]'
                      : 'text-[var(--foreground-muted)]'
                  }`} style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                    {progress === 100 ? 'Completed' : `${doneCount}/${totalItems}`}
                  </span>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute -left-5 top-3 hidden h-2 w-2 rounded-full bg-[var(--accent)] md:block" />
                )}
              </button>
            </li>
          )
        })}

        {/* Reference-only section 8 */}
        {referenceSection && (
          <li className="opacity-50">
            <div className="pr-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-normal text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
                  {referenceSection.number}. {referenceSection.title}
                </h3>
                <span className="shrink-0 rounded-sm bg-[var(--background-tertiary)] px-1.5 py-0.5 font-normal uppercase text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-overline)', lineHeight: 'var(--line-height-overline)' }}>
                  Reference only
                </span>
              </div>
              <p className="mt-1.5 text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
                {referenceSection.description}
              </p>
            </div>
            <div className="mt-3 h-[3px] w-full rounded-[1px] bg-[var(--progress-track)]" />
          </li>
        )}

        {/* Start CTA */}
        <li className="pt-8">
          {selectedCount === 0 ? (
            <p className="text-[var(--foreground-muted)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
              Select at least one security domain to begin.
            </p>
          ) : (
            <Button
              className="rounded-sm px-10 font-normal"
              onClick={onStartChecklist}
              style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)', height: '56px' }}
              type="button"
            >
              Start Checklist ({selectedCount} {selectedCount === 1 ? 'section' : 'sections'})
            </Button>
          )}
        </li>
      </ul>
    </div>
  )
}
