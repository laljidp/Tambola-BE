import mongoose from 'mongoose'
import { COLLECTION } from '../collections'
import { sign } from 'jsonwebtoken'
const otpGenerator = require('otp-generator')
const { Schema } = mongoose
require('dotenv').config()

const { JWT_SECRET } = process.env

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: false,
    default: null,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  phoneNo: {
    type: String,
    required: true,
    unique: [true, 'PhoneNo already registered!']
  },
  countryCode: {
    type: String,
    required: true,
    default: '+91'
  },
  otp: {
    type: String,
    required: false,
    default: null
  },
  otpExpires: {
    type: String,
    required: false,
    default: null
  },
  lastVisited: {
    type: Date, default: new Date()
  },
  isVerified: {
    type: Boolean,
    default: false
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
    phoneNo: this.phoneNo
  }

  return sign(payload, JWT_SECRET, {
    expiresIn: '30d',
    algorithm: 'RS384'
  })
}

UserSchema.methods.generateOTP = function () {
  this.otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })
  this.otpExpires = Date.now() + (30 * 60 * 1000) // expires in an 30m = (30*60*1000)
}

UserSchema.methods.updateVerifyFlag = function () {
  this.isVerified = true
}

mongoose.set('useFindAndModify', false)

const User = mongoose.model(COLLECTION.USERS, UserSchema)

export default User
