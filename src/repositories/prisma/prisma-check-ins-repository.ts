import { Prisma, CheckIn } from '@prisma/client'
import { ICheckInsRepository } from '../check-ins-repository'
import { prisma } from '../../lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = prisma.checkIn.findMany({
      where: { user_id: userId },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async countByuserId(userId: string) {
    const count = prisma.checkIn.count({ where: { user_id: userId } })

    return count
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    })

    if (!checkIn) return null

    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: { id: data.id },
      data,
    })

    return checkIn
  }
}
