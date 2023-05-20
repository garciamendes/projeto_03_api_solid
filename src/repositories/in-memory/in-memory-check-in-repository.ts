// Node
import { randomUUID } from 'node:crypto'

// Third party
import { CheckIn, Prisma } from '@prisma/client'

// Project
import { ICheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated: data.validated ? new Date() : null,
      created: new Date(),
    }

    this.items.push(checkIn)
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkinOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created)
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkinOnSameDate) {
      return null
    }

    return checkinOnSameDate
  }
}
