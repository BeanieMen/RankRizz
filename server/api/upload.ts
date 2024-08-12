import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { defineEventHandler, readFormData, getRequestHeader } from 'h3'
import { UserDatabase, generateRandomString } from '../db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return { message: 'Invalid request method' }
  }

  const db = new UserDatabase()
  const ipAddress = getRequestHeader(event, 'x-forwarded-for') ?? ''
  await db.initialize()

  const formData = await readFormData(event)
  const userId = formData.get('userId') as string | null
  const imageFile = formData.get('image') as File | null

  if (!userId || !imageFile) {
    return { message: 'Invalid form data or no image file received' }
  }

  const uploadPath = path.join(process.cwd(), 'public', 'user-photos', userId)
  const uploadedImageId = generateRandomString()
  const filename = `id_${uploadedImageId}.webp`
  const filePath = path.join(uploadPath, filename)

  // Ensure upload directory exists
  try {
    await fs.mkdir(uploadPath, { recursive: true })
  } catch (error) {
    console.error('Error creating directory:', error)
    return { message: 'Error creating directory' }
  }

  const imageIds = await db.getImageIds(userId) ?? []
  if (imageIds.length >= 3) {
    return { message: 'Upload limit reached' }
  }

  try {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const image = sharp(buffer)
    const metadata = await image.metadata()

    if (metadata.width && metadata.height) {
      const { width, height } = metadata
      if (width < 256 || height < 256 || width > 1920 || height > 1080) {
        return {
          message: 'Image dimensions must be between 256x256 and 1920x1080.',
        }
      }
      await image.webp({ quality: 50 }).toFile(filePath)

      await db.addImage(userId, uploadedImageId)
      await db.addRatingLookup(ipAddress, uploadedImageId)

      return { message: 'File uploaded successfully' }
    } else {
      return { message: 'Error retrieving image metadata' }
    }
  } catch (error) {
    console.error('Error processing image:', error)
    return { message: 'Error processing image' }
  }
})
