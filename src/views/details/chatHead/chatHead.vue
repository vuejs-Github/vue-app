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
import { status } from "@/api/test.js";
export default {
  name: "chatHead",
  props: ["status", "taskid"],
  data() {
    return {
      endModal: false,
    };
  },
  methods: {
    over() {
      if (this.status === "assist") {
        //退出
        this.$emit('exit')
      } else {
        let data = {
          taskid: this.taskid,
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