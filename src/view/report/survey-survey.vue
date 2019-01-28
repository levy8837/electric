<template>
    <div>
        <div>
            <Row :gutter="20" style="margin-top: 20px;">
                <i-col span="8">
                    <div class="card-area">
                        <Card shadow style="padding:0px">
                            <div class="top-style"></div>
                            <div class="top-area">
                                <Icon type="md-hand" style="margin:5px;float:left" color="#436EEE" />
                                <p>指定路线</p>
                            </div>
                            <div class="operate-wrap-navi" style="margin-left: 5px">
                                <p class="p-area">检测点选择:</p>
                                <Select class="select-area" v-model="electricityMeterInfoId" @on-change='selectedChange'>
                                    <OptionGroup v-for="items in customerList" :value="items.customerId" :key="items.customerId"
                                        :label="items.customerName">
                                        <Option v-for="item in items.meterInfosDtoList" :value="item.id" :key="item.id">{{
                                            item.equipmentName }}</Option>
                                    </OptionGroup>
                                </Select>
                            </div>
                        </Card>
                    </div>
                    <div class="card-area" style="height: 210px;">
                        <div class="top-style"></div>
                        <div class="top-area">
                            <Icon type="ios-radio-button-on" size="20" style="float:left" color="#436EEE" />
                            <p>环比</p>
                        </div>
                        <div v-for="(navi, i) in naviCardData" :key="`navi-${i}`" class="navi-div">
                            <navi-card shadow :color="navi.color" :title="navi.title" :icon="navi.icon" :icon-size="14">
                                <Icon v-if="i==5 && navi.count<100" class="count-style-navi" type="md-arrow-round-down"
                                    color="#9A66E4" />
                                <Icon v-if="i==5 && navi.count>=100" class="count-style-navi" type="md-arrow-round-up"
                                    color="#9A66E4" />
                                <Icon v-if="i==2 && navi.count<100" class="count-style-navi" type="md-arrow-round-down"
                                    color="#9A66E4" />
                                <Icon v-if="i==2 && navi.count>=100" class="count-style-navi" type="md-arrow-round-up"
                                    color="red" />
                                <p :style="{color:navi.color}" class="count-style-navi">{{navi.count}}</p>
                            </navi-card>
                        </div>
                    </div>
                </i-col>
                <i-col span="16">
                    <div class="card-area">
                        <div class="top-style"></div>
                        <div class="top-area">
                            <Icon type="md-trending-up" size="20" style="float:left" color="#436EEE" />
                            <p>当日负荷曲线</p>
                        </div>
                        <div>
                            <Card shadow>
                                <chart-line style="height: 300px;" :xAxisData="xAxisData" :seriesData="seriesData"
                                    :text="lineText" />
                            </Card>
                        </div>
                    </div>
                </i-col>
            </Row>
            <Row :gutter="20" style="margin-top: 20px;">
                <i-col span="24">
                    <div class="card-area" style="height: 400px;">
                        <div class="top-style"></div>
                        <div class="top-area">
                            <Icon type="md-trending-up" size="20" style="float:left" color="#436EEE" />
                            <p>用电趋势</p>
                        </div>
                        <div>
                            <Card shadow style="float:right;width: 90%;">
                                <chart-bar style="height: 350px" :xAxisData="statisticXData" :seriesData="statisticSData" :text="lineText" />
                            </Card>
                            <div class="btn-div"><Button class='operate-navi' type="primary">
                                    <p style="fontSize:32px" @click="hourClick()">48</p>
                                    <p>过去48小时</p>
                                </Button></div>
                            <div class="btn-div"><Button class='operate-navi' type="primary">
                                    <p style="fontSize:32px" @click="dayClick()">31</p>
                                    <p>过去31天</p>
                                </Button></div>
                            <div class="btn-div"><Button class='operate-navi' type="primary">
                                    <p style="fontSize:32px" @click="monthClick()">12</p>
                                    <p>过去12月</p>
                                </Button></div>

                        </div>
                    </div>

                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>
    import { InforCard, NaviCard } from '_c/info-card'
    import CountTo from '_c/count-to'
    import { ChartPie, ChartBar, ChartLine } from '_c/charts'
    import Example from './components/example.vue'
    import { formatData } from '@/libs/tools'
    import Map from './components/Map.vue'
    import { getGetAllCustomer, getCapacityData, getElectricityRingRatio, getDataStatistics } from '@/api/surveySurvey'
    export default {
        name: 'survey_survey',
        components: {
            InforCard,
            NaviCard,
            CountTo,
            ChartPie,
            ChartLine,
            ChartBar,
            Example,
            Map
        },
        data() {
            return {
                electricityMeterInfoId: 0,
                customerList: [],
                lineText: '',
                naviCardData: [{
                        title: '当日用电',
                        icon: 'md-pulse',
                        count: 0.0,
                        color: '#2d8cf0'
                    },
                    {
                        title: '昨日同期',
                        icon: 'md-pulse',
                        count: 0.0,
                        color: '#19be6b'
                    },
                    {
                        title: '趋势',
                        icon: 'md-pulse',
                        count: 0.0,
                        color: '#ff9900'
                    },
                    {
                        title: '当月用电',
                        icon: 'md-pulse',
                        count: 0.0,
                        color: '#ed3f14'
                    },
                    {
                        title: '上月同期',
                        icon: 'md-pulse',
                        count: 0.0,
                        color: '#E46CBB'
                    },
                    {
                        title: '趋势',
                        icon: 'md-pulse',
                        count: 0.0,
                        color: '#9A66E4'
                    }
                ],
                xAxisData: [],
                seriesData: [],
                statisticXData:[],
                statisticSData:[],
                lineData: {},
            }
        },
        methods: {
            init() {
                this.getCustomerList();
            },
            getCustomerList() {
                return new Promise((resolve, reject) => {
                    getGetAllCustomer().then(res => {
                        const data = res.data.result;
                        this.customerList = data;
                        let routerParams = this.$route.params.dataObj;
                        if(routerParams==undefined){
                            this.electricityMeterInfoId = data[0].meterInfosDtoList[0].id;
                            this.lineText = data[0].customerName + data[0].meterInfosDtoList[0].equipmentName;
                        }else{
                            data.forEach(element=>{
                                if(element.customerId==routerParams){
                                    this.electricityMeterInfoId=element.meterInfosDtoList[0].id;
                                    this.lineText = element.customerName + element.meterInfosDtoList[0].equipmentName;
                                }
                            })
                        }
                        this.getElectricityRingRatio();
                        this.getCapacityData();
                        this.getDataStatistics();
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            getDataStatistics() {
                return new Promise((resolve, reject) => {
                    getDataStatistics(this.electricityMeterInfoId).then(res => {
                        const data = res.data.result;
                        this.lineData=data;
                        let XData=[];
                        let SData=[];
                        data.hourStatistic.forEach(element=>{
                            let data=formatData(element.createTime,'hour')
                            XData.push(data);
                            SData.push(((element.tendency)*100).toFixed(2));
                        })
                        this.statisticXData=XData;
                        this.statisticSData=SData;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })

            },
            getElectricityRingRatio() {
                return new Promise((resolve, reject) => {
                    getElectricityRingRatio(this.electricityMeterInfoId).then(res => {
                        const data = res.data.result;
                        this.naviCardData[0].count = data.todayelEctricityValue.toFixed(2);
                        this.naviCardData[1].count = data.yesterdayEctricityValue.toFixed(2);
                        this.naviCardData[2].count = ((data.dayTend) * 100).toFixed(2);
                        this.naviCardData[3].count = data.thisMonthEctricityValue.toFixed(2);
                        this.naviCardData[4].count = data.lastMonthEctricityValue.toFixed(2);
                        this.naviCardData[5].count = ((data.monthTend) * 100).toFixed(2);
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            getCapacityData() {
                return new Promise((resolve, reject) => {
                    getCapacityData(this.electricityMeterInfoId, this.dateTime, 30, 0).then(res => {
                        const data = res.data.result;
                        var capacity = [];
                        var hour = [];
                        data.items.forEach(element => {
                            capacity.push(element.capacity / 1000);
                            hour.push(element.hour);
                        });
                        this.seriesData = capacity;
                        this.xAxisData = hour;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })
            },
            hourClick() {
                let XData=[];
                let SData=[];
                this.lineData.hourStatistic.forEach(element=>{
                    let data=formatData(element.createTime,'hour')
                    XData.push(data);
                    SData.push(((element.tendency)*100).toFixed(2));
                })
                this.statisticXData=XData;
                this.statisticSData=SData;
            },
            dayClick() {
                let XData=[];
                let SData=[];
                this.lineData.dayStatistic.forEach(element=>{
                    let data=formatData(element.createTime,'day')
                    XData.push(data);
                    SData.push(((element.tendency)*100).toFixed(2));
                })
                this.statisticXData=XData;
                this.statisticSData=SData;
            },
            monthClick() {
                let XData=[];
                let SData=[];
                this.lineData.monthStatistic.forEach(element=>{
                    let data=formatData(element.createTime)
                    XData.push(data);
                    SData.push(((element.tendency)*100).toFixed(2));
                })
                this.statisticXData=XData;
                this.statisticSData=SData;
            },
            selectedChange(val) {
                this.customerList.forEach(element => {
                    element.meterInfosDtoList.forEach(item => {
                        if (item.id == val) {
                            this.lineText = element.customerName + item.equipmentName;
                        }
                    })
                })
                this.getElectricityRingRatio();
                this.getCapacityData();
                this.getDataStatistics();
            },
        },
        watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            $route(to,from){
                if(to.name=='survey_survey'){
                    this.getCustomerList();
                }
            }
        },
        mounted() {
            this.init();
        }
    }

</script>

<style lang="less">
    .count-style-navi {
        font-size: 20px;
        float: right;
        margin-top: 15px;
    }

    .card-area {
        background-color: white;
        margin-top: 5px;
        border: 1px solid;

        .ivu-card-body {
            padding: 0px;
        }

        ;

        .top-area {
            background-color: rgb(221, 226, 226);
            padding: 5px;
        }

        .top-style {
            height: 5px;
            background-color: darkcyan;
        }
    }

    .p-area {
        float: left;
        margin: 10px;
        margin-top: 15px;
    }

    ;

    .select-area {
        width: 200px;
        margin: 10px;
    }

    .operate-wrap-navi {
        padding-top: 30px;
    }

    .operate-navi {
        width: 100%;
    }

    .navi-div {
        float: left;
        margin: 6px;
        width: 29%;
    }

    .btn-div {
        width: 8%;
        margin: 1%;
        float: left;
    }

</style>
