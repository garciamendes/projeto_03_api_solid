// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Create GYMS (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa criar uma GYM', async () => {
    const { Token } = await createAndAuthenticateUser(app)
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${Token}`)
      .send({
        name: 'Smart',
        description: 'Smart, fazendo o melhor pela a vida saudável',
        latitude: -3.7422367,
        longitude: -38.5060608,
        phone: '(85) 9 88998833',
        stars: 4.2,
      })

    expect(response.statusCode).toEqual(201)
  })
})
