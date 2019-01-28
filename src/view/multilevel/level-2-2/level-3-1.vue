<template>
    <div class="couplet-card">
        <div class="portlet-title" v-show='!showLog'>
            <Icon type="person-stalker"></Icon>
            <span class='title_text'>{{titleText}}</span>
        </div>

        <!--故障信息列表-->
        <div v-show='showList' class='query-wrap'>

            <div class="operate-wrap" style="margin-left: 5px">
                <Select v-model="customerId" @on-change='selectedChange' class='operate' style="width:200px">
                    <Option v-for="item in customerDataList" :value="item.id" :key="item.customerSerialNumber">{{ item.customerName }}</Option>
                </Select>
            </div>

            <div class="operate-wrap" style="margin-left: 20px">时间
                <DatePicker class='operate' type="date" :value="dateTime" :options="disabledDate" placeholder="选择时间" @on-change='dateChange'
                    style="width: 200px">
                </DatePicker>
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
    </div>
</template>
<script>
    import search from '@/view/components/search/search.vue';
    import operate from '@/view/components/button-group/index.vue';
    import { getErrorRecordList,getCustomerList } from '@/api/errorRecord'
    import { getDate } from '@/libs/tools'
    export default {
        name: 'level_2_1',
        data() {
            return {
                columns1: [
                    {
						title: '序号',
						key: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '事件编号',
                        key: 'eventNumber',
                        align: 'center',
                    },
                    {
                        title: '设备编号',
                        key: 'equipmentNumber',
                        align: 'center',
                    },
                    {
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center',
                    },
                    {
                        title: '所属客户',
                        key: 'customerName',
                        align: 'center',
                    },
                    {
                        title: '报警等级',
                        key: 'alarmLevel',
                        align: 'center',
                    },
                    {
                        title: '恢复时间',
                        key: 'recoveryTime',
                        align: 'center',
                    },
                    {
                        title: '报警时间',
                        key: 'alarmTime',
                        align: 'center',
                    },
                    {
                        title: '报警人',
                        key: 'alarmPerson',
                        align: 'center',
                    },
                    {
                        title: '报警状态',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.alarmState == '0') {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        }
                                    }, '恢复')

                                ]);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        }
                                    }, '待修')

                                ]);
                            }
                        }
                    },
                    {
                        title: '报警内容',
                        key: 'alarmContent',
                        align: 'center',
                    },

                ],
                customerDataList: [{
                        id: '0001',
                        customerName: '鹿城创业',
                        customerNumber: '0001'
                    },
                    {
                        id: '0002',
                        customerName: '百度',
                        customerNumber: '0002'
                    },
                    {
                        id: '0003',
                        customerName: '阿里',
                        customerNumber: '0003'
                    }
                ],
                listData: [{
                        eventNumber: '0213554',
                        equipmentNumber: '0002354',
                        equipmentName: '五楼电源',
                        belongedCustomer: '鹿城创业',
                        alarmLevel: '紧急故障',
                        recoveryTime: '2018-5-16 16:48:45',
                        alarmTime: '2018-5-16 16:35:22',
                        wulidianTime: '',
                        alarmPerson: '',
                        alarmState: '1',
                        alarmContent: '总功率因素越下限'
                    },
                    {
                        eventNumber: '0213554',
                        equipmentNumber: '0002354',
                        equipmentName: '五楼电源',
                        belongedCustomer: '鹿城创业',
                        alarmLevel: '紧急故障',
                        recoveryTime: '2018-5-16 16:48:45',
                        alarmTime: '2018-5-16 16:35:22',
                        wulidianTime: '',
                        alarmPerson: '',
                        alarmState: '0',
                        alarmContent: 'B相电流越上限'
                    }
                ],
                customerId: 0,
                dateTime: new Date(),
                disabledDate: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },   
                employeeGroupList: [],
                data: {},
                total: 1,
                page: 1,
                showList: true, //显示列表
                showLog: false,
                isSelect: false,
                add: false,
                titleText: '故障记录列表',
                iconType: 'person',
                placeholderValue: '请输设备编号',
                isLoading: false,
                isGroup: false,
                isEdit: false, // 点击编辑切换
                queryParam: {
                    "pageSize": 10,
                    "keyWords": '',
                    "pageNumber": 0,
                    "skipCount": 0
                },
                addGroupBtn: {
                    status: true,
                    text: '组管理'
                },
                numberParam: '',
                removeInputFlag: 0,
                addBtn: false, //新增按钮权限
                deleteBtn: false, //删除按钮权限
                editBtn: false //编辑按钮权限
            }
        },
        methods: {
            init() {
                this.getCustomerList();
                this.getListData();
            },
            getListData(){
                return new Promise((resolve, reject) => {
                    getErrorRecordList(this.queryParam.pageSize,this.queryParam.skipCount,this.customerId,this.dateTime,this.queryParam.keyWords).then(res => {
                        const data = res.data.result;
                        this.isLoading = false;
                        this.listData = data.items;
                        let size=this.queryParam.skipCount+1;
                        this.listData.forEach(element=>{
                            element.index=size++;
                            element.recoveryTime=getDate(element.recoveryTime,"year");
                            element.alarmTime=getDate(element.alarmTime,"year");
                            if(element.recoveryTime=="1-01-01 00:00:00"){
                                element.recoveryTime="";
                            }
                            element.wulidianTime=getDate(element.wulidianTime,"year");
                        })
                        this.total = data.totalCount;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })     
            },
            getCustomerList(){
                return new Promise((resolve, reject) => {
                    getCustomerList(this.queryParam.pageSize,this.queryParam.skipCount).then(res => {
                        const data = res.data.result;
                        this.customerDataList = data.items;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })   
            },
            query(data) {
                this.queryParam.pageNumber = 0;
                this.queryParam.skipCount = 0;
                this.queryParam.keyWords = data.keyWords;
                this.getListData();
            },
            selectItem(data, index) {
                // this.deleteBtn=true;
                // this.editBtn=true;
                this.data = data;
                this.selectIndex = index;
                this.isSelect = true;
            },
            selectedChange(val) {
                this.customerId=val;
                this.getListData();

            },
            dateChange(val) {
                this.dateTime=val;
                this.getListData();
            },
            pageChange(data) {
                this.queryParam.pageNumber = data - 1;
                this.queryParam.skipCount = (data - 1) * this.queryParam.pageSize;
                this.getListData();
            },
        },
        components: {
            search,
            operate
        },
        mounted() {
            this.init();
        }
    };

</script>
<style lang='less'>
    @import "../../components/search/searchAndOperate.less";

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
