// Third party
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Project
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-in-repository'

// Local
import { CheckInUseCase } from './checkin'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check ins History Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('Validando a busca do histórico do usuário', async () => {
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

    const { checkIns } = await sut.execute({ userId: 'user_01', page: 1 })

    expect(checkIns).toHaveLength(3)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym_01' }),
      expect.objectContaining({ gym_id: 'gym_02' }),
      expect.objectContaining({ gym_id: 'gym_03' }),
    ])
  })

  it('Validando a busca do histórico do usuário com páginação', async () => {
    for (let index = 1; index <= 22; index++) {
      let id = index < 10 ? `gym_0${index}` : `gym_${index}`

      await checkInRepository.create({
        gym_id: id,
        user_id: 'user_01'
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user_01', page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym_21' }),
      expect.objectContaining({ gym_id: 'gym_22' }),
    ])
  })
})
