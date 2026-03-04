# Contributing

Thanks for helping improve the MCP Security Checklist.

## Contribution paths

- **Code/UI changes:** Open a PR against this repository.
- **Checklist content additions:** Use the **“Checklist Content Addition (JSON)”** GitHub issue template.

## Checklist content additions (JSON)

Content additions are handled by an automated workflow that:

1. Parses your JSON submission from the issue body.
2. Validates the contribution shape.
3. Applies it to `mcp-security-checklist/src/data/checklist.json`.
4. Runs `npm run validate-content`.
5. Opens a pull request for maintainer review.

Submissions are **never auto-merged**.

## Supported contribution kinds

Use one JSON payload with:

- `schemaVersion`: must be `1`
- `kind`: one of `add-section`, `add-subsection`, `add-item`
- `change`: payload matching that kind

Sample payloads:

- `mcp-security-checklist/docs/contribution-samples/add-section.sample.json`
- `mcp-security-checklist/docs/contribution-samples/add-subsection.sample.json`
- `mcp-security-checklist/docs/contribution-samples/add-item.sample.json`

## Content constraints

- Item IDs must match: `^[a-z]+-[a-z]+-\d{3}$`
- Priority must be: `CRITICAL`, `HIGH`, or `RECOMMENDED`
- Roles must be one or more of:
  - `security-engineer`
  - `architect`
  - `devops`
  - `developer`
  - `compliance`
- Every item must include at least one `tag` and one `source`.
- `section.id`, `subsection.id`, and `item.id` must be unique where relevant.

## Local validation (optional but recommended)

From `mcp-security-checklist/`:

```bash
npm ci
npm run validate-content
```

## Review expectations

Maintainers review for:

- Security relevance and clarity
- Schema validity and ID consistency
- Correct section/subsection placement
- Source quality and traceability

If your submission fails validation, the workflow will fail and no PR will be created.
