import express from 'express'
import { check } from 'express-validator'
import * as Auth from '../controllers/auth.controller'
import validate from '../middlewares/validate'
import dotenv from 'dotenv'

const router = express.Router()

dotenv.config()

router.get('/', (req, res) => { res.send({ message: 'You\'re accessing auth routes..' }) })

router.post('/login', [
  check('phone_no').isMobilePhone().withMessage('Enter a valid Phone number'),
], validate, Auth.login)

router.post('/register', [
  check('phone_no').isMobilePhone().withMessage('Enter a valid phone number'),
  check('firstName').not().isEmpty().withMessage('First name is required'),
  check('lastName').not().isEmpty().withMessage('Last name is required')
], Auth.registerUser)

router.post('/verifyOTP', [
  check('phone_no').isMobilePhone().withMessage('Bad request! Phone number missing'),
  check('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP')
], validate, Auth.verifyOTPForLogin)


export default router
