import path from 'path'
import fs from 'fs/promises'
import { config } from 'dotenv'
import { UserDatabase } from '../db/database'
import { defineCronHandler } from '#nuxt/cron'

config()

const { DELETION_TIME } = process.env
if (!DELETION_TIME) throw new Error('No DELETION_TIME set in process.env')

export default defineCronHandler(
  () => DELETION_TIME,
  async () => {
    const db = await UserDatabase.getInstance()
    const directoryPath = path.resolve(process.cwd(), 'user-photos')

    try {
      const items = await fs.readdir(directoryPath, { withFileTypes: true })
      const folders = items.filter(item => item.isDirectory())

      await Promise.all(folders.map(async (folder) => {
        try {
          // folder.name = userId / id
          await db.deleteImages(folder.name)
          const folderPath = path.join(directoryPath, folder.name)
          await fs.rm(folderPath, { recursive: true, force: true })
          console.log(`Deleted folder: ${folderPath}`)
        }
        catch (error) {
          console.error(`Error processing folder ${folder.name}:`, error)
        }
      }))

      console.log('All folders in /public/user-photos have been processed.')
    }
    catch (error) {
      console.error('Error handling directory /public/user-photos:', error)
    }
  },
)
