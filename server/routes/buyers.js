import { Router } from 'express'
import { z } from 'zod'
import { updateDb } from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { publicBuyer } from '../utils/sanitize.js'

const router = Router()

const profileSchema = z.object({
  phone: z.string().min(5).optional(),
  location: z.string().min(2).optional(),
  profilePicture: z.string().optional()
})

router.get('/me', requireAuth, requireRole('buyer'), async (req, res) => {
  const result = await updateDb(async (db) => {
    return db.buyers.find((buyer) => buyer.id === req.user.id)
  })

  if (!result) return res.status(404).json({ error: 'Buyer not found' })
  res.json({ buyer: publicBuyer(result) })
})

router.put('/me', requireAuth, requireRole('buyer'), validate(profileSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    const buyer = db.buyers.find((item) => item.id === req.user.id)
    if (!buyer) return null

    Object.assign(buyer, req.body)
    return buyer
  })

  if (!result) return res.status(404).json({ error: 'Buyer not found' })
  res.json({ buyer: publicBuyer(result) })
})

export default router
