<template>
    <div ref="dom" class="charts chart-line"></div>
</template>

<script>
    import echarts from 'echarts'
    import tdTheme from './theme.json'
    echarts.registerTheme('tdTheme', tdTheme)
    export default {
        name: 'ChartLine',
        props: {
            xAxisData: Array,
            seriesData: Array,
            text: String,
            subtext: String
        },
        watch: {
            xAxisData() {
                this.echartsShow();
            }
        },
        methods: {
            echartsShow() {
                let xAxisData = this.xAxisData
                let seriesData = this.seriesData
                this.$nextTick(() => {
                    let option = {
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
                            },
                            formatter: function (params, ticket, callback) {
                                var htmlStr = '';
                                for(var i=0;i<params.length;i++){
                                    var param = params[i];
                                    var xName = param.name;//x轴的名称
                                    var seriesName = param.seriesName;//图例名称
                                    var value = param.value;//y轴值
                                    var color = param.color;//图例颜色
                                    
                                    if(i===0){
                                    htmlStr += xName + '点<br/>';//x轴的名称
                                    }
                                    htmlStr +='<div>';
                                    //为了保证和原来的效果一样，这里自己实现了一个点的效果
                                    htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+color+';"></span>';
                                    
                                    //圆点后面显示的文本
                                    htmlStr += seriesName + '：' + value + 'kw';
                                    
                                    htmlStr += '</div>';
                                }
                                return htmlStr;
                            }
                        },
                        xAxis: {
                            name:'时辰',
                            boundaryGap: false,
                            type: 'category',
                            data: xAxisData
                        },
                        yAxis: {
                            name:'功率',
                            type: 'value',
                            axisLabel: {
                                formatter: function (value) {
                                    var texts = [];
                                    texts.push(value + ' kw');
                                    return texts;
                                }
                            }
                        },
                        series: [{
                            name: '功率',
                            stack: '总量',
                            areaStyle: {normal: {
                                color: '#2d8cf0'
                            }},
                            data: seriesData,
                            type: 'line',
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }]
                    }
                    let dom = echarts.init(this.$refs.dom, 'tdTheme')
                    dom.setOption(option)
                })
            }

        },
        mounted() {
            this.echartsShow();
        }
    }

</script>

<style lang="less">
    .charts {
        //
    }

</style>
