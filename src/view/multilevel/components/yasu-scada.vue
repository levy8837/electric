
<template>
     <div class="couplet-card">
        <Tabs active-key="key1">
        <Tab-pane label="1#箱变" key="key1">
                <yasu-com1 :isViews="isViews"></yasu-com1>
        </Tab-pane>
        <Tab-pane label="2#箱变" key="key2">
                <yasu-com2 :isView="isView" ></yasu-com2>
        </Tab-pane>
        <Tab-pane label="3#箱变" key="key2">
                <yasu-com3 :isView="isView" ></yasu-com3>
        </Tab-pane>
    </Tabs>
    </div>
</template>

<script type="text/ecmascript-6">
import yasuCom1 from './yasu-com1.vue';
import yasuCom2 from './yasu-com2.vue';
import yasuCom3 from './yasu-com3.vue';
import { getCustomerList,addCustomer,delCustomer,updataCustomer } from '@/api/scada'
 export default {
    components: {
        yasuCom1,
        yasuCom2,
        yasuCom3
    },
    props: {
    },
    data() {
        return{
            isView:true,
            isViews:false
        }  
    },  
    watch: {
    },
    methods: {
        init() {         	
        },         
    },
    mounted() {   
    },
 }
</script>

<style  lang='less' scoped>
</style>
