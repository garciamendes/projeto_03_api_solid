import { PrismaCheckInRepository } from '../../repositories/prisma/prisma-check-ins-repository'
import { PrismaGymRepository } from '../../repositories/prisma/prisma-gym-repository'
import { CheckInUseCase } from '../checkin'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const gymsRepository = new PrismaGymRepository()

  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}
