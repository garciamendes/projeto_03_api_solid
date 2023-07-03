// Third part
import { FastifyRequest, FastifyReply } from 'fastify'

// Project
import { ResourceNotFoundError } from '../../../useCases/errors/resource-not-found-error'
import { makeGetUserUseCase } from '../../../useCases/factories/make-get-user-profile-use.case'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getUserProfile = makeGetUserUseCase()

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
