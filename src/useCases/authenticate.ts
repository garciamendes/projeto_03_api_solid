// Project
import { compare } from 'bcryptjs'
import { IUserRepository } from '../repositories/users-repository'
import { InvalidCrendetialsError } from './errors/invalid-crendetials.error'
import { User } from '@prisma/client'

interface IAuthRequest {
  email: string
  password: string
}

interface IAuthResponse {
  user: User
}

export class AuthenticationUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ email, password }: IAuthRequest): Promise<IAuthResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCrendetialsError()
    }

    const doesPasswordsMatch = await compare(password, user.password_hash)

    if (!doesPasswordsMatch) {
      throw new InvalidCrendetialsError()
    }

    return { user }
  }
}
