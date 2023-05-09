// Third part
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

// Project
import { RegisterUseCase } from '../../useCases/register'
import { UserAlreadyExistsError } from '../../useCases/errors/user-already-exists-error'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, name, password } = registerBody.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    await registerUseCase.execute({
      email,
      name,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
