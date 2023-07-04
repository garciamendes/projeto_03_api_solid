// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe('Validate Check-in (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa validar seu Check-in', async () => {
    const { Token } = await createAndAuthenticateUser(app, true)
    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        name: 'Smart',
        latitude: -3.7422367,
        longitude: -38.5060608,
      },
    })

    const { id: checkInId } = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkInId}/validate`)
      .set('Authorization', `Bearer ${Token}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
