import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-change-this-secret',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://127.0.0.1:5173,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim()),
  admin: {
    id: 'admin-001',
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@kigali.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  }
}
