import { PrismaGymRepository } from '../../repositories/prisma/prisma-gym-repository'
import { GYMUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymRepository()
  const useCase = new GYMUseCase(gymsRepository)

  return useCase
}
