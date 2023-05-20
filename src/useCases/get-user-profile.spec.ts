// Third party
import { describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'

// Project
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

// Local
import { GetUserProfile } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get user Profile Use Case', () => {
  it('Validando a busca do usuário pelo ID', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfile(userRepository)

    const createdUser = await userRepository.create({
      name: 'teste',
      email: 'garcia1@gmail.com',
      password_hash: await hash('dev123', 6),
    })

    const { user } = await sut.execute({ id: createdUser.id })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toEqual('garcia1@gmail.com')
  })

  it('Validando a busca do usuário pelo ID que não exista', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfile(userRepository)

    await expect(() =>
      sut.execute({ id: 'user-notfound-exists' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
