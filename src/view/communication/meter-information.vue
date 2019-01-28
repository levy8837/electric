<template>
    <div class="couplet-card">
        <div class="portlet-title" v-show='!showLog'>
            <Icon type="person-stalker"></Icon>
            <span class='title_text'>{{titleText}}</span>
        </div>

        <!--电表信息列表-->
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
        <Modal v-model="isAddElectricityMeter" :closable="false" width="800">
            <p slot="header" style="color:#2db7f5;text-align:left">
                <span>{{modelTitle}}</span>
            </p>
            <div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="生产厂商" prop="manufacturer">
                            <Select v-model="formValidate.manufacturer">
                                <Option v-for="item in manufacturerList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="产品型号" prop="productType">
                            <Input v-model="formValidate.productType" :maxlength=20 placeholder="请输入产品型号"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="modbus地址" prop="modbusSlaveId">
                            <Input v-model="formValidate.modbusSlaveId" :maxlength=3 placeholder="请输入modbus地址"></Input>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="别名" prop="alias">
                            <Input v-model="formValidate.alias" :maxlength=20 placeholder="请输入别名"></Input>
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
    import { getElectricityMeterList,addElectricityMeter,delElectricityMeter,updataElectricityMeter } from '@/api/electricityMeter'
    import { getDataDicConfigList, getOrganizationList} from '@/api/data'
    export default {
        name: 'meter_information',
        data() {
            const validateNumber = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请输入,不能为空'));
                } else {
                if (!Number.isInteger(+value)) { 
                    callback(new Error('请输入数字值'));
                }
                callback();
                }
            };
            return {
                columns1: [{
						title: '序号',
						key: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '生产厂商',
                        key: 'manufacturer',
                        align: 'center',

                    },
                    {
                        title: '产品型号',
                        key: 'productType',
                        align: 'center',
                    },
                    {
                        title: 'modbus地址',
                        key: 'modbusSlaveId',
                        align: 'center',
                    },
                    {
                        title: '别名',
                        key: 'alias',
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
                manufacturerList:[],
                organizationUnitIdList:[],
                data: {},
                total: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '电表信息列表',
                modelTitle: '',
                placeholderValue: '请输入电表名称',
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
                isAddElectricityMeter: false,
                formValidate: {},
                saving: false,
                ruleValidate: {
                    manufacturer: [
                        { required: true, message: '请选择生产商', trigger: 'blur' },
                    ],
                    productType: [
                        { required: true, message: '请输入产品类型', trigger: 'blur' }
                    ],
                    modbusSlaveId: [
                        { required: true, validator: validateNumber, trigger: 'change'}
                    ],
                    organizationUnitId: [
                        { required: true, type:'number', message: '请选择组织', trigger: 'blur' }
                    ],
                    alias: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            init() {
                this.getListData();
                this.getDataDicConfigList(18);
                this.getOrganizationUnits(2);
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
            getDataDicConfigList(dictionaryType){
               return new Promise((resolve, reject) => {
                    getDataDicConfigList(dictionaryType).then(
                       res => {
                            const data = res.data.result.items;
                            this.manufacturerList=data;
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
                    getElectricityMeterList(this.queryParam).then(
                        res => {
                            const data = res.data.result;
                            this.isLoading = false;
                            this.isSelect=false;
                            this.listData = data.items;
                            let size=this.queryParam.skipCount+1;
                            this.listData.forEach(element=>{
                                element.index=size++;
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
                    delElectricityMeter(data.id).then(
                        res => {
                            this.$Message.success('删除设备成功');
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
                this.isAddElectricityMeter = true;
                this.modelTitle = '新增电表';
            },
            //编辑
            editHandler(index) {
                this.isEdit = true;
                this.isAddElectricityMeter = true;
                this.modelTitle = '编辑电表信息';
                this.formValidate = this.data;
                this.organizationUnitIdList.forEach(element=>{
                    if(objEqual(this.formValidate.organizationUnitName, element.displayName)){
                        this.formValidate.organizationUnitId=element.id;
                    }
                })
            },
            handleCancle(name) {
                this.isAddElectricityMeter = false;
                this.isSelect=false;
                this.$refs[name].resetFields();
            },
            handelSave(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.isEdit){
                            return new Promise((resolve, reject) => {
                            updataElectricityMeter(this.formValidate).then(
                                res => {
                                    this.$Message.success('修改设备成功');
                                    this.isAddElectricityMeter = false;
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
                        }
                        return new Promise((resolve, reject) => {
                            addElectricityMeter(this.formValidate).then(
                                res => {
                                    this.$Message.success('新增设备成功');
                                    this.isAddElectricityMeter = false;
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
