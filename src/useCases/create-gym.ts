// Third party
import { Gym, Prisma } from '@prisma/client'

// Project
import { IGymsRepository } from '../repositories/gyms-repository'

// Local
import { randomUUID } from 'crypto'

interface IGYMProps {
  name: string
  description?: string | null
  phone?: string | null
  stars?: number | null
  latitude: number
  longitude: number
}

interface IGYMUserCaseResponse {
  gym: Gym
}

export class GYMUseCase {
  constructor(private gymRepository: IGymsRepository) {}

  async execute(data: IGYMProps): Promise<IGYMUserCaseResponse> {
    const gym = await this.gymRepository.create({
      id: randomUUID(),
      name: data.name,
      description: data.description,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
      phone: data.phone,
      stars: data.stars,
    })

    return { gym }
  }
}
