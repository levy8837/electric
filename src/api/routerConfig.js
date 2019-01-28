import axios from '@/libs/api.request'
//获取客户列表
export const getRouterConfigList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter;
    return axios.request({
        url: 'services/app/RouterConfiguration/GetPaged',
        params: {
            Filter,
            MaxResultCount,
            SkipCount
        },
        method: 'get'
    })
}
//新增客户
export const addRouterConfig = (RouterConfig) => {
    const data = RouterConfig;
    return axios.request({
        url: 'services/app/RouterConfiguration/Create',
        data,
        method: 'post'
    })
}
//删除客户
export const delRouterConfig = (id) => {
    return axios.request({
        url: 'api/services/app/RouterConfiguration/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改客户
export const updataRouterConfig = (RouterConfig) => {
    const data = RouterConfig;
    return axios.request({
        url: 'services/app/RouterConfiguration/Update',
        data,
        method: 'put'
    })
}
