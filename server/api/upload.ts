import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { defineEventHandler, readMultipartFormData } from 'h3'
import { UserDatabase } from '../db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return { message: 'Invalid request method' }
  }

  const db = new UserDatabase()
  await db.initialize()

  const form = await readMultipartFormData(event)

  if (!form) {
    return { message: 'No form data received' }
  }

  const userId = form
    .find(field => field.name === 'userId')
    ?.data?.toString()
  if (!userId) {
    return { message: 'Invalid form data' }
  }

  const imageFile = form.find(field => field.name === 'image')
  if (!imageFile) {
    return { message: 'No image file received' }
  }

  const uploadPath = path.join(process.cwd(), 'public', 'user-photos', userId)
  await fs.mkdir(uploadPath, { recursive: true })

  const timestamp = Date.now()
  const filename = `${userId}_${timestamp}.webp`
  const filePath = path.join(uploadPath, filename)

  const imageLocations = (await db.getImagesById(userId)) ?? ''

  if (imageLocations.length >= 3) {
    return { message: 'Upload limit reached' }
  }


  try {
    const image = sharp(imageFile.data)
    const metadata = await image.metadata()

    if (metadata.width && metadata.height) {
      const width = metadata.width
      const height = metadata.height
      if (width < 256 || height < 256 || width > 1920 || height > 1080) {
        return {
          message: 'Image dimensions must be between 256x256 and 1920x1080.',
        }
      }
      await image.webp({ quality: 50 }).toFile(filePath)
      await db.addImage(userId, `/user-photos/${userId}/${filename}`)

      return { message: 'File uploaded successfully' }
    }
    else {
      return { message: 'Error retrieving image metadata' }
    }
  }

  
  catch (error) {
    console.error('Error processing image:', error)
    return { message: 'Error processing image' }
  }
})
