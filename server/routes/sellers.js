import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { z } from 'zod'
import { readDb, updateDb } from '../data/store.js'
import { requireAuth, requireRole, requireSellerOwner } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { publicBuyer, publicSeller } from '../utils/sanitize.js'

const router = Router()

const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().nonnegative(),
  image: z.string().min(1),
  description: z.string().optional().default('')
})

const commentSchema = z.object({
  text: z.string().min(1).max(260)
})

const ratingSchema = z.object({
  rating: z.enum(['good', 'bad'])
})

const findSeller = (db, sellerId) => db.sellers.find((seller) => String(seller.id) === String(sellerId))
const findProduct = (seller, productId) => seller?.products?.find((product) => String(product.id) === String(productId))

const sellerWithStats = (db, seller) => ({
  ...publicSeller(seller),
  favoriteCount: db.buyers.filter((buyer) => (buyer.favoriteSellers || []).includes(seller.id)).length,
  wishlistCount: db.buyers.reduce((total, buyer) => {
    return total + (buyer.wishlist || []).filter((item) => item.sellerId === seller.id).length
  }, 0)
})

router.get('/', async (req, res) => {
  const db = await readDb()
  res.json({ sellers: db.sellers.map(publicSeller) })
})

router.get('/:sellerId', async (req, res) => {
  const db = await readDb()
  const seller = findSeller(db, req.params.sellerId)
  if (!seller) return res.status(404).json({ error: 'Seller not found' })
  res.json({ seller: sellerWithStats(db, seller) })
})

router.get('/:sellerId/insights', requireAuth, requireSellerOwner, async (req, res) => {
  const db = await readDb()
  const seller = findSeller(db, req.params.sellerId)
  if (!seller) return res.status(404).json({ error: 'Seller not found' })

  const favoriteBuyers = db.buyers
    .filter((buyer) => (buyer.favoriteSellers || []).includes(seller.id))
    .map((buyer) => ({ id: buyer.id, name: buyer.name, email: buyer.email }))

  const wishlistedProducts = db.buyers.flatMap((buyer) => {
    return (buyer.wishlist || [])
      .filter((item) => item.sellerId === seller.id)
      .map((item) => {
        const product = seller.products?.find((candidate) => candidate.id === item.productId)
        return {
          ...item,
          buyerId: buyer.id,
          buyerName: buyer.name,
          productName: product?.name || item.productName
        }
      })
  })

  res.json({ favoriteBuyers, wishlistedProducts })
})

router.post('/:sellerId/products', requireAuth, requireSellerOwner, validate(productSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    if (!seller) return null

    const product = {
      id: randomUUID(),
      ...req.body,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }

    seller.products = seller.products || []
    seller.products.push(product)
    return { seller, product }
  })

  if (!result) return res.status(404).json({ error: 'Seller not found' })
  res.status(201).json({ seller: publicSeller(result.seller), product: result.product })
})

router.put('/:sellerId/products/:productId', requireAuth, requireSellerOwner, validate(productSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    const product = findProduct(seller, req.params.productId)
    if (!seller || !product) return null

    Object.assign(product, req.body, { id: product.id })
    return { seller, product }
  })

  if (!result) return res.status(404).json({ error: 'Product not found' })
  res.json({ seller: publicSeller(result.seller), product: result.product })
})

router.delete('/:sellerId/products/:productId', requireAuth, requireSellerOwner, async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    if (!seller) return null

    const before = seller.products?.length || 0
    seller.products = (seller.products || []).filter((product) => String(product.id) !== String(req.params.productId))
    return before === seller.products.length ? null : seller
  })

  if (!result) return res.status(404).json({ error: 'Product not found' })
  res.json({ seller: publicSeller(result) })
})

router.post('/:sellerId/favorite', requireAuth, requireRole('buyer'), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    const buyer = db.buyers.find((item) => item.id === req.user.id)
    if (!seller || !buyer) return null

    buyer.favoriteSellers = buyer.favoriteSellers || []
    const exists = buyer.favoriteSellers.includes(seller.id)
    buyer.favoriteSellers = exists
      ? buyer.favoriteSellers.filter((id) => id !== seller.id)
      : [...buyer.favoriteSellers, seller.id]

    return { seller, buyer, favorite: !exists }
  })

  if (!result) return res.status(404).json({ error: 'Seller not found' })
  res.json({
    seller: publicSeller(result.seller),
    buyer: publicBuyer(result.buyer),
    favorite: result.favorite
  })
})

router.post('/:sellerId/rating', requireAuth, requireRole('buyer'), validate(ratingSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    if (!seller) return null

    seller.reactions = seller.reactions || { good: [], bad: [] }
    seller.reactions.good = seller.reactions.good || []
    seller.reactions.bad = seller.reactions.bad || []

    const opposite = req.body.rating === 'good' ? 'bad' : 'good'
    seller.reactions[opposite] = seller.reactions[opposite].filter((id) => id !== req.user.id)

    if (seller.reactions[req.body.rating].includes(req.user.id)) {
      seller.reactions[req.body.rating] = seller.reactions[req.body.rating].filter((id) => id !== req.user.id)
    } else {
      seller.reactions[req.body.rating].push(req.user.id)
    }

    return seller
  })

  if (!result) return res.status(404).json({ error: 'Seller not found' })
  res.json({ seller: publicSeller(result) })
})

router.post('/:sellerId/comments', requireAuth, requireRole('buyer'), validate(commentSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    const buyer = db.buyers.find((item) => item.id === req.user.id)
    if (!seller || !buyer) return null

    const comment = {
      id: randomUUID(),
      buyerId: buyer.id,
      buyerName: buyer.name,
      text: req.body.text,
      createdAt: new Date().toISOString()
    }

    seller.comments = seller.comments || []
    seller.comments.unshift(comment)
    return { seller, comment }
  })

  if (!result) return res.status(404).json({ error: 'Seller not found' })
  res.status(201).json({ seller: publicSeller(result.seller), comment: result.comment })
})

router.post('/:sellerId/products/:productId/like', requireAuth, requireRole('buyer'), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    const product = findProduct(seller, req.params.productId)
    if (!seller || !product) return null

    product.likes = product.likes || []
    const exists = product.likes.includes(req.user.id)
    product.likes = exists ? product.likes.filter((id) => id !== req.user.id) : [...product.likes, req.user.id]
    return { seller, product, liked: !exists }
  })

  if (!result) return res.status(404).json({ error: 'Product not found' })
  res.json({ seller: publicSeller(result.seller), product: result.product, liked: result.liked })
})

router.post('/:sellerId/products/:productId/wishlist', requireAuth, requireRole('buyer'), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    const product = findProduct(seller, req.params.productId)
    const buyer = db.buyers.find((item) => item.id === req.user.id)
    if (!seller || !product || !buyer) return null

    buyer.wishlist = buyer.wishlist || []
    const exists = buyer.wishlist.some((item) => item.productId === product.id && item.sellerId === seller.id)
    buyer.wishlist = exists
      ? buyer.wishlist.filter((item) => !(item.productId === product.id && item.sellerId === seller.id))
      : [
          ...buyer.wishlist,
          {
            productId: product.id,
            sellerId: seller.id,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image,
            sellerName: seller.businessName,
            addedAt: new Date().toISOString()
          }
        ]

    return { seller, buyer, wishlisted: !exists }
  })

  if (!result) return res.status(404).json({ error: 'Product not found' })
  res.json({
    seller: publicSeller(result.seller),
    buyer: publicBuyer(result.buyer),
    wishlisted: result.wishlisted
  })
})

router.post('/:sellerId/products/:productId/comments', requireAuth, requireRole('buyer'), validate(commentSchema), async (req, res) => {
  const result = await updateDb(async (db) => {
    const seller = findSeller(db, req.params.sellerId)
    const product = findProduct(seller, req.params.productId)
    const buyer = db.buyers.find((item) => item.id === req.user.id)
    if (!seller || !product || !buyer) return null

    const comment = {
      id: randomUUID(),
      buyerId: buyer.id,
      buyerName: buyer.name,
      text: req.body.text,
      createdAt: new Date().toISOString()
    }

    product.comments = product.comments || []
    product.comments.unshift(comment)
    return { seller, product, comment }
  })

  if (!result) return res.status(404).json({ error: 'Product not found' })
  res.status(201).json({ seller: publicSeller(result.seller), product: result.product, comment: result.comment })
})

export default router
