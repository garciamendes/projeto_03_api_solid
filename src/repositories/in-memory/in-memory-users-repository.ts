// Project
import { Prisma, User } from '@prisma/client'
import { IUserRepository } from '../users-repository'

export class InMemoryUsersRepository implements IUserRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: '1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created: new Date(),
    }

    this.items.push(user)
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) return null

    return user
  }
}
