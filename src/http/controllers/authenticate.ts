// Third part
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

// Project
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { AuthenticationUseCase } from '../../useCases/authenticate'
import { InvalidCrendetialsError } from '../../useCases/errors/invalid-crendetials.error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticareBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticareBody.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticationUseCase(prismaUsersRepository)

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCrendetialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(200).send()
}
