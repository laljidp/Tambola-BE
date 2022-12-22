import express from 'express'
import * as UsersController from '../controllers/users.controller'

const router = express.Router()

router.get('/my-profile', UsersController.getUserProfile)

export default router
