import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { z } from 'zod'
import { config } from '../config.js'
import { readDb, updateDb } from '../data/store.js'
import { requireAuth, signSession } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { currentUserPayload, publicBuyer, publicSeller } from '../utils/sanitize.js'

const router = Router()

const buyerRegistrationSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(5, 'Phone number must be at least 5 characters'),
  location: z.string().trim().min(2, 'Location must be at least 2 characters'),
  idnumber: z.string().trim().min(3, 'National ID number must be at least 3 characters'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters')
})

const sellerRegistrationSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  businessName: z.string().trim().min(2, 'Business name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(5, 'Phone number must be at least 5 characters'),
  location: z.string().trim().min(2, 'Location must be at least 2 characters'),
  idnumber: z.string().trim().min(3, 'National ID number must be at least 3 characters'),
  idphoto: z.string().trim().min(1, 'ID photo is required'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters')
})

const loginSchema = z.object({
  type: z.enum(['buyer', 'seller', 'admin']),
  email: z.string().email(),
  password: z.string().min(1)
})

const emailExists = (db, email) => {
  const normalized = email.toLowerCase()
  return db.buyers.some((buyer) => buyer.email.toLowerCase() === normalized) ||
    db.sellers.some((seller) => seller.email.toLowerCase() === normalized)
}

const sessionResponse = (account, type) => {
  const currentUser = currentUserPayload(account, type)
  return {
    token: signSession(currentUser),
    currentUser,
    account: type === 'buyer' ? publicBuyer(account) : publicSeller(account)
  }
}

router.post('/register/buyer', validate(buyerRegistrationSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    if (emailExists(db, req.body.email)) {
      return { error: 'Email already registered' }
    }

    const buyer = {
      id: randomUUID(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      idnumber: req.body.idnumber,
      passwordHash: await bcrypt.hash(req.body.password, 12),
      profilePicture: '',
      favoriteSellers: [],
      wishlist: [],
      registeredAt: new Date().toISOString()
    }

    db.buyers.push(buyer)
    return { buyer }
  })

  if (result.error) return res.status(409).json({ error: result.error })
  res.status(201).json(sessionResponse(result.buyer, 'buyer'))
})

router.post('/register/seller', validate(sellerRegistrationSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    if (emailExists(db, req.body.email)) {
      return { error: 'Email already registered' }
    }

    const seller = {
      id: randomUUID(),
      name: req.body.name,
      businessName: req.body.businessName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      idnumber: req.body.idnumber,
      idphoto: req.body.idphoto,
      passwordHash: await bcrypt.hash(req.body.password, 12),
      products: [],
      reactions: { good: [], bad: [] },
      comments: [],
      registeredAt: new Date().toISOString()
    }

    db.sellers.push(seller)
    return { seller }
  })

  if (result.error) return res.status(409).json({ error: result.error })
  res.status(201).json(sessionResponse(result.seller, 'seller'))
})

router.post('/login', validate(loginSchema), async (req, res) => {
  if (req.body.type === 'admin') {
    if (req.body.email === config.admin.email && req.body.password === config.admin.password) {
      const currentUser = { id: config.admin.id, name: config.admin.name, type: 'admin' }
      return res.json({ token: signSession(currentUser), currentUser, account: currentUser })
    }

    return res.status(401).json({ error: 'Invalid admin credentials' })
  }

  const db = await readDb()
  const accounts = req.body.type === 'seller' ? db.sellers : db.buyers
  const account = accounts.find((item) => item.email.toLowerCase() === req.body.email.toLowerCase())

  if (!account || !(await bcrypt.compare(req.body.password, account.passwordHash))) {
    return res.status(401).json({ error: `No ${req.body.type} account found with that email and password.` })
  }

  res.json(sessionResponse(account, req.body.type))
})

router.get('/me', requireAuth, async (req, res) => {
  if (req.user.type === 'admin') {
    return res.json({ currentUser: req.user, account: req.user })
  }

  const db = await readDb()
  const account = req.user.type === 'seller'
    ? db.sellers.find((seller) => seller.id === req.user.id)
    : db.buyers.find((buyer) => buyer.id === req.user.id)

  if (!account) {
    return res.status(404).json({ error: 'Account not found' })
  }

  res.json({
    currentUser: currentUserPayload(account, req.user.type),
    account: req.user.type === 'seller' ? publicSeller(account) : publicBuyer(account)
  })
})

export default router
