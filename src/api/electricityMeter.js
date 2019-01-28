import axios from '@/libs/api.request'
//获取客户列表
export const getElectricityMeterList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter;
    return axios.request({
        url: 'services/app/ElectricityMeterInfo/GetPaged',
        params: {
            Filter,
            MaxResultCount,
            SkipCount
        },
        method: 'get'
    })
}
//新增客户
export const addElectricityMeter = (ElectricityMeter) => {
    const data = ElectricityMeter;
    return axios.request({
        url: 'services/app/ElectricityMeterInfo/Create',
        data,
        method: 'post'
    })
}
//删除客户
export const delElectricityMeter = (id) => {
    return axios.request({
        url: 'services/app/ElectricityMeterInfo/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改客户
export const updataElectricityMeter = (ElectricityMeter) => {
    const data = ElectricityMeter;
    return axios.request({
        url: 'services/app/ElectricityMeterInfo/Update',
        data,
        method: 'put'
    })
}
