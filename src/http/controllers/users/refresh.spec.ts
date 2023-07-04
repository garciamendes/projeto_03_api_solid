// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'

describe('Refresh (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que a aplicação possa fazer o refresh do token do usuário', async () => {
    await request(app.server).post('/register').send({
      name: 'Jonh Doe',
      email: 'JonhDoe@gmail.com',
      password: 'dev123',
    })

    const authResponse = await request(app.server).post('/auth').send({
      email: 'JonhDoe@gmail.com',
      password: 'dev123',
    })

    const cookies = authResponse.get('Set-Cookie')
    const response = await request(app.server)
      .patch('/auth/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      Token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
