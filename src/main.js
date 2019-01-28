// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import axios from 'axios'
import moment from 'moment';
import util from './libs/util';
import importDirective from '@/directive'
import VueLazyLoad from 'vue-lazyload'
// import Icon from 'vue-svg-icon/Icon.vue'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/java-script/svg-pan-zoom.js'

// 实际打包时应该不引入mock
/* eslint-disable */

util.ajax.get('/AbpUserConfiguration/GetAll').then(result => {
    Object.defineProperty(Vue.prototype, '$moment', { value: moment });
    if (process.env.NODE_ENV !== 'production') require('@/mock')


    Vue.use(VueLazyLoad,{
        error:'@/assets/images/error.png',
        loading:'@/assets/images/error.png'
    })
    Vue.use(iView, {
        i18n: (key, value) => i18n.t(key, value)
    })
    Vue.config.productionTip = false
    /**
     * @description 全局注册应用配置
     */
    Vue.prototype.$config = config
    /**
     * 注册指令
     */
    importDirective(Vue)
    
    Vue.prototype.$http = axios;
    
    // Vue.component('icon', Icon)
    
    /* eslint-disable no-new */
    
    // window.abp = $.extend(true, abp, result.data.result);
    
    Vue.prototype.L = function (text, ...args) {
        let localizedText = window.abp.localization.localize(text, AppConsts.localization.defaultLocalizationSourceName);
        if (!localizedText) {
            localizedText = text;
        }
        if (!args || !args.length) {
            return localizedText;
        }
        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args)
    }

    Vue.filter('l', function (value) {
        if (!value) return ''
        return window.abp.localization.localize(value, AppConsts.localization.defaultLocalizationSourceName);
    });

    new Vue({
        el: '#app',
        router,
        i18n,
        store,
        render: h => h(App),
        data: {
            currentPageName: ''
        },
        // mounted() {
        //     this.currentPageName = this.$route.name;
        //     // Display a list of open pages
        //     this.$store.commit('setOpenedList');
        //     this.$store.commit('initCachepage');

        //     //Filtering admin menu
        //     this.$store.commit('updateMenulist');
        // },
        // created() {
        //     let tagsList = [];
        //     appRouter.map((item) => {
        //         if (item.children.length <= 1) {
        //             tagsList.push(item.children[0]);
        //         } else {
        //             tagsList.push(...item.children);
        //         }
        //     });

        //     this.$store.commit('setTagsList', tagsList);
        //     abp.message.info = (message, title) => {
        //         this.$Modal.info({
        //             title: title,
        //             content: message
        //         })
        //     };

        //     abp.message.success = (message, title) => {
        //         this.$Modal.success({
        //             title: title,
        //             content: message
        //         })
        //     };

        //     abp.message.warn = (message, title) => {
        //         this.$Modal.warning({
        //             title: title,
        //             content: message
        //         })
        //     };

        //     abp.message.error = (message, title) => {
        //         this.$Modal.error({
        //             title: title,
        //             content: message
        //         })
        //     };

        //     abp.message.confirm = (message, titleOrCallback, callback) => {
        //         var userOpts = {
        //             content: message
        //         };
        //         if ($.isFunction(titleOrCallback)) {
        //             callback = titleOrCallback;
        //         } else if (titleOrCallback) {
        //             userOpts.title = titleOrCallback;
        //         };
        //         userOpts.onOk = callback || function () { };
        //         this.$Modal.confirm(userOpts);
        //     }

        //     abp.notify.success = (message, title, options) => {
        //         this.$Notice.success({
        //             title: title,
        //             desc: message
        //         })
        //     };

        //     abp.notify.info = (message, title, options) => {
        //         this.$Notice.info({
        //             title: title,
        //             desc: message
        //         })
        //     };

        //     abp.notify.warn = (message, title, options) => {
        //         this.$Notice.warning({
        //             title: title,
        //             desc: message
        //         })
        //     };

        //     abp.notify.error = (message, title, options) => {
        //         this.$Notice.error({
        //             title: title,
        //             desc: message
        //         })
        //     };
        // }
    });
})