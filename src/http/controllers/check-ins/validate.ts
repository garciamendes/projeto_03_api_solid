// Third part
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

// Project
import { makeValidateCheckInUseCase } from '../../../useCases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const checkInValidateUseCase = makeValidateCheckInUseCase()
  await checkInValidateUseCase.execute({
    checkinId: checkInId,
  })
  return reply.status(204).send()
}
