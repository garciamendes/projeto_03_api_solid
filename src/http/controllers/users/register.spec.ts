// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'

describe('Register (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa se cadastrar', async () => {
    const response = await request(app.server).post('/register').send({
      name: 'Jonh Doe',
      email: 'JonhDoe@gmail.com',
      password: 'dev123',
    })

    expect(response.statusCode).toEqual(201)
  })
})
