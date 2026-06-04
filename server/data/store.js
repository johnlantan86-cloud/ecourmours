import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db.json')

const initialData = {
  buyers: [],
  sellers: [],
  productReports: []
}

const ensureDb = async () => {
  await mkdir(__dirname, { recursive: true })
  try {
    await readFile(dbPath, 'utf8')
  } catch {
    await writeFile(dbPath, JSON.stringify(initialData, null, 2))
  }
}

export const readDb = async () => {
  await ensureDb()
  const contents = await readFile(dbPath, 'utf8')
  return {
    ...initialData,
    ...JSON.parse(contents || '{}')
  }
}

export const writeDb = async (data) => {
  await ensureDb()
  await writeFile(dbPath, JSON.stringify({ ...initialData, ...data }, null, 2))
}

export const updateDb = async (updater) => {
  const db = await readDb()
  const result = await updater(db)
  await writeDb(db)
  return result
}
