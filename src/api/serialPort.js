import axios from '@/libs/api.request'
//获取客户列表
export const getSerialPortList = (data) => {
    const MaxResultCount=data.maxResultCount;
    const SkipCount=data.skipCount;
    const Filter=data.filter;
    return axios.request({
        url: 'services/app/SerialPortInformation/GetPaged',
        params: {
            Filter,
            MaxResultCount,
            SkipCount
        },
        method: 'get'
    })
}
//新增客户
export const addSerialPort = (SerialPort) => {
    const data = SerialPort;
    return axios.request({
        url: 'services/app/SerialPortInformation/Create',
        data,
        method: 'post'
    })
}
//删除客户
export const delSerialPort = (id) => {
    return axios.request({
        url: 'services/app/SerialPortInformation/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
//修改客户
export const updataSerialPort = (SerialPort) => {
    const data = SerialPort;
    return axios.request({
        url: 'services/app/SerialPortInformation/Update',
        data,
        method: 'put'
    })
}
