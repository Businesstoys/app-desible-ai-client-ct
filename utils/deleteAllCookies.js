import { deleteCookie, getCookies } from 'cookies-next'

export function deleteAllCookies () {
  const cookieStore = getCookies()
  Object.keys(cookieStore).forEach((key) => {
    deleteCookie(key)
  })
}
