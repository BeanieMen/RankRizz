import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

describe('API Routes', async () => {
  await setup({
    port: 3000,
    env: {}
  })

  it('POST /generate-account - should create a new user', async () => {
    const response = await fetch('http://localhost:3000/api/generate-account', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser' }),
      headers: { 'Content-Type': 'application/json' }
    })
    console.log(response)
  })
})
