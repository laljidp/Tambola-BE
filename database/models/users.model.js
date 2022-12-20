import mongoose from 'mongoose'
import { COLLECTION } from '../collections'
const { Schema } = mongoose

const Users = mongoose.model(COLLECTION.USERS, new Schema({ 
 firstName: {
    type: String,        
  },
  lastName: {
    type: String
  },
  profilePhoto: String,
  password: String,
  source: { type: String, required: [true, "source not specified"] },
  googleId: {
    type: String,
    default: null
  },
  email: {
    type: String,
    unique: [true, 'email already registered!'],
    required: [true, 'email is required'],
    match: /[a-z0–9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-z0–9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0–9](?:[a-z0–9-]*[a-z0–9])?\.)+[a-z0–9](?:[a-z0–9-]*[a-z0–9])?/
  },
  phone_no: {
    type: String,
    default: null    
  },  
  country_code: {
    type: String,
    required: true,
    default: '+91'
  },
  lastVisited: { type: Date, default: new Date() }
}, { timestamps: true }))

export default Users