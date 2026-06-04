import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { config } from './config.js'
import { readDb } from './data/store.js'
import { errorHandler, notFound } from './middleware/validate.js'
import authRoutes from './routes/auth.js'
import buyerRoutes from './routes/buyers.js'
import sellerRoutes from './routes/sellers.js'
import reportRoutes from './routes/reports.js'
import adminRoutes from './routes/admin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const clientDistPath = join(__dirname, '..', 'dist')
const clientIndexPath = join(clientDistPath, 'index.html')

const app = express()
const host = process.env.HOST || '0.0.0.0'

app.set('trust proxy', true)

const isSameHostOrigin = (origin, req) => {
  try {
    return new URL(origin).host === req.get('host')
  } catch {
    return false
  }
}

const isAllowedOrigin = (origin, req) => {
  if (!origin) return true
  if (isSameHostOrigin(origin, req)) return true
  if (config.corsOrigins.includes(origin)) return true
  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
}

app.use('/api', (req, res, next) => {
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin, req)) {
        return callback(null, true)
      }
      return callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true
  })(req, res, next)
})
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

app.get('/api/health', async (req, res) => {
  const db = await readDb()
  res.json({
    ok: true,
    buyers: db.buyers.length,
    sellers: db.sellers.length,
    reports: db.productReports.length
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/buyers', buyerRoutes)
app.use('/api/sellers', sellerRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/admin', adminRoutes)

if (existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath))
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next()
    }

    res.sendFile(clientIndexPath)
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(config.port, host, () => {
  console.log(`Server running at http://${host}:${config.port}`)
})
