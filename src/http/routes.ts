// Third party
import { FastifyInstance } from 'fastify'

// Local
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { getUserProfile } from './controllers/get-user-profile'

export async function appRoutes(app: FastifyInstance) {
  // Users
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/profile/:id', getUserProfile)
}
