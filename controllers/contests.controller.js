import { COLLECTION } from '../database/collections'
import { ACTIVE_CONTEST_FIELD } from '../database/db.helper'
import Contests from '../database/models/contests.model'

export const getAllContests = async (req, res) => {
  const contests = await Contests.find({})
  if (!contests) {
    res.status(200).json({ success: true, data: [] })
  }
  res.status(200).json({ success: true, data: contests })
}

export const createContest = async (req, res) => {
  const { body } = req
  try {
    console.log('supasses the validation.....')
    const cts = new Contests({
      ...body,
      startDateTime: new Date(body.startDateTime)
    })
    cts.save()
    return res.status(200).json({ success: true, message: 'Contest created' })
  } catch (err) {
    console.log('err', err?.message)
  }
}

export const getActiveContests = async (req, res) => {
  try {
    const contests = await Contests.find(
      { isActive: true },
      ACTIVE_CONTEST_FIELD.join(' ')
    )
    res.status(200).json({ success: true, data: contests })
  } catch (err) {
    console.log('Error while fetching active contests: ', err)
  }
}

export const getContestInfoByID = async (req, res) => {
  const { id } = req.params
  const contest = await Contests.findOne({ _id: id }).populate({
    path: 'tickets',
    populate: {
      path: 'user',
      model: COLLECTION.USERS,
      select: 'firstName profilePhoto'
    }
  })
  console.log('contest', contest)
  if (!contest) {
    return res
      .status(200)
      .json({ success: true, message: 'Contest not found!', data: null })
  }
  return res.status(200).json({ success: true, data: contest })
}

export const assignTicketToUser = async (req, res) => {
  const { contestID, ticketID } = req.body
  const { _id } = req.user
  const contest = await Contests.findById(contestID)
  if (!contest) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid contest !' })
  }

  const contestData = await Contests.findOne(
    { _id: contestID },
    { tickets: { $elemMatch: { _id: ticketID } } }
  )

  if (!contestData) {
    return res.status(200).json({ success: false, message: 'Bad request!' })
  }

  const { tickets = [] } = contestData

  if (tickets[0]?.user) {
    return res.status(200).json({
      success: false,
      message: 'Ticket already been assigned ! try another'
    })
  }

  const resp = await Contests.updateOne(
    { _id: contestID, 'tickets._id': ticketID },
    { 'tickets.$.user': _id }
  )
  const modifiedCount = resp.nModified
  res.status(200).json({
    success: true,
    message: `Ticket assigned [${modifiedCount || 0}]!`
  })
}
