import authRoutes from './auth.routes'
import userRoutes from './users.routes'
import authenticate from '../middlewares/authenticate'
import contestRoutes from './contests.routes'

module.exports = app => {
  app.use('/api/auth', authRoutes)
  app.use('/api/user', authenticate, userRoutes)
  app.use('/api/contest', authenticate, contestRoutes)
}
