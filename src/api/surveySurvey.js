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
//获取获取电表对比趋势数据
export const getElectricityRingRatio = (electricityMeterId) => {
    return axios.request({
        url: 'DataStatistics/GetElectricityRingRatio/'+electricityMeterId,
        method: 'get'
    })
}
//获取获取电表对比数据分析
export const getDataStatistics = (ElectricityMeterInfoId) => {
    return axios.request({
        url: 'DataStatistics/ElectricityMeters',
        params: {
            ElectricityMeterInfoId
        },
        method: 'get'
    })
}
