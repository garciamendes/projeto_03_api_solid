// Third party
import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { hash } from 'bcryptjs'

// Project
import { prisma } from '../../lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'Jonh Doe',
      email: 'JonhDoe@gmail.com',
      password_hash: await hash('dev123', 6),
      role: isAdmin ? 'ADMIN' : 'MENBER',
    },
  })

  const authResponse = await request(app.server).post('/auth').send({
    email: 'JonhDoe@gmail.com',
    password: 'dev123',
  })

  const { Token } = authResponse.body
  return { Token }
}
