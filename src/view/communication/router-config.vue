<template>
    <div class="couplet-card">
        <div class="portlet-title" v-show='!showLog'>
            <Icon type="person-stalker"></Icon>
            <span class='title_text'>{{titleText}}</span>
        </div>

        <!--路由配置列表-->
        <div v-show='showList' class='query-wrap'>

            <div class="operate-wrap">
                <operate class='operate' :deleteStatus='isSelect && deleteBtn' :edit='isSelect && editBtn' :addStatus='addBtn'
                    :data='data' @refreshHandler='refreshHandler' @deleteHandler='deleteHandler' @addHandler='addHandler'
                    @editHandler='editHandler'></operate>
            </div>
            <div class="search-wrap">
                <search class='search-component' @query='query' :removeInputFlag='removeInputFlag' :placeholderValue='placeholderValue'>
                </search>
            </div>
        </div>
        <div class="list" v-show='showList'>
            <div class='table-wrap'>
                <i-table stripe highlight-row :columns="columns1" :data="listData" @on-row-click='selectItem'>
                </i-table>
                <Spin :fix='true' v-show='isLoading'>
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
            </div>
            <Page class='page-wrap' show-elevator show-total :total="total" :current="queryParam.pageNumber+1"
                @on-change='pageChange'>
            </Page>
        </div>
        <Modal v-model="isAddRouterConfig" :closable="false" width="800">
            <p slot="header" style="color:#2db7f5;text-align:left">
                <span>{{modelTitle}}</span>
            </p>
            <div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="路由器编号" prop="routerInformationId">
                            <Select v-model="formValidate.routerInformationId">
                                <Option v-for="item in snList" :value="item.id" :key="item.id">{{ item.sn }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="电表别名" prop="electricityMeterInfoId">
                            <Select v-model="formValidate.electricityMeterInfoId">
                                <Option v-for="item in aliasList" :value="item.id" :key="item.id">{{ item.alias }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="串口编号" prop="serialPortInformationId">
                            <Select v-model="formValidate.serialPortInformationId">
                                <Option v-for="item in serialPortNumberList" :value="item.id" :key="item.id">{{ item.serialPortNumber }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="是否报警" prop="isAcquire">
                             <RadioGroup v-model="formValidate.isAcquire">
                                <Radio v-for="item in isAcquireData" :key='item.value' 
                                :label="item.value">
                                {{item.name}}
                            </Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="组织" prop="organizationUnitId">
                            <Select v-model="formValidate.organizationUnitId">
                                <Option v-for="item in organizationUnitIdList" :value="item.id" :key="item.id">{{ item.displayName }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="备注" prop="remark">
                            <Input type="textarea" :rows="3" v-model="formValidate.remark" :maxlength=200 placeholder=""></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" @click="handleCancle('formValidate')">
                    取消
                </Button>
                <Button type="info" size="large" :loading="saving" @click="handelSave('formValidate')">
                    保存
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import search from '@/view/components/search/search.vue';
    import operate from '@/view/components/button-group/index.vue';
    import { formatData, objEqual } from '@/libs/tools'
    import { getRouterConfigList,addRouterConfig,delRouterConfig,updataRouterConfig } from '@/api/routerConfig'
    import { getOrganizationList,getSerialPortInformationList,getRouterInformationList,getElectricityMeterInfoList } from '@/api/data'
    export default {
        name: 'serial_config',
        data() {
            return {
                columns1: [{
						title: '序号',
						key: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '路由器编号',
                        key: 'sn',
                        align: 'center',

                    },
                    {
                        title: '电表',
                        key: 'alias',
                        align: 'center',
                    },
                    {
                        title: '串口编号',
                        key: 'serialPortNumber',
                        align: 'center',
                    },
                    {
                        title: '是否采集',
                        key: 'isAcquireData',
                        align: 'center',
                    },
                    {
                        title: '组织',
                        key: 'organizationUnitName',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                    }
                ],
                listData: [],
                isAcquireData:[
                    {
                        value:1,
                        name:'是'
                    },
                    {
                        value:0,
                        name:'否'
                    }
                ],
                organizationUnitIdList:[],
                snList:[],
                aliasList:[],
                serialPortNumberList:[],
                data: {},
                total: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '路由器信息列表',
                modelTitle: '',
                placeholderValue: '请输入路由器名称',
                isLoading: false,
                isEdit: false, // 点击编辑切换
                queryParam: {
                    "maxResultCount": 10,
                    "filter": '',
                    "pageNumber": 0,
                    "skipCount": 0
                },
                removeInputFlag: 0,
                addBtn: true, //新增按钮权限
                deleteBtn: false, //删除按钮权限
                editBtn: false,
                isAddRouterConfig: false,
                formValidate: {
                    isAcquire:1
                },
                saving: false,
                ruleValidate: {
                    routerInformationId: [
                        { required: true, type:'number', message: '请输入路由器编号', trigger: 'blur' }
                    ],
                    serialPortInformationId: [
                        { required: true, type:'number', message: '请输入绑定类型', trigger: 'blur' }
                    ],
                    organizationUnitId: [
                        { required: true, type:'number', message: '请选择组织', trigger: 'blur' }
                    ],
                    electricityMeterInfoId: [
                        { required: true, type:'number', message: '请输入名称', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            init() {
                this.getListData();
                this.getSerialPortInformations();
                this.getRouterInformations();
                this.getElectricityMeterInfos();
                this.getOrganizationUnits(2);
            },
            getSerialPortInformations(OrganizationUnitType){
                return new Promise((resolve, reject) => {
                    getSerialPortInformationList(OrganizationUnitType).then(
                       res => {
                            const data = res.data.result;
                            this.serialPortNumberList=data;
                            resolve()
                        },
                        error => {
                            this.$Message.error(error.error.message);
                            resolve();
                    }).catch(err => {
                        reject(err)
                    })
                })   
            },
            getRouterInformations(OrganizationUnitType){
                return new Promise((resolve, reject) => {
                    getRouterInformationList(OrganizationUnitType).then(
                       res => {
                            const data = res.data.result;
                            this.snList=data;
                            resolve()
                        },
                        error => {
                            this.$Message.error(error.error.message);
                            resolve();
                    }).catch(err => {
                        reject(err)
                    })
                })   
            },
            getElectricityMeterInfos(OrganizationUnitType){
                return new Promise((resolve, reject) => {
                    getElectricityMeterInfoList(OrganizationUnitType).then(
                       res => {
                            const data = res.data.result;
                            this.aliasList=data;
                            resolve()
                        },
                        error => {
                            this.$Message.error(error.error.message);
                            resolve();
                    }).catch(err => {
                        reject(err)
                    })
                })   
            },
            getOrganizationUnits(OrganizationUnitType){
                return new Promise((resolve, reject) => {
                    getOrganizationList(OrganizationUnitType).then(
                       res => {
                            const data = res.data.result.items;
                            this.organizationUnitIdList=data;
                            resolve()
                        },
                        error => {
                            this.$Message.error(error.error.message);
                            resolve();
                    }).catch(err => {
                        reject(err)
                    })
                })   
            },
            getListData(){
                return new Promise((resolve, reject) => {
                    getRouterConfigList(this.queryParam).then(
                        res => {
                            const data = res.data.result;
                            this.isLoading = false;
                            this.isSelect=false;
                            this.listData = data.items;
                            let size=this.queryParam.skipCount+1;
                            this.listData.forEach(element=>{
                                element.index=size++;
                                if(element.isAcquire){
                                    element.isAcquireData='是';
                                    element.isAcquire=1;
                                }else{
                                    element.isAcquireData='否';
                                    element.isAcquire=0;
                                }
                            })
                            this.total = data.totalCount;
                            resolve()
                        },
                        error => {
                            this.$Message.error(error.error.message);
                            resolve();
                    }).catch(err => {
                        reject(err)
                    })
                })     
            },
            query(data) {
                this.queryParam.pageNumber = 0;
                this.queryParam.skipCount = 0;
                this.queryParam.filter = data.filter;
                this.getListData();
            },

            selectItem(data, index) {
                this.deleteBtn = true;
                this.editBtn = true;
                this.data = data;
                this.selectIndex = index;
                this.isSelect = true;
            },
            pageChange(data) {
                this.queryParam.pageNumber = data - 1;
                this.queryParam.skipCount = (data - 1) * this.queryParam.maxResultCount;
                this.getListData();
            },
            // 刷新页面
            refreshHandler() {
                this.queryParam.filter = '';
                this.isSelect = false;
                this.getListData();
            },
            deleteHandler(data) {
                return new Promise((resolve, reject) => {
                    delRouterConfig(data.id).then(
                        res => {
                            this.$Message.success('删除路由器成功');
                            this.isSelect = false;
                            this.getListData();
                            resolve()
                        },
                        error => {
                            this.$Message.error(error.error.message);
                            resolve();
                    }).catch(err => {
                        reject(err)
                    })
                })     
                
            },
             addHandler() {
                this.isAddRouterConfig = true;
                this.modelTitle = '新增路由器配置';
            },
            //编辑
            editHandler(index) {
                this.isEdit = true;
                this.isAddRouterConfig = true;
                this.modelTitle = '编辑路由器配置信息';
                this.formValidate = this.data;
                this.organizationUnitIdList.forEach(element=>{
                    if(objEqual(this.formValidate.organizationUnitName, element.displayName)){
                        this.formValidate.organizationUnitId=element.id;
                    }
                })
                this.snList.forEach(element=>{
                    if(objEqual(this.formValidate.sn, element.sn)){
                        this.formValidate.routerInformationId=element.id;
                    }
                })
                this.aliasList.forEach(element=>{
                    if(objEqual(this.formValidate.alias, element.alias)){
                        this.formValidate.electricityMeterInfoId=element.id;
                    }
                })
                this.serialPortNumberList.forEach(element=>{
                    if(objEqual(this.formValidate.serialPortNumber, element.serialPortNumber)){
                        this.formValidate.serialPortInformationId=element.id;
                    }
                })
            },
            handleCancle(name) {
                this.isAddRouterConfig = false;
                this.isSelect=false;
                this.$refs[name].resetFields();
            },
            handelSave(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.isEdit){
                            return new Promise((resolve, reject) => {
                                updataRouterConfig(this.formValidate).then(
                                    res => {
                                        this.$Message.success('修改设备成功');
                                        this.isAddRouterConfig = false;
                                        this.isEdit=false;
                                        this.$refs[name].resetFields();
                                        this.getListData();
                                        resolve()
                                    },
                                    error => {
                                        this.$Message.error(error.error.message);
                                        resolve();
                                }).catch(err => {
                                    reject(err)
                                })
                            })    
                        }else{
                            return new Promise((resolve, reject) => {
                                addRouterConfig(this.formValidate).then(
                                    res => {
                                        this.$Message.success('新增设备成功');
                                        this.isAddRouterConfig = false;
                                        this.$refs[name].resetFields();
                                        this.getListData();
                                        resolve()
                                    },
                                    error => {
                                        this.$Message.error(error.error.message);
                                        resolve();
                                }).catch(err => {
                                    reject(err)
                                })
                            })  
                        }
                    } else {
                        this.$Message.error('输入有误!');
                    }
                })
                   
                
            }
        },
        components: {
            search,
            operate,
        },
        mounted() {
            this.init();
        }
    };

</script>
<style lang='less'>
    @import "../components/search/searchAndOperate.less";

    .control-group {
        height: 55px;

        .error_text {
            color: red;
            padding-left: 10px;
        }
    }

    .dec {
        display: inline-block;
        vertical-align: middle;
        width: 90px;
        text-align: right;
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        margin-right: 10px;
    }

</style>
