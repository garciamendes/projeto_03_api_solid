// Third party
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Project
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-in-repository'

// Local
import { CheckInUseCase } from './checkin'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Validando a criação de um novo check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'teste_01',
      userId: 'teste_01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Validando se o usuário consegue fazer check-in duas vezes no dia', async () => {
    vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0)) // 22/1/2023 11:00:00

    await sut.execute({
      gymId: 'teste_01',
      userId: 'teste_01',
    })

    await expect(() =>
      sut.execute({
        gymId: 'teste_01',
        userId: 'teste_01',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Validando se o usuário consegue fazer check-in duas vezes em diferentes dias', async () => {
    vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0)) // 22/1/2023 11:00:00

    await sut.execute({
      gymId: 'teste_01',
      userId: 'teste_01',
    })

    vi.setSystemTime(new Date(2023, 0, 23, 8, 0, 0)) // 23/1/2023 11:00:00
    const { checkIn } = await sut.execute({
      gymId: 'teste_01',
      userId: 'teste_01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
