<template>
    <div class="search">

        <Input v-model="value" :placeholder="placeholderValue" style="width: 300px" @keyup.enter.native="query"></Input>
        <Button type="primary" icon="ios-search" class='query search-btn' @click="query">查询</Button>
        <Button type="primary" @click='empty' class="search-btn">清空</Button>
        <Button type="primary" class='more hide_wrap search-btn' @click='showMore'>高级查询</Button>
        <div class="more-wrap show_wrap" v-show='isShowMore'>
            <div v-for='( item, index ) in searchdata' style='margin-bottom: 5px;' class='show_wrap'>
                <span class='select-text show_wrap'>
                    {{item.title}}
                </span>
                <Select v-model="item.code" style="width:200px" class='show_wrap' clearable>
                    <Option class='show_wrap' v-for="selectItem in item.data" :value="selectItem.code" :key="selectItem.value">{{
                        selectItem.value }}</Option>
                </Select>
            </div>
            <div style='margin-bottom: 5px;' class='show_wrap' v-show='showDate' @click='handleClick'>
                <span class='select-text show_wrap'>
                    <!--{{item.title}}-->
                    {{dateTime.title}}
                </span>
                <Row class='show_wrap' style="width: 200px;display:inline-block;vertical-align: middle;">
                    <Col span="12">
                    <DatePicker class='show_wrap' :type="dateTime.type" :value='dateTime.value' @on-change='changeDate'
                        :editable='false' placeholder="请选择时间" style="width: 200px"></DatePicker>
                    </Col>
                </Row>
            </div>

        </div>


    </div>
</template>

<script>
    export default {
        props: {
            placeholderValue: {
                type: String,
                default: ''
            },
            searchdata: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            dateTime: {
                type: String,
                default: '',
            },
            showDate: {
                type: Boolean,
                default: false,
            },
            dateTime: {
                type: Object,
                default: function () {
                    return {
                        title: '',
                        type: 'date',
                        value: ''
                    };
                }
            },
            removeInputFlag: {
                type: Number,
                default: 0
            }
        },

        data() {
            let self = this;
            return {
                value: '',
                isShowMore: false,
                queryParam: {
                    filter: self.value,
                    selectData: self.searchdata,
                    time: self.dateTime.value
                }
            }
        },
        methods: {
            showMore() {
                this.isShowMore = !this.isShowMore;
            },
            query() {
                let self = this;
                this.queryParam.filter = this.value;
                this.queryParam.selectData = this.searchdata;
                this.queryParam.time = this.dateTime.value;
                this.$emit('query', this.queryParam);
            },
            handleBodyClick() {

                this.isShowMore = false;

            },
            empty() {
                this.value = '';
                this.searchdata.forEach((item) => {
                    item.code = '';
                });
                this.query();
            },
            changeDate(date) {
                this.dateTime.value = date;
            },
            handleClick(event) {
                if (event && event.stopPropagation) {
                    event.stopPropagation();

                } else {

                    window.event.cancelBubble = true;

                }
                this.isShowMore = true;
            }
        },
        watch: {
            removeInputFlag(newVal) {
                if (newVal) {
                    this.value = '';
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                document.querySelector('body').addEventListener('click', (event) => {

                    if (event.target.className.indexOf('show_wrap') > -1) return;
                    if (event.target.parentElement.className.indexOf('show_wrap') > -1) return;
                    if (event.target.parentElement.parentElement.className.indexOf('show_wrap') > -1)
                        return;

                    if (event.target.className.indexOf('hide_wrap') < 0 && event.target.parentElement.className
                        .indexOf('hide_wrap') < 0) {
                        this.handleBodyClick();
                    }
                });
            })
        },
        beforeDestroy() {
            document.querySelector('body').removeEventListener('click', this.handleBodyClick);
        }
    }

</script>

<style scoped lang='less'>
    .search {
        position: relative;
        width: 520px;
    }

    .text {
        padding-right: 10px;
    }

    .more-wrap {
        width: 300px;
        position: absolute;
        top: 35px;
        right: 0;
        z-index: 22;
        border: 1px solid #e6e6e6;
        background: #fff;
        min-height: 10px;
        padding: 20px 10px;
    }

    .select-text {
        display: inline-block;
        width: 70px;
        text-align: center;
    }

    .search-btn {
        margin-right: 2px
    }

</style>
