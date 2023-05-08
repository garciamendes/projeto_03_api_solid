// Third party
import fastify from 'fastify'

// Local
import { appRoutes } from './http/routes'

export const app = fastify()
app.register(appRoutes)
