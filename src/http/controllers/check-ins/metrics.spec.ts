// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe('Metrics Check-in (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa visualizar a quantidade check-ins', async () => {
    const { Token } = await createAndAuthenticateUser(app)
    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        name: 'Smart',
        latitude: -3.7422367,
        longitude: -38.5060608,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${Token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
