import { initializeDb, getUserByPasskey } from '../../utils/database'

export default defineEventHandler(async (event) => {
  const db = initializeDb()
  if (event.method === 'GET') {
    const pass = getRouterParam(event, 'pass') || ''
    const user = await getUserByPasskey(db, pass)
    db.close()

    if (user) {
      return { user: user }
    }
    else {
      return { user: null }
    }
  }
})
