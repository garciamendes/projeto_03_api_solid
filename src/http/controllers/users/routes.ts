// Third party
import { FastifyInstance } from 'fastify'

// Project
import { verifyJwt } from '../../middlewares/verify-jwt'

// Local
import { register } from './register'
import { authenticate } from './authenticate'
import { getUserProfile } from './get-user-profile'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  // Public routes
  app.post('/register', register)
  app.post('/auth', authenticate)
  app.patch('/auth/refresh', refresh)

  // Privates Routes
  app.get('/profile', { onRequest: [verifyJwt] }, getUserProfile)
}
