<template>
    <div class="couplet-card">
        <div class="portlet-title" v-show='!showLog'>
            <Icon type="person-stalker"></Icon>
            <span class='title_text'>{{titleText}}</span>
        </div>

        <!--客户信息列表-->
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
            <div class="more-col-div">
                <Poptip placement="bottom-end" width="40" class-name="vertical-center-modal">
                    <Icon type="ios-more" :size="23" />
                    <div slot="content">
                        <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
                            <Checkbox label="companyName">公司名称</Checkbox>
                            <Checkbox label="companyLegalName">法人姓名</Checkbox>
                            <Checkbox label="address">单位地址</Checkbox>
                            <Checkbox label="unifiedSocialCreditCode">统一社会信用编码</Checkbox>
                            <Checkbox label="industry">所属行业</Checkbox>
                            <Checkbox label="contractNO">合同编号</Checkbox>
                            <Checkbox label="powerAccountNO">电力户号</Checkbox>
                            <Checkbox label="serviceType">服务类型</Checkbox>
                            <Checkbox label="userLevel">用户等级</Checkbox>
                            <Checkbox label="contractSigningDate">合同签订日期</Checkbox>
                            <Checkbox label="contactPerson">联系人</Checkbox>
                            <Checkbox label="contactNO">联系号码</Checkbox>
                            <Checkbox label="creationTime">创建时间</Checkbox>
                            <Checkbox label="remark">备注</Checkbox>
                        </Checkbox-group>
                    </div>
                </Poptip >
            </div>
            <div class='table-wrap'>
                <i-table stripe highlight-row :columns="tableColumns" :data="listData" @on-row-click='selectItem'>
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
        <Modal v-model="isAddcostomer" :closable="false" width="800">
            <p slot="header" style="color:#2db7f5;text-align:left">
                <span>{{modelTitle}}</span>
            </p>
            <div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="公司名称" prop="companyName">
                            <Input v-model="formValidate.companyName" :maxlength=30 placeholder="请输入公司名称"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="法人姓名" prop="companyLegalName">
                            <Input v-model="formValidate.companyLegalName" :maxlength=10 placeholder="请输入法人姓名"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="地址" prop="address">
                            <Input v-model="formValidate.address" :maxlength=60 placeholder="请输入单位地址"></Input>
                        </FormItem>
                        </Col>
                         <Col span="11" class='col-wrap'>
                        <FormItem label="统一社会信用代码" prop="unifiedSocialCreditCode">
                            <Input v-model="formValidate.unifiedSocialCreditCode" :maxlength=20 placeholder="请输入统一社会信用代码"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="所属行业" prop="industry">
                            <Select v-model="formValidate.industry">
                                <Option v-for="item in industryList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="合同编号" prop="contractNO">
                            <Input v-model="formValidate.contractNO" :maxlength=20 placeholder="请输入合同编号"></Input>
                        </FormItem>
                        </Col>
                        
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="电力户号" prop="powerAccountNO">
                            <Input v-model="formValidate.powerAccountNO" :maxlength=20 placeholder="请输入电力户号"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="计量方式" prop="measurementType">
                            <Select v-model="formValidate.measurementType">
                                <Option v-for="item in measurementTypeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="服务类型" prop="serviceType">
                            <Select v-model="formValidate.serviceType">
                                <Option v-for="item in serviceTypeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="用户等级" prop="userLevel">
                            <Select v-model="formValidate.userLevel">
                                <Option v-for="item in userLevelList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="合同签订日期" prop="contractSigningDate">
                            <Input v-model="formValidate.contractSigningDate" :maxlength=11 placeholder="请输入合同签订日期"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="用电类别" prop="electricityCategory">
                            <Select v-model="formValidate.electricityCategory">
                                <Option v-for="item in electricityCategoryList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="联系人" prop="contactPerson">
                            <Input v-model="formValidate.contactPerson" :maxlength=10  placeholder="请输入联系人"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="联系号码" prop="contactNO">
                            <Input v-model="formValidate.contactNO" :maxlength=11 placeholder="请输入移动电话"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="说明" prop="remark">
                            <Input type="textarea" :rows="3" v-model="formValidate.remark" :maxlength=30 placeholder=""></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" @click="handleCancle">
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
    import { bankCardAttribution } from '@/assets/java-script/checkCard.js';
    import { formatData } from '@/libs/tools';
    import { getCustomerList,addCustomer,delCustomer,updataCustomer } from '@/api/customer';
    import { getDataDicConfigList } from '@/api/data'
    export default {
        name: 'customer_info',
        data() {
            var validateMobilePhone = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请输入联系电话'));
                } else {
                if (value !== '') { 
                    var reg=/^1[3456789]\d{9}$/;
                    if(!reg.test(value)){
                    callback(new Error('请输入有效的手机号码'));
                    }
                }
                callback();
                }
            };
            const validateNumber = (rule, value, callback) => {
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
            };
            return {
                listData: [],
                tableColumns: [],
                tableColumnsChecked: ['companyName', 'companyLegalName', 'address', 'industry', 'serviceType', 'userLevel', 'creationTime'],
                industryList:[],
                measurementTypeList:[],
                serviceTypeList:[],
                userLevelList:[],
                electricityCategoryList:[],
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
                selectData:[2,3,4,19,20],
                data: {},
                total: 1,
                page: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '客户信息列表',
                modelTitle: '',
                iconType: 'person',
                placeholderValue: '请输入客户名称或编号',
                isLoading: false,
                isGroup: false,
                isEdit: false, // 点击编辑切换
                queryParam: {
                    "maxResultCount": 10,
                    "filter": '',
                    "pageNumber": 0,
                    "skipCount": 0
                },
                numberParam: '',
                removeInputFlag: 0,
                addBtn: true, //新增按钮权限
                deleteBtn: false, //删除按钮权限
                editBtn: false,
                isAddcostomer: false,
                formValidate: {
                    bankAccount:''
                },
                ruleValidate: {
                    companyName: [
                        { required: true, message: '公司名称不能为空', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请输入公司地址', trigger: 'blur' }
                    ],
                    serviceType: [
                        { required: true, message: '请选择服务类型', trigger: 'blur' }
                    ],
                    unifiedSocialCreditCode: [
                        { required: true, message: '请输入统一社会信用编码', trigger: 'blur' }
                    ],
                    contactPerson: [
                        { required: true, message: '请输入联系人姓名', trigger: 'blur' }
                    ],
                    mobilephone: [
                        {validator: validateMobilePhone, trigger: 'change'}
                    ]
                },
                saving: false,
                bank_account:'',
                display_bank_account:''
            }
        },
        methods: {
            init() {
                this.getListData();
                this.selectData.forEach(element => {
                    this.getDataDicConfigList(element);
                });
            },
            getDataDicConfigList(dictionaryType){
               return new Promise((resolve, reject) => {
                   getDataDicConfigList(dictionaryType).then(
                       res => {
                            const data = res.data.result.items;
                            this.selectedData(data,dictionaryType)
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
            selectedData(data,dictionaryType){
                switch (dictionaryType) {
                    case 2:
                        this.industryList=data;
                        break;
                    case 3:
                        this.serviceTypeList=data;
                        break;
                    case 4:
                        this.userLevelList=data;
                        break;
                    case 19:
                        this.electricityCategoryList=data;
                        break;
                    case 20:
                        this.measurementTypeList=data;
                        break;
                
                    default:
                        break;
                }
            },
            getListData(){
                return new Promise((resolve, reject) => {
                   getCustomerList(this.queryParam).then(
                       res => {
                            const data = res.data.result;
                            this.isLoading = false;
                            this.listData = data.items;
                            let size=this.queryParam.skipCount+1;
                            this.listData.forEach(element=>{
                                element.index=size++;
                                element.creationTime=formatData(element.creationTime,"day");
                                element.contractSigningDate=formatData(element.contractSigningDate,"day");
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
            //银行账户校验
            inputChange(){
                this.bank_account = this.bank_account.toString().replace(/\s/g, '');
                var carInfo = bankCardAttribution(this.bank_account);
                this.formValidate.bankAccount=carInfo.bankName;
            },
            //格式化银行卡号
            handleBankCardInput(e) {
                this.bank_account = e.target.value;
                this.formValidate.bankAccountNO = this.bank_account.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ') 
            },
            getTable2Columns () {
                const table2ColumnList = {
                    index: {
                        title: '序号',
						key: 'index',
                        width: 50,
                        fixed: 'left',
                        align: 'center'
                    },
                    companyName: {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
			                    h('a', {
			                        
			                        on: {
			                            click: () => {
											this.toReport(params.row.id);
			                            }
			                        }
			                    }, params.row.companyName)
			                ]);
			           	},
                        sortable: true
                    },
                    companyLegalName: {
                        title: '法人姓名',
                        key: 'companyLegalName',
                        align: 'center',
                        sortable: true
                    },
                    address: {
                        title: '单位地址',
                        key: 'address',
                        align: 'center',
                        sortable: true
                    },
                    unifiedSocialCreditCode: {
                        title: '统一社会信用编码',
                        key: 'unifiedSocialCreditCode',
                        align: 'center',
                        sortable: true
                    },
                    industry: {
                        title: '所属行业',
                        key: 'industry',
                        align: 'center',
                        sortable: true
                    },
                    contractNO: {
                        title: '合同编号',
                        key: 'contractNO',
                        align: 'center',
                        sortable: true
                    },
                    serviceType: {
                        title: '服务类型',
                        key: 'serviceType',
                        align: 'center',
                        sortable: true
                    },
                    userLevel: {
                        title: '用户等级',
                        key: 'userLevel',
                        align: 'center',
                        sortable: true
                    },
                    contractSigningDate: {
                        title: '合同签订日期',
                        key: 'contractSigningDate',
                        align: 'center',
                        sortable: true
                    },
                    contactPerson: {
                        title: '联系人',
                        key: 'contactPerson',
                        align: 'center',
                        sortable: true
                    },
                    contactNO: {
                        title: '移动电话',
                        key: 'contactNO',
                        align: 'center',
                        sortable: true
                    },
                    creationTime: {
                        title: '创建时间',
                        key: 'creationTime',
                        align: 'center',
                        sortable: true
                    },
                    remark: {
                        title: '备注',
                        key: 'remark',
                        align: 'center'
                    }
                };

                let data = [table2ColumnList.index];

                this.tableColumnsChecked.forEach(col => data.push(table2ColumnList[col]));

                return data;
            },
            changeTableColumns () {
                this.tableColumns = this.getTable2Columns();
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
                    delCustomer(data.id).then(
                        res => {
                            this.$Message.success('删除客户成功');
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
                this.isAddcostomer = true;
                this.modelTitle = '新增客户';
            },
            //编辑
            editHandler(index) {
                this.isEdit = true;
                this.isAddcostomer = true;
                this.modelTitle = '编辑客户';
                this.formValidate = this.data;
            },
            handleCancle() {
                this.isAddcostomer = false;
                this.formValidate = {};
            },
            handelSave(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.isEdit){
                            return new Promise((resolve, reject) => {
                            updataCustomer(this.formValidate).then(
                                res => {
                                    this.$Message.success('修改客户成功');
                                    this.isAddcostomer = false;
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
                            addCustomer(this.formValidate).then(
                                res => {
                                    this.$Message.success('新增客户成功');
                                    this.isAddcostomer = false;
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
            this.changeTableColumns();
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
            padding-left: 11px;
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
        margin-right: 11px;
    }
    .more-col-div{
        text-align: right;
        padding-right: 11px;
    }
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
            left: 110;
        }
    }
    .ivu-checkbox-group-item{
        display: flex
    }
</style>
