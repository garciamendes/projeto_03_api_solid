// Third party
import { FastifyInstance } from 'fastify'

// Project
import { verifyJwt } from '../../middlewares/verify-jwt'
import { VerifyUserRole } from '../../middlewares/verify-user-role'

// Local
import { create } from './create'
import { search } from './search'
import { nearby } from './nearby'

export async function gymsRoutes(app: FastifyInstance) {
  // Verificação se o usuário está autenticado na aplicação
  app.addHook('onRequest', verifyJwt)

  // Private routes
  app.post('/gyms', { onRequest: [VerifyUserRole('ADMIN')] }, create)
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
}
