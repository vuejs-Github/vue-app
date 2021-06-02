<template>
  <div>
    <div class="text-right" style="border-bottom: 1px solid #f0f0f0">
      <el-button
        @click="over"
        type="primary"
        size="small"
        style="margin-bottom: 7px"
      >
        {{ status === "assist" ? "退出" : "结束" }}
      </el-button>
    </div>
    <div
      v-if="status == 'synergy'"
      style="padding: 10px; border-bottom: 1px solid #f0f0f0"
    >
      <i
        @click="$emit('room', true)"
        class="mouse-pointer el-icon-plus"
        style="font-size: 26px"
      />
    </div>
  </div>
</template>
<script>
import { status, members } from "@/api/test.js";
import { GET_INIT_MY_SYNERGY, GET_INIT_SYNERGY } from "@/constants/types.js";
export default {
  name: "chatHead",
  props: ["status", "id"],
  data() {
    return {
      endModal: false,
    };
  },
  methods: {
    over() {
      if (this.status !== "assist") {
        //退出
        const { holoview_uid } = JSON.parse(
          sessionStorage.getItem("holoview_userInfo")
        );
        members({ id: this.id, uid: holoview_uid }, "delete").then((res) => {
          PubSub.publish(GET_INIT_SYNERGY, "no"); //重新获取协同列表
          this.$router.history.push({
            path: `/expert`,
          });
        });
      } else {
        let data = {
          id: this.id,
          status: 4,
        };
        status(data).then((res) => {
          PubSub.publish(GET_INIT_MY_SYNERGY); //重新获取协同列表
          this.$router.history.push({
            path: `/expert`,
          });
        });
      }
    },
  },
};
</script>
<style scoped>
.text-right {
  text-align: right;
}
</style>