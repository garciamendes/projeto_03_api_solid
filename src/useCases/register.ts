// Third party
import { hash } from 'bcryptjs'

// Project
import { IUserRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface IRegisterProps {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, name, password }: IRegisterProps) {
    const userExist = await this.userRepository.findByEmail(email)

    if (userExist) throw new UserAlreadyExistsError()

    const password_hash = await hash(password, 6)

    await this.userRepository.create({
      email,
      name,
      password_hash,
    })
  }
}
