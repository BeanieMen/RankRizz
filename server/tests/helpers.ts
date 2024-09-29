import { readFileSync } from 'node:fs'

interface ApiResponseGenerateAcc {
  data: { passKey: string, username: string, id: string }
  error: null | string
}

export const dummyImageSmall = new Blob([readFileSync('./server/tests/images/small.jpg')], { type: 'image/jpeg' })
export const dummyImage = new Blob([readFileSync('./server/tests/images/big.jpg')], { type: 'image/jpeg' })

export async function createDummyUsers(
  count: number,
  withImage: boolean = false,
) {
  const users = []
  for (let i = 0; i < count; i++) {
    const ip = `192.168.0.${i}`
    const response = await fetch('http://localhost:3000/api/generate-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
      },
      body: JSON.stringify({ username: `testuser${i}` }),
    })
    const user = (await response.json()) as ApiResponseGenerateAcc
    users.push({ ...user, data: { ...user.data } })
    if (withImage) {
      const form = new FormData()

      form.append('image', dummyImage)
      form.append('userId', user.data.id)

      await fetch(`http://localhost:3000/api/upload`, {
        method: 'POST',
        headers: {
          'X-Forwarded-For': ip,
        },
        body: form,
      })
    }
  }
  return { users }
}
