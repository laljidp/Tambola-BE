import express from 'express'
import { checkSchema, param } from 'express-validator'

import * as ContestsController from '../controllers/contests.controller'
import validate from '../middlewares/validate'

const router = express.Router()

router.get('/', ContestsController.getActiveContests)

router.post(
  '/',
  checkSchema({
    name: {
      isString: true,
      errorMessage: 'Name is required!'
    },
    startDateTime: {
      isISO8601: true,
      errorMessage: 'Invalid date'
    },
    joiningAmount: {
      isInt: true
    },
    'prizes.quickFive': { isInt: true },
    'prizes.firstRow': { isInt: true },
    'prizes.secondRow': { isInt: true },
    'prizes.thirdRow': { isInt: true },
    'prizes.fullHousie': { isInt: true },
    'prizes.secondFullHousie': { isInt: true },
    maxParticipants: {
      isInt: true,
      errorMessage: 'Invalid maxParticipants value'
    }
  }),
  validate,
  ContestsController.createContest
)

router.get(
  '/:id',
  [param('id', 'Invalid request [ID]!').isMongoId()],
  validate,
  ContestsController.getContestInfoByID
)

router.post(
  '/assignTicket',
  checkSchema({
    ticketID: { isString: true, errorMessage: 'ticketID is is missing!' },
    contestID: { isString: true, errorMessage: 'contestID is missing!' }
  }),
  validate,
  ContestsController.assignTicketToUser
)
export default router
