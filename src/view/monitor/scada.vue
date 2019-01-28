<template >
    <div class="couplet-card">
        <Tabs active-key="key1" type="card" style="height: 100%">
            <Tab-pane label="东方魅力SCADA" key="key1">
                <dongfang-scada :isViews="isViews"></dongfang-scada>
            </Tab-pane>
            <Tab-pane label="亚设塑业SCADA" key="key2">
                <yasu-scada :isView="isView"></yasu-scada>
            </Tab-pane>
        </Tabs>
    </div>
</template>

<script type="text/ecmascript-6">
    import dongfangScada from './components/dongfang-scada.vue';
    import yasuScada from './components/yasu-scada.vue';
    import {
        getCustomerList,
        addCustomer,
        delCustomer,
        updataCustomer
    } from '@/api/scada'
    export default {
        name: 'scada',
        components: {
            dongfangScada,
            yasuScada
        },
        props: {},
        data() {
            return {
                isView: true,
                isViews: false
            }
        },
        watch: {},
        methods: {
            init() {},
        },
        mounted() {},
    }

</script>

<style lang='less'>
.couplet-card{
    height: 100%;
}

.ivu-tabs-content-animated{
    height: 100%;
}
</style>
