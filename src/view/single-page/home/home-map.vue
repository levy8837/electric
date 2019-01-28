<template id="child-Outmap">
    <div class="box">
        <div class="map-example" @change="fullscreenChange" :fullscreen.sync="fullscreen" ref="fullscreen">
            <div id="allmap" class="map-container"></div>
            <Icon @click.native="toggleFullScreen" :type="[fullscreen ? 'md-contract' : 'md-expand']" class="btn btn-default btn-map-fullscreen"
                :size="23"></Icon>
        </div>
    </div>
</template>

<script>
    import fullscreen from 'vue-fullscreen'
    import Vue from 'vue'
    Vue.use(fullscreen)
    let map = null
    export default {
        data() {
            return {
                fullscreen: false,
                style: {
                    width: '100%',
                    height: this.om.height + 'px'
                },
                data_info: [{
                        "point1": 120.427232,
                        "point2": 27.514563,
                        "address": "客户：王某某<br/>地址：浙江省温州市苍南县灵溪苍南县新城农贸综合市场(东方魅力) <br/>总设备：500"
                    },
                    {
                        "point1": 120.459325,
                        "point2": 27.531903,
                        "address": "客户：张某某<br/>地址：浙江省温州市苍南县灵溪镇山海大道288号(亚塑) <br/>总设备：500"
                    }
                ]
            }
        },

        props: ['om'], //通过props属性，将从父级得到的数据传给子级
        mounted() {
            this.feathData();
        },
        methods: {
            toggleFullScreen() {
                this.$fullscreen.toggle(this.$el.querySelector('.map-example'), {
                    wrap: false,
                    callback: this.fullscreenChange
                })
            },
            fullscreenChange(fullscreen) {
                this.fullscreen = fullscreen
                map.checkResize()
                map.setMapStyle({
                    style: fullscreen ? 'bluish' : 'normal'
                })
            },
            feathData() {
                var _this = this;
                map = new BMap.Map("allmap"); // 创建Map实例
                map.centerAndZoom(new BMap.Point(_this.om.longitude, _this.om.latitude), 12);
                var opts = {
                    width: 250, // 信息窗口宽度
                    height: 110, // 信息窗口高度
                    title: "详细信息", // 信息窗口标题
                    enableMessage: true //设置允许信息窗发送短息
                };
                for (var i = 0; i < _this.data_info.length; i++) {
                    var marker = new BMap.Marker(new BMap.Point(_this.data_info[i].point1, _this.data_info[i].point2)); // 创建标注
                    var content = _this.data_info[i].address;
                    map.addOverlay(marker); // 将标注添加到地图中
                    addClickHandler(content, marker);
                }

                function addClickHandler(content, marker) {
                    marker.addEventListener("mouseover", function (e) {
                        openInfo(content, e);
                        changeSize();
                    });
                };

                function openInfo(content, e) {
                    var p = e.target;
                    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                    var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
                    map.openInfoWindow(infoWindow, point); //开启信息窗口
                };
                // map.centerAndZoom("温州", 12); // 初始化地图,设置中心点坐标和地图级别
                //添加地图类型控件
                map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                // map.setCurrentCity("苏州"); // 设置地图显示的城市 此项是必须设置的
                map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            }
        }
    }

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    .map-example {
        position: relative;
        height: 600px;

        .map-container {
            height: 100%;
        }

        .btn-map-fullscreen {
            position: absolute;
            right: 10px;
            top: 40px;
            width: 36px;
            height: 36px;
            padding: 0;
            font-size: 36px;
            line-height: 36px;
            text-align: center;
            outline: none;
        }

        .ivu-icon .ivu-icon-md-expand {
            vertical-align: text-top;
            line-height: 1
        }

        &.fullscreen {
            width: 100%;
            height: 100%;
        }
    }

</style>
