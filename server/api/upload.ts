import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { defineEventHandler, readMultipartFormData } from 'h3'
import { initializeDb, upsertImageLocation, getImageLocation } from '../utils/database'

export default defineEventHandler(async (event) => {
  const db = await initializeDb()
  const form = await readMultipartFormData(event)
  if (!form) return { message: 'No form data received', statusCode: 400 }

  const userId = form.find(field => field.name === 'userId')?.data?.toString() as string
  if (!userId) return { message: 'Invalid form data', statusCode: 400 }

  const imageFile = form.find(field => field.name === 'image')
  if (!imageFile) return { message: 'No image file received', statusCode: 400 }

  const uploadPath = path.join(process.cwd(), 'public', 'user-photos', userId)
  await fs.mkdir(uploadPath, { recursive: true })

  const timestamp = Date.now()
  const filename = `${userId}_${timestamp}.webp`
  const filePath = path.join(uploadPath, filename)

  let imageLocation = await getImageLocation(db, userId) ?? ''
  if (imageLocation.split(',').length === 3) return { message: 'Upload limit reached' }
  if (imageLocation) {
    imageLocation += ','
  }
  imageLocation += `/user-photos/${userId}/${filename}`

  try {
    await sharp(imageFile.data)
      .webp({ quality: 50 })
      .toFile(filePath)

    await upsertImageLocation(db, userId, imageLocation)

    return { message: 'File uploaded successfully' }
  }
  catch (error) {
    console.error('Error processing image:', error)
    return { message: 'Error processing image', statusCode: 500 }
  }
})
