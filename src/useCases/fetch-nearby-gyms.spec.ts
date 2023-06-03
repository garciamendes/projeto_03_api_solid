// Third party
import { beforeEach, describe, expect, it } from 'vitest'

// Project
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository'

// Local
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('Validando a busca por academia com até 10km de distância', async () => {
    await gymsRepository.create({
      name: 'Smart fit',
      stars: 4.5,
      latitude: -3.7422357,
      longitude: -38.4895827,
    })

    await gymsRepository.create({
      name: 'Smart do fit',
      stars: 4.6,
      latitude: -3.7430065,
      longitude: -38.4897115,
    })

    await gymsRepository.create({
      name: 'Fit body',
      stars: 4.7,
      latitude: -3.719976,
      longitude: -38.5681003,
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.750036,
      userLongitude: -38.453528,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Smart fit' }),
      expect.objectContaining({ name: 'Smart do fit' }),
    ])
  })
})
