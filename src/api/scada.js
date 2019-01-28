import axios from '@/libs/api.request'

export const getHistoryData = (ElectricityMeterInfoId, MaxResultCount) => {
    return axios.request({
        url: 'HistoryData/GetHistoryData',
        params: {
            ElectricityMeterInfoId,
            MaxResultCount
        },
        method: 'get'
    })
}
export const getElectricityMeter = (CustomerId) => {
    return axios.request({
        url: 'ElectricityMeter/ElectricityMeters',
        params: {
            CustomerId
        },
        method: 'get'
    })
}
