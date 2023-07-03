// Third party
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// Project
import { app } from '../../../app'
import { createAndAuthenticateUser } from '../../../utils/tests/create-and-authenticate-user'

describe('Profile (e2e)', () => {
  beforeEach(async () => {
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('É possível que o usuário possa buscar sua informações na aplicação', async () => {
    const { Token } = await createAndAuthenticateUser(app)
    const response = await request(app.server)
      .get('/profile')
      .set('Authorization', `Bearer ${Token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.Uuser).toEqual(
      expect.objectContaining({
        email: 'JonhDoe@gmail.com',
      }),
    )
  })
})
