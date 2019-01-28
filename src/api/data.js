import axios from '@/libs/api.request'

export const getTableData = () => {
    return axios.request({
        url: 'get_table_data',
        method: 'get'
    })
}

export const getDragList = () => {
    return axios.request({
        url: 'get_drag_list',
        method: 'get'
    })
}
export const uploadImg = formData => {
    return axios.request({
      url: 'PowerQualification/UploadPowerQualification',
      data: formData,
      method: 'post'
    })
  }
export const sureUploadImg = imgData => {
    return axios.request({
      url: 'services/app/Agent/UpdatePowerQualification',
      data: imgData,
      method: 'put'
    })
  }

  //获取字典列表
export const getDataDicConfigList = (DictionaryType) => {
    return axios.request({
        url: 'services/app/DataDicConfig/GetPaged',
        params: {
            DictionaryType
        },
        method: 'get'
    })
}
  //获取组织列表
export const getOrganizationList = (OrganizationUnitType) => {
    return axios.request({
        url: 'services/app/OrganizationUnit/GetOrganizationUnits',
        params: {
            OrganizationUnitType
        },
        method: 'get'
    })
}
  //获取串口下拉列表
export const getSerialPortInformationList = () => {
    return axios.request({
        url: 'services/app/SerialPortInformation/GetRouterInformationForDropdownList',
        method: 'get'
    })
}
  //获取路由器下拉列表
export const getRouterInformationList = () => {
    return axios.request({
        url: 'services/app/RouterInformation/GetRouterInformationForDropdownList',
        method: 'get'
    })
}
  //获取电表下拉列表
export const getElectricityMeterInfoList = () => {
    return axios.request({
        url: 'services/app/ElectricityMeterInfo/GetRouterInformationForDropdownList',
        method: 'get'
    })
}