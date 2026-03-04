import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

interface SourceRef {
  label: string
  url?: string
}

interface ChecklistItem {
  id: string
  title: string
  description: string
  priority: 'CRITICAL' | 'HIGH' | 'RECOMMENDED'
  roles: string[]
  tags: string[]
  sources: SourceRef[]
  incidentRefs?: string[]
}

interface SubSection {
  id: string
  number: string
  title: string
  description?: string
  items: ChecklistItem[]
}

interface Section {
  id: string
  number: number
  title: string
  icon: string
  description: string
  whyItMatters?: string
  subsections: SubSection[]
}

interface SiteMeta {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  siteTitle: string
  siteDescription: string
}

interface ChecklistData {
  version: string
  lastUpdated: string
  totalItems: number
  meta: SiteMeta
  sections: Section[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '../..')

const sourceCatalog: SourceRef[] = [
  { label: 'OWASP Secure MCP Server Development Guide v1.0 (Feb 2026)' },
  { label: 'SlowMist MCP-Security-Checklist (2025)' },
  { label: 'OWASP Cheat Sheet for Third-Party MCP Servers v1.0' },
  { label: 'OWASP Top 10 for Agentic Applications 2026' },
  { label: 'OWASP LLM AI Security & Governance Checklist v1.1' },
  { label: 'OWASP AI Red Teaming Vendor Evaluation Guide v1.0' },
  { label: 'Academic Research: arXiv 2506.01333, 2506.02040, 2512.06556, 2505.14590' },
]

const sectionMeta = new Map<number, Omit<Section, 'number' | 'subsections'>>([
  [1, { id: 'mcp-server', title: 'MCP Server Security', icon: 'Shield', description: 'Server-side controls for MCP endpoints, tools, runtime isolation, and operational security.' }],
  [2, { id: 'mcp-client', title: 'MCP Client / Host Security', icon: 'Monitor', description: 'Host and client protections for safe server interactions, user approvals, and secure operation flows.' }],
  [3, { id: 'architecture', title: 'Secure MCP Architecture', icon: 'Network', description: 'Architecture-level controls for transport security, identity boundaries, and multi-MCP risk containment.' }],
  [4, { id: 'agentic', title: 'Agentic-Specific Security', icon: 'Bot', description: 'OWASP ASI01–ASI10 controls for agent goal safety, tool abuse prevention, and resilient autonomous workflows.' }],
  [5, { id: 'llm-execution', title: 'LLM Secure Execution', icon: 'Brain', description: 'Execution-layer controls to constrain model behavior, protect secrets, and defend tool invocation boundaries.' }],
  [6, { id: 'governance', title: 'Governance & Compliance', icon: 'Scale', description: 'Governance process, threat modeling, legal compliance, and continuous evaluation requirements.' }],
  [7, { id: 'crypto', title: 'Cryptocurrency-Specific MCP Security', icon: 'Wallet', description: 'High-assurance controls for wallet, signing, and transaction flows in crypto-enabled MCP deployments.' }],
  [8, { id: 'tools', title: 'Security Tools & Continuous Validation', icon: 'Wrench', description: 'Reference tooling and operational validation guidance for ongoing security assurance.' }],
])

const sectionPrefix = new Map<number, string>([
  [1, 'srv'],
  [2, 'cli'],
  [3, 'arc'],
  [4, 'agn'],
  [5, 'llm'],
  [6, 'gov'],
  [7, 'cry'],
  [8, 'tls'],
])

const subsectionPrefix = new Map<string, string>([
  ['1.1', 'api'],
  ['1.2', 'auth'],
  ['1.3', 'tool'],
  ['1.4', 'data'],
  ['1.5', 'prompt'],
  ['1.6', 'supply'],
  ['1.7', 'runtime'],
  ['1.8', 'persist'],
  ['1.9', 'monitor'],
  ['1.10', 'privacy'],
  ['1.11', 'resource'],
  ['2.1', 'ui'],
  ['2.2', 'auth'],
  ['2.3', 'verify'],
  ['2.4', 'manage'],
  ['2.5', 'prompt'],
  ['2.6', 'audit'],
  ['2.7', 'token'],
  ['2.8', 'approve'],
  ['2.9', 'sample'],
  ['3.1', 'net'],
  ['3.2', 'session'],
  ['3.3', 'multi'],
  ['4.1', 'hijack'],
  ['4.2', 'misuse'],
  ['4.3', 'identity'],
  ['4.4', 'supply'],
  ['4.5', 'rce'],
  ['4.6', 'memory'],
  ['4.7', 'inter'],
  ['4.8', 'cascade'],
  ['4.9', 'trust'],
  ['4.10', 'rogue'],
  ['5.1', 'exec'],
  ['6.1', 'workflow'],
  ['6.2', 'inventory'],
  ['6.3', 'legal'],
  ['6.4', 'redteam'],
  ['7.1', 'wallet'],
])

const subsectionDescriptions = new Map<string, string>([
  ['1.1', 'API endpoints are the primary interface between AI models and MCP servers. Weak validation here allows injection attacks, path traversal, and unauthorized access.'],
  ['1.2', 'Authentication and authorization gate every request. Misconfigured identity controls create confused deputy vulnerabilities and unauthorized data access.'],
  ['1.3', 'Tools are executable capabilities exposed to AI. Without integrity verification, attackers can modify tool behavior, descriptions, or permissions post-approval.'],
  ['1.4', 'All data flowing through MCP must be validated and constrained. Uncontrolled inputs and outputs lead to injection, resource exhaustion, and context overflow.'],
  ['1.5', 'Prompt injection is the most prevalent attack vector in AI systems. These controls prevent external data from hijacking agent goals or triggering unauthorized actions.'],
  ['1.6', 'MCP servers depend on third-party packages and container images. Compromised dependencies introduce backdoors, credential theft, and supply chain attacks.'],
  ['1.7', 'Runtime environment configuration determines the blast radius of any breach. Hardened containers, network segmentation, and secrets management limit attacker movement.'],
  ['1.8', 'MCP plugins that persist after session end can maintain unauthorized access. Lifecycle controls ensure clean termination and prevent zombie processes.'],
  ['1.9', 'Without comprehensive audit trails, security incidents cannot be detected, investigated, or attributed. Monitoring provides the evidence chain for incident response.'],
  ['1.10', 'Data handled by MCP servers may include PII, credentials, and financial information. Encryption, minimization, and isolation prevent unauthorized exposure.'],
  ['1.11', 'Resources exposed by MCP servers must be access-controlled and size-limited to prevent data exfiltration and abuse through unrestricted resource access.'],
  ['2.1', 'Users are the final defense against malicious tool behavior. Full transparency into tool operations prevents hidden actions and social engineering attacks.'],
  ['2.2', 'Client authentication establishes identity before any server communication. Without it, anonymous clients can access sensitive tools and data.'],
  ['2.3', 'Clients must verify they are communicating with legitimate servers. Without verification, man-in-the-middle attacks and server impersonation go undetected.'],
  ['2.4', 'Managing which tools and servers are active prevents exposure to malicious or outdated components. Version control and conflict resolution reduce attack surface.'],
  ['2.5', 'Prompts are the control plane for AI behavior. Prompt injection, context contamination, and instruction override can redirect agent actions entirely.'],
  ['2.6', 'Client-side logs capture the full picture of interactions that server logs may miss. They are essential for detecting compromised servers and anomalous patterns.'],
  ['2.7', 'Stored tokens and credentials are high-value targets. Secure storage with scope limitation prevents token theft and privilege escalation.'],
  ['2.8', 'Auto-approval bypasses human oversight. Without careful control, malicious tools can execute destructive actions without user awareness.'],
  ['2.9', 'Sampling requests can leak sensitive context to models. Controlling what data enters sampling prevents unintended information disclosure.'],
  ['3.1', 'Transport security is the foundation of all MCP communication. Unencrypted or weakly authenticated channels expose every message to interception and tampering.'],
  ['3.2', 'Session isolation prevents cross-user data leakage. Without it, one user\'s data, tokens, and context can be accessed by another user or agent.'],
  ['3.3', 'Multiple MCP servers in one environment create compound attack surfaces. A compromised server can cascade attacks to others through shared context or function calls.'],
  ['4.1', 'Agent goal hijacking redirects autonomous systems to attacker-controlled objectives. Locked system prompts and validated inputs prevent goal drift and override.'],
  ['4.2', 'Tools are the hands of the agent. Without least-privilege profiles and approval gates, a compromised agent can delete data, transfer funds, or exfiltrate secrets.'],
  ['4.3', 'Agent identities control what each agent can access. Shared or inherited credentials allow privilege escalation and confused deputy attacks across agent hierarchies.'],
  ['4.4', 'Agentic supply chains include tool libraries, model weights, and MCP packages. Unvetted components introduce backdoors and malicious behavior into agent workflows.'],
  ['4.5', 'Agents may trigger code execution through tools or model outputs. Without sandboxing, this creates remote code execution vulnerabilities in the host environment.'],
  ['4.6', 'Agent memory persists across interactions. Poisoned memory can alter future decisions, inject false context, and cascade misinformation through RAG pipelines.'],
  ['4.7', 'Inter-agent messages can carry malicious payloads. Without authentication and schema validation, one compromised agent can subvert an entire multi-agent system.'],
  ['4.8', 'Cascading failures amplify single-point compromises into system-wide outages. Circuit breakers and timeout policies contain blast radius and prevent runaway chains.'],
  ['4.9', 'Agents can deceive human operators through misleading summaries or false confirmations. Validation checks ensure humans make informed approval decisions.'],
  ['4.10', 'Rogue agents operate outside their defined policies. Behavioral monitoring and kill switches provide last-resort controls against misaligned autonomous behavior.'],
  ['5.1', 'The LLM execution layer directly processes prompts and invokes tools. Without guardrails, malicious prompts can extract secrets, hijack priorities, or bypass filters.'],
  ['6.1', 'Governance workflows ensure no tool or server goes live without security review. Without formal approval processes, untested components reach production.'],
  ['6.2', 'Threat modeling identifies attack surfaces before they are exploited. An AI asset inventory provides the foundation for risk assessment and control prioritization.'],
  ['6.3', 'Legal and regulatory requirements define minimum compliance thresholds. Incident response playbooks ensure rapid, coordinated responses to MCP-specific attacks.'],
  ['6.4', 'Red teaming validates controls against realistic adversarial scenarios. Without it, theoretical protections may fail against actual attack techniques.'],
  ['7.1', 'Cryptocurrency operations involve irreversible financial transactions. Enhanced security measures for private keys, transaction verification, and wallet isolation are critical.'],
])

const siteMeta: SiteMeta = {
  heroTitle: 'Secure your MCP deployment',
  heroSubtitle: 'An open-source security checklist for the AI tool ecosystem. Track your progress across 228 controls derived from OWASP, SlowMist, and recent academic research.',
  ctaText: 'Get started',
  siteTitle: 'MCP Security Checklist',
  siteDescription: 'An interactive, open-source security checklist for Model Context Protocol deployments, covering server security, client security, agentic workflows, governance, and more.',
}

const rolePatterns: Array<{ role: string; regex: RegExp }> = [
  { role: 'compliance', regex: /compliance|regulatory|legal|gdpr|ccpa|governance|policy/i },
  { role: 'architect', regex: /architecture|network|transport|session|isolation|tenant|protocol/i },
  { role: 'devops', regex: /deployment|runtime|container|ci\/cd|pipeline|siem|monitor|logging|infrastructure|kubernetes|networkpolicies/i },
  { role: 'developer', regex: /tool|code|api|schema|validation|prompt|input|output|json|execution|memory|template/i },
  { role: 'security-engineer', regex: /security|auth|oauth|token|permission|threat|audit|encryption|incident|rce|sandbox|vulnerab|attack/i },
]

const tagPatterns: Array<{ tag: string; regex: RegExp }> = [
  { tag: 'authentication', regex: /auth|oauth|oidc|mfa|identity|certificate|pkce|token/i },
  { tag: 'authorization', regex: /rbac|least privilege|scope|permission|allowlist|approval/i },
  { tag: 'input-validation', regex: /input|output|schema|sanitize|validation|json/i },
  { tag: 'prompt-injection', regex: /prompt|injection|instruction|context/i },
  { tag: 'tool-security', regex: /tool|manifest|version pin|rug pull|namespace/i },
  { tag: 'supply-chain', regex: /supply|dependency|checksum|artifact|scorecard|osv|registry/i },
  { tag: 'runtime-security', regex: /runtime|sandbox|container|seccomp|apparmor|non-root|rce/i },
  { tag: 'network-security', regex: /tls|mtls|network|egress|waf|ssrf|socket|origin/i },
  { tag: 'monitoring', regex: /logging|audit|siem|alert|anomaly|forensic/i },
  { tag: 'privacy', regex: /privacy|sensitive|pii|encryption|data minimization/i },
  { tag: 'governance', regex: /governance|workflow|review|approval|policy-as-code|inventory|threat model/i },
  { tag: 'agentic-security', regex: /agent|asi\d+|goal|memory|inter-agent|kill switch|misalignment/i },
  { tag: 'crypto-security', regex: /wallet|private key|hsm|on-chain|transfer|mnemonic|totp/i },
]

const incidentPatterns = [
  /EchoLeak/gi,
  /VS Code RCE Sep 2025/gi,
  /Postmark MCP impersonation(?: incident)?(?:, Sep 2025)?/gi,
  /CVE-\d{4}-\d+/gi,
]

function inferRoles(title: string, description: string): string[] {
  const text = `${title} ${description}`
  const roles = rolePatterns
    .filter((entry) => entry.regex.test(text))
    .map((entry) => entry.role)

  if (roles.length === 0) {
    return ['security-engineer']
  }

  return [...new Set(roles)]
}

function inferTags(title: string, description: string, priority: ChecklistItem['priority']): string[] {
  const text = `${title} ${description}`
  const tags = tagPatterns
    .filter((entry) => entry.regex.test(text))
    .map((entry) => entry.tag)

  tags.push(`priority-${priority.toLowerCase()}`)

  if (tags.length === 1) {
    tags.push('mcp-security')
  }

  return [...new Set(tags)]
}

function inferSources(sectionNumber: number): SourceRef[] {
  if (sectionNumber === 4) {
    return [sourceCatalog[3], sourceCatalog[0], sourceCatalog[6]]
  }

  if (sectionNumber === 6) {
    return [sourceCatalog[4], sourceCatalog[5], sourceCatalog[0]]
  }

  if (sectionNumber === 5) {
    return [sourceCatalog[4], sourceCatalog[0]]
  }

  return [sourceCatalog[0], sourceCatalog[1], sourceCatalog[2]]
}

function extractIncidentRefs(description: string): string[] | undefined {
  const refs = new Set<string>()

  for (const pattern of incidentPatterns) {
    const matches = description.match(pattern)
    if (!matches) {
      continue
    }

    for (const match of matches) {
      refs.add(match.trim())
    }
  }

  if (refs.size === 0) {
    return undefined
  }

  return [...refs]
}

function sanitizeText(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildChecklistData(markdown: string): ChecklistData {
  const lines = markdown.split(/\r?\n/)

  const sections = new Map<number, Section>()
  let currentSectionNumber: number | null = null
  let currentSubSection: SubSection | null = null
  const subsectionCounters = new Map<string, number>()
  let pendingBlockquote: string | null = null

  const sectionRegex = /^##\s+(\d+)\.\s+(.+)$/
  const subsectionRegex = /^###\s+((\d+)\.(\d+))\s+(.+)$/
  const itemRegex = /^-\s+(🔴|🟡|🟢)\s+\*\*\[(CRITICAL|HIGH|RECOMMENDED)\]\s+(.+?):\*\*\s+(.+)$/
  const blockquoteRegex = /^>\s+(.+)$/

  for (const line of lines) {
    const sectionMatch = line.match(sectionRegex)
    if (sectionMatch) {
      const sectionNumber = Number(sectionMatch[1])
      const section = sections.get(sectionNumber)

      if (!section && sectionMeta.has(sectionNumber)) {
        const meta = sectionMeta.get(sectionNumber)
        if (!meta) {
          continue
        }

        sections.set(sectionNumber, {
          ...meta,
          number: sectionNumber,
          subsections: [],
        })
      }

      currentSectionNumber = sectionNumber
      currentSubSection = null
      pendingBlockquote = null
      continue
    }

    // Parse blockquotes after section headings (before any subsection)
    if (currentSectionNumber !== null && currentSubSection === null) {
      const blockquoteMatch = line.match(blockquoteRegex)
      if (blockquoteMatch) {
        const text = blockquoteMatch[1].trim()
        if (pendingBlockquote) {
          pendingBlockquote += ' ' + text
        } else {
          pendingBlockquote = text
        }

        const section = sections.get(currentSectionNumber)
        if (section && pendingBlockquote) {
          section.whyItMatters = pendingBlockquote
        }

        continue
      }
    }

    const subsectionMatch = line.match(subsectionRegex)
    if (subsectionMatch && currentSectionNumber !== null) {
      const subsectionNumber = subsectionMatch[1]
      const sectionForSub = Number(subsectionMatch[2])
      if (sectionForSub !== currentSectionNumber) {
        continue
      }

      const title = sanitizeText(subsectionMatch[4])
      const subId = subsectionPrefix.get(subsectionNumber) ?? `sub${subsectionNumber.replace('.', '')}`

      const section = sections.get(currentSectionNumber)
      if (!section) {
        continue
      }

      const subsection: SubSection = {
        id: `${sectionPrefix.get(currentSectionNumber)}-${subId}`,
        number: subsectionNumber,
        title,
        items: [],
      }

      const subDescription = subsectionDescriptions.get(subsectionNumber)
      if (subDescription) {
        subsection.description = subDescription
      }

      section.subsections.push(subsection)
      currentSubSection = subsection
      continue
    }

    const itemMatch = line.match(itemRegex)
    if (itemMatch && currentSectionNumber !== null) {
      const priority = itemMatch[2] as ChecklistItem['priority']
      const title = sanitizeText(itemMatch[3])
      const description = sanitizeText(itemMatch[4])

      const section = sections.get(currentSectionNumber)
      if (!section) {
        continue
      }

      if (!currentSubSection) {
        const syntheticNumber = `${currentSectionNumber}.1`
        const syntheticSubPrefix = subsectionPrefix.get(syntheticNumber) ?? 'general'

        currentSubSection = {
          id: `${sectionPrefix.get(currentSectionNumber)}-${syntheticSubPrefix}`,
          number: syntheticNumber,
          title: section.title,
          items: [],
        }

        const syntheticDescription = subsectionDescriptions.get(syntheticNumber)
        if (syntheticDescription) {
          currentSubSection.description = syntheticDescription
        }

        section.subsections.push(currentSubSection)
      }

      const sectionShort = sectionPrefix.get(currentSectionNumber)
      const subsectionShort = currentSubSection.id.split('-')[1] ?? 'item'
      const counterKey = `${sectionShort}-${subsectionShort}`
      const nextCounter = (subsectionCounters.get(counterKey) ?? 0) + 1
      subsectionCounters.set(counterKey, nextCounter)

      const item: ChecklistItem = {
        id: `${sectionShort}-${subsectionShort}-${String(nextCounter).padStart(3, '0')}`,
        title,
        description,
        priority,
        roles: inferRoles(title, description),
        tags: inferTags(title, description, priority),
        sources: inferSources(currentSectionNumber),
      }

      const incidentRefs = extractIncidentRefs(description)
      if (incidentRefs) {
        item.incidentRefs = incidentRefs
      }

      currentSubSection.items.push(item)
    }
  }

  const orderedSections = [...sections.values()].sort((a, b) => a.number - b.number)
  const totalItems = orderedSections
    .filter((section) => section.id !== 'tools')
    .flatMap((section) => section.subsections)
    .flatMap((subsection) => subsection.items).length

  return {
    version: '2026.1',
    lastUpdated: '2026-03-03',
    totalItems,
    meta: siteMeta,
    sections: orderedSections,
  }
}

async function main() {
  const checklistPath = path.resolve(repoRoot, 'docs/checklist.md')
  const checklistMarkdown = await readFile(checklistPath, 'utf-8')

  const checklistData = buildChecklistData(checklistMarkdown)
  const outputDir = path.resolve(repoRoot, 'mcp-security-checklist/src/data')
  await mkdir(outputDir, { recursive: true })

  const checklistJsonPath = path.resolve(outputDir, 'checklist.json')
  await writeFile(checklistJsonPath, `${JSON.stringify(checklistData, null, 2)}\n`, 'utf-8')

  const changelog = {
    versions: [
      {
        version: '2026.1',
        date: '2026-03-03',
        changes: ['Initial release with 228 security controls'],
      },
    ],
  }

  const changelogPath = path.resolve(outputDir, 'changelog.json')
  await writeFile(changelogPath, `${JSON.stringify(changelog, null, 2)}\n`, 'utf-8')

  const itemCount = checklistData.sections
    .filter((section) => section.id !== 'tools')
    .flatMap((section) => section.subsections)
    .flatMap((subsection) => subsection.items).length

  console.log(`Generated checklist data with ${itemCount} items in ${checklistData.sections.length} sections.`)
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Unknown error while generating checklist data')
  }

  process.exit(1)
})