// Third party
import { Gym } from '@prisma/client'

// Project
import { IGymsRepository } from '../repositories/gyms-repository'

interface IFetchNearbyGymsProps {
  userLatitude: number
  userLongitude: number
}

interface IFetchNearbyGymsCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsProps): Promise<IFetchNearbyGymsCaseResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
