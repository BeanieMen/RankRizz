import { setup } from '@nuxt/test-utils/e2e'
import { describe, it, expect, beforeEach } from 'vitest'
import { UserDatabase } from '../db/database'
import { createDummyUsers, dummyImage, dummyImageSmall } from './helpers'

describe('API Routes', async () => {
  await setup({
    port: 3000,
    build: false,
  })

  let db: UserDatabase

  beforeEach(async () => {
    db = await UserDatabase.getInstance()
    await db.resetDatabase()
  })

  // Helper functions for API requests
  const postReceiveRating = async (data: Record<string, string>) => {
    return fetch('http://localhost:3000/api/receive-rating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Forwarded-For': '192.168.0.0',
      },
      body: new URLSearchParams(data),
    })
  }

  const postUpload = async (formData: FormData) => {
    return fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: {
        'X-Forwarded-For': '192.168.0.0',
      },
      body: formData,
    })
  }

  const postGenerateAccount = async (body: Record<string, any>, headers: Record<string, string> = {}) => {
    return fetch('http://localhost:3000/api/generate-account', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...headers },
    })
  }

  //   Receive Rating API Route
  describe('Receive Rating API Route', () => {
    it('POST /receive-rating - should return 200 for valid rating', async () => {
      const { users } = await createDummyUsers(1, true)
      const images = await db.getImageIds(users[0]!.data.id)
      const imageId = images[0]?.id

      const response = await postReceiveRating({
        starRating: '5',
        imageId: imageId!,
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('message', 'Successfully uploaded ratings')
    })

    it('POST /receive-rating - should return 400 for missing image ID', async () => {
      const response = await postReceiveRating({
        starRating: '5',
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Image ID is missing')
    })

    it('POST /receive-rating - should return 400 for missing data', async () => {
      const response = await postReceiveRating({
        imageId: 'dummy-id',
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Missing or invalid rating/comment')
    })

    it('POST /receive-rating - should return 409 for duplicate comment', async () => {
      const { users } = await createDummyUsers(1, true)
      const images = await db.getImageIds(users[0]!.data.id)
      const imageId = images[0]?.id

      await postReceiveRating({
        comment: 'Great photo!',
        imageId: imageId!,
      })

      const response = await postReceiveRating({
        comment: 'Great photo!',
        imageId: imageId!,
      })

      expect(response.status).toBe(409)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Duplicate comment')
    })

    it('POST /receive-rating - should return 409 for duplicate rating', async () => {
      const { users } = await createDummyUsers(1, true)
      const images = await db.getImageIds(users[0]!.data.id)
      const imageId = images[0]?.id

      await postReceiveRating({
        starRating: '5',
        imageId: imageId!,
      })

      const response = await postReceiveRating({
        starRating: '5',
        imageId: imageId!,
      })

      expect(response.status).toBe(409)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Duplicate rating')
    })
  })

  // Upload API Route
  describe('Upload API Route', () => {
    it('POST /upload - should upload an image for an existing user', async () => {
      const { users } = await createDummyUsers(1)
      const user = users[0]!
      const form = new FormData()

      form.append('image', dummyImage)
      form.append('userId', user.data.id)

      const response = await postUpload(form)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('message', 'File uploaded successfully')
      expect(data.error).toBeNull()
    })

    it('POST /upload - should return an error if the user ID or image file is missing', async () => {
      const form = new FormData()
      form.append('userId', 'invalidUserId')

      const response = await postUpload(form)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'User ID and image file are required')
    })

    it('POST /upload - should return an error if the user has already uploaded 3 images', async () => {
      // first image
      const { users } = await createDummyUsers(1, true)
      const user = users[0]!
      const form = new FormData()

      form.append('image', dummyImage)
      form.append('userId', user.data.id)

      // second image
      await postUpload(form)

      // third image
      await postUpload(form)

      const response = await postUpload(form)

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Upload limit reached (3 images per user)')
    })

    it('POST /upload - should return an error if the image dimensions are out of bounds', async () => {
      const { users } = await createDummyUsers(1)
      const user = users[0]!
      const form = new FormData()

      // 1x1 image
      form.append('image', dummyImageSmall)
      form.append('userId', user.data.id)

      const response = await postUpload(form)

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Image dimensions must be between 256x256 and 1920x1080.')
    })
  })

  // Random API Route
  describe('Random API Route', () => {
    it('GET /random - should return random user data', async () => {
      await createDummyUsers(1, true)

      const response = await fetch('http://localhost:3000/api/random', {
        method: 'GET',
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('randomUsers')
      expect(Array.isArray(data.data.randomUsers)).toBe(true)
    })

    it('GET /random - should return no random user data', async () => {
      await createDummyUsers(1)

      const response = await fetch('http://localhost:3000/api/random', {
        method: 'GET',
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('randomUsers')
      expect(Array.isArray(data.data.randomUsers)).toBe(false)
    })
  })

  // User Data API Route
  describe('User Data API Route', () => {
    it('GET /user/[pass] - should handle multiple images correctly', async () => {
      const { users } = await createDummyUsers(1, true)
      const user = users[0]!
      const imageIds = (await db.getImageIds(user.data.id)).map(img => img.id)

      // Add comments and ratings to each image
      for (const imageId of imageIds) {
        await db.addComment(imageId, `Comment for image ${imageId}`)
        await db.createStar(imageId, 5)
      }

      const response = await fetch(
        `http://localhost:3000/api/user/${user.data.passKey}`,
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.imageIds.length).toBe(1)
      expect(data.data.comments.length).toBe(1)
      expect(data.data.starRatingAverages.length).toBe(1)
      expect(data.data.starRatingTotals.length).toBe(1)
    })

    it('GET /user/[pass] - should return no comments and ratings if none exist', async () => {
      const { users } = await createDummyUsers(1, true)
      const user = users[0]!
      const response = await fetch(
        `http://localhost:3000/api/user/${user.data.passKey}`,
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.imageIds.length).toBe(1)
      expect(data.data.comments.length).toBe(1)
      expect(data.data.starRatingAverages.length).toBe(1)
      expect(data.data.starRatingTotals.length).toBe(1)
    })
  })

  // Generate Account API Route
  describe('Generate Account API Route', () => {
    it('POST /generate-account - should return 201 for successful account creation', async () => {
      const response = await postGenerateAccount({ username: 'testuser1' })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data).toHaveProperty('error', null)
    })

    it('POST /generate-account - should return 409 for account creation limit per IP', async () => {
      const ip = '192.168.0.1'
      const response1 = await postGenerateAccount(
        { username: 'testuser1' },
        { 'X-Forwarded-For': ip },
      )

      expect(response1.status).toBe(201)

      const response2 = await postGenerateAccount(
        { username: 'testuser1' },
        { 'X-Forwarded-For': ip },
      )

      expect(response2.status).toBe(409)
      const data = await response2.json()
      expect(data).toHaveProperty('error', 'An account is already associated with this IP address')
    })

    it('POST /generate-account - should return 400 for missing username', async () => {
      const response = await postGenerateAccount({ username: '' })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Username is required')
    })
  })
})
