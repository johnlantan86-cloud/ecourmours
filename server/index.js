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

const app = express()

const isAllowedOrigin = (origin) => {
  if (!origin) return true
  if (config.corsOrigins.includes(origin)) return true
  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
}

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Origin not allowed by CORS'))
  },
  credentials: true
}))
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

app.use(notFound)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`API server running at http://127.0.0.1:${config.port}`)
})
