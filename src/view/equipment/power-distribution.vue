<template>
    <div class="couplet-card">
        <div class="portlet-title" v-show='!showLog'>
            <Icon type="person-stalker"></Icon>
            <span class='title_text'>{{titleText}}</span>
        </div>

        <!--员工信息列表-->
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
        <Modal v-model="isAddPowerDistribution" :closable="false" width="800">
            <p slot="header" style="color:#2db7f5;text-align:left">
                <span>{{modelTitle}}</span>
            </p>
            <div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="配电室编号" prop="distributionRoomNumber">
                            <Input v-model="formValidate.distributionRoomNumber" placeholder="请输入配电室编号"></Input>
                        </FormItem>
                        </Col>
                         <Col span="10" class='col-wrap'>
                        <FormItem label="配电室名称" prop="distributionRoomName">
                            <Input v-model="formValidate.distributionRoomName" number placeholder="请输入配电室名称"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="表计户号" prop="meterNumber">
                            <Input v-model="formValidate.meterNumber" number placeholder="请输入表计户号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="组织" prop="organizationUnitId">
                            <Select v-model="formValidate.organizationUnitId">
                                <Option v-for="item in organizationUnitIdList" :value="item.id" :key="item.id">{{ item.displayName }}</Option>
                            </Select>
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
    import { getPowerDistributionList,addPowerDistribution,delPowerDistribution,updataPowerDistribution } from '@/api/powerDistribution'
    import { getOrganizationList } from '@/api/data'
    export default {
        name: 'power_distribution',
        data() {
            return {
                columns1: [{
						title: '序号',
						key: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '配电室编号',
                        key: 'distributionRoomNumber',
                        align: 'center',
                        
                    },
                     {
                        title: '配电室名称',
                        key: 'distributionRoomName',
                        align: 'center',
                    },
                    {
                        title: '表计户号',
                        key: 'meterNumber',
                        align: 'center',
                    },
                    {
                        title: '组织名称',
                        key: 'organizationUnitName',
                        align: 'center',
                    }
                ],
                listData: [],
                organizationUnitIdList:[],
                data: {},
                total: 1,
                page: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '配电室信息列表',
                modelTitle: '',
                iconType: 'person',
                placeholderValue: '请输入配电室名称',
                isLoading: false,
                isGroup: false,
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
                isAddPowerDistribution: false,
                formValidate: {},
                ruleValidate: {
                    distributionRoomNumber: [
                        { required: true, message: '请输入电力设施名称', trigger: 'blur' },
                    ],
                    distributionRoomName: [
                        { required: true, message: '请输入进线电源', trigger: 'blur' }
                    ]
                },
                saving: false,
            }
        },
        methods: {
            init() {
                this.getListData();
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
            getListData(){
                return new Promise((resolve, reject) => {
                    getPowerDistributionList(this.queryParam).then(
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
                    delPowerDistribution(data.id).then(res => {
                        this.$Message.success('删除电力设施成功');
                        this.isSelect = false;
                        this.getListData();
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })     
                
            },
            addHandler() {
                this.isAddPowerDistribution = true;
                this.modelTitle = '新增配电室';
            },
            //编辑
            editHandler(index) {
                this.isEdit = true;
                this.isAddPowerDistribution = true;
                this.modelTitle = '编辑配电室';
                this.formValidate = this.data;
                this.organizationUnitIdList.forEach(element=>{
                    if(objEqual(this.formValidate.organizationUnitName, element.displayName)){
                        this.formValidate.organizationUnitId=element.id;
                    }
                })
            },
            handleCancle(name) {
                this.isAddPowerDistribution = false;
                this.isSelect=false;
                this.$refs[name].resetFields();
            },
            handelSave(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.isEdit){
                            return new Promise((resolve, reject) => {
                                updataPowerDistribution(this.formValidate).then(
                                    res => {
                                        this.$Message.success('修改成功');
                                        this.isAddPowerDistribution = false;
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
                        }else{
                            return new Promise((resolve, reject) => {
                                addPowerDistribution(this.formValidate).then(
                                    res => {
                                        this.$Message.success('新增成功');
                                        this.isAddPowerDistribution = false;
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
