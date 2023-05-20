// Third party
import { User } from '@prisma/client'

// Project
import { IUserRepository } from '../repositories/users-repository'

// Local
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileRequest {
  id: string
}

interface GetUserProfileResponse {
  user: User
}

export class GetUserProfile {
  constructor(private usersRepository: IUserRepository) {}

  async execute({
    id,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
