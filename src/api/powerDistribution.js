import axios from '@/libs/api.request'
//获取配电室列表
export const getPowerDistributionList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter

    return axios.request({
        url: 'services/app/PowerDistributionRoom/GetPaged',
        params: {
            MaxResultCount,
            SkipCount,
            Filter
        },
        method: 'get'
    })
}
//新增配电室
export const addPowerDistribution = (PowerDistribution) => {
    const data = PowerDistribution;
    return axios.request({
        url: 'services/app/PowerDistributionRoom/Create',
        data,
        method: 'post'
    })
}
//删除配电室
export const delPowerDistribution = (id) => {
    return axios.request({
        url: 'services/app/PowerDistributionRoom/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改配电室
export const updataPowerDistribution = (PowerDistribution) => {
    const data = PowerDistribution;
    return axios.request({
        url: 'services/app/PowerDistributionRoom/Update',
        data,
        method: 'put'
    })
}
