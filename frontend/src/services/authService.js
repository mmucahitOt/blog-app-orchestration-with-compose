import axios from 'axios'
import generateURL from './serviceConfig'

const AUTH_API_URL = generateURL('auth')

export const login = async (username, password) => {
  const loginURL = AUTH_API_URL + '/login'
  return axios.post(loginURL, {
    username,
    password,
  })
}
