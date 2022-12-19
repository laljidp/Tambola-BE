import mongoose from 'mongoose'
import { COLLECTION } from '../collections'
const { Schema } = mongoose

export const Users = mongoose.model(COLLECTION.USERS, new Schema({
  firstName: {
    type: String,
    required: true
  },  
  lastName: {
    type: String,
    required: true
  },    
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },  
  phone_no: {
    type: String,
    required: true
  },  
  country_code: {
    type: String,
    required: true,
    default: '+91'
  },
  last_logged_in: {
    type: Date,
    default: null
  }
}, { timestamps: true }))
