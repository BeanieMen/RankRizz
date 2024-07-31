import { initializeDb, getUser } from '../../utils/database'

export default defineEventHandler(async (event) => {
  const db = initializeDb()
  if (event.method === 'GET') {
    const id = getRouterParam(event, 'id') || ''
    const user = await getUser(db, id)
    db.close()

    if (user) {
      return { user: user }
    }
    else {
      return { user: null }
    }
  }
})
