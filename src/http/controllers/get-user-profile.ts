// Third part
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

// Project
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetUserProfile } from '../../useCases/get-user-profile'
import { ResourceNotFoundError } from '../../useCases/errors/resource-not-found-error'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const idUserParams = z.object({ id: z.string().uuid() })
  const { id } = idUserParams.parse(request.params)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const getUserProfile = new GetUserProfile(prismaUsersRepository)

    await getUserProfile.execute({ id })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(200).send()
}
