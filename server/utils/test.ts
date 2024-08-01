import { initializeDb, getUserByPasskey, updateUsername } from './database'

async function main() {
  const db = initializeDb()
  await updateUsername(db, 'Beanie', '123')
  const user = await getUserByPasskey(db, '123')

  console.log(user)
}

main()
