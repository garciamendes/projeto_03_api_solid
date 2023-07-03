// Third part
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

// Project
import { InvalidCrendetialsError } from '../../../useCases/errors/invalid-crendetials.error'
import { makeAuthenticateUseCase } from '../../../useCases/factories/make-authenticate-use-case'

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
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign({}, { sign: { sub: user.id } })
    return reply.status(200).send({ Token: token })
  } catch (error) {
    if (error instanceof InvalidCrendetialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
