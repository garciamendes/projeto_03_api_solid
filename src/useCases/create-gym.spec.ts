// Third party
import { beforeEach, describe, expect, it } from 'vitest'

// Local
import { GYMUseCase } from './create-gym'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository'

let gymsRepository: InMemoryGymsRepository
let sut: GYMUseCase

describe('GYM Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GYMUseCase(gymsRepository)
  })

  it('Validando a criação de uma GYM', async () => {
    const { gym } = await sut.execute({
      name: 'Smart fit',
      stars: 4.6,
      latitude: -3.7735396,
      longitude: -38.4853552
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
