import axios from '@/libs/api.request'
//获取电力设施列表
export const getPowerFacilityList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter

    return axios.request({
        url: 'services/app/PowerFacility/GetPaged',
        params: {
            MaxResultCount,
            SkipCount,
            Filter
        },
        method: 'get'
    })
}
//新增电力设施
export const addPowerFacility = (PowerFacility) => {
    const data = PowerFacility;
    return axios.request({
        url: 'services/app/PowerFacility/Create',
        data,
        method: 'post'
    })
}
//删除电力设施
export const delPowerFacility = (id) => {
    return axios.request({
        url: 'services/app/PowerFacility/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改电力设施
export const updataPowerFacility = (PowerFacility) => {
    const data = PowerFacility;
    return axios.request({
        url: 'services/app/PowerFacility/Update',
        data,
        method: 'put'
    })
}
