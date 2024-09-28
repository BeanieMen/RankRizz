import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import {
  defineEventHandler,
  readFormData,
  getRequestHeader,
  setResponseStatus,
} from 'h3'
import { UserDatabase, generateRandomString } from '../db/database'

export default defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance()
  const ipAddress = getRequestHeader(event, 'x-forwarded-for') ?? ''

  const formData = await readFormData(event)
  const userId = formData.get('userId') as string | null
  const imageFile = formData.get('image') as File | null

  if (!userId || !imageFile) {
    setResponseStatus(event, 400)
    return { error: 'User ID and image file are required' }
  }

  const uploadPath = path.join(process.cwd(), 'user-photos', userId)
  const uploadedImageId = generateRandomString()
  const filename = `id_${uploadedImageId}.webp`
  const filePath = path.join(uploadPath, filename)
  try {
    await fs.mkdir(uploadPath, { recursive: true })
  }
  catch (error) {
    console.error('Error creating directory:', error)
    setResponseStatus(event, 500)
    return { error: 'Error creating upload directory' }
  }

  const imageIds = await db.getImageIds(userId)
  if (imageIds.length >= 3) {
    setResponseStatus(event, 403)
    return { error: 'Upload limit reached (3 images per user)' }
  }

  try {
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const image = sharp(buffer)
    const metadata = await image.metadata()

    if (metadata.width && metadata.height) {
      const { width, height } = metadata
      if (width < 256 || height < 256 || width > 1920 || height > 1080) {
        setResponseStatus(event, 400)
        return {
          error: 'Image dimensions must be between 256x256 and 1920x1080.',
        }
      }
      await image.webp({ quality: 50 }).toFile(filePath)

      await db.addImage(userId, uploadedImageId)
      await db.addRatingLookup(ipAddress, uploadedImageId)

      setResponseStatus(event, 200)
      return { message: 'File uploaded successfully', error: null }
    }
    else {
      setResponseStatus(event, 500)
      return { error: 'Error retrieving image metadata' }
    }
  }
  catch (error) {
    console.error('Error processing image:', error)
    setResponseStatus(event, 500)
    return { error: 'Error processing image' }
  }
})
