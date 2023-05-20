// Third party
import { describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'

// Project
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

// Local
import { AuthenticationUseCase } from './authenticate'
import { InvalidCrendetialsError } from './errors/invalid-crendetials.error'

describe('Authenticate Use Case', () => {
  it('Validando se o usuário consegue se autenticar', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticationUseCase(userRepository)

    await userRepository.create({
      name: 'teste',
      email: 'garcia1@gmail.com',
      password_hash: await hash('dev123', 6),
    })

    const { user } = await sut.execute({
      email: 'garcia1@gmail.com',
      password: 'dev123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Validando se o usuário consegue se autenticar com email não existente', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticationUseCase(userRepository)

    expect(() =>
      sut.execute({
        email: 'garcia1@gmail.com',
        password: 'dev123',
      }),
    ).rejects.toBeInstanceOf(InvalidCrendetialsError)
  })

  it('Validando se o usuário consegue se autenticar com senha errada', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticationUseCase(userRepository)

    await userRepository.create({
      name: 'teste',
      email: 'garcia1@gmail.com',
      password_hash: await hash('dev12345', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'garcia1@gmail.com',
        password: 'dev123',
      }),
    ).rejects.toBeInstanceOf(InvalidCrendetialsError)
  })
})
