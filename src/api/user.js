import axios from '@/libs/api.request'

export const login = ({ userNameOrEmailAddress, password,rememberClient }) => {
  const data = {
    userNameOrEmailAddress,
    password,
    rememberClient
  }
  return axios.request({
    url: 'TokenAuth/Authenticate',
    data,
    method: 'post'
  })
}

export const getUserInfo = (userId) => {
  return axios.request({
    url: 'services/app/User/GetUserForEdit',
    params: {
      userId
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
