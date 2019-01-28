<template>
  <Card :shadow="shadow" class="navi-card-wrapper" :padding="0">
    <div class="content-con">
      <div class="card-top-area" :style="{background: color, width: leftWidth}">
        <common-icon class="icon" :type="icon" :size="iconSize" color="#fff"/>
        <p style="color:white">{{ title }}</p>
      </div>
      <div>
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import CommonIcon from '_c/common-icon'
export default {
  name: 'NaviCard',
  components: {
    CommonIcon
  },
  props: {
    left: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: '#2d8cf0'
    },
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 20
    },
    shadow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    leftWidth () {
      return `${this.left}%`
    },
    rightWidth () {
      return `${100 - this.left}%`
    }
  }
}
</script>

<style lang="less">
.common{
  position: absolute;
  top: 0px;
  height: 100%;
  display: table;
  text-align: center;
}
.size{
  width: 100%;
  height: 100%;
}
.middle-center{
  display: table-cell;
  vertical-align: middle;
}
.navi-card-wrapper{
  .size;
  overflow: hidden;
  .ivu-card-body{
    .size;
  }
  .content-con{
    .size;
    position: relative;
    .card-top-area{
      .icon{
        float: left;
        margin: 3px;
      }
    }
  }
}
</style>
