import { Router } from 'express'
import { readDb, updateDb } from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { publicBuyer, publicSeller } from '../utils/sanitize.js'

const router = Router()

router.use(requireAuth, requireRole('admin'))

router.get('/overview', async (req, res) => {
  const db = await readDb()
  res.json({
    buyers: db.buyers.map(publicBuyer),
    sellers: db.sellers.map(publicSeller),
    productReports: db.productReports
  })
})

router.delete('/users/:type/:id', async (req, res) => {
  if (!['buyer', 'seller'].includes(req.params.type)) {
    return res.status(400).json({ error: 'User type must be buyer or seller' })
  }

  const result = await updateDb(async (db) => {
    if (req.params.type === 'buyer') {
      const before = db.buyers.length
      db.buyers = db.buyers.filter((buyer) => String(buyer.id) !== String(req.params.id))
      return db.buyers.length !== before
    }

    const before = db.sellers.length
    db.sellers = db.sellers.filter((seller) => String(seller.id) !== String(req.params.id))
    return db.sellers.length !== before
  })

  if (!result) return res.status(404).json({ error: 'User not found' })
  res.json({ ok: true })
})

router.delete('/reports/:id', async (req, res) => {
  const result = await updateDb(async (db) => {
    const before = db.productReports.length
    db.productReports = db.productReports.filter((report) => String(report.id) !== String(req.params.id))
    return db.productReports.length !== before
  })

  if (!result) return res.status(404).json({ error: 'Report not found' })
  res.json({ ok: true })
})

export default router
