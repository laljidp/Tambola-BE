import mongoose from 'mongoose'
import { COLLECTION } from '../collections'

const { Schema } = mongoose

const TicketSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  series: {
    type: [],
    required: true
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: COLLECTION.USERS,
    default: null
  }
}, { timestamps: true })

export default TicketSchema
