<template>
  <div>
    <div>
      <Row :gutter="20" style="margin-top: 20px;">
        <i-col span="8" >
          <div class="card-area">
            <Card shadow style="padding:0px">
              <div class="top-style"></div>
              <div class="top-area">
                <Icon type="md-hand" style="margin:5px;float:left" color="#436EEE"/>
                <p>指定路线</p>
              </div>
              <div class="operate-wrap-navi" style="margin-left: 5px">
                <p class="p-area">检测点选择:</p>
                <Select v-model="model" @on-change='selectedChange' class="select-area">
                  <Option v-for="item in dataList" :value="item.id" :key="item.customerNumber">{{ item.customerName }}</Option>
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
                <Icon v-if="i==5" class="count-style-navi" type="md-arrow-round-down" color="#9A66E4"/>
                <Icon v-if="i==2" class="count-style-navi" type="md-arrow-round-up" color="red"/>
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
                <chart-line style="height: 300px;" :xAxisData="xAxisData" :seriesData="seriesData" text=""/>
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
                  <chart-bar style="height: 350px" :value="lineData" text=""/>
                </Card>
                <div class="btn-div"><Button class='operate-navi' type="primary"><p style="fontSize:32px" @click="hourClick()">48</p><p>过去48小时</p></Button></div>
                <div class="btn-div"><Button class='operate-navi' type="primary"><p style="fontSize:32px" @click="dayClick()">31</p><p>过去31天</p></Button></div>
                <div class="btn-div"><Button class='operate-navi' type="primary"><p style="fontSize:32px" @click="monthClick()">12</p><p>过去12月</p></Button></div>
                  
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
import { ChartPie, ChartBar, ChartLine} from '_c/charts'
import Example from '../components/example.vue'
import Map from '../components/Map.vue'
export default {
  name: 'home',
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
  data () {
    return {
      model:'',
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
      inforCardData: [
        { title: '已接入客户数量', icon: 'md-person-add', count: 22, color: '#2d8cf0' },
        { title: '已接入设备数量', icon: 'md-locate', count: 235, color: '#19be6b' },
        { title: '故障待处理', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        { title: '离线设备数量', icon: 'md-share', count: 0, color: '#ed3f14' },
        { title: '抢修待处理任务', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      naviCardData: [
        { title: '当日用电', icon: 'md-pulse', count: 1.0, color: '#2d8cf0' },
        { title: '昨日同期', icon: 'md-pulse', count: 0.8, color: '#19be6b' },
        { title: '趋势', icon: 'md-pulse', count: 125, color: '#ff9900' },
        { title: '当月用电', icon: 'md-pulse', count: 18.1, color: '#ed3f14' },
        { title: '上月同期', icon: 'md-pulse', count: 18.2, color: '#E46CBB' },
        { title: '趋势', icon: 'md-pulse', count: 99.5, color: '#9A66E4' }
      ],
      pieData: [
        {value: 335, name: '直接访问'},
        {value: 310, name: '邮件营销'},
        {value: 234, name: '联盟广告'},
        {value: 135, name: '视频广告'},
        {value: 1548, name: '搜索引擎'}
      ],
      xAxisData:[],
      seriesData:[],
      barData: {
        1: 1,
        2: 1,
        3: 1.2,
        4: 1,
        5: 0.8,
        6: 1,
        7: 1,
        8: 0.8,
        9: 0.8,
        10: 0.8,
        11: 1,
        12: 0.8,
        13: 1.6,
        14: 1,
        15: 1,
        16: 1.2,
        17: 1,
        18: 1,
        19: 1.4,
        20: 1,
        21: 1,
        22: 1,
        23: 1,
        24: 0.6,
        25: 1,
        26: 1,
        27: 1,
        28: 1,
        29: 1.2,
        30: 0.8,
        31: 0.8,
        32: 0.8,
        33: 1,
        34: 1,
        35: 1,
        36: 2,
        37: 1,
        38: 0.8,
        39: 0.8,
        40: 1,
        41: 0.8,
        42: 1,
        43: 1.3,
        44: 1,
        45: 1,
        46: 1.5,
        47: 0.7,
        48: 1,
      },
      lineData: {
        1: 0.5,
        2: 0.5,
        3: 0.6,
        4: 0.5,
        5: 0.4,
        6: 0.5,
        7: 0.5,
        8: 0.4,
        9: 0.4,
        10: 0.4,
        11: 0.4,
        12: 0.5,
        13: 0.8,
        14: 0.5,
        15: 0.5,
        16: 0.6,
        17: 0.5,
        18: 0.5,
        19: 0.7,
        20: 0.5,
        21: 0.5,
        22: 0.5,
        23: 0.5,
        24: 0.6,
        25: 0.5,
        26: 0.5,
        27: 0.5,
        28: 0.5,
        29: 0.5,
        30: 0.4,
        31: 0.4,
        32: 0.4,
        33: 0.5,
        34: 0.5,
        35: 0.5,
        36: 1,
        37: 0.5,
        38: 0.4,
        39: 0.4,
        40: 0.5,
        41: 0.4,
        42: 0.5,
        43: 0.6,
        44: 0.5,
        45: 0.4,
        46: 0.5,
        47: 0.7,
        48: 0.5,
      },
    }
  },
  methods:{
    hourClick(){
      this.lineData={
        1: 0.5,
        2: 0.5,
        3: 0.6,
        4: 0.5,
        5: 0.4,
        6: 0.5,
        7: 0.5,
        8: 0.4,
        9: 0.4,
        10: 0.4,
        11: 0.4,
        12: 0.5,
        13: 0.8,
        14: 0.5,
        15: 0.5,
        16: 0.6,
        17: 0.5,
        18: 0.5,
        19: 0.7,
        20: 0.5,
        21: 0.5,
        22: 0.5,
        23: 0.5,
        24: 0.6,
        25: 0.5,
        26: 0.5,
        27: 0.5,
        28: 0.5,
        29: 0.5,
        30: 0.4,
        31: 0.4,
        32: 0.4,
        33: 0.5,
        34: 0.5,
        35: 0.5,
        36: 1,
        37: 0.5,
        38: 0.4,
        39: 0.4,
        40: 0.5,
        41: 0.4,
        42: 0.5,
        43: 0.6,
        44: 0.5,
        45: 0.4,
        46: 0.5,
        47: 0.7,
        48: 0.5,
      }
    },
    dayClick(){
      this.lineData={
        1: 0.5,
        2: 0.5,
        3: 0.6,
        4: 0.5,
        5: 0.4,
        6: 0.5,
        7: 0.5,
        8: 0.4,
        9: 0.4,
        10: 0.4,
        11: 0.4,
        12: 0.5,
        13: 0.8,
        14: 0.5,
        15: 0.5,
        16: 0.6,
        17: 0.5,
        18: 0.5,
        19: 0.7,
        20: 0.5,
        21: 0.5,
        22: 0.5,
        23: 0.5,
        24: 0.6,
        25: 0.5,
        26: 0.5,
        27: 0.5,
        28: 0.5,
        29: 0.5,
        30: 0.4,
        31: 0.4,
      }
    },
    monthClick(){
      this.lineData={
        1: 0.5,
        2: 0.5,
        3: 0.6,
        4: 0.5,
        5: 0.4,
        6: 0.5,
        7: 0.5,
        8: 0.4,
        9: 0.4,
        10: 0.4,
        11: 0.4,
        12: 0.5,
      }
    },
    selectedChange(){
      const hour=new Date(Date.now());
      console.info("hour",hour)
      const hours = hour.getHours();
      var xData=[];
      var sData=[];
      for(var i=0;i<=hours;i++){
        xData.push(i);
        sData.push(Math.random()*2+0.3)
      }
      this.xAxisData=xData;
      this.seriesData=sData;
    },


  },
  mounted () {
    this.selectedChange();
  }
}
</script>

<style lang="less">
.count-style-navi{
  font-size: 20px;
  float: right;
  margin-top: 15px;
}
.card-area{
  background-color: white;
  margin-top: 5px;
  border: 1px solid;
  .ivu-card-body{
    padding: 0px;
  };
  .top-area{
    background-color: rgb(221, 226, 226);
    padding:5px;
  }
  .top-style{
    height: 5px;
    background-color: darkcyan;
  }
}
.p-area{
    float: left;
    margin: 10px;
    margin-top: 15px;
  };
.select-area{
    width: 200px;
    margin: 10px;
  }
.operate-wrap-navi{
  padding-top: 30px;
}
.operate-navi{
  width: 100%;
}
.navi-div{
  float: left;
  margin: 6px;
  width: 29%;
}
.btn-div{
  width: 6%;
  margin: 1%;
  float: left;
}
</style>
