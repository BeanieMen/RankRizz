import { initializeDb, getUserByPasskey } from '../../utils/database'

export default defineEventHandler(async (event) => {
  const db = initializeDb()
  if (event.method === 'GET') {
    const pass = getRouterParam(event, 'pass') || ''
    const user = await getUserByPasskey(db, pass)

    if (user) {
      db.close()
      return { user: user }
    }
    else {
      db.close()
      return { user: null, image: null }
    }
  }
})
