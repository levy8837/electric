import axios from '@/libs/api.request'
//获取客户列表
export const getRouterInfoList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter;
    return axios.request({
        url: 'services/app/RouterInformation/GetPaged',
        params: {
            Filter,
            MaxResultCount,
            SkipCount
        },
        method: 'get'
    })
}
//新增客户
export const addRouterInfo = (RouterInfo) => {
    const data = RouterInfo;
    return axios.request({
        url: 'services/app/RouterInformation/Create',
        data,
        method: 'post'
    })
}
//删除客户
export const delRouterInfo = (id) => {
    return axios.request({
        url: 'services/app/RouterInformation/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改客户
export const updataRouterInfo = (RouterInfo) => {
    const data = RouterInfo;
    return axios.request({
        url: 'services/app/RouterInformation/Update',
        data,
        method: 'put'
    })
}
