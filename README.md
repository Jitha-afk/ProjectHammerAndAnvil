# ProjectHammerAndAnvil

Project workspace for the MCP Security Checklist application — a React + TypeScript single-page app that provides an interactive, persistence-enabled security control checklist for MCP deployments.

## Contributing

- Contributor guide: `CONTRIBUTING.md`
- App workspace: `mcp-security-checklist/`

### JSON content submissions

This repository supports structured checklist-content submissions through a GitHub issue template.

- Open issue template: **Checklist Content Addition (JSON)**
- Submit one payload kind: `add-section`, `add-subsection`, or `add-item`
- Automation validates payload, applies it to `mcp-security-checklist/src/data/checklist.json`, then opens a PR for review
- No direct auto-merge is performed

Sample payloads are in:

- `mcp-security-checklist/docs/contribution-samples/add-section.sample.json`
- `mcp-security-checklist/docs/contribution-samples/add-subsection.sample.json`
- `mcp-security-checklist/docs/contribution-samples/add-item.sample.json`
