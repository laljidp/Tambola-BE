import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import { createServer } from 'http'
import jwtStrategy from './passport/jwt.passport'
dotenv.config()

passport.use(jwtStrategy)
const { MONGO_URL } = process.env

const startServer = async () => {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  const app = express()
  const httpServer = createServer(app)

  app.use(morgan())
  app.use(cors())
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(express.json())

  const PORT = 4000

  app.get('/', (req, res) => { res.send({ message: 'App is loading...' }) })

  httpServer.listen(PORT, () => {
    console.log(`Running a server at localhost:4000`)
  })
}

startServer()
