import { validationResult } from 'express-validator'

export default (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let error = []
    error = errors.array().map((err) => err.msg)
    return res.status(401).json({ error })
  }
  next()
}
