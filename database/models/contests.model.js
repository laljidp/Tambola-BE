import mongoose from 'mongoose'
import { COLLECTION } from '../collections'

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

mongoose.set('useFindAndModify', false)

const Contests = mongoose.model(COLLECTION.CONTESTS, ContestSchema)

export default Contests
