// Third part
import { FastifyRequest, FastifyReply } from 'fastify'

// Project
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetUserProfile } from '../../useCases/get-user-profile'
import { ResourceNotFoundError } from '../../useCases/errors/resource-not-found-error'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const getUserProfile = new GetUserProfile(prismaUsersRepository)
    const id = request.user.sub
    const { user } = await getUserProfile.execute({ id })
    const Uuser = { ...user, password_hash: undefined }

    return reply.status(200).send({ Uuser })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
