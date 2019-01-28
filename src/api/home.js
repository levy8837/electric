import axios from '@/libs/api.request'

export const getData = () => {
  return axios.request({
    url: 'Home/GetStatisticalData',
    method: 'get'
  })
}