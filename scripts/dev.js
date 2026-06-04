import { spawn } from 'node:child_process'
import { join } from 'node:path'

const nodeBin = process.execPath
const viteEntry = join('node_modules', 'vite', 'bin', 'vite.js')

const processes = [
  {
    name: 'api',
    command: nodeBin,
    args: ['server/index.js']
  },
  {
    name: 'vite',
    command: nodeBin,
    args: [viteEntry, '--host', '127.0.0.1', '--port', '5174', '--strictPort']
  }
]

const children = new Set()
let shuttingDown = false

const stopAll = (signal = 'SIGTERM') => {
  if (shuttingDown) return
  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal)
    }
  }
}

for (const processConfig of processes) {
  let child
  try {
    child = spawn(processConfig.command, processConfig.args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    })
  } catch (error) {
    console.error(`[${processConfig.name}] ${error.message}`)
    stopAll()
    process.exitCode = 1
    break
  }

  children.add(child)

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${processConfig.name}] ${chunk}`)
  })

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${processConfig.name}] ${chunk}`)
  })

  child.on('error', (error) => {
    console.error(`[${processConfig.name}] ${error.message}`)
    stopAll()
    process.exitCode = 1
  })

  child.on('exit', (code, signal) => {
    children.delete(child)

    if (!shuttingDown) {
      const reason = signal || `code ${code}`
      console.error(`[${processConfig.name}] exited with ${reason}`)
      stopAll()
      process.exitCode = code || 1
    }
  })
}

process.on('SIGINT', () => stopAll('SIGINT'))
process.on('SIGTERM', () => stopAll('SIGTERM'))
