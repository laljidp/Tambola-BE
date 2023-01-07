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
    const cts = new Contests({ ...body, startDateTime: new Date(body.startDateTime) })
    cts.save()
    return res.status(200).json({ success: true, message: 'Contest created', data: cts })
  } catch (err) {
    console.log('err', err?.message)
  }
}

export const getActiveContests = async (req, res) => {
  try {
    const contests = await Contests.find({ isActive: true })
    res.status(200).json({ success: true, data: contests })
  } catch (err) {
    console.log('Error while fetching active contests: ', err)
  }
}

export const getContestInfoByID = async (req, res) => {
  const { id } = req.params
  const contest = await Contests.findById(id)
  console.log('contest', contest)
  if (!contest) {
    return res.status(200).json({ success: true, message: 'Contest not found!', data: null })
  }
  return res.status(200).json({ success: true, data: contest })
}
