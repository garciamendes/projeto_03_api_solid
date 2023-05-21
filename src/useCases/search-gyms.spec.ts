// Third party
import { beforeEach, describe, expect, it } from 'vitest'

// Project
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository'

// Local
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('Validando o filtro de busca por nome da academia', async () => {
    await gymsRepository.create({
      name: 'Smart fit',
      stars: 4.6,
      latitude: -3.7501588,
      longitude: -38.4538632
    })

    await gymsRepository.create({
      name: 'Smart fit',
      stars: 4.6,
      latitude: -3.1501588,
      longitude: -20.4538632
    })

    await gymsRepository.create({
      name: 'Fit body',
      stars: 1.2,
      latitude: -3.1301588,
      longitude: -20.4538632
    })

    const { gym } = await sut.execute({ search: 'smart fit', page: 1 })

    expect(gym).toHaveLength(2)
    expect(gym).toEqual([
      expect.objectContaining({ name: 'Smart fit' }),
      expect.objectContaining({ name: 'Smart fit' }),
    ])
  })

  it('Validando a busca do histórico do usuário com páginação', async () => {
    for (let index = 1; index <= 22; index++) {
      let id = index < 10 ? `gym_0${index}` : `gym_${index}`

      await gymsRepository.create({
        name: `Smart fit ${id}`,
        stars: 4.6,
        latitude: -3.7501588,
        longitude: -38.4538632
      })
    }

    const { gym } = await sut.execute({ search: 'smart', page: 2 })

    expect(gym).toHaveLength(2)
    expect(gym).toEqual([
      expect.objectContaining({ name: 'Smart fit gym_21' }),
      expect.objectContaining({ name: 'Smart fit gym_22' }),
    ])
  })
})
