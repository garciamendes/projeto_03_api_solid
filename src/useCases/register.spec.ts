// Third party
import { describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'

// Local
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('Validando ver se todo o fluxo de cadastro de usuário deem certo', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUseCase(userRepository)

    const { user } = await registerUserCase.execute({
      name: 'Garcia',
      email: 'garcia1@gmail.com',
      password: 'dev123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Verficando se a senha do usuario está sendo criado como hash', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(userRepository)

    const { user } = await sut.execute({
      name: 'Garcia',
      email: 'garcia1@gmail.com',
      password: 'dev123',
    })

    const isPasswordCorrectlyhashed = await compare(
      'dev123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyhashed).toBe(true)
  })

  it('Não pode ser possível cadastro com o mesmo email duas vezes', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(userRepository)

    const email = 'garcia6@gmail.com'

    await sut.execute({
      name: 'Garcia',
      email,
      password: 'dev123',
    })

    await expect(() =>
      sut.execute({
        name: 'Garcia',
        email,
        password: 'dev123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
