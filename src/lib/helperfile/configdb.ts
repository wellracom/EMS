import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

export type LoggerConfig = {
  logger: {
    interval: number
  }
}

const filePath = path.join(process.cwd(), 'config', 'config.json')

const defaultConfig: LoggerConfig = {
  logger: {
    interval: 10,
  },
}

export async function readLoggerConfig(): Promise<LoggerConfig> {
  try {
    const file = await readFile(filePath, 'utf-8')
    return JSON.parse(file)
  } catch {
    return defaultConfig
  }
}

export async function writeLoggerConfig(data: LoggerConfig): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })

  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}
