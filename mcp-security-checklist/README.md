# MCP Security Checklist

Interactive security checklist for Model Context Protocol deployments.

## Development

```bash
npm ci
npm run dev
```

## Content validation

```bash
npm run validate-content
```

This validates `src/data/checklist.json` for schema shape, unique item IDs, and `totalItems` consistency.

## Automated content submissions

Checklist additions can be submitted via the GitHub issue template **Checklist Content Addition (JSON)**.

Pipeline behavior:

1. Parse JSON payload from issue body.
2. Validate contribution schema.
3. Apply changes to `src/data/checklist.json`.
4. Run `npm run validate-content`.
5. Open an automated PR for maintainer review.

### Supported payload kinds

- `add-section`
- `add-subsection`
- `add-item`

Sample payloads:

- `docs/contribution-samples/add-section.sample.json`
- `docs/contribution-samples/add-subsection.sample.json`
- `docs/contribution-samples/add-item.sample.json`

## Local dry-run of an issue payload

You can simulate the workflow by setting `ISSUE_BODY` and running:

```bash
npm run apply-content-submission
npm run validate-content
```

See root `CONTRIBUTING.md` for full contribution rules.
