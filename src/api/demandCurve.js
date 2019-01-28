import axios from '@/libs/api.request'

//获取客户列表
export const getGetAllCustomer = () => {
    return axios.request({
        url: 'Customer/GetAllCustomer',
        method: 'get'
    })
}
//获取获取电表数据
export const getCapacityData = (ElectricityMeterInfoId,Date,MaxResultCount,SkipCount) => {
    return axios.request({
        url: 'CapacityTrend/CapacityTrend',
        params: {
            ElectricityMeterInfoId,
            Date,
            MaxResultCount,
            SkipCount
        },
        method: 'get'
    })
}
