<template>
  <div>
    <div v-show='showList' class='query-wrap'>
        <div class="operate-wrap" style="margin-left: 5px">监测点选择：
          <Select v-model="model" @on-change='selectedChange'  class='operate' style="width:200px">
            <Option v-for="item in dataList" :value="item.id" :key="item.customerNumber">{{ item.customerName }}</Option>
          </Select>
        </div>
        <div class="operate-wrap" style="margin-left: 20px">时间选择：   
          <DatePicker 
            class='operate'
            type="date" 
            :value="dateTime" 
            placeholder="Select date" 
            @on-change='dateChange'
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
      <example :xAxisData="xAxisData" :seriesData="seriesData" :text="lineText" style="height: 500px;"/>
    </div>
  </div>
  
  
</template>
<script>
import Example from '../components/example.vue'
export default {
  name: 'level_2_3',
  components: {
    Example,
  },
  data(){
    return{
      model:'',
      showList:true,
      dateTime:'',
      lineText:'',
      lineData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
      xAxisData:[
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24'
      ],
      seriesData:[],
      dataList:[
          {
            id:'0001',
            customerName:'一楼电源',
            customerNumber:'0001'
          },
          {
            id:'0002',
            customerName:'二楼电源',
            customerNumber:'0002'
          },
          {
            id:'0003',
            customerName:'三楼电源',
            customerNumber:'0003'
          }
        ],
    }
  },
  methods:{
    selectedChange(){
      var sData=[];
      for(var i=0;i<25;i++){
        var randomNum = Math.random().toFixed(2);
        sData.push(randomNum*2+0.4);
      };
      this.seriesData=sData;
    },
    dateChange(){
      var sData=[];
      for(var i=0;i<25;i++){
        var randomNum = Math.random().toFixed(2);
        sData.push(randomNum*2+0.4);
      };
      this.seriesData=sData;
    }
  },
  mounted(){
    this.selectedChange();
  }
}

</script>
<style>
@import "../../components/search/searchAndOperate.less"; 	
.card-area{
  background-color: white;
  margin-top: 5px;
  border: 1px solid;
}
.top-area{
    background-color: rgb(221, 226, 226);
    padding:5px;
  }
.top-style{
  height: 5px;
  background-color: darkcyan;
}
</style>

