import { Strategy, ExtractJwt } from 'passport-jwt'
import { Users } from '../database/models/users.model'

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = 'SECRET_KEY' // normally store this in process.env.secret

export default new Strategy(opts, async (jwtPayload, done) => {
  if (jwtPayload.__id) {
    const user = await Users.findOne({ username: jwtPayload.username })
    if (user) {
      return done(null, jwtPayload)
    } else {
      return done(null, false)
    }
  }
  return done(null, false)
})
