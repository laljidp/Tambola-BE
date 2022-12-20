import User from '../models/users.model'

export const addGoogleUser = ({ id, email, firstName, lastName, profilePhoto }) => {
  const user = new User({
    googleId: id, email, firstName, lastName, profilePhoto, source: "google"
  })
  return user.save()
}

export const getUsers = () => {
  return User.find({})
}

export const getUserByEmail = async ({ email }) => {
  return await User.findOne({ email })
}
