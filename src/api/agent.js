import axios from '@/libs/api.request'
//获取客户列表
export const getAgentList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter

    return axios.request({
        url: 'services/app/Agent/GetPaged',
        params: {
            MaxResultCount,
            SkipCount,
            Filter
        },
        method: 'get'
    })
}
//新增客户
export const addAgent = (Agent) => {
    const data = Agent;
    return axios.request({
        url: 'services/app/Agent/Create',
        data,
        method: 'post'
    })
}
//删除客户
export const delAgent = (id) => {
    return axios.request({
        url: 'services/app/Agent/Delete/',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改客户
export const updataAgent = (id, Agent) => {
    const data = Agent;
    return axios.request({
        url: 'services/app/Agent/Update',
        data,
        method: 'put'
    })
}
//查询电力资质
export const getPowerQualification = (agentId) => {
    return axios.request({
        url: 'services/app/Agent/GetPowerQualification',
        params: {
            agentId
        },
        method: 'get'
    })
}
