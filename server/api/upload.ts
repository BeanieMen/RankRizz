import { promises as fs } from 'fs'
import path from 'path'
import { defineEventHandler, readMultipartFormData } from 'h3'
import { initializeDb, upsertImageLocation } from '../utils/database'

export default defineEventHandler(async (event) => {
  const db = initializeDb()
  const form = await readMultipartFormData(event)
  if (!form) return { message: 'No form data received', statusCode: 400 }

  const userId = form.find(field => field.name === 'userId')?.data?.toString()
  const imageFile = form.find(field => field.name === 'image')
  if (!userId || !imageFile) return { message: 'Invalid form data', statusCode: 400 }

  const folderName = `${new Date().getMonth() + 1}-${new Date().getFullYear()}`
  const uploadPath = path.join(process.cwd(), 'public', 'user-photos', folderName)

  await Promise.all([
    upsertImageLocation(db, userId, `/user-photos/${folderName}/${userId}.png`),
    fs.mkdir(uploadPath, { recursive: true }),
    fs.writeFile(path.join(uploadPath, `${userId}.png`), new Uint8Array(imageFile.data)),
  ])

  return { message: 'File uploaded successfully' }
})
