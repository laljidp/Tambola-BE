import passport from "passport";
import User from '../database/models/users.model'

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const currentUser = await User.findOne({ googleId: id });
  done(null, currentUser);
});