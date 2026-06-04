import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { z } from 'zod'
import { updateDb } from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const productReportSchema = z.object({
  sellerId: z.string().min(1),
  productId: z.string().min(1),
  reason: z.string().min(3).max(300)
})

router.post('/products', requireAuth, requireRole('buyer'), validate(productReportSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = db.sellers.find((item) => String(item.id) === String(req.body.sellerId))
    const product = seller?.products?.find((item) => String(item.id) === String(req.body.productId))
    const buyer = db.buyers.find((item) => item.id === req.user.id)
    if (!seller || !product || !buyer) return null

    const report = {
      id: randomUUID(),
      sellerId: seller.id,
      sellerName: seller.businessName,
      productId: product.id,
      productName: product.name,
      reporterId: buyer.id,
      reporterName: buyer.name,
      reporterEmail: buyer.email,
      reason: req.body.reason,
      createdAt: new Date().toISOString()
    }

    db.productReports.unshift(report)
    return report
  })

  if (!result) return res.status(404).json({ error: 'Product not found' })
  res.status(201).json({ report: result })
})

export default router
