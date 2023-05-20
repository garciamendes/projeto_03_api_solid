// Third party
import { CheckIn } from '@prisma/client'

// Project
import { ICheckInsRepository } from '../repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ICheckInRequest {
  userId: string
  gymId: string
}

interface ICheckInResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({ gymId, userId }: ICheckInRequest): Promise<ICheckInResponse> {
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new ResourceNotFoundError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
