// Third party
import { Gym, Prisma } from '@prisma/client'

// Project
import { prisma } from '../../lib/prisma'
import { IFindManyNearbyProps, IGymsRepository } from '../gyms-repository'

export class PrismaGymRepository implements IGymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    if (!gym) return null

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findManyNearby({ latitude, longitude }: IFindManyNearbyProps) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async findManyBySearch(search: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }
}
