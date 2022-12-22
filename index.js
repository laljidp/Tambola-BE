import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import bodyParser from 'body-parser'
dotenv.config()
require('./passport/passport')

const { MONGO_URL } = process.env

const startServer = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, (error) => {
    if (error) { console.log('Error connecting to MongoDB:', error) } else { console.log('MongoDB connected!') }
  })
  const app = express()

  // configuring passport (initialization)
  app.use(passport.initialize())
  require('./middlewares/jwt')

  // Configuring request body middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('combined'))
  app.use(cors())
  app.use(express.urlencoded({
    extended: true
  }))
  app.use(express.json())
  const PORT = 4000

  app.get('/', (req, res) => res.send({ message: 'App is Running..' }))
  // Configuring Routes
  require('./routes/index')(app)

  app.listen(PORT, () => {
    console.log(`Running a server at ${PORT} port`)
  })
}

startServer()
