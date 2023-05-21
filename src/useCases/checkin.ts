import { CheckIn } from '@prisma/client'

// Project
import { ICheckInsRepository } from '../repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { IGymsRepository } from '../repositories/gyms-repository'
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'

interface ICheckInRequest {
  userId: string,
  gymId: string,
  userLatitude: number,
  userLongitude: number
}

interface ICheckInResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository
  ) {}

  async execute({ gymId, userId, userLatitude, userLongitude }: ICheckInRequest): Promise<ICheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {latitude: userLatitude, longitude: userLongitude},
      {latitude: Number(gym.latitude), longitude: Number(gym.longitude)}
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
