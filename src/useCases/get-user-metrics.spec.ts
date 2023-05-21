// Third party
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Project
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-in-repository'

// Local
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user Metrics Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('Validando a busca da quantidade de check ins por usuário', async () => {
    await checkInRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01'
    })

    await checkInRepository.create({
      gym_id: 'gym_02',
      user_id: 'user_01'
    })

    await checkInRepository.create({
      gym_id: 'gym_03',
      user_id: 'user_01'
    })

    const { checkInsCount } = await sut.execute({ userId: 'user_01' })

    expect(checkInsCount).toEqual(3)
  })
})
