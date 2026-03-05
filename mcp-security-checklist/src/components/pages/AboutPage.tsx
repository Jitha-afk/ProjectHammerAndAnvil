import { useEffect, useState } from 'react'
import { ArrowLeft, X, ZoomIn } from 'lucide-react'

import mcpAttackSurface from '@/assets/img/mcpattacksurface.png'
import { Button } from '@/components/ui/button'

export function AboutPage() {
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!isZoomed) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomed(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isZoomed])

  return (
    <div className="animate-page-enter">
      <div className="mx-auto max-w-[var(--page-width)] px-6 py-8 md:px-[var(--page-padding)] md:py-12">
        <Button
          asChild
          className="mb-8 h-9 rounded-sm border border-transparent bg-transparent px-3 font-normal text-foreground hover:border-border hover:bg-transparent hover:text-foreground dark:hover:bg-transparent dark:hover:text-foreground"
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
            The checklist covers 200+ security controls across 7 domains, from MCP client or server hardening
            to architectural considerations. Section 8 provides reference tooling recommendations
            and is not part of the scored checklist.
          </p>

          <figure className="group relative mt-6 overflow-hidden rounded-md border border-[var(--border)]" style={{ marginLeft: 'calc(-1 * var(--page-padding, 2rem))', marginRight: 'calc(-1 * var(--page-padding, 2rem))', width: 'calc(100% + 2 * var(--page-padding, 2rem))' }}>
            <button
              aria-label="Zoom image"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-sm bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              onClick={() => setIsZoomed(true)}
              type="button"
            >
              <ZoomIn className="size-4" />
            </button>
            <img
              alt="MCP attack surface diagram illustrating the threat landscape across protocol layers"
              className="w-full cursor-zoom-in object-contain"
              onClick={() => setIsZoomed(true)}
              src={mcpAttackSurface}
            />
            <figcaption className="border-t border-[var(--border)] px-4 py-2 text-center text-xs text-[var(--foreground-secondary)]">
              MCP attack surface across protocol layers — from{' '}
              <a
                className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
                href="https://arxiv.org/abs/2508.13220"
                rel="noreferrer"
                target="_blank"
              >
                MCPSecBench (arXiv:2508.13220)
              </a>
            </figcaption>
          </figure>

          {isZoomed && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
              onClick={() => setIsZoomed(false)}
            >
              <button
                aria-label="Close zoom"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-white/20"
                onClick={() => setIsZoomed(false)}
                type="button"
              >
                <X className="size-5" />
              </button>
              <img
                alt="MCP attack surface diagram illustrating the threat landscape across protocol layers"
                className="max-h-full max-w-full cursor-zoom-out rounded-md object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                src={mcpAttackSurface}
              />
            </div>
          )}

          <h2 className="pt-4 font-normal text-foreground" style={{ fontSize: 'var(--font-size-title)', lineHeight: 'var(--line-height-title)' }}>
            Sources & methodology
          </h2>

          <p>
            This checklist synthesizes security guidance from multiple authoritative sources:
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>OWASP Secure MCP Server Development Guide v1.0 (Feb 2026)</li>
            <li>OWASP Cheat Sheet for Third-Party MCP Servers v1.0</li>
            <li>OWASP Top 10 for Agentic Applications 2026</li>
            <li>OWASP LLM AI Security & Governance Checklist v1.1</li>
            <li>OWASP AI Red Teaming Vendor Evaluation Guide v1.0</li>
            <li>SlowMist MCP-Security-Checklist (2025)</li>
            <li>
              <a
                className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
                href="https://arxiv.org/abs/2505.14590"
                rel="noreferrer"
                target="_blank"
              >
                arXiv:2505.14590
              </a>
              {' — '}
              MCIP: Protecting MCP Safety via Model Contextual Integrity Protocol
              {' (Jing et al., 2025)'}
            </li>
            <li>
              <a
                className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
                href="https://arxiv.org/abs/2506.01333"
                rel="noreferrer"
                target="_blank"
              >
                arXiv:2506.01333
              </a>
              {' — '}
              ETDI: Mitigating Tool Squatting and Rug Pull Attacks in Model Context Protocol (MCP) by using OAuth-Enhanced Tool Definitions and Policy-Based Access Control
              {' (Bhatt, Narajala & Habler, 2025)'}
            </li>
            <li>
              <a
                className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
                href="https://arxiv.org/abs/2506.02040"
                rel="noreferrer"
                target="_blank"
              >
                arXiv:2506.02040
              </a>
              {' — '}
              Beyond the Protocol: Unveiling Attack Vectors in the Model Context Protocol (MCP) Ecosystem
              {' (Song et al., 2025)'}
            </li>
            <li>
              <a
                className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
                href="https://arxiv.org/abs/2512.06556"
                rel="noreferrer"
                target="_blank"
              >
                arXiv:2512.06556
              </a>
              {' — '}
              Securing the Model Context Protocol: Defending LLMs Against Tool Poisoning and Adversarial Attacks
              {' (Jamshidi et al., 2025)'}
            </li>
            <li>
              <a
                className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
                href="https://arxiv.org/abs/2504.08623"
                rel="noreferrer"
                target="_blank"
              >
                arXiv:2504.08623
              </a>
              {' — '}
              Enterprise-Grade Security for the Model Context Protocol (MCP): Frameworks and Mitigation Strategies
              {' (Narajala & Habler, 2025)'}
            </li>
            <li>
              <a
                className="text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
                href="https://arxiv.org/abs/2508.13220"
                rel="noreferrer"
                target="_blank"
              >
                arXiv:2508.13220
              </a>
              {' — '}
              MCPSecBench: A Systematic Security Benchmark and Playground for Testing Model Context Protocols
              {' (Yang et al., 2025)'}
            </li>
          </ul>

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
