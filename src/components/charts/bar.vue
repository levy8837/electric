<template>
    <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
    import echarts from 'echarts'
    import tdTheme from './theme.json'
    echarts.registerTheme('tdTheme', tdTheme)
    export default {
        name: 'ChartBar',
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
                this.$nextTick(() => {
                    let xAxisData = this.xAxisData
                    let seriesData = this.seriesData
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
                                    htmlStr += xName + '<br/>';//x轴的名称
                                    }
                                    htmlStr +='<div>';
                                    //为了保证和原来的效果一样，这里自己实现了一个点的效果
                                    htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:'+color+';"></span>';
                                    
                                    //圆点后面显示的文本
                                    htmlStr += seriesName + '：' + value + '%';
                                    
                                    htmlStr += '</div>';
                                }
                                return htmlStr;
                            }
                        },
                        xAxis: {
                            name: '时间',
                            type: 'category',
                            data: xAxisData
                        },
                        yAxis: {
                            axisLabel: {
                                formatter: function (value) {
                                    var texts = [];
                                    texts.push(value + ' %');
                                    return texts;
                                }
                            },
                            name: '用电趋势',
                            type: 'value'
                        },
                        series: [{
                            data: seriesData,
                            name: '趋势',
                            stack: '总量',
                            areaStyle: {normal: {
                                color: '#2d8cf0'
                            }},
                            type: 'bar'
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
