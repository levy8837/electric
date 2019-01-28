<template>
    <div style="width:100%;height:100%;" id="visite"></div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'map',
    data () {
        return {
                     
        };
    },
    methods:{
        init(){
        },
        chartsView(){
            this.$nextTick(() => {
                let visite = echarts.init(document.getElementById('visite'));
                const option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['报警时长','运行时长','空闲时长','调试时长']  
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis:  {
                    axisLabel:{
                        formatter: function (value) {
                            var texts = [];
                            texts.push(value+'%');
                            return texts;
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.chratsInfo.equipmentGroupName
                },
                dataZoom: [
                    
                    {
                        type: "inside",
                    }
                ],
                series: [
                            {
                                name: '报警时长',
                                type: 'bar',
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        color:'rgb(249,37,36)',
                                    }
                                },
                                data: this.chratsInfo.warningTimeList
                            },
                            {
                                name: '运行时长',
                                type: 'bar',
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        color:'rgb(89,208,78)',
                                    }
                                },
                                data:  this.chratsInfo.runningTimeList
                            },
                            {
                                name: '空闲时长',
                                type: 'bar',
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        color:'rgb(253,209,20)',
                                    }
                                },
                                data: this.chratsInfo.freeTimeList
                            },
                            {
                                name: '调试时长',
                                type: 'bar',
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        color:'rgb(0,143,215)',
                                    }
                                },
                                data: this.chratsInfo.debugTimeList
                            }
                    ]
                };

                visite.setOption(option);
                window.addEventListener('resize', function () {
                    visite.resize();
                });
            });
        }
    },
    mounted(){
        this.init();
    },
}
</script>
