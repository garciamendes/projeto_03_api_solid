import request from 'supertest'
import { FastifyInstance } from 'fastify'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/register').send({
    name: 'Jonh Doe',
    email: 'JonhDoe@gmail.com',
    password: 'dev123',
  })

  const authResponse = await request(app.server).post('/auth').send({
    email: 'JonhDoe@gmail.com',
    password: 'dev123',
  })

  const { Token } = authResponse.body
  return { Token }
}
