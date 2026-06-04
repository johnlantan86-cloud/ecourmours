import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export const signSession = (user) => {
  return jwt.sign(user, config.jwtSecret, { expiresIn: '7d' })
}

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.type)) {
      return res.status(403).json({ error: 'You do not have permission for this action' })
    }
    next()
  }
}

export const requireSellerOwner = (req, res, next) => {
  if (req.user?.type === 'admin' || (req.user?.type === 'seller' && String(req.user.id) === String(req.params.sellerId))) {
    return next()
  }

  return res.status(403).json({ error: 'Only this seller can manage these products' })
}
