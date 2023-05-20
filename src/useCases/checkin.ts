// Third party
import { CheckIn } from '@prisma/client'

// Project
import { ICheckInsRepository } from '../repositories/check-ins-repository'

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
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
