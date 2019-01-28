<template>
    <div>
        <div v-show='showList' class='query-wrap'>
            <div class="operate-wrap" style="margin-left: 5px">监测点选择：
                <Select v-model="electricityMeterInfoId" @on-change='selectedChange' class='operate' style="width:200px">
                    <OptionGroup  v-for="items in customerList" :value="items.customerId" :key="items.customerId" :label="items.customerName">
                        <Option v-for="item in items.meterInfosDtoList" :value="item.id" :key="item.id">{{ item.equipmentName }}</Option>
                    </OptionGroup>
                </Select>
            </div>
            <div class="operate-wrap" style="margin-left: 20px">时间选择：
                <DatePicker class='operate' type="date" :value="dateTime" placeholder="Select date" @on-change='dateChange'
                    style="width: 200px">
                </DatePicker>
            </div>
        </div>
        <div class="card-area">
            <div class="top-style"></div>
            <div class="top-area">
                <Icon type="md-trending-up" size="20" style="float:left" color="#436EEE" />
                <p>日负荷曲线</p>
            </div>
            <example :xAxisData="xAxisData" :seriesData="seriesData" :text="lineText" style="height: 500px;" />
        </div>
    </div>


</template>
<script>
    import Example from './components/example.vue'
    import { getGetAllCustomer,getCapacityData } from '@/api/demandCurve'
    import { formatData } from '@/libs/tools'
    export default {
        name: 'demand_curve',
        components: {
            Example,
        },
        data() {
            return {
                electricityMeterInfoId: 0,
                showList: true,
                dateTime: new Date(),
                lineText: '',
                xAxisData: [],
                seriesData: [],
                customerList:[],
            }
        },
        methods: {
            init(){
                this.getCustomerList();
            },
            getCustomerList(){
                return new Promise((resolve, reject) => {
                    getGetAllCustomer().then(res => {
                        const data = res.data.result;
                        this.customerList = data;
                        this.electricityMeterInfoId=data[0].meterInfosDtoList[0].id;
                        this.lineText=data[0].customerName + data[0].meterInfosDtoList[0].equipmentName;
                        this.getCapacityData();
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })   
            },
            selectedChange(val) {
                this.customerList.forEach(element=>{
                    element.meterInfosDtoList.forEach(item=>{
                        if(item.id==val){
                            this.lineText=element.customerName + item.equipmentName;
                        }
                    })
                })
                this.getCapacityData();
            },
            getCapacityData(){
                return new Promise((resolve, reject) => {
                    getCapacityData(this.electricityMeterInfoId,this.dateTime,30,0).then(res => {
                        const data = res.data.result;
                        var capacity=[];
                        var hour=[];
                        data.items.forEach(element => {
                            let date=formatData(this.dateTime,'day') + ' ' + element.hour + '时'
                            capacity.push(element.capacity / 1000);
                            hour.push(date);
                        });
                        this.seriesData=capacity;
                        this.xAxisData=hour;
                        resolve()
                    }).catch(err => {
                        reject(err)
                    })
                })   
            },
            dateChange(val) {
                this.dateTime=val;
                this.getCapacityData();
            }
        },
        mounted() {
            this.init();
        }
    }

</script>
<style>
    @import "../components/search/searchAndOperate.less";

    .card-area {
        background-color: white;
        margin-top: 5px;
        border: 1px solid;
    }

    .top-area {
        background-color: rgb(221, 226, 226);
        padding: 5px;
    }

    .top-style {
        height: 5px;
        background-color: darkcyan;
    }

</style>
