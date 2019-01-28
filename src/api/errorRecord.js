import axios from '@/libs/api.request'
//获取故障列表信息
export const getErrorRecordList = (MaxResultCount, SkipCount, CustomerId, AlarmDate, EquipmetNumber) => {
    return axios.request({
        url: 'ErrorRecord/ErrorRecord',
        params: {
            CustomerId,
            AlarmDate,
            EquipmetNumber,
            // Sorting,
            MaxResultCount,
            SkipCount
        },
        method: 'get'
    })
}
//获取客户列表
export const getCustomerList = () => {
    return axios.request({
        url: 'Customer/Customers',
        method: 'get'
    })
}
