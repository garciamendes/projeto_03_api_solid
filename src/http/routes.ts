// Third party
import { FastifyInstance } from 'fastify'

// Local
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { getUserProfile } from './controllers/get-user-profile'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  // Users
  app.post('/register', register)
  app.post('/auth', authenticate)

  // Privates Routes
  app.get('/profile/:id', { onRequest: [verifyJwt] }, getUserProfile)
}
