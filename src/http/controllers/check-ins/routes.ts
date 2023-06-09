// Third party
import { FastifyInstance } from 'fastify'

// Project
import { verifyJwt } from '../../middlewares/verify-jwt'
import { VerifyUserRole } from '../../middlewares/verify-user-role'

// Local
import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'

export async function checkInsRoutes(app: FastifyInstance) {
  // Verificação se o usuário está autenticado na aplicação
  app.addHook('onRequest', verifyJwt)

  // Private routes
  app.post('/gyms/:gymId/check-ins', create)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [VerifyUserRole('ADMIN')] },
    validate,
  )
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
}
