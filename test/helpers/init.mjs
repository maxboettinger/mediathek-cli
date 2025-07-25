import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

process.env.TS_NODE_PROJECT = path.resolve(__dirname, '../tsconfig.json')
process.env.NODE_ENV = 'development'

globalThis.oclif = globalThis.oclif || {}
globalThis.oclif.columns = 80
