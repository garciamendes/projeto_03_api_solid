// Third part
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

// Project
import { makeSearchGymsUseCase } from '../../../useCases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    search: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { search, page } = searchGymQuerySchema.parse(request.query)

  const gymUseCase = makeSearchGymsUseCase()
  const { gym: gyms } = await gymUseCase.execute({
    search,
    page,
  })

  return reply.status(200).send({ gyms })
}
