<template>
    <div class="couplet-card">
        <div class="portlet-title" v-show='!showLog'>
            <Icon type="person-stalker"></Icon>
            <span class='title_text'>{{titleText}}</span>
        </div>

        <!--串口信息列表-->
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
        <Modal v-model="isAddSerialPort" :closable="false" width="800">
            <p slot="header" style="color:#2db7f5;text-align:left">
                <span>{{modelTitle}}</span>
            </p>
            <div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="串口编号" prop="serialPortNumber">
                            <Input v-model="formValidate.serialPortNumber" :maxlength=5 placeholder="请输入串口编号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="别名" prop="alias">
                            <Input v-model="formValidate.alias" :maxlength=120 placeholder="请输入别名"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="绑定类型" prop="bindType">
                            <Input v-model="formValidate.bindType" :maxlength=50 placeholder="请输入绑定类型"></Input>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="是否报警" prop="isAlarm">
                             <RadioGroup v-model="formValidate.isAlarm">
                                    <Radio v-for="item in isAlarmData" :key='item.value' 
                                    :label="item.value">
                                    {{item.name}}
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
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
    import { formatData } from '@/libs/tools'
    import { getSerialPortList,addSerialPort,delSerialPort,updataSerialPort } from '@/api/serialPort'
    export default {
        name: 'serial_port',
        data() {
            return {
                columns1: [{
						title: '序号',
						key: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '串口编号',
                        key: 'serialPortNumber',
                        align: 'center',

                    },
                    {
                        title: '别名',
                        key: 'alias',
                        align: 'center',
                    },
                    {
                        title: '绑定类型',
                        key: 'bindType',
                        align: 'center',
                    },
                    {
                        title: '是否报警',
                        key: 'isAlarmData',
                        align: 'center',
                    },
                    {
                        title: '创建时间',
                        key: 'creationTime',
                        align: 'center',
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                    }
                ],
                listData: [],
                isAlarmData:[
                    {
                        value:1,
                        name:'是'
                    },
                    {
                        value:0,
                        name:'否'
                    }
                ],
                data: {},
                total: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '串口信息列表',
                modelTitle: '',
                placeholderValue: '请输入串口名称',
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
                isAddSerialPort: false,
                formValidate: {
                    isAlarm:1
                },
                saving: false,
                ruleValidate: {
                    serialPortNumber: [
                        { required: true, message: '请输入串口编号', trigger: 'blur' }
                    ],
                    bindType: [
                        { required: true, message: '请输入绑定类型', trigger: 'blur' }
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
            },
            getListData(){
                return new Promise((resolve, reject) => {
                    getSerialPortList(this.queryParam).then(
                        res => {
                            const data = res.data.result;
                            this.isLoading = false;
                            this.listData = data.items;
                            let size=this.queryParam.skipCount+1;
                            this.listData.forEach(element=>{
                                element.index=size++;
                                element.creationTime=formatData(element.creationTime,"day");
                                if(element.isAlarm){
                                    element.isAlarmData='是';
                                    element.isAlarm=1;
                                }else{
                                    element.isAlarmData='否';
                                    element.isAlarm=0;
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
                    delSerialPort(data.id).then(
                        res => {
                            this.$Message.success('删除串口成功');
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
                this.isAddSerialPort = true;
                this.modelTitle = '新增串口';
            },
            //编辑
            editHandler(index) {
                this.isEdit = true;
                this.isAddSerialPort = true;
                this.modelTitle = '编辑串口信息';
                this.formValidate = this.data;
            },
            handleCancle(name) {
                this.isAddSerialPort = false;
                this.$refs[name].resetFields();
            },
            handelSave(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.isEdit){
                            return new Promise((resolve, reject) => {
                            updataSerialPort(this.formValidate).then(
                                res => {
                                    this.$Message.success('修改设备成功');
                                    this.isAddSerialPort = false;
                                    this.isEdit=false;
                                    this.formValidate = {};
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
                            addSerialPort(this.formValidate).then(
                                res => {
                                    this.$Message.success('新增设备成功');
                                    this.isAddSerialPort = false;
                                    this.formValidate = {};
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
