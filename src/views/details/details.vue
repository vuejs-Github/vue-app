
<template>
  <div class="height100">
    <el-row class="height100">
      <el-col :span="12"> 对接详情数据 </el-col>
      <el-col :span="12" class="border-left height100">
        <chat-head
          @room="room"
          @exit="exit"
          :id="params.id"
          :status="params.status"
        />
        <holoview-sdk
          widget="Chat"
          baseUrl="https://demo.holoview-lab.com"
          appKey="000001"
          :rid="params.rid"
          class="height-calc"
        />
        <holoview-sdk
          widget="ChatFoot"
          videoCall="true"
          baseUrl="https://demo.holoview-lab.com"
          appKey="000001"
          status="synergy"
          :rid="params.rid"
        />
      </el-col>
    </el-row>
    <invite-dialog :inviteVisible.sync="inviteVisible" :id="params.id" />
  </div>
</template>

<script>
import HoloviewSdk from "holoview-sdk";
import chatHead from "./chatHead/chatHead.vue";
import inviteDialog from "./inviteDialog/inviteDialog.vue";
export default {
  name: "detail",
  components: {
    HoloviewSdk,
    chatHead,
    inviteDialog,
  },
  data() {
    return {
      params: {},
      inviteVisible: false,
    };
  },
  methods: {
    exit() {},
    //房间
    room() {
      this.inviteVisible = true;
    },
  },
  beforeDestroy() {
    PubSub.unsubscribe("IS_NEED_GOBACK");
  },
  created() {
    this.params = this.$route.query;
    PubSub.subscribe("IS_NEED_GOBACK", (n, rid) => {
      if (rid == this.params.rid) {
        this.$router.back();
      }
    });
  },
};
</script>
<style scoped>
.height-calc >>> .chats {
  height: calc(100% - 188px) !important;
}
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
  width: 50% !important;
}
</style>