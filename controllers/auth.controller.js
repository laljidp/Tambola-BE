import User from '../database/models/users.model'
import { getTextMSg, sendSMS } from '../utils'

// @route POST api/user
// @desc Add a new user
export const registerUser = async (req, res) => {
  try {
    const { phoneNo } = req.body

    const user = await User.findOne({ phoneNo })

    if (user) return res.status(403).json({ success: false, message: 'User with associated Phone number already exists!' })

    const newUser = new User({ ...req.body })

    const __user = await newUser.save()

    // Generate and reset password token
    __user.generateOTP()

    // save the updated User
    await __user.save()

    // Configure SMS to sent
    const textMsg = getTextMSg(__user.otp)
    try {
      sendSMS(`${__user.countryCode}${phoneNo}`, textMsg)
    } catch (err) {
      console.log('Error while sending SMS form Twilio API', err)
    }

    res.status(200).json({ success: true, message: `An OTP has been sent to ${__user.phoneNo}` })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
export const login = (req, res) => {
  User.findOne({ phoneNo: req.body.phoneNo, countryCode: res.body?.countryCode })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `The Phone number you've entered is not associated with any account! Please try again!`
        })
      }
      // generate OTP  with expiry time
      user.generateOTP()

      // commit changes to DB
      user.save()

      // send OTP for the sign in
      const textMsg = getTextMSg(user.otp)
      sendSMS(fullPhoneNumber(user.countryCode, user.phoneNo), textMsg)

      res.status(200).json({ success: true, message: `OTP has been sent to ${user.countryCode} ${user.phoneNo}` })
    })
    .catch(err => res.status(500).json({ success: false, error: err.message }))
}

export const verifyOTPForLogin = (req, res) => {
  const { phoneNo, otp } = req.body

  User.findOne({ phoneNo })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid OTP'
        })
      }

      if (user.otp !== otp) {
        return res.status(401).json({ sucess: false, message: 'Invalid OTP' })
      }

      // verify OTP
      if (user.otp === otp && new Date().getTime() < user.otpExpires) {
        // generate token and sent back
        const token = user.generateJWT()
        return res.status(200).json({
          token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
            email: user.email
          }
        })
      } else {
        res.status(401).json({ success: false, message: 'OTP expired !' })
      }
    })
}

export const resendOTP = (req, res) => {
  const { phoneNo } = req.body

  if (!phoneNo) return res.status(403).json({ success: false, message: 'Bad request!' })

  User.findOne({ phoneNo })
    .then(user => {
      if (!user) return res.status(403).json({ success: false, message: 'Invalid request! Account not found' })
      // Generate OTP for & save in DB
      user.generateOTP()
      user.save()

      const textMsg = getTextMSg(user.otp)
      const fullPhoneNumber = fullPhoneNumber(user.countryCode, phoneNo)

      // send text msg to mobile no
      sendSMS(fullPhoneNumber, textMsg)

      res.status(200)
        .json({ success: true, message: `OTP has been sent to ${fullPhoneNumber}` })
    })
    .catch(err => {
      console.log('Error while re-sending OTP', err)
      res.status(500).json({ success: false, message: 'Internal server error!' })
    })
}
