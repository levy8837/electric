<template>
    <div class="couplet-card">
        <div class="portlet-title" v-show='!showLog'>
            <Icon type="person-stalker"></Icon>
            <span class='title_text'>{{titleText}}</span>
        </div>

        <!--代理商信息列表-->
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
                            <Checkbox label="address" is>单位地址</Checkbox>
                            <Checkbox label="contactPerson">联系人</Checkbox>
                            <Checkbox label="mobilephone">移动电话</Checkbox>
                            <Checkbox label="telephone">固定电话</Checkbox>
                            <Checkbox label="creationTime">创建时间</Checkbox>
                            <Checkbox label="email">邮箱</Checkbox>
                            <Checkbox label="position">职务</Checkbox>
                            <Checkbox label="unifiedSocialCreditCode">统一社会信用编码</Checkbox>
                            <Checkbox label="companyLegalName">法人姓名</Checkbox>
                            <Checkbox label="bankAccount">开户银行</Checkbox>
                            <Checkbox label="bankAccountNO">开户账号</Checkbox>
                            <Checkbox label="remark">备注</Checkbox>
                        </Checkbox-group>
                    </div>
                </Poptip>
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
        <Modal v-model="isAddAgent" :closable="false" width="800">
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
                        <FormItem label="联系人" prop="contactPerson">
                            <Input v-model="formValidate.contactPerson" :maxlength=10 placeholder="请输入联系人"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="法人姓名" prop="companyLegalName">
                            <Input v-model="formValidate.companyLegalName" :maxlength=10 placeholder="请输入法人姓名"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="职务" prop="position">
                            <Input v-model="formValidate.position" :maxlength=10 placeholder="请输入职务"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="开户账号" prop="bankAccountNO">
                            <Input v-model="formValidate.bankAccountNO" :maxlength=20 placeholder="请输入开户账号" @on-change="handleBankCardInput"
                                @on-blur="inputChange"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="开户银行" prop="bankAccount">
                            <Input v-model="formValidate.bankAccount" :maxlength=60 placeholder="请输入开户银行"></Input>
                        </FormItem>
                        </Col>

                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="地址" prop="address">
                            <Input v-model="formValidate.address" :maxlength=60 placeholder="请输入地址"></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="邮箱" prop="email">
                            <Input v-model="formValidate.email" :maxlength=40 placeholder="请输入邮箱"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="固定电话" prop="telephone">
                            <Input v-model="formValidate.telephone" :maxlength=11 placeholder="请输入固定电话"></Input>
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
                        <FormItem label="说明" prop="remark">
                            <Input type="textarea" :rows="3" v-model="formValidate.remark" :maxlength=30 placeholder=""></Input>
                        </FormItem>
                        </Col>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="电力资质" prop="powerQualification">
                            <Input v-show="false" v-model="formValidate.powerQualification" :maxlength=30 placeholder=""></Input>
                            <div class="demo-upload-list">
                                <template v-if="insideSrc === ''">
                                    <Icon type="ios-camera" size="30" @click.native="cutPicture()"></Icon>
                                </template>
                                <template v-else>
                                    <img :src="insideSrc">
                                    <div class="demo-upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(insideSrc)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                                    </div>
                                </template>
                            </div>
                            <Modal title="电力资质" v-model="visible">
                                <img :src="imgName" v-if="visible" style="width: 100%">
                            </Modal>
                            <Modal title="图片裁切" v-model="cutVisible" width="650">
                                <div>
                                    <Row>
                                        <i-col>
                                            <Card>
                                                <div class="cropper-example cropper-first">
                                                    <cropper :src="exampleImageSrc" crop-button-text="确认提交" @on-crop="handleCroped"
                                                        @beforeUpload="beforeUpload"></cropper>
                                                </div>
                                            </Card>
                                        </i-col>
                                    </Row>
                                </div>
                                <div slot="footer">
                                    <Button type="info" size="large" @click="handleCancleImg">
                                        取消
                                    </Button>
                                    <Button type="info" size="large" :loading="uploading" @click="handelSaveImg">
                                        保存
                                    </Button>
                                </div>
                            </Modal>
                        </FormItem>
                        </Col>

                    </Row>
                    <Row :gutter="24" class='row-wrap'>
                        <Col span="11" class='col-wrap'>
                        <FormItem label="移动电话" prop="mobilephone">
                            <Input v-model="formValidate.mobilephone" :maxlength=11 placeholder="请输入移动电话"></Input>
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
    import { getAgentList, addAgent, delAgent, updataAgent, getPowerQualification } from '@/api/agent';
    import Cropper from '@/components/cropper'
    import { uploadImg, sureUploadImg } from '@/api/data'
    export default {
        name: 'agent-info',
        data() {
            var validateMobilePhone = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系电话'));
                } else {
                    if (value !== '') {
                        var reg = /^1[3456789]\d{9}$/;
                        if (!reg.test(value)) {
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
            const validatePowerQualification = (rule, value, callback) => {
                if (this.formValidate.powerQualification=== '') {
                    callback(new Error('请上传电力资质'));
                } else {
                    callback();
                }
            };
            return {
                FileName: '',
                FileType: '',
                FileToken: '',
                defaultList: [],
                imgName: '',
                visible: false,
                cutVisible: false,
                isUpdata: false,
                uploadList: [],
                exampleImageSrc: '',
                insideSrc: '',
                powerQualificationData: {
                    fileToken: '',
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                listData: [],
                tableColumns: [],
                tableColumnsChecked: ['companyName', 'address', 'contactPerson', 'mobilephone', 'creationTime', 'email',
                    'position', 'companyLegalName'
                ],
                data: {},
                total: 1,
                page: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '代理商信息列表',
                modelTitle: '',
                iconType: 'person',
                placeholderValue: '请输入代理商名称',
                isLoading: false,
                isGroup: false,
                isEdit: false, // 点击编辑切换
                queryParam: {
                    "maxResultCount": 10,
                    "filter": '',
                    "pageNumber": 0,
                    "skipCount": 0
                },
                addGroupBtn: {
                    status: true,
                    text: '组管理'
                },
                numberParam: '',
                removeInputFlag: 0,
                addBtn: true, //新增按钮权限
                deleteBtn: false, //删除按钮权限
                editBtn: false,
                isAddAgent: false,
                formValidate: {
                    bankAccount: ''
                },
                ruleValidate: {
                    companyName: [{
                        required: true,
                        message: '公司名称不能为空',
                        trigger: 'blur'
                    }, ],
                    email: [{
                        type: 'email',
                        message: '请正确输入邮箱',
                        trigger: 'blur'
                    }],
                    address: [{
                        required: true,
                        message: '请输入公司地址',
                        trigger: 'blur'
                    }],
                    powerQualification: [{
                        validator:validatePowerQualification,
                        trigger:'blur'
                    }],
                    unifiedSocialCreditCode: [{
                        required: true,
                        message: '请输入统一社会信用编码',
                        trigger: 'blur'
                    }],
                    contactPerson: [{
                        required: true,
                        message: '请输入联系人姓名',
                        trigger: 'blur'
                    }],
                    mobilephone: [{
                            required: true,
                            message: '请输入联系电话',
                            trigger: 'blur'
                        },
                        {
                            validator: validateMobilePhone,
                            trigger: 'change'
                        }
                    ]
                },
                saving: false,
                uploading: false,
                bank_account: '',
                display_bank_account: ''
            }
        },
        methods: {
            guid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            beforeUpload(file) {
                this.isUpdata = false;
                this.FileName = file.name;
                this.FileType = file.type;
                this.FileToken = this.guid();
            },
            handleCroped(blob, insideSrc) {
                this.insideSrc = insideSrc;
                const formData = new FormData()
                formData.append('croppedImg', blob)
                formData.append('FileName', this.FileName)
                formData.append('FileType', this.FileType)
                formData.append('FileToken', this.FileToken)
                uploadImg(formData).then((res) => {
                    let data = res.data.result;
                    this.powerQualificationData.fileToken = data.fileToken;
                    this.powerQualificationData.height = data.height;
                    this.powerQualificationData.width = data.width;
                    this.isUpdata = true;
                    this.$Message.success('提交成功~')
                })
            },
            handelSaveImg() {
                if (this.isUpdata) {
                    this.uploading = true;
                    sureUploadImg(this.powerQualificationData).then((res) => {
                        let data = res.data.result;
                        this.formValidate.powerQualification = data;
                        this.cutVisible = false;
                        this.isUpdata = false;
                        this.uploading = false;
                        this.$Message.success('上传成功~')
                    })
                } else {
                    this.$Message.success('先确认提交~')
                }
            },
            handleCancleImg() {
                this.cutVisible = false;
                this.powerQualificationData = {}
            },

            cutPicture() {
                this.cutVisible = true;
            },
            handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove() {
                this.insideSrc = '';
            },

            init() {
                this.getListData();
            },
            getListData() {
                return new Promise((resolve, reject) => {
                    getAgentList(this.queryParam).then(
                        res => {
                            const data = res.data.result;
                            this.isLoading = false;
                            this.listData = data.items;
                            let size = this.queryParam.skipCount + 1;
                            this.listData.forEach(element => {
                                element.index = size++;
                                element.creationTime = formatData(element.creationTime, "day");
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
            toReport(val) {
                console.info("传递参数值：", val)
                this.$router.push({
                    name: 'survey_survey',
                    params: {
                        dataObj: val
                    }
                })
            },
            //银行账户校验
            inputChange() {
                this.bank_account = this.bank_account.toString().replace(/\s/g, '');
                var carInfo = bankCardAttribution(this.bank_account);
                this.formValidate.bankAccount = carInfo.bankName;
            },
            //格式化银行卡号
            handleBankCardInput(e) {
                this.bank_account = e.target.value;
                this.formValidate.bankAccountNO = this.bank_account.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
            },
            getTable2Columns() {
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
                    address: {
                        title: '单位地址',
                        key: 'address',
                        align: 'center',
                        sortable: true
                    },
                    contactPerson: {
                        title: '联系人',
                        key: 'contactPerson',
                        align: 'center',
                        sortable: true
                    },
                    mobilephone: {
                        title: '移动电话',
                        key: 'mobilephone',
                        align: 'center',
                        sortable: true
                    },
                    telephone: {
                        title: '固定电话',
                        key: 'telephone',
                        align: 'center',
                        sortable: true
                    },
                    creationTime: {
                        title: '创建时间',
                        key: 'creationTime',
                        align: 'center',
                        sortable: true
                    },
                    email: {
                        title: '邮箱',
                        key: 'email',
                        align: 'center',
                        sortable: true
                    },
                    position: {
                        title: '职务',
                        key: 'position',
                        align: 'center',
                        sortable: true
                    },
                    powerQualification: {
                        title: '电力资质',
                        key: 'powerQualification',
                        align: 'center',
                        sortable: true
                    },
                    unifiedSocialCreditCode: {
                        title: '统一社会信用编码',
                        key: 'unifiedSocialCreditCode',
                        align: 'center',
                        sortable: true
                    },
                    companyLegalName: {
                        title: '法人姓名',
                        key: 'companyLegalName',
                        align: 'center',
                        sortable: true
                    },
                    bankAccount: {
                        title: '开户银行',
                        key: 'bankAccount',
                        align: 'center',
                        sortable: true
                    },
                    bankAccountNO: {
                        title: '开户账号',
                        key: 'bankAccountNO',
                        align: 'center',
                        sortable: true
                    },
                    remark: {
                        title: '备注',
                        key: 'remark',
                        align: 'center'
                    },
                };

                let data = [table2ColumnList.index];

                this.tableColumnsChecked.forEach(col => data.push(table2ColumnList[col]));

                return data;
            },
            changeTableColumns() {
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
                    delAgent(data.id).then(
                        res => {
                            this.$Message.success('删除代理商成功');
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
                this.isAddAgent = true;
                this.modelTitle = '新增代理商';
            },
            //编辑
            editHandler(index) {
                this.isEdit = true;
                this.isAddAgent = true;
                this.modelTitle = '编辑代理商';
                this.formValidate = this.data;
                this.insideSrc = 'http://www.86y.org/images/loading.gif';
                this.getImgById(this.data.id);
            },
            getImgById(agentId) {
                getPowerQualification(agentId).then((res) => {
                    let data = res.data.result;
                    this.insideSrc = 'data:image/jpeg;base64,' + data.powerQualification;
                })
            },
            handleCancle() {
                this.isAddAgent = false;
                this.insideSrc = '';
                this.formValidate = {};
            },
            handelSave(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.saving = true;
                        if (this.isEdit) {
                            return new Promise((resolve, reject) => {
                                updataAgent(this.formValidate.id, this.formValidate).then(
                                    res => {
                                        this.$Message.success('修改代理商成功');
                                        this.isAddAgent = false;
                                        this.isEdit = false;
                                        this.saving = false;
                                        this.formValidate = {};
                                        this.getListData();
                                        resolve()
                                    },
                                    error => {
                                        this.$Message.error(error.error.message);
                                        this.saving = false;
                                        resolve();
                                }).catch(err => {
                                    reject(err)
                                })
                            })
                        }else{
                            return new Promise((resolve, reject) => {
                                addAgent(this.formValidate).then(
                                    res => {
                                        this.$Message.success('新增代理商成功');
                                        this.isAddAgent = false;
                                        this.saving = false;
                                        this.formValidate = {};
                                        this.getListData();
                                        resolve()
                                    },
                                    error => {
                                        this.$Message.error(error.error.message);
                                        this.saving = false;
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
            Cropper
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

    .more-col-div {
        text-align: right;
        padding-right: 11px;
    }

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
            top: 0;
            left: 110;
        }
    }

    .ivu-checkbox-group-item {
        display: flex
    }

    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

</style>
