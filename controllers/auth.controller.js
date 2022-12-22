import User from '../database/models/users.model'
import { sendSMS } from '../utils'

// @route POST api/user
// @desc Add a new user
export const registerUser = async (req, res) => {
  try {
    const { phone_no } = req.body

    const user = await User.findOne({ phone_no })

    if (user) return res.status(403).json({ success: false, message: 'User with associated Phone number already exists!' })

    const newUser = new User({ ...req.body })

    const __user = await newUser.save()

    // Generate and reset password token
    __user.generateOTP()

    // save the updated User
    await __user.save()

    console.log('counrty code', __user.country_code)
    // Configure SMS to sent
    const textMsg = `Your OTP for Tambola game is:  ${__user.otp}`
    try {
      sendSMS(`${__user.country_code}${phone_no}`, textMsg)
    } catch (err) {
      console.log('Error while sending SMS form Twilio API', err)
    }

    res.status(200).json({ success: true, message: `An OTP has been sent to ${__user.phone_no}` })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
export const login = (req, res) => {
  User.findOne({ phone_no: req.body.phone_no })
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
      const textMsg = `Your OTP for Tambola game is:  ${user.otp}`
      sendSMS(`${user.country_code}${user.phone_no}`, textMsg)

      res.status(200).json({ success: true, message: `OTP has been sent to ${user.country_code} ${user.phone_no}` })
    })
    .catch(err => res.status(500).json({ success: false, error: err.message }))
}

export const verifyOTPForLogin = (req, res) => {
  const { phone_no, otp } = req.body

  User.findOne({ phone_no })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid OTP'
        })
      }

      // verify OTP
      if (user.otp === otp && new Date().getTime() < user.otpExpires) {
        // generate token and sent back
        const token = user.generateJWT()
        return res.status(200).json({ token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
            email: user.email
          } })
      } else {
        res.status(401).json({ success: false, message: 'OTP expired !' })
      }
    })
}
