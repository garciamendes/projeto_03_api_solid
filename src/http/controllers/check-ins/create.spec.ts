// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'
import { prisma } from '../../../lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa criar um Check-in', async () => {
    const { Token } = await createAndAuthenticateUser(app)
    const gym = await prisma.gym.create({
      data: {
        name: 'Smart',
        latitude: -3.7422367,
        longitude: -38.5060608,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${Token}`)
      .send({
        latitude: -3.7422367,
        longitude: -38.5060608,
      })

    expect(response.statusCode).toEqual(201)
  })
})
