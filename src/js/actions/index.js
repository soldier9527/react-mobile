import {
  LOGIN,
  LOGOUT
} from './constants'

export function login(data) {
  return {type: LOGIN, data}
}

export function logout() {
  return {type: LOGOUT}
}