// Third party
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Project
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-in-repository'

// Local
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/lateCheckInValidation-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Validando a validação de check-in', async () => {
    const { id } = await checkInRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    const { checkIn } = await sut.execute({ checkinId: id })

    expect(checkIn.validated).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated).toEqual(expect.any(Date))
  })

  it('Validando o caso de validação de check-in que não existe', async () => {
    await expect(() =>
      sut.execute({
        checkinId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Validando o caso de não pode validar o check-in após 20 minutos da sua criação ', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const { id } = await checkInRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    const twentyOneMinuteInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinuteInMs)

    await expect(() => sut.execute({ checkinId: id })).rejects.toBeInstanceOf(
      LateCheckInValidationError,
    )
  })
})
