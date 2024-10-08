import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url

  if (url?.startsWith('/user-photos')) {
    const imagePath = path.join(process.cwd(), url)

    try {
      await stat(imagePath)
      event.node.res.setHeader('Content-Type', 'image/webp')
      const stream = createReadStream(imagePath)
      return sendStream(event, stream)
    }
    catch (error) {
      throw createError({ statusCode: 404, statusMessage: 'Image not found' })
    }
  }
})
