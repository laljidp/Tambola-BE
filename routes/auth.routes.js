import express, { Router } from 'express'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Users } from '../database/models/users.model'

const router = express.Router()

dotenv.config()

const { SECRET_KEY } = process.env

router.get('/', (req, res) => { res.send({ message: 'You\'re accessing auth routes..' }) })

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  console.log('req.body', req.body)
  const user = await Users.find({ username }).exec()
  console.log('user', user)
  if (user.length === 1) {
    if (bcrypt.compareSync(password, user[0].password)) {
      const { username, email, id, name, role } = user[0]
      const opts = {}
      opts.expiresIn = 60 * 60 * 24 // token expires in 2min
      const secret = SECRET_KEY // normally stored in process.env.secret
      const token = jwt.sign({
        username, __id: id, name, email
      }, secret, opts)
      console.log('token', token)
      res.send({ token, username, email, id, name, role })
    } else {
      res.status(401).json({ message: 'Invalid password' })
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials!' })
  }
})

router.get('/checkAuthToken', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user) {
    const { __id } = req.user
    const user = await Users.findOne({ _id: __id })
    if (user) {
      res.send(req.user)
    } else {
      res.status(401).json({ message: 'Unauthorized..' })
    }
  }
})

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/profile"    
  })
);

router.get("/logout", (req, res) => {
  req.session.destroy(function () {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});


export default router
