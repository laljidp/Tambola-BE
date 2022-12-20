import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'

require('./passport/googleAuth')
require('./passport/passport')
dotenv.config()

const { MONGO_URL } = process.env

const startServer = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,
    useCreateIndex: true
  }, (error) => {
    if (error)
      console.log('Error connecting to MongoDB:', error)
    else
      console.log('MongoDB connected!')
  })
  const app = express()
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('combined'))
  app.use(cors())
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(express.json())

  const PORT = 4000

  app.use('/auth', authRoutes);

  app.get('/', (req, res) => { res.send({ message: 'App is loading...' }) })

  app.listen(PORT, () => {
    console.log(`Running a server at ${PORT} port`)
  })
}

startServer()
