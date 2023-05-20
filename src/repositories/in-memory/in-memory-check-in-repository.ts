// Node
import { randomUUID } from 'node:crypto'

// Third party
import { CheckIn, Prisma } from '@prisma/client'

// Project
import { ICheckInsRepository } from '../check-ins-repository'

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
}
