// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Search GYMS (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa buscar as GYMS', async () => {
    const { Token } = await createAndAuthenticateUser(app)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${Token}`)
      .send({
        name: 'Smart Fit',
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
        name: 'Fit Get',
        description: 'Get, fazendo o melhor pela a vida saudável',
        latitude: -3.7422167,
        longitude: -38.2060608,
        phone: '(85) 9 88998833',
        stars: 3.2,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        search: 'Smart',
      })
      .set('Authorization', `Bearer ${Token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'Smart Fit',
      }),
    ])
  })
})
