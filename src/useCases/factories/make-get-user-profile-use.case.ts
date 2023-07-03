import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetUserProfile } from '../get-user-profile'

export function makeGetUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfile(usersRepository)

  return useCase
}
