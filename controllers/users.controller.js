import User from '../database/models/users.model'

// @route GET api/my-profile/
// @desc Returns a user profile info
// @access Public
export const getUserProfile = async (req, res) => {
  try {
    const id = req?.user?.id

    if (!id) return res.status(401).json({ success: false, message: 'Bad request! Invalid user' })

    const user = await User.findById(id)

    if (!user) return res.status(401).json({ message: 'User does not exist' })

    res.status(200).json({ success: true, message: 'A Valid user!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
