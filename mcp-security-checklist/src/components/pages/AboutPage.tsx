import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function AboutPage() {
  return (
    <div className="animate-page-enter">
      <div className="mx-auto max-w-[var(--page-width)] px-6 py-16 md:px-[var(--page-padding)] md:py-24">
        <Button
          asChild
          className="mb-8 h-9 rounded-sm px-3 font-normal"
          variant="ghost"
        >
          <a href="#/">
            <ArrowLeft className="mr-1.5 size-3.5" />
            Back to checklist
          </a>
        </Button>

        <h1 className="font-light text-foreground" style={{ fontSize: 'var(--font-size-display)', lineHeight: 'var(--line-height-display)' }}>
          About this project
        </h1>

        <div className="mt-8 space-y-6 text-[var(--foreground-secondary)]" style={{ fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-body)' }}>
          <p>
            The MCP Security Checklist is an open-source, interactive checklist designed to help
            teams plan, implement, and validate security controls for Model Context Protocol (MCP) deployments.
          </p>

          <p>
            MCP is rapidly becoming the standard protocol for connecting AI models to external tools,
            data sources, and services. With this power comes significant security responsibility —
            from API validation and tool integrity to agentic workflow safety and governance compliance.
          </p>

          <h2 className="pt-4 font-normal text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
            Sources & methodology
          </h2>

          <p>
            This checklist synthesizes security guidance from multiple authoritative sources:
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>OWASP Secure MCP Server Development Guide v1.0 (Feb 2026)</li>
            <li>SlowMist MCP-Security-Checklist (2025)</li>
            <li>OWASP Cheat Sheet for Third-Party MCP Servers v1.0</li>
            <li>OWASP Top 10 for Agentic Applications 2026</li>
            <li>OWASP LLM AI Security & Governance Checklist v1.1</li>
            <li>OWASP AI Red Teaming Vendor Evaluation Guide v1.0</li>
            <li>Recent academic research (arXiv 2506.01333, 2506.02040, 2512.06556, 2505.14590)</li>
          </ul>

          <h2 className="pt-4 font-normal text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
            Priority levels
          </h2>

          <ul className="space-y-3 pl-0">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-block h-5 min-w-5 rounded-sm bg-[var(--critical-light)] text-center text-xs font-medium leading-5 text-[var(--critical-foreground)]">C</span>
              <span><strong className="text-foreground">Critical</strong> — Must not be omitted; omission leads to direct system failure or compromise</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-block h-5 min-w-5 rounded-sm bg-[var(--high-light)] text-center text-xs font-medium leading-5 text-[var(--high-foreground)]">H</span>
              <span><strong className="text-foreground">High</strong> — Strongly recommended; omission significantly degrades security posture</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-block h-5 min-w-5 rounded-sm bg-[var(--recommended-light)] text-center text-xs font-medium leading-5 text-[var(--recommended-foreground)]">R</span>
              <span><strong className="text-foreground">Recommended</strong> — Good practice; may be omitted in specific, justified contexts</span>
            </li>
          </ul>

          <h2 className="pt-4 font-normal text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
            How it works
          </h2>

          <p>
            Select the security domains relevant to your deployment, then work through the controls
            in each section. Each item can be marked as completed, not applicable (N/A), or left unchecked.
            Your progress is saved locally in your browser — no data is sent to any server.
          </p>

          <p>
            The checklist covers 228 security controls across 7 domains, from MCP server hardening
            to cryptocurrency-specific protections. Section 8 provides reference tooling recommendations
            and is not part of the scored checklist.
          </p>

          <h2 className="pt-4 font-normal text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
            License
          </h2>

          <p>
            This project is open-source under the MIT license. Contributions are welcome via{' '}
            <a
              className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
              href="https://github.com/jitesh-a/mcp-security-checklist"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
