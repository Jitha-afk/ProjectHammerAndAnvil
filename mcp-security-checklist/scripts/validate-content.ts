import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const roleSchema = z.enum([
  'security-engineer',
  'architect',
  'devops',
  'developer',
  'compliance',
])

const sourceRefSchema = z.object({
  label: z.string().trim().min(1),
  url: z.string().url().optional(),
})

const checklistItemSchema = z.object({
  id: z.string().regex(/^[a-z]+-[a-z]+-\d{3}$/),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  priority: z.enum(['CRITICAL', 'HIGH', 'RECOMMENDED']),
  roles: z.array(roleSchema).min(1),
  tags: z.array(z.string().trim().min(1)).min(1),
  sources: z.array(sourceRefSchema).min(1),
  incidentRefs: z.array(z.string().trim().min(1)).optional(),
})

const subSectionSchema = z.object({
  id: z.string().trim().min(1),
  number: z.string().trim().min(1),
  title: z.string().trim().min(1),
  items: z.array(checklistItemSchema),
})

const sectionSchema = z.object({
  id: z.string().trim().min(1),
  number: z.number(),
  title: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  description: z.string().trim().min(1),
  subsections: z.array(subSectionSchema),
})

const checklistDataSchema = z.object({
  version: z.string().trim().min(1),
  lastUpdated: z.string().trim().min(1),
  totalItems: z.number().int().nonnegative(),
  sections: z.array(sectionSchema).min(1),
})

async function loadChecklistData() {
  const dataPath = path.resolve(__dirname, '../src/data/checklist.json')
  const rawJson = await readFile(dataPath, 'utf-8')
  return JSON.parse(rawJson)
}

function ensureUniqueIds(ids: string[]) {
  const duplicates = new Set<string>()
  const seen = new Set<string>()

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id)
      continue
    }

    seen.add(id)
  }

  if (duplicates.size > 0) {
    throw new Error(`Duplicate item IDs found: ${[...duplicates].join(', ')}`)
  }
}

async function main() {
  const parsed = checklistDataSchema.parse(await loadChecklistData())

  const nonReferenceSections = parsed.sections.filter(
    (section) => section.id !== 'tools',
  )

  const allItems = nonReferenceSections
    .flatMap((section) => section.subsections)
    .flatMap((subSection) => subSection.items)

  const actualTotal = allItems.length

  if (parsed.totalItems !== actualTotal) {
    throw new Error(
      `totalItems (${parsed.totalItems}) does not match actual item count (${actualTotal})`,
    )
  }

  ensureUniqueIds(allItems.map((item) => item.id))

  console.log(
    `✅ checklist.json is valid: ${actualTotal} checkable items across ${parsed.sections.length} sections`,
  )
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`❌ Content validation failed: ${error.message}`)
  } else {
    console.error('❌ Content validation failed with an unknown error')
  }

  process.exit(1)
})