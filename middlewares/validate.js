import { validationResult } from 'express-validator'

export default (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = {}
    errors.array().map((err) => error[err.param] = err.msg)
    return res.status(402).json({ error })
  }
  next()
}
