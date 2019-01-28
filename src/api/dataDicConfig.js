import axios from '@/libs/api.request'
//获取字典列表
export const getDataDicConfigList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter
    return axios.request({
        url: 'services/app/DataDicConfig/GetPaged',
        params: {
            MaxResultCount,
            SkipCount,
            Filter
        },
        method: 'get'
    })
}
//新增字典
export const addDataDicConfig = (DataDicConfig) => {
    const data = DataDicConfig;
    return axios.request({
        url: 'services/app/DataDicConfig/Create',
        data,
        method: 'post'
    })
}
//删除字典
export const delDataDicConfig = (id) => {
    return axios.request({
        url: 'services/app/DataDicConfig/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改字典
export const updataDataDicConfig = (id, DataDicConfig) => {
    const data = DataDicConfig;
    return axios.request({
        url: 'services/app/DataDicConfig/Update',
        data,
        method: 'put'
    })
}
