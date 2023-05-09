// Third party
import { hash } from 'bcryptjs'
import { User } from '@prisma/client'

// Project
import { IUserRepository } from '../repositories/users-repository'

// Local
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface IRegisterProps {
  name: string
  email: string
  password: string
}

interface IRegisterUserCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    email,
    name,
    password,
  }: IRegisterProps): Promise<IRegisterUserCaseResponse> {
    const userExist = await this.userRepository.findByEmail(email)

    if (userExist) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)

    const user = await this.userRepository.create({
      email,
      name,
      password_hash,
    })

    return { user }
  }
}
