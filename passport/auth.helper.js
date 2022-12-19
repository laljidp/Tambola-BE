import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY

export const checkAuthentication = (req) => {
  if (req.headers && req.headers.authorization) {
    const { authorization } = req.headers
    const token = authorization.split(' ')[1]
    if (token) {
      const data = jwt.verify(token, SECRET_KEY)
      if (data) {
        return data
      } else {
        return null
      }
    } else {
      return null
    }
  } else {
    return null
  }
}
