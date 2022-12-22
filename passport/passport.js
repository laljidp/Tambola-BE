const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const Users = require('../database/models/users.model')

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'joanlouji'
},
function (jwtPayload, done) {
  return Users.findById(jwtPayload.sub)
    .then(user => {
      return done(null, user)
    }
    ).catch(err => {
      return done(err)
    })
}
))
