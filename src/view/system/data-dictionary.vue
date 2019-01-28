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
        <Modal v-model="isAddDataDicConfig" :closable="false" width="800">
            <p slot="header" style="color:#2db7f5;text-align:left">
                <span>{{modelTitle}}</span>
            </p>
            <div>
                <Form ref="formValidate" :model="formValidate" :label-width="100">
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="名称" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输名称"></Input>
                        </FormItem>
                        </Col>
                        <Col span="10" class='col-wrap'>
                        <FormItem label="客户编号" prop="dictionaryType">
                             <Select v-model="formValidate.dictionaryType" clearable>
                                <Option v-for="item in dictionaryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" @click="handleCancle">
                    取消
                </Button>
                <Button type="info" size="large" :loading="saving" @click="handelSave">
                    保存
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import search from '@/view/components/search/search.vue';
    import operate from '@/view/components/button-group/index.vue';
    import { getDate } from '@/libs/tools'
    import { getDataDicConfigList,addDataDicConfig,delDataDicConfig,updataDataDicConfig } from '@/api/dataDicConfig'
    export default {
        name: 'data_dictionary',
        data() {
            return {
                columns1: [{
						title: '序号',
						key: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center',
                        
                    },
                    {
                        title: '字典类型',
                        key: 'dictionaryType',
                        align: 'center',
                    },
                    {
                        title: '创建时间',
                        key: 'creationTime',
                        align: 'center',
                    }
                ],
                listData: [],
                dictionaryList:[
                    {
                        value: 1,
                        label: '代理商名称'
                    },
                    {
                        value: 2,
                        label: '行业'
                    },
                    {
                        value: 3,
                        label: '服务类型'
                    },
                    {
                        value: 4,
                        label: '用户等级'
                    },
                    {
                        value: 5,
                        label: '箱变产商'
                    },
                    {
                        value: 6,
                        label: '负荷开关厂商'
                    },
                    {
                        value: 7,
                        label: '电流互感器厂商'
                    },
                    {
                        value: 8,
                        label: '电压互感器厂商'
                    },
                    {
                        value: 9,
                        label: '高压熔断器厂商'
                    },
                    {
                        value: 10,
                        label: '变压设备厂商'
                    },
                    {
                        value: 11,
                        label: '高压变压器厂商'
                    },
                    {
                        value: 12,
                        label: '低压变压器厂商'
                    },
                    {
                        value: 13,
                        label: '隔离开关厂商'
                    },
                    {
                        value: 14,
                        label: '断路器厂商'
                    },
                    {
                        value: 15,
                        label: '出线电缆厂商'
                    },
                    {
                        value: 16,
                        label: '电容器产商'
                    },
                    {
                        value: 17,
                        label: '路由器厂商'
                    },
                    {
                        value: 18,
                        label: '电表厂商'
                    },
                    {
                        value: 19,
                        label: '用户类别'
                    },
                    {
                        value: 20,
                        label: '计量方式'
                    }
                ],
                data: {},
                total: 1,
                page: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '字典信息列表',
                modelTitle: '',
                iconType: 'person',
                placeholderValue: '请输入字典名称',
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
                isAddDataDicConfig: false,
                formValidate: {},
                saving: false,
            }
        },
        methods: {
            init() {
                this.getListData();
            },
            getListData(){
                return new Promise((resolve, reject) => {
                    getDataDicConfigList(this.queryParam).then(res => {
                        const data = res.data.result;
                        this.isLoading = false;
                        this.listData = data.items;
                        let size=this.queryParam.skipCount+1;
                        this.listData.forEach(element=>{
                            element.index=size++;
                            element.creationTime=getDate(element.creationTime,"year");
                        })
                        this.total = data.totalCount;
                        resolve()
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
            //界面跳转
            toReport(val){
                console.info("传递参数值：",val)
                this.$router.push({
                    name: 'survey_survey',
                    params: { 
                        dataObj: val
                    }
                })
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
                    delDataDicConfig(data.id).then(res => {
                        this.$Message.success('删除客户成功');
                        this.isSelect = false;
                        this.getListData();
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })     
                
            },
            addHandler() {
                this.isAddDataDicConfig = true;
                this.modelTitle = '新增字典';
            },
            //编辑
            editHandler(index) {
                this.isEdit = true;
                this.isAddDataDicConfig = true;
                this.modelTitle = '编辑字典';
                this.formValidate = this.data;
                this.dictionaryList.forEach(element => {
                    if(element.label==this.formValidate.dictionaryType){
                        this.formValidate.dictionaryType=element.value;
                    }
                });
            },
            handleCancle() {
                this.isAddDataDicConfig = false;
                this.formValidate = {};
            },
            handelSave() {
                if(this.isEdit){
                    return new Promise((resolve, reject) => {
                    updataDataDicConfig(this.formValidate.id,this.formValidate).then(res => {
                        this.$Message.success('修改成功');
                        this.isAddDataDicConfig = false;
                        this.isEdit=false;
                        this.formValidate = {};
                        this.getListData();
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })    
                }
                return new Promise((resolve, reject) => {
                    addDataDicConfig(this.formValidate).then(res => {
                        this.$Message.success('新增成功');
                        this.isAddDataDicConfig = false;
                        this.formValidate = {};
                        this.getListData();
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
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
