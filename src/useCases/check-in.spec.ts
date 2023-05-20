// Third party
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

// Project
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-in-repository'

// Local
import { CheckInUseCase } from './checkin'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym_01',
      name: 'JS Academi',
      description: '',
      phone: '',
      stars: 0,
      latitude: new Decimal(0),
      longitude: new Decimal(0)
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Validando a criação de um novo check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 0,
      userLongitude: 0
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Validando se o usuário consegue fazer check-in duas vezes no dia', async () => {
    vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0)) // 22/1/2023 11:00:00

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 0,
      userLongitude: 0
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym_01',
      userId: 'user_01',
        userLatitude: 0,
      userLongitude: 0
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Validando se o usuário consegue fazer check-in duas vezes em diferentes dias', async () => {
    vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0)) // 22/1/2023 11:00:00

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 0,
      userLongitude: 0
    })

    vi.setSystemTime(new Date(2023, 0, 23, 8, 0, 0)) // 23/1/2023 11:00:00
    const { checkIn } = await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 0,
      userLongitude: 0
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
