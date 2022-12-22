import mongoose from 'mongoose'
import { COLLECTION } from '../collections'
import { sign } from 'jsonwebtoken'
const otpGenerator = require('otp-generator')
const { Schema } = mongoose
require('dotenv').config()

const { JWT_SECRET } = process.env

const UserSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  profilePhoto: {
    type: String
  },
  email: {
    type: String,
    unique: [true, 'email already registered!'],
    required: false,
    default: null,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  phone_no: {
    type: String,
    required: true,
    unique: [true, 'Phone_no already registered!']
  },
  country_code: {
    type: String,
    required: true,
    default: '+91'
  },
  otp: {
    type: String,
    required: false
  },
  otpExpires: {
    type: String,
    required: false
  },
  lastVisited: {
    type: Date, default: new Date()
  }
}, { timestamps: true })

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  const payload = {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    phone_no: this.phone_no
  }

  return sign(payload, JWT_SECRET, {
    expiresIn: '30d'
  })
}

UserSchema.methods.generateOTP = function () {
  this.otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })
  this.otpExpires = Date.now() + 3600000 // expires in an hour
}

mongoose.set('useFindAndModify', false)

const User = mongoose.model(COLLECTION.USERS, UserSchema)

export default User
