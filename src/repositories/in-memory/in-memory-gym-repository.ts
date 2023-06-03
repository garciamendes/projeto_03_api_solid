// Project
import { Gym, Prisma } from '@prisma/client'
import { IFindManyNearbyProps, IGymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '../../utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) return null

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(String(data.latitude)),
      longitude: new Prisma.Decimal(String(data.longitude)),
      phone: data.phone ?? null,
      stars: data.stars ?? null,
    }

    this.items.push(gym)
    return gym
  }

  async findManyBySearch(search: string, page: number) {
    return this.items
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({ latitude, longitude }: IFindManyNearbyProps) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        },
      )

      const distanceOfTenKilometers = 10
      return distance < distanceOfTenKilometers
    })
  }
}
