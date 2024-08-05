import { env } from 'process'
import path from 'path'
import fs from 'fs'
import { initializeDb, removeImageLocation } from '../utils/database'
import { defineCronHandler } from '#nuxt/cron'

export default defineCronHandler(
  () => env.deletionTime as string,
  async () => {
    const db = await initializeDb()
    const directoryPath = path.resolve(process.cwd(), 'public/user-photos')

    try {
      const items = fs.readdirSync(directoryPath, { withFileTypes: true })
      const folders = items.filter(item => item.isDirectory())

      folders.forEach(async (folder) => {
        await removeImageLocation(db, folder.name)
        const folderPath = path.join(directoryPath, folder.name)
        console.log(`Folder found: ${folderPath}`)

        fs.rmSync(folderPath, { recursive: true, force: true })
        console.log(`Deleted folder: ${folderPath}`)
      })
      db.close()
      console.log('All folders in /public/user-photos have been deleted successfully.')
    }
    catch (error) {
      console.error('Error handling directory /public/user-photos:', error)
    }
  },
)
