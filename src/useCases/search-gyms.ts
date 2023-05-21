// Third party
import { Gym, Prisma } from '@prisma/client'

// Project
import { IGymsRepository } from '../repositories/gyms-repository'

// Local
import { randomUUID } from 'crypto'

interface ISearchGymsProps {
  search: string,
  page: number
}

interface ISearchGymsCaseResponse {
  gym: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymRepository: IGymsRepository) {}

  async execute({search, page}: ISearchGymsProps): Promise<ISearchGymsCaseResponse> {
    const gym = await this.gymRepository.findManyBySearch(search, page)

    return { gym }
  }
}
