import mongoose from 'mongoose'
import Tickets from './tickets.model'
import { COLLECTION } from '../collections'
import { getTickets } from '../../utils'

const { Schema } = mongoose

const ContestSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  joiningAmount: {
    type: Number,
    required: true
  },
  prizes: {
    quickFive: Number,
    firstRow: Number,
    secondRow: Number,
    thirdRow: Number,
    fullHousie: Number,
    secondFullHousie: Number
  },
  tickets: {
    type: [Tickets],
    required: true,
    default: []
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  isFinished: {
    type: Boolean,
    required: true,
    default: false
  },
  isPlaying: {
    type: Boolean,
    required: true,
    default: false
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, { timestamps: true })

ContestSchema.methods.updatePlayingStatus = function (isRunning) {
  this.isPlaying = isRunning
}

ContestSchema.methods.updateIsFinished = function (isFinished) {
  this.isFinished = isFinished
}

ContestSchema.method.updateIsActive = function (isActive) {
  this.isActive = isActive
}

ContestSchema.pre('save', function (next) {
  const _tickets = getTickets()
  this.tickets = _tickets.map((ticket, ind) => {
    return {
      series: ticket._entries,
      name: `T-${ind + 1}`
    }
  })
  next()
})

mongoose.set('useFindAndModify', false)

const Contests = mongoose.model(COLLECTION.CONTESTS, ContestSchema)

export default Contests
