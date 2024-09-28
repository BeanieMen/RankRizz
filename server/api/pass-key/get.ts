import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler((event) => {
  const passKey = getCookie(event, 'passKey')
  if (passKey) {
    return { passKey: passKey }
  }
  else {
    return { error: 'passKey not found' }
  }
})
