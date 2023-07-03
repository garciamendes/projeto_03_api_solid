// Third part
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

// Project
import { makeCreateGymUseCase } from '../../../useCases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    stars: z.number().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { name, description, latitude, longitude, phone, stars } =
    createGymBodySchema.parse(request.body)

  const gymUseCase = makeCreateGymUseCase()
  await gymUseCase.execute({
    name,
    description,
    latitude,
    longitude,
    phone,
    stars,
  })

  return reply.status(201).send()
}
