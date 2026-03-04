import { readFile, writeFile } from 'node:fs/promises'
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
  description: z.string().trim().min(1).optional(),
  items: z.array(checklistItemSchema),
})

const sectionSchema = z.object({
  id: z.string().trim().min(1),
  number: z.number().int().positive(),
  title: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  description: z.string().trim().min(1),
  whyItMatters: z.string().trim().min(1).optional(),
  subsections: z.array(subSectionSchema),
})

const contributionSchema = z.discriminatedUnion('kind', [
  z.object({
    schemaVersion: z.literal(1),
    kind: z.literal('add-section'),
    change: z.object({
      section: sectionSchema,
    }),
  }),
  z.object({
    schemaVersion: z.literal(1),
    kind: z.literal('add-subsection'),
    change: z.object({
      sectionId: z.string().trim().min(1),
      subsection: subSectionSchema,
    }),
  }),
  z.object({
    schemaVersion: z.literal(1),
    kind: z.literal('add-item'),
    change: z.object({
      sectionId: z.string().trim().min(1),
      subsectionId: z.string().trim().min(1),
      item: checklistItemSchema,
    }),
  }),
])

type ChecklistData = {
  version: string
  lastUpdated: string
  totalItems: number
  sections: Array<{
    id: string
    number: number
    subsections: Array<{
      id: string
      number: string
      items: Array<{ id: string }>
    }>
  }>
}

function parseSubsectionNumber(value: string) {
  const [majorRaw, minorRaw = '0'] = value.split('.')
  const major = Number.parseInt(majorRaw, 10)
  const minor = Number.parseInt(minorRaw, 10)

  return {
    major: Number.isFinite(major) ? major : Number.MAX_SAFE_INTEGER,
    minor: Number.isFinite(minor) ? minor : Number.MAX_SAFE_INTEGER,
  }
}

function sortSubsectionsByNumber(subsections: Array<{ number: string }>) {
  subsections.sort((left, right) => {
    const leftParsed = parseSubsectionNumber(left.number)
    const rightParsed = parseSubsectionNumber(right.number)

    if (leftParsed.major !== rightParsed.major) {
      return leftParsed.major - rightParsed.major
    }

    return leftParsed.minor - rightParsed.minor
  })
}

function extractSubmissionText(issueBody: string): string {
  const sectionMatch = issueBody.match(/### Submission JSON\s+([\s\S]*?)(?:\n###\s|\n##\s|$)/i)
  const rawBlock = sectionMatch?.[1]?.trim() ?? issueBody.trim()

  if (!rawBlock) {
    throw new Error('Issue body is empty. Could not find submission payload.')
  }

  const fencedJson = rawBlock.match(/```json\s*([\s\S]*?)```/i)
  if (fencedJson?.[1]) {
    return fencedJson[1].trim()
  }

  const fencedAny = rawBlock.match(/```\s*([\s\S]*?)```/i)
  if (fencedAny?.[1]) {
    return fencedAny[1].trim()
  }

  const firstBrace = rawBlock.indexOf('{')
  const lastBrace = rawBlock.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return rawBlock.slice(firstBrace, lastBrace + 1)
  }

  return rawBlock
}

function getAllSubsectionIds(data: ChecklistData) {
  return new Set(
    data.sections
      .flatMap((section) => section.subsections)
      .map((subsection) => subsection.id),
  )
}

function getAllItemIds(data: ChecklistData) {
  return new Set(
    data.sections
      .flatMap((section) => section.subsections)
      .flatMap((subsection) => subsection.items)
      .map((item) => item.id),
  )
}

function recalculateTotalItems(data: ChecklistData) {
  return data.sections
    .filter((section) => section.id !== 'tools')
    .flatMap((section) => section.subsections)
    .flatMap((subsection) => subsection.items).length
}

async function loadChecklistData() {
  const dataPath = path.resolve(__dirname, '../src/data/checklist.json')
  const rawJson = await readFile(dataPath, 'utf-8')

  return {
    dataPath,
    data: JSON.parse(rawJson) as ChecklistData,
  }
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

async function main() {
  const issueBody = process.env.ISSUE_BODY

  if (!issueBody) {
    throw new Error('Missing ISSUE_BODY environment variable')
  }

  const submissionText = extractSubmissionText(issueBody)
  const parsedJson = JSON.parse(submissionText)
  const submission = contributionSchema.parse(parsedJson)

  const { dataPath, data } = await loadChecklistData()
  const sectionIds = new Set(data.sections.map((section) => section.id))
  const subsectionIds = getAllSubsectionIds(data)
  const itemIds = getAllItemIds(data)

  if (submission.kind === 'add-section') {
    const { section } = submission.change

    if (sectionIds.has(section.id)) {
      throw new Error(`Section ID already exists: ${section.id}`)
    }

    if (data.sections.some((existing) => existing.number === section.number)) {
      throw new Error(`Section number already exists: ${section.number}`)
    }

    const newSubsectionIds = section.subsections.map((subsection) => subsection.id)
    const duplicateSubsection = newSubsectionIds.find((id) => subsectionIds.has(id))
    if (duplicateSubsection) {
      throw new Error(`Subsection ID already exists: ${duplicateSubsection}`)
    }

    const newItemIds = section.subsections.flatMap((subsection) => subsection.items).map((item) => item.id)
    const duplicateItem = newItemIds.find((id) => itemIds.has(id))
    if (duplicateItem) {
      throw new Error(`Item ID already exists: ${duplicateItem}`)
    }

    data.sections.push(section)
    data.sections.sort((left, right) => left.number - right.number)
  }

  if (submission.kind === 'add-subsection') {
    const { sectionId, subsection } = submission.change
    const section = data.sections.find((entry) => entry.id === sectionId)

    if (!section) {
      throw new Error(`Target section not found: ${sectionId}`)
    }

    if (subsectionIds.has(subsection.id)) {
      throw new Error(`Subsection ID already exists: ${subsection.id}`)
    }

    if (section.subsections.some((existing) => existing.number === subsection.number)) {
      throw new Error(`Subsection number already exists in ${sectionId}: ${subsection.number}`)
    }

    const duplicateItem = subsection.items.find((item) => itemIds.has(item.id))
    if (duplicateItem) {
      throw new Error(`Item ID already exists: ${duplicateItem.id}`)
    }

    section.subsections.push(subsection)
    sortSubsectionsByNumber(section.subsections)
  }

  if (submission.kind === 'add-item') {
    const { sectionId, subsectionId, item } = submission.change
    const section = data.sections.find((entry) => entry.id === sectionId)

    if (!section) {
      throw new Error(`Target section not found: ${sectionId}`)
    }

    const subsection = section.subsections.find((entry) => entry.id === subsectionId)

    if (!subsection) {
      throw new Error(`Target subsection not found: ${subsectionId}`)
    }

    if (itemIds.has(item.id)) {
      throw new Error(`Item ID already exists: ${item.id}`)
    }

    subsection.items.push(item)
  }

  data.totalItems = recalculateTotalItems(data)
  data.lastUpdated = todayIsoDate()

  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8')

  console.log('✅ Content submission applied successfully')
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`❌ Failed to apply content submission: ${error.message}`)
  } else {
    console.error('❌ Failed to apply content submission due to an unknown error')
  }

  process.exit(1)
})
