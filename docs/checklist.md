# MCP Security Checklist 2026
## A Comprehensive Security Guide for the AI Tool Ecosystem

> **Sources:** OWASP Secure MCP Server Development Guide v1.0 (Feb 2026), SlowMist MCP-Security-Checklist (2025), OWASP Cheat Sheet for Third-Party MCP Servers v1.0, OWASP Top 10 for Agentic Applications 2026, OWASP LLM AI Security & Governance Checklist v1.1, OWASP AI Red Teaming Vendor Evaluation Guide v1.0, and recent academic research (arXiv 2506.01333, 2506.02040, 2512.06556, 2505.14590).

> **Priority Levels:**
> - 🔴 **[CRITICAL]** — Must not be omitted; omission leads to direct system failure or compromise
> - 🟡 **[HIGH]** — Strongly recommended; omission significantly degrades security posture
> - 🟢 **[RECOMMENDED]** — Good practice; may be omitted in specific, justified contexts

---

## 📚 Table of Contents

1. [MCP Server Security](#1-mcp-server-security)
   - 1.1 API Security
   - 1.2 Server Authentication & Authorization
   - 1.3 Tool Security & Integrity
   - 1.4 Data Validation & Resource Management
   - 1.5 Prompt Injection Controls
   - 1.6 Supply Chain Security
   - 1.7 Deployment & Runtime Security
   - 1.8 Background Persistence Control
   - 1.9 Monitoring & Logging
   - 1.10 Data Security & Privacy
   - 1.11 Resources Security
2. [MCP Client / Host Security](#2-mcp-client--host-security)
   - 2.1 User Interaction Security
   - 2.2 Client Authentication & Authorization
   - 2.3 Server Verification & Communication Security
   - 2.4 MCP Tools & Servers Management
   - 2.5 Prompt Security
   - 2.6 Logging & Auditing
   - 2.7 Permission Token Storage & Management
   - 2.8 Auto-Approve Control
   - 2.9 Sampling Security
3. [Secure MCP Architecture](#3-secure-mcp-architecture)
   - 3.1 Transport & Network Security
   - 3.2 Session & Identity Isolation
   - 3.3 Multi-MCP Scenario Security
4. [Agentic-Specific Security (NEW)](#4-agentic-specific-security-new)
   - 4.1 Agent Goal Hijack Prevention (ASI01)
   - 4.2 Tool Misuse & Exploitation Prevention (ASI02)
   - 4.3 Identity & Privilege Abuse Prevention (ASI03)
   - 4.4 Agentic Supply Chain Security (ASI04)
   - 4.5 Unexpected Code Execution / RCE Prevention (ASI05)
   - 4.6 Memory & Context Poisoning Prevention (ASI06)
   - 4.7 Inter-Agent Communication Security (ASI07)
   - 4.8 Cascading Failure Prevention (ASI08)
   - 4.9 Human-Agent Trust Exploitation (ASI09)
   - 4.10 Rogue Agent Controls (ASI10)
5. [LLM Secure Execution](#5-llm-secure-execution)
6. [Governance & Compliance](#6-governance--compliance)
   - 6.1 Governance Workflow
   - 6.2 AI Asset Inventory & Threat Modeling
   - 6.3 Legal & Regulatory
   - 6.4 AI Red Teaming
7. [Cryptocurrency-Specific MCP Security](#7-cryptocurrency-specific-mcp-security)
8. [Security Tools & Continuous Validation](#8-security-tools--continuous-validation)

---

## 1. MCP Server Security

> The MCP Server provides external tools, resources, and functionalities that AI can invoke. It is the primary attack surface in the MCP ecosystem.

### 1.1 API Security

- 🔴 **[CRITICAL] Input Validation:** Enforce strict validation on all API inputs to prevent injection attacks, path traversal (`../`), and invalid parameters. Reject anything that doesn't match the defined JSON Schema.
- 🔴 **[CRITICAL] Path Traversal Protection:** Validate all file path arguments against configured boundaries; prohibit directory traversal sequences. (82% of MCP servers fail this check per Endor Labs.)
- 🔴 **[CRITICAL] Command Injection Prevention:** Sanitize all CLI flags and shell-bound parameters; never concatenate user input directly into system calls. (43% of MCP servers are vulnerable per Equixly.)
- 🟡 **[HIGH] API Rate Limiting:** Implement per-session and per-user call rate limits to prevent abuse and DoS attacks.
- 🟡 **[HIGH] Output Encoding:** Properly encode all API outputs; prevent injection payloads from escaping serialization boundaries.
- 🟡 **[HIGH] Size Limits:** Enforce maximum size constraints on all inputs and outputs to prevent context overflows or memory exhaustion.
- 🟢 **[RECOMMENDED] Schema-Driven Responses:** Define strict JSON schemas for all tool responses and reject deviations at the transport layer.

### 1.2 Server Authentication & Authorization

- 🔴 **[CRITICAL] OAuth 2.1 / OIDC Enforcement:** All remote MCP servers must use OAuth 2.1 or OIDC for client and user identity. Validate `iss`, `aud`, `exp`, and signatures on every request.
- 🔴 **[CRITICAL] No Token Passthrough:** Never forward client tokens to downstream APIs; use tokens explicitly issued to the MCP server or use validated OAuth "On-Behalf-Of" flows (RFC 8693). Direct passthrough creates a Confused Deputy vulnerability.
- 🔴 **[CRITICAL] Short-Lived, Scoped Tokens:** Issue access tokens with minimal lifetimes (minutes) and narrow scopes. Revalidate on each call before any tool or resource access.
- 🔴 **[CRITICAL] Least Privilege:** Run service processes and tools with the minimum required permissions. Never run as root.
- 🟡 **[HIGH] Role-Based Access Control (RBAC):** Implement role-based access control, limiting resource access per identity and enforcing least privilege by default.
- 🟡 **[HIGH] Credential Management:** Securely manage and store service credentials; never hard-code secrets; use secrets vaults (e.g., HashiCorp Vault, AWS Secrets Manager). Never expose secrets to the LLM layer.
- 🟡 **[HIGH] External Service Authentication:** Use secure, scoped authentication when calling third-party services.
- 🟡 **[HIGH] API Key Rotation:** Automatically rotate API keys and service credentials on a schedule; limit key validity windows.
- 🟡 **[HIGH] Service Identity Authentication:** Provide a verifiable mechanism for clients to authenticate the server's identity.
- 🟡 **[HIGH] Centralized Policy Enforcement:** Use a dedicated policy/gateway layer to enforce authentication, authorization, consent, tool filtering, and audit logging consistently across all agents and servers.
- 🟢 **[RECOMMENDED] Dynamic Client Registration Protection:** If dynamic client registration is required, protect endpoints via access tokens, software statements (signed JWTs), or signed request bodies. Avoid open dynamic registration in production.
- 🟢 **[RECOMMENDED] Session Treated as State, Not Identity:** Never rely on session IDs alone for authorization. Bind sessions to validated OAuth identity; rotate and expire aggressively.

### 1.3 Tool Security & Integrity

- 🔴 **[CRITICAL] Cryptographic Tool Manifests:** Every tool must have a signed manifest (RSA/ECDSA) that includes its description, schema, version, and required permissions. Verify this signature and hash at load time and on every invocation.
- 🔴 **[CRITICAL] Tool Version Pinning & Rug Pull Prevention:** Pin approved tool versions using cryptographic hashes. Alert and block on any post-approval change to tool descriptions or behavior — this is the "rug pull" attack vector (post-approval descriptor mutations that subvert tool behavior).
- 🔴 **[CRITICAL] Tool Description vs. Behavior Validation:** Validate that a tool's advertised description matches its actual runtime code behavior. Flag any tool performing actions (e.g., network writes, file reads) not mentioned in its manifest.
- 🔴 **[CRITICAL] Tool Permission Control:** Each tool must only have the minimum permissions needed to complete its declared task.
- 🟡 **[HIGH] Strict Tool Onboarding & Approval:** Maintain a formal approval workflow (SAST, DAST, SCA, manual review) for adding or updating any tool or its description.
- 🟡 **[HIGH] Tool Isolation:** Execute tools in a controlled, sandboxed environment to prevent system-level impact or lateral movement.
- 🟡 **[HIGH] Tool Structure Validation:** Audit all fields of each tool. Expose only the minimal, strictly necessary fields to the model; keep internal metadata outside the model's context.
- 🟡 **[HIGH] Namespace Isolation:** Enforce strict namespace isolation for different tools to prevent tool name hijacking or typosquatting.
- 🟡 **[HIGH] Tool Behavior Constraints:** Restrict the range and types of actions a tool can perform; define per-tool capability profiles.
- 🟡 **[HIGH] Third-Party Interface Response Security:** Verify returned data from external interfaces matches expectations; never directly inject raw third-party responses into model context.
- 🟡 **[HIGH] Secure Error Handling:** Handle errors without exposing stack traces, tokens, filesystem paths, or tool internals to the model or client.
- 🟢 **[RECOMMENDED] Tool Classification:** Categorize tools by sensitivity and risk level; apply tiered review processes accordingly.
- 🟢 **[RECOMMENDED] Tool Registration & Deregistration:** Define clear, audited processes for adding and removing tools to prevent orphaned or stale tool registrations.

### 1.4 Data Validation & Resource Management

- 🔴 **[CRITICAL] Strict Input/Output Sanitization:** Treat all data as untrusted. Strip or escape sequences that could lead to XSS, SQL Injection, RCE, or path traversal. This applies to both inputs from the model and outputs returned to the model.
- 🔴 **[CRITICAL] JSON Schema Enforcement:** Define and enforce JSON Schemas for every tool's inputs and outputs. Reject any request that doesn't match.
- 🟡 **[HIGH] Resource Usage Quotas:** Impose per-session quotas and rate limits on tool invocations and data fetches. Enforce timeouts and isolated memory/compute budgets to prevent DoS or runaway processes.
- 🟡 **[HIGH] Resource Access Control:** Implement fine-grained access control for resources exposed by the MCP server.
- 🟡 **[HIGH] Resource Limits:** Limit the size and quantity of individual resources returned.
- 🟡 **[HIGH] Resource Template Security:** Validate and sanitize all template parameters before use.
- 🟢 **[RECOMMENDED] Sensitive Resource Labeling:** Label sensitive resources distinctly and apply specialized handling and access controls.

### 1.5 Prompt Injection Controls

- 🔴 **[CRITICAL] Structured Tool Invocation:** Favor structured JSON tool calls over free-form text commands. All model intent must flow through a schema-validated interface.
- 🔴 **[CRITICAL] Human-in-the-Loop (HITL) for High-Risk Actions:** For destructive or irreversible actions (deleting data, fund transfers, system-level changes), implement an approval checkpoint requiring explicit user confirmation (e.g., via MCP elicitations) before proceeding.
- 🟡 **[HIGH] Indirect Prompt Injection Defense:** Sanitize all external data sources (web pages, documents, RAG content, emails, calendar events) before they can influence agent goals or tool calls. Apply CDR (Content Disarm & Reconstruction) and prompt-carrier detection.
- 🟡 **[HIGH] LLM-as-a-Judge for High-Risk Actions:** For high-risk tool calls, run a dedicated approval check in a distinct LLM session with a policy prompt defining which calls and parameters are allowed.
- 🟡 **[HIGH] Context Compartmentalization (One Task, One Session):** Reset MCP sessions when an agent switches contexts or tasks to prevent hidden instructions from persisting in long conversation histories.
- 🟡 **[HIGH] Tool Description Scanning:** Scan tool descriptions, parameters, and metadata for hidden instructions, invisible Unicode characters, or semantic manipulation attempts.
- 🟢 **[RECOMMENDED] Prompt Templates:** Use secure, parameterized prompt templates to reduce injection risk.
- 🟢 **[RECOMMENDED] Prompt Consistency Verification:** Ensure identical prompts produce predictable and auditable results across environments.

### 1.6 Supply Chain Security

- 🔴 **[CRITICAL] Version Pinning & Checksums:** Pin all dependencies to exact versions with cryptographic checksums. Verify integrity at build and deploy time.
- 🔴 **[CRITICAL] Signed Container Images:** Use signed, immutable container images. Verify signatures before deployment.
- 🟡 **[HIGH] Dependency Scanning (SCA):** Integrate Software Composition Analysis tools (npm audit, pip audit, OSV-Scanner) into CI/CD. Block builds that introduce known-vulnerable dependencies.
- 🟡 **[HIGH] AIBOM (AI Bill of Materials):** Maintain an AI Bill of Materials for all builds to ensure provenance and detect tampering.
- 🟡 **[HIGH] Source Verification:** Validate the origin and authenticity of all third-party code and packages. Only connect to servers from trusted, vetted registries.
- 🟡 **[HIGH] Typosquatting Prevention:** Enforce fully qualified tool and package names. Fail closed on ambiguous name resolution.
- 🟡 **[HIGH] Secure Build Pipeline:** Enforce integrity throughout the build process; use policy-as-code (e.g., OPA) to gate insecure dependencies.
- 🟢 **[RECOMMENDED] OpenSSF Scorecard:** Evaluate dependencies and repositories using the OpenSSF Scorecard to assess security posture.
- 🟢 **[RECOMMENDED] CVE Monitoring:** Continuously monitor OSV and NVD for new vulnerabilities in dependencies.

### 1.7 Deployment & Runtime Security

- 🔴 **[CRITICAL] Containerization & Hardening:** Deploy MCP servers in minimal, hardened containers running as non-root users. Drop all unnecessary Linux capabilities.
- 🔴 **[CRITICAL] Secrets Vaulting:** Store all credentials, API keys, and tokens in a secrets vault. Never store secrets in environment variables, logs, or plaintext in code. Never allow the LLM access to secrets directly; use opaque middleware.
- 🔴 **[CRITICAL] Network Segmentation:** Place the server in a restricted network segment. Use firewall rules or Kubernetes NetworkPolicies to block all traffic except what is explicitly required.
- 🔴 **[CRITICAL] CI/CD Security Gates:** Integrate security scanning as a mandatory build gate. Fail builds that introduce vulnerabilities, unapproved dependencies, or policy violations.
- 🟡 **[HIGH] Isolation Environment:** Run servers in isolated environments (containers, VMs, or sandboxes) to prevent escape and mitigate lateral movement.
- 🟡 **[HIGH] Environment Variable Protection:** Ensure sensitive environment variables are not exposed in logs, error messages, or stack traces.
- 🟡 **[HIGH] Secure Boot:** Validate service boot processes with integrity checks.
- 🟡 **[HIGH] RCE Primitive Controls:** Secure or disable execute primitives (git hooks, smudge/clean filters, aliases, post-checkout scripts) that can be abused for arbitrary code execution.
- 🟡 **[HIGH] SSRF Prevention:** Validate and restrict all outbound network calls from tools; use egress allowlists to block Server-Side Request Forgery vectors. (30% of MCP servers are vulnerable to SSRF.)
- 🟢 **[RECOMMENDED] Immutable Infrastructure:** Adopt immutable infrastructure patterns; containers should not be modified in place after deployment.
- 🟢 **[RECOMMENDED] Secure Protocol Configuration:** Configure TLS with modern parameters; regularly review and update cipher suites.

### 1.8 Background Persistence Control

- 🟡 **[HIGH] Lifecycle Management:** Implement strict lifecycle management for MCP plugins; coordinate termination with the client.
- 🟡 **[HIGH] Shutdown Cleanup (Deterministic):** On session termination, disconnect, or timeout, immediately flush and destroy all associated file handles, temporary storage, in-memory contexts, and cached tokens.
- 🟡 **[HIGH] Background Activity Monitoring:** Monitor and log all MCP background activities; alert on anomalous persistence.
- 🟡 **[HIGH] Activity Restrictions:** Limit the operations and duration of MCP background processes.
- 🟢 **[RECOMMENDED] Health Check Mechanism:** Regularly check the status of MCP plugins to detect abnormal persistence or zombie processes.

### 1.9 Monitoring & Logging

- 🔴 **[CRITICAL] Comprehensive Audit Logs:** Log every action — tool invocations (with parameters), resource access, authentication/authorization events, and configuration changes (logging old and new values). Use field-level allowlists and redaction/hashing to prevent sensitive data from appearing in verbose logs.
- 🔴 **[CRITICAL] Immutable Log Storage:** Store logs securely and immutably for forensic analysis. Ensure log integrity; prevent tampering.
- 🟡 **[HIGH] Centralized SIEM Integration:** Feed MCP server audit logs into a centralized monitoring system (SIEM). Configure real-time alerts for suspicious patterns (spike in failed validations, high-frequency tool calls, unusual file access).
- 🟡 **[HIGH] Anomaly Detection:** Detect and alert on abnormal tool invocation patterns (mass file reads, excessive API calls, unusual chaining).
- 🟡 **[HIGH] Security Event Alerts:** Configure real-time alerts for critical security events (auth failures, schema violations, unexpected tool behavior).
- 🟢 **[RECOMMENDED] Behavioral Baseline:** Establish a behavioral baseline for normal tool-use patterns and alert on deviations.

### 1.10 Data Security & Privacy

- 🔴 **[CRITICAL] Data Encryption:** Encrypt sensitive data both in storage and in transit (TLS 1.2+ minimum).
- 🟡 **[HIGH] Data Minimization:** Collect and process only the data necessary for the task.
- 🟡 **[HIGH] Data Isolation:** Ensure effective isolation of different users' data. No shared mutable state across sessions or users.
- 🟡 **[HIGH] Sensitive Data Identification:** Automatically identify and apply specialized handling for sensitive data (PII, credentials, financial data).
- 🟢 **[RECOMMENDED] Data Access Control:** Enforce strict, auditable access controls on all stored data.

### 1.11 Resources Security

- 🟡 **[HIGH] Resource Access Control:** Implement fine-grained access control for each resource type.
- 🟡 **[HIGH] Resource Size & Count Limits:** Limit the size and number of resources per session to prevent abuse.
- 🟢 **[RECOMMENDED] Resource Template Security:** Validate and sanitize all template parameters before materializing resources.

---

## 2. MCP Client / Host Security

> The Host is the AI application environment; the Client communicates with MCP Servers. Both are first-line defenses against malicious server behavior.

### 2.1 User Interaction Security

- 🔴 **[CRITICAL] Full Tool Transparency:** Display the complete tool manifest (descriptions, parameters, capabilities, permissions) to users before activation. Never display shortened summaries that can hide injected instructions — including hidden tags like `<SECRET>`.
- 🔴 **[CRITICAL] Confirmation of Sensitive Operations:** High-risk operations (file deletion, fund transfers, system commands) must require explicit, informed user confirmation.
- 🟡 **[HIGH] Operation Visualization:** Make tool invocations and data access visible and auditable by users with detailed operation logs.
- 🟡 **[HIGH] Permission Request Transparency:** Permission requests must explicitly state their purpose and scope to prevent over-authorization.
- 🟡 **[HIGH] Status Feedback:** Users should have real-time visibility into what MCP operations are currently in progress.
- 🟢 **[RECOMMENDED] UI Security Indicators:** Provide intuitive security indicators in the UI showing the scope of AI operations.

### 2.2 Client Authentication & Authorization

- 🔴 **[CRITICAL] Mandatory Authentication:** Enforce authentication before communicating with any MCP Server; prohibit anonymous access.
- 🟡 **[HIGH] OAuth 2.1 / PKCE Implementation:** Implement OAuth 2.1 with PKCE correctly for user-facing operations. Use client credentials for system-to-system operations.
- 🟡 **[HIGH] CSRF Protection:** For web-based clients, use a unique random state parameter per request to mitigate CSRF attacks.
- 🟡 **[HIGH] Minimal OAuth Scopes:** Restrict access using minimal, task-specific OAuth scopes. Use action-level permissions on a per-identity basis.
- 🟢 **[RECOMMENDED] Short-Lived PATs:** Where OAuth cannot be implemented, use narrowly scoped, short-lived Personal Access Tokens.

### 2.3 Server Verification & Communication Security

- 🔴 **[CRITICAL] TLS 1.2+ Enforcement:** Encrypt all Client-Server communications with TLS 1.2+. Disable weak cipher suites.
- 🔴 **[CRITICAL] Certificate Validation:** Strictly validate TLS certificates of remote Servers; check the full certificate chain. Implement certificate pinning where feasible.
- 🔴 **[CRITICAL] Server Identity Verification:** Verify MCP Server identity before connecting; prevent connections to impersonated or malicious servers.
- 🟡 **[HIGH] Origin Header Validation:** For local HTTP connections, validate the `Origin` header to prevent cross-site request forgery.
- 🟡 **[HIGH] JSON-RPC Schema Validation:** Strictly validate all JSON-RPC messages against the MCP schema; reject malformed or unrecognized data.
- 🟢 **[RECOMMENDED] Trusted Registry Only:** Only connect to servers from a vetted, internal registry. Use IP allowlists and network isolation.

### 2.4 MCP Tools & Servers Management

- 🔴 **[CRITICAL] Tool Version Pinning:** Maintain a manifest of approved server and tool versions with checksums. Alert on any unauthorized changes.
- 🔴 **[CRITICAL] Malicious MCP Detection:** Monitor and identify potentially malicious MCP behavior; scan installed MCPs periodically.
- 🟡 **[HIGH] Function Name Conflict Prevention:** Check for name conflicts or malicious overwriting before registering any tool. Use namespaces or unique identifiers.
- 🟡 **[HIGH] Secure Update Verification:** Regularly check for and apply security updates; verify that updated tools do not contain malicious descriptions.
- 🟡 **[HIGH] Conflict Resolution:** Establish clear, audited rules to resolve tool name conflicts and malicious priority hijacking.
- 🟡 **[HIGH] Domain Isolation:** Isolate tools across different domains to prevent cross-domain impact.
- 🟡 **[HIGH] Tool Classification:** Classify tools by sensitivity and risk level; apply tiered approval for high-risk tools.
- 🟢 **[RECOMMENDED] Staged Rollout:** Deploy new servers in staging with full telemetry; promote to production only after a probation period with no incidents.
- 🟢 **[RECOMMENDED] Authorized Server Directory:** Maintain a central directory of all approved MCP servers and tools.

### 2.5 Prompt Security

- 🔴 **[CRITICAL] Prompt Injection Defense:** Implement layered defenses against prompt injection, including manual verification for critical executions. Detect preloaded malicious prompts at initialization.
- 🔴 **[CRITICAL] System Prompt Protection:** Clearly separate system prompts from user inputs; prevent tampering or override.
- 🔴 **[CRITICAL] Malicious Instruction Detection:** Detect and block malicious instructions embedded in tool descriptions, tool outputs, and third-party MCP server responses.
- 🟡 **[HIGH] Sensitive Data Filtering:** Filter sensitive personal data from prompts and context before sending to models or third-party services.
- 🟡 **[HIGH] Context Isolation:** Ensure contexts from different sources remain isolated; prevent cross-contamination or information leakage between sessions.
- 🟡 **[HIGH] Historical Context Management:** Define and enforce a clear mechanism for cleaning up historical context to prevent data buildup and stale injection risks.
- 🟢 **[RECOMMENDED] Prompt Templates:** Use secure, parameterized prompt templates to reduce injection risk.
- 🟢 **[RECOMMENDED] Prompt Consistency Verification:** Verify that identical prompts produce predictable, consistent results across environments.

### 2.6 Logging & Auditing

- 🔴 **[CRITICAL] Client-Side Logging:** Record all interactions with MCP Servers, tool calls, and authorization activities.
- 🟡 **[HIGH] Security Event Recording:** Log all security-related events, including authorization failures and anomalous invocations.
- 🟡 **[HIGH] Anomaly Alerts:** Alert on abnormal tool invocation patterns (mass file reads, excessive API calls, unusual chaining sequences).

### 2.7 Permission Token Storage & Management

- 🔴 **[CRITICAL] Secure Credential Storage:** Use the system keychain or dedicated encrypted storage for sensitive credentials; prevent unauthorized access.
- 🟡 **[HIGH] Permission Scope Limitation:** Strictly limit token scopes; enforce least privilege at the token level.
- 🟡 **[HIGH] Sensitive Data Isolation:** Isolate sensitive user data from ordinary data in storage and processing.

### 2.8 Auto-Approve Control

- 🔴 **[CRITICAL] Auto-Approve Restrictions:** Carefully control which tools and operations qualify for auto-approval; default to requiring human review for novel or high-risk actions.
- 🟡 **[HIGH] Whitelist Management:** Maintain and audit a whitelist of tools eligible for auto-approval.
- 🟡 **[HIGH] Approval Process Auditing:** Log and audit all auto-approval decisions.
- 🟢 **[RECOMMENDED] Dynamic Risk Assessment:** Dynamically adjust auto-approval policies based on session context and risk signals.

### 2.9 Sampling Security

- 🟡 **[HIGH] Context Scope Control:** Strictly control which context is included in sampling requests; apply minimum necessary context.
- 🟡 **[HIGH] Sensitive Data Filtering in Sampling:** Filter out sensitive data from sampling requests and responses.
- 🟡 **[HIGH] Sampling Request Validation:** Validate all parameters and content within sampling requests.
- 🟢 **[RECOMMENDED] User Control over Sampling:** Ensure users have clear, auditable control over sampling requests and results.
- 🟢 **[RECOMMENDED] Result Validation:** Verify that sampling results conform to expected security and quality standards.

---

## 3. Secure MCP Architecture

### 3.1 Transport & Network Security

- 🔴 **[CRITICAL] Local MCP — Prefer STDIO/Unix Sockets:** For local MCP servers, use STDIO or Unix sockets over network sockets. If local HTTP is required, bind only to `127.0.0.1`, validate the Origin header, and still enforce authentication.
- 🔴 **[CRITICAL] Remote MCP — Enforce TLS 1.2+:** All remote MCP server connections must use TLS 1.2 or higher.
- 🔴 **[CRITICAL] Mutual TLS (mTLS) for Static Relationships:** For known, static client-server relationships, use mTLS to provide bidirectional identity verification.
- 🟡 **[HIGH] WAF & Rate Limiting for Remote Endpoints:** Protect remote MCP servers with a Web Application Firewall and rate limiters.
- 🟡 **[HIGH] Egress Allowlists:** Enforce strict outbound traffic controls; deny all non-approved network destinations from tool execution environments.

### 3.2 Session & Identity Isolation

- 🔴 **[CRITICAL] Per-Session Isolation:** Strictly segregate execution contexts, memory, and temporary storage for each user or agent session. Prohibit global variables or shared singletons for user-specific data.
- 🔴 **[CRITICAL] Per-Session Resource Quotas:** Enforce strict limits on memory, CPU, filesystem usage, and API rate limits per session ID or user identity.
- 🔴 **[CRITICAL] Deterministic Session Cleanup:** When an MCP session terminates, disconnects, or times out, immediately destroy all associated file handles, temporary storage, in-memory contexts, and cached tokens.
- 🟡 **[HIGH] Non-Human Identity (NHI) Governance:** Treat all automated agents, backend processes, and MCP server systems as first-class identities with unique credentials and tightly scoped permissions. Continuously audit NHI systems.
- 🟡 **[HIGH] Cross-Tenant Isolation:** Implement protocol-enforced state separation in multi-tenant deployments to prevent cross-tenant data leakage.

### 3.3 Multi-MCP Scenario Security

- 🔴 **[CRITICAL] Cross-MCP Function Call Control:** Secure control over cross-MCP function calls to prevent malicious MCP servers from returning harmful prompts that trigger other MCPs into performing sensitive operations. (72.4% documented cascade rate between compromised servers.)
- 🔴 **[CRITICAL] Multi-MCP Environment Scanning:** Periodically scan and inspect all installed MCPs in multi-server environments.
- 🟡 **[HIGH] Server Isolation Policies:** Data flow between MCP servers must require explicit, policy-enforced authorization.
- 🟡 **[HIGH] Shared Context Contamination Prevention:** Prevent tools from one MCP server from poisoning the context of another.
- 🟡 **[HIGH] Combined Capability Mapping:** Document and audit all server combinations (e.g., Git + Browser, Filesystem + Network) for compound attack surfaces.
- 🟢 **[RECOMMENDED] Function Priority Hijacking Prevention:** Check for malicious prompt presets designed to hijack function call priority.

---

## 4. Agentic-Specific Security (NEW)

> These controls address the OWASP Top 10 for Agentic Applications 2026 (ASI01–ASI10). They are new categories not present in the original SlowMist checklist and are critical for MCP deployments used in agentic workflows.

### 4.1 Agent Goal Hijack Prevention (ASI01)

- 🔴 **[CRITICAL] Treat All Natural-Language Inputs as Untrusted:** Route user-provided text, uploaded documents, and retrieved external content through input-validation and prompt-injection safeguards before they can influence goal selection, planning, or tool calls.
- 🔴 **[CRITICAL] Lock Agent System Prompts:** Define and lock system prompts so that goal priorities and permitted actions are explicit and auditable. Changes must go through configuration management and human approval.
- 🟡 **[HIGH] Validate User Intent & Agent Intent at Runtime:** Require confirmation via human approval, policy engine, or guardrails whenever an agent proposes actions deviating from the original task or scope.
- 🟡 **[HIGH] Sanitize Connected Data Sources:** Sanitize RAG inputs, emails, calendar invites, uploaded files, external APIs, browsing output, and peer-agent messages using CDR and content filtering.
- 🟡 **[HIGH] Behavioral Baseline & Goal Drift Alerting:** Track a stable identifier for the active goal; alert on unexpected goal changes, anomalous tool sequences, or shifts from the established behavioral baseline.
- 🟢 **[RECOMMENDED] Periodic Red-Team Testing:** Conduct periodic red-team simulations of goal override attacks and verify rollback effectiveness.
- 🟢 **[RECOMMENDED] Intent Capsule Pattern:** Bind declared goals, constraints, and context to each execution cycle in a signed, immutable envelope to restrict runtime modification.

### 4.2 Tool Misuse & Exploitation Prevention (ASI02)

- 🔴 **[CRITICAL] Least Agency & Least Privilege for Tools:** Define per-tool least-privilege profiles (scopes, maximum call rate, egress allowlists). Restrict tool functionality and data access to those profiles (e.g., read-only DB queries, no send/delete rights for email summarizers).
- 🔴 **[CRITICAL] Action-Level Authentication & Approval:** Require explicit authentication for each tool invocation and human confirmation for high-impact or destructive actions (delete, transfer, publish). Present a dry-run or diff preview before approval.
- 🟡 **[HIGH] Policy Enforcement Middleware ("Intent Gate"):** Treat LLM/planner outputs as untrusted. A pre-execution Policy Enforcement Point (PEP/PDP) validates intent and arguments, enforces schemas and rate limits, and issues short-lived credentials.
- 🟡 **[HIGH] Tool Sandboxing & Egress Controls:** Run tool execution in isolated sandboxes. Enforce outbound allowlists; deny all non-approved network destinations.
- 🟡 **[HIGH] Adaptive Tool Budgeting:** Apply cost, rate, or token usage ceilings with automatic throttling or revocation when exceeded.
- 🟡 **[HIGH] Semantic Firewalls:** Enforce fully qualified tool names and version pins to avoid typosquatted or alias-colliding tools. Fail closed on ambiguous name resolution.
- 🟢 **[RECOMMENDED] Just-in-Time (JIT) Ephemeral Access:** Grant temporary credentials or API tokens that expire immediately after use, bound to specific user sessions.

### 4.3 Identity & Privilege Abuse Prevention (ASI03)

- 🔴 **[CRITICAL] Governed Agent Identities:** Every agent must have a distinct, governed identity (unique credentials, tightly scoped permissions). Prevent unscoped privilege inheritance from manager agents to worker agents.
- 🔴 **[CRITICAL] Prevent Memory-Based Credential Retention:** Agents must not cache credentials, keys, or retrieved sensitive data across tasks or users. Clear agent memory between session boundaries.
- 🟡 **[HIGH] Token Delegation with Minimal Scope:** Use the OAuth token delegation flow (RFC 8693) to pass user context while limiting permissions. Maintain distinct server non-human identities.
- 🟡 **[HIGH] Prevent Confused Deputy Attacks:** Ensure the MCP server cannot be tricked into misusing a user's privileges to execute unauthorized actions on their behalf.
- 🟢 **[RECOMMENDED] MFA for High-Privilege Agent Actions:** Require multi-factor authentication for agents initiating high-privilege operations.

### 4.4 Agentic Supply Chain Security (ASI04)

- 🔴 **[CRITICAL] Vet Third-Party Agent Components:** Treat all external agent frameworks, tool libraries, and MCP server packages as untrusted until formally reviewed and approved.
- 🟡 **[HIGH] AIBOM for Agent Stacks:** Maintain an AI Bill of Materials covering all agent dependencies, model weights, and tool definitions.
- 🟡 **[HIGH] Monitor for Malicious MCP Packages:** Actively monitor registries for typosquatted or backdoored MCP server packages (e.g., the Postmark MCP impersonation incident, Sep 2025).
- 🟢 **[RECOMMENDED] Signed Artifacts Throughout:** Sign all agent code artifacts, tool manifests, and model weights in the deployment pipeline.

### 4.5 Unexpected Code Execution / RCE Prevention (ASI05)

- 🔴 **[CRITICAL] Sandbox All Code Execution:** Execute all model-generated or tool-triggered code inside isolated sandboxes (containers, micro-VMs). Apply seccomp profiles, AppArmor, or equivalent.
- 🔴 **[CRITICAL] Disable Dangerous Execution Primitives:** Secure or disable git hooks, smudge/clean filters, aliases, shell expansion, and similar RCE vectors in tool implementations.
- 🟡 **[HIGH] Input Validation Before Shell Invocation:** Never pass model-provided or user-provided strings directly to shell commands without thorough validation and allowlist-based filtering.
- 🟡 **[HIGH] Allowlist-Based Execution:** Define an explicit allowlist of permitted operations; deny everything else by default.

### 4.6 Memory & Context Poisoning Prevention (ASI06)

- 🔴 **[CRITICAL] Validate Memory Updates:** Enforce validation on every memory write. Require source attribution, scan for anomalies, and use cryptographic integrity checks (hashes) on stored context.
- 🔴 **[CRITICAL] Memory Segmentation by Session/User:** Prevent agents from writing to a shared memory store. Isolate memory by session or user identity to prevent cascading poisoning.
- 🟡 **[HIGH] TTL on Stored Memory:** Implement Time-To-Live on all stored agent data to prevent outdated or malicious information from persisting indefinitely.
- 🟡 **[HIGH] RAG Retrieval Validation:** Validate and sanitize all documents retrieved from vector databases or RAG pipelines before injecting them into model context.
- 🟢 **[RECOMMENDED] Memory Access Auditing:** Log all reads and writes to agent memory; alert on anomalous patterns.

### 4.7 Inter-Agent Communication Security (ASI07)

- 🔴 **[CRITICAL] Authenticate Agent-to-Agent Messages:** All inter-agent messages must be authenticated and integrity-verified. Do not trust messages from agents claiming high-trust status without cryptographic verification.
- 🟡 **[HIGH] Prevent Role Contamination:** Isolate agent roles and responsibilities; prevent one agent from inheriting or overriding another's role or permissions through message passing.
- 🟡 **[HIGH] Validate Agent Cards / Directories:** When using agent discovery (e.g., A2A protocol), verify agent identity claims in directories; reject unverified high-trust claims (guard against "Agent-in-the-Middle" attacks).
- 🟢 **[RECOMMENDED] Structured Message Schemas:** Enforce strict schemas for all inter-agent messages; reject anything outside the defined schema.

### 4.8 Cascading Failure Prevention (ASI08)

- 🔴 **[CRITICAL] Circuit Breakers:** Implement circuit breakers for all tool chains and downstream dependencies to prevent runaway cascades.
- 🟡 **[HIGH] Timeout Policies:** Enforce execution timeouts for all tool calls and agent actions; prevent blocking or loop amplification.
- 🟡 **[HIGH] Blast Radius Limitation:** Design agent workflows to minimize blast radius; limit the set of downstream systems any single agent can affect.
- 🟢 **[RECOMMENDED] Graceful Degradation:** Design MCP integrations to degrade gracefully; document safe fallback behaviors for all failure modes.

### 4.9 Human-Agent Trust Exploitation Prevention (ASI09)

- 🟡 **[HIGH] Validate Agent-Presented Actions:** Implement checks to ensure agents cannot deceive human operators into approving harmful actions through misleading summaries or false confirmations.
- 🟡 **[HIGH] Audit AI Output Trustworthiness:** Independently verify critical AI-generated outputs before using them in consequential decisions; do not rely solely on agent-provided evidence.
- 🟢 **[RECOMMENDED] Insider Threat Integration:** Incorporate AI agents into the established Insider Threat Program to monitor insider prompts intended to access sensitive data or alter agent behavior.

### 4.10 Rogue Agent Controls (ASI10)

- 🟡 **[HIGH] Behavioral Monitoring for Misalignment:** Continuously monitor agent behavior for signs of misalignment, unexpected goal drift, or autonomous actions outside defined policies.
- 🟡 **[HIGH] Kill Switches & Emergency Shutdown:** Implement reliable human-controlled kill switches that can halt all agent operations immediately.
- 🟢 **[RECOMMENDED] Periodic Alignment Audits:** Conduct regular audits of agent behavior against declared goals and policies; redeploy or retrain on drift.

---

## 5. LLM Secure Execution

- 🔴 **[CRITICAL] Malicious Prompt Prevention:** The LLM must identify and defend against malicious mnemonic or injection instructions within prompts.
- 🟡 **[HIGH] Priority Function Execution:** Ensure the LLM can correctly prioritize and execute intended plugin functions, and that malicious tools cannot hijack execution priority.
- 🟡 **[HIGH] Sensitive Information Protection:** Prevent LLMs from leaking sensitive information (system prompts, credentials, internal data) through completion or tool calls.
- 🟡 **[HIGH] Multi-Modal Content Filtering:** Filter harmful or injected content in multi-modal inputs (e.g., malicious prompt text embedded in images or PDFs).
- 🟢 **[RECOMMENDED] Secure MCP Invocation:** Validate that the LLM only invokes MCP tools within its permitted, declared scope.

---

## 6. Governance & Compliance

### 6.1 Governance Workflow

- 🔴 **[CRITICAL] Formal Tool Approval Workflow:** No new tool or major code change goes live without a security-focused peer review and sign-off from both Security Reviewer and Domain Owner.
- 🔴 **[CRITICAL] Trusted MCP Registry:** Maintain a central registry holding metadata, approved versions, hashes, and ownership information for all approved MCP servers.
- 🟡 **[HIGH] Governance Roles:** Define clear roles — Submitter, Security Reviewer, Domain Owner, Approver, and Operator — for the MCP onboarding lifecycle.
- 🟡 **[HIGH] Governance Submission Process:** Require formal submission of new MCP servers with documentation and a hash of tool descriptions, followed by automated scanning, review, staging deployment, and periodic re-validation.
- 🟡 **[HIGH] Cryptographic Integrity:** Use cryptographic signing and version pinning for all tools, dependencies, and registry manifests.
- 🟢 **[RECOMMENDED] Policy-as-Code:** Implement governance policies as code (e.g., OPA) to enable automated enforcement in CI/CD pipelines.

### 6.2 AI Asset Inventory & Threat Modeling

- 🟡 **[HIGH] AI Asset Inventory:** Maintain a complete inventory of all LLM/agent assets, data sources, tool integrations, and access paths.
- 🟡 **[HIGH] Threat Modeling of MCP Components:** Apply structured threat modeling (e.g., STRIDE, MAESTRO framework) to all MCP components and their trust boundaries.
- 🟡 **[HIGH] Risk Assessment:** Continuously assess risk associated with new tools, agents, and integrations; apply risk-tiered controls.
- 🟢 **[RECOMMENDED] Model Cards & Risk Cards:** Maintain model cards and risk cards for all deployed LLM components.

### 6.3 Legal & Regulatory

- 🟡 **[HIGH] Data Privacy Compliance:** Ensure MCP deployments comply with applicable privacy regulations (GDPR, CCPA, etc.); apply data minimization and purpose limitation.
- 🟡 **[HIGH] Incident Response Playbooks:** Update incident response playbooks to include MCP-specific attack scenarios and include LLM/agent incidents in tabletop exercises.
- 🟢 **[RECOMMENDED] Regulatory Monitoring:** Track evolving AI-specific regulations (EU AI Act, NIST AI RMF) and update controls accordingly.

### 6.4 AI Red Teaming

- 🟡 **[HIGH] Continuous TEVV (Testing, Evaluation, Verification, Validation):** Establish continuous testing throughout the AI/MCP lifecycle including red teaming, adversarial evaluation, and integration testing.
- 🟡 **[HIGH] MCP-Specific Red Team Scope:** Red team engagements must explicitly cover MCP internals: tool exposure, capability registration, sandboxing boundaries, tool poisoning, rug pulls, and multi-agent contamination.
- 🟡 **[HIGH] Multi-Turn & Stateful Attack Testing:** Evaluate system security across multi-turn, stateful interactions — not just single-turn inputs.
- 🟡 **[HIGH] Agentic Workflow Attack Simulation:** Test multi-step adversarial workflows (e.g., indirect injection → tool pivot → exfiltration) reflecting realistic threat actor behavior.
- 🟢 **[RECOMMENDED] Human-in-the-Loop Bypass Testing:** Explicitly test the reliability of human approval kill switches and confirm they cannot be bypassed through adversarial prompts.
- 🟢 **[RECOMMENDED] Vendor Red Team Evaluation Criteria:** When selecting AI red teaming vendors, require demonstrated experience with tool-calling semantics, MCP internals, multi-agent architectures, and privilege escalation pathways (not just surface-level jailbreak testing).

---

## 7. Cryptocurrency-Specific MCP Security

> These items specifically target high-risk MCP deployments involving crypto wallets, on-chain operations, or financial transactions.

- 🔴 **[CRITICAL] Private Key Protection:** Apply enhanced security measures for private keys (e.g., HSM storage, Scrypt-based encryption). Never expose private keys to the LLM or any third-party interface.
- 🔴 **[CRITICAL] Transfer Information Confirmation:** Ensure completeness and clarity of all on-chain or exchange transfer signature information presented to users before signing.
- 🔴 **[CRITICAL] Funds Operation Secondary Verification:** Implement secondary verification (e.g., TOTP/Google Authenticator) for all critical fund operations.
- 🟡 **[HIGH] Wallet Generation Security:** Verify the security and entropy quality of mnemonic or wallet generation processes.
- 🟡 **[HIGH] Wallet Information Privacy:** Thoroughly filter wallet information before sending any data to third-party interfaces or LLM providers.
- 🟡 **[HIGH] Local Model for Sensitive Operations:** Use locally hosted LLMs for operations involving wallet data to prevent third-party model providers from accessing financial information.
- 🟢 **[RECOMMENDED] Traditional Wallet Compatibility:** Provide secure compatibility with traditional wallets (e.g., transaction signing via existing hardware wallet solutions).

---

## 8. Security Tools & Continuous Validation

### Recommended Security Tooling

**Static Analysis & Scanning:**
- SAST tools with custom MCP rules integrated into CI/CD

**Runtime & Monitoring:**
- SIEM integration for MCP audit log analysis

**Content Filtering & Guardrails:**
- `PromptShields` — Azure Foundry Content Safety Classifier

**Supply Chain & Dependency:**
- `OpenSSF Scorecard` — Repository security posture evaluation
- `OSV-Scanner`, `npm audit`, `pip audit` — Dependency vulnerability detection

**Authentication & Secrets:**
- Azure KeyVault — Secrets storage
- HSM (Hardware Security Module) — For signing key protection

---

## Quick Minimum Security Bar

Use this as a final gate before production deployment:

| Domain | Must-Pass Checks |
|---|---|
| **Identity & Auth** | OAuth 2.1/OIDC enforced; short-lived scoped tokens; no token passthrough; centralized policy enforcement |
| **Tool Integrity** | Cryptographic manifests; version pinned; rug pull monitoring; description vs. behavior validated |
| **Isolation** | Per-session isolation; no shared user state; deterministic cleanup; resource quotas |
| **Validation** | All messages schema-validated; inputs/outputs sanitized; size-limited; structured JSON invocation |
| **Deployment** | Containerized non-root; secrets in vault; network segmented; CI/CD security gates active |
| **Agentic Controls** | HITL for high-risk actions; agent identities governed; memory segmented; kill switches tested |
| **Observability** | Immutable audit logs; SIEM alerts configured; behavioral baseline established |
| **Governance** | Formal tool approval workflow; trusted registry; peer review enforced; red team scheduled |

---

*Based on: SlowMist MCP-Security-Checklist (Apr 2025) · OWASP Secure MCP Server Development Guide v1.0 (Feb 2026) · OWASP Third-Party MCP Cheat Sheet v1.0 (Oct 2025) · OWASP Top 10 for Agentic Applications 2026 (Dec 2025) · OWASP LLM AI Security & Governance Checklist v1.1 · OWASP AI Red Teaming Vendor Evaluation v1.0 (Jan 2026) · arXiv: ETDI (2506.01333), MCP Attack Vectors (2506.02040), Tool Poisoning Defense (2512.06556), MCIP (2505.14590)*
