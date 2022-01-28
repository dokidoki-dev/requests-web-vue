import Cookies from 'js-cookie'

const TokenKey = 'token'
const uuid = 'uuid'
const username = 'username'

export function getToken() {
  return Cookies.get(TokenKey)
}

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

export function removeToken() {
  Cookies.remove(TokenKey)
  Cookies.remove('uuid')
  Cookies.remove('username')
  return Cookies
}
