
<template>
  <div class="height100">
    <el-row class="height100">
      <el-col :span="12">
        对接详情数据
      </el-col>
      <el-col :span="12" class="border-left height100">
        <holoview-sdk widget="Chat" :rid="params.rid"/>
        <holoview-sdk widget="ChatFoot" videoCall="true" status="synergy" :rid="params.rid"/>
      </el-col> 
    </el-row>
  </div>
</template>

<script>
import HoloviewSdk from 'holoview-sdk'
export default {
  name: "detail",
  components: {
    HoloviewSdk
  },
  data() {
    return {
      assistTable: [],
      myTable: [],
      radioType: "ing",
      params: {

      }
    };
  },
  methods: {
    initOver() {
    }
  },
  created() {
    this.params = this.$route.query
    this.initOver() 
  }
};
</script>
<style scoped>
.inline-block {
  display: inline-block;
}
.text-center {
  text-align: center;
}
.height100 {
  height: 100%;
}
.border-left {
  border-left: 1px solid #ccc;
}
.border-left >>> .holoview-sdk-css .chats,
.border-left >>> .holoview-sdk-css .ant-row {
  width: 50%!important;
}
</style>