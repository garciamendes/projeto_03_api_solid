// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Nearby GYMS (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa lista as GYMS mais próximas', async () => {
    const { Token } = await createAndAuthenticateUser(app)
    await request(app.server)
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
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${Token}`)
      .send({
        name: 'Academia Smart Fit - Santos Dumont 💪🏼',
        description: 'Smart, fazendo o melhor pela a vida saudável',
        latitude: -3.7431788,
        longitude: -38.4968984,
        phone: '(85) 9 88998833',
        stars: 4.2,
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${Token}`)
      .send({
        name: 'Academia Smart Fit - North Shopping 💪🏼',
        description: 'Smart, fazendo o melhor pela a vida saudável',
        latitude: -3.7626848,
        longitude: -38.5865486,
        phone: '(85) 9 88998833',
        stars: 4.2,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -3.750079,
        longitude: -38.453882,
      })
      .set('Authorization', `Bearer ${Token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(2)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'Smart',
      }),
      expect.objectContaining({
        name: 'Academia Smart Fit - Santos Dumont 💪🏼',
      }),
    ])
  })
})
