// Third party
import { describe, expect, it } from 'vitest'

// Project
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-in-repository'

// Local
import { CheckInUseCase } from './checkin'

describe('Check-in Use Case', () => {
  it('Validando a criação de um novo check-in', async () => {
    const checkInRepository = new InMemoryCheckInsRepository()
    const sut = new CheckInUseCase(checkInRepository)

    const { checkIn } = await sut.execute({
      gymId: 'teste_01',
      userId: 'teste_01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
