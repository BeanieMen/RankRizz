import { env } from 'process'
import path from 'path'
import fs from 'fs'
import { UserDatabase } from '../db/database'
import { defineCronHandler } from '#nuxt/cron'

export default defineCronHandler(
  () => env.DELETION_TIME as string,
  async () => {
    const db = new UserDatabase()
    await db.initialize()

    const directoryPath = path.resolve(process.cwd(), 'public/user-photos')

    try {
      const items = fs.readdirSync(directoryPath, { withFileTypes: true })
      const folders = items.filter(item => item.isDirectory())

      folders.forEach(async (folder) => {
        // folder.name = user_id / id
        await db.deleteImages(folder.name)
        const folderPath = path.join(directoryPath, folder.name)
        fs.rmSync(folderPath, { recursive: true, force: true })
        console.log(`Deleted folder: ${folderPath}`)
      })
      console.log('All folders in /public/user-photos have been deleted successfully.')
    }
    catch (error) {
      console.error('Error handling directory /public/user-photos:', error)
    }
  },
)
