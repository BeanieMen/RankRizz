import { initializeDb, getRandomData } from '../utils/database'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const db = initializeDb()
    const randomData = await getRandomData(db)
    return { imageSrc: randomData.imageSrc, userName: randomData.userName }
  }
})
