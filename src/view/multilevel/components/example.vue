<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null
    }
  },
  props: {
    xAxisData: Array,
    seriesData: Array,
    text: String,
    subtext: String
  },
  watch:{
    seriesData(){
      this.loadLine();
    },
    xAxisData(){
      this.loadLine();
    },

  },
  methods: {
    resize () {
      this.dom.resize()
    },
    loadLine(){
    const option = {
      title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        }
      ],
      yAxis: {
        axisLabel:{
            formatter: function (value) {
                var texts = [];
                texts.push(value+' kw');
                return texts;
            }
        }
      },
      series: [
        {
          name: '功率',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {
            color: '#2d8cf0'
          }},
          data: this.seriesData
        },
       
       
      ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize())
    })

    }
  },
  mounted () {
    this.loadLine();
  },
  beforeDestroy () {
    off(window, 'resize', this.resize())
  }
}
</script>
