import { defineEventHandler, getQuery, setCookie, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  const { passKey } = getQuery(event)

  if (typeof passKey === 'string') {
    try {
      setCookie(event, 'passKey', passKey, {
        httpOnly: true,
        path: '/',
      })
      return { message: 'Cookie set successfully' }
    }
    catch (error) {
      setResponseStatus(event, 500)
      return { error: 'Failed to set the cookie' }
    }
  }
  else {
    setResponseStatus(event, 400)
    return { error: 'passKey is missing or invalid' }
  }
})
