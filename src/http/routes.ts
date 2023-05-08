// Third party
import { FastifyInstance } from 'fastify'

// Local
import { register } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  // Users
  app.post('/users', register)
}
