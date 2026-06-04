export const validate = (schema) => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      })
    }

    req.body = parsed.data
    next()
  }
}

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' })
}

export const errorHandler = (error, req, res, next) => {
  console.error(error)
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error'
  })
}
