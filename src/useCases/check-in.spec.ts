// Third party
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

// Project
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-in-repository'

// Local
import { CheckInUseCase } from './checkin'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym_01',
      name: 'Smart fit',
      stars: 4.6,
      latitude: -3.7501588,
      longitude: -38.4538632
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
      userLatitude: -3.7501588,
      userLongitude: -38.4538632
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Validando se o usuário consegue fazer check-in duas vezes no dia', async () => {
    vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0)) // 22/1/2023 11:00:00

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: -3.7501588,
      userLongitude: -38.4538632
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym_01',
        userId: 'user_01',
        userLatitude: -3.7501588,
      userLongitude: -38.4538632
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Validando se o usuário consegue fazer check-in duas vezes em diferentes dias', async () => {
    vi.setSystemTime(new Date(2023, 0, 22, 8, 0, 0)) // 22/1/2023 11:00:00

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: -3.7501588,
      userLongitude: -38.4538632
    })

    vi.setSystemTime(new Date(2023, 0, 23, 8, 0, 0)) // 23/1/2023 11:00:00
    const { checkIn } = await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: -3.7501588,
      userLongitude: -38.4538632
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Validando se o usuário consegue fazer check-in em uma academia distante', async () => {
    gymsRepository.items.push({
      id: 'gym_02',
      name: 'Smart fit',
      description: '',
      phone: '',
      stars: 0,
      latitude: new Decimal(-3.7735396),
      longitude: new Decimal(-38.4853552)
    })

    await expect(() => sut.execute({
      gymId: 'gym_02',
      userId: 'user_01',
      userLatitude: -3.7501588,
      userLongitude: -38.4538632
    })).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
