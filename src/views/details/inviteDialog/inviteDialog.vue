<template>
  <el-dialog
    class="dialog"
    :show-close="false"
    :destroy-on-close="true"
    :before-close="close"
    :visible.sync="inviteVisible"
    width="800px"
  >
    <el-row>
      <el-col :span="12">
        <div
          class="font-bold"
          style="padding: 20px; font-size: 15px; color: #38434c"
        >
          可邀请专家
        </div>
        <div
          class="scroll-bar boderT1"
          style="
            min-height: 400px;
            max-height: 400px;
            overflow: auto;
            border-right: 1px solid #e5e5e5;
          "
        >
          <div
            v-for="item of inviteRoom"
            :key="item.uid"
            class="p10"
            style="border-bottom: 1px solid #e5e5e5"
          >
            <el-checkbox v-model="item.checked" class="mr10 ml10 checkbox">
              <el-avatar size="large" icon="el-icon-user" />
              <span class="ml10" style="color: #38434c">{{ item.name }}</span>
            </el-checkbox>
          </div>
        </div>
      </el-col>
      <el-col class="radius8" :span="12">
        <div style="padding: 19px 20px; color: #38434c" class="radius8">
          <div class="font-bold" style="fontsize: 15px">当前协同成员</div>
          <span class="float-right" style="color: #cd0616">
            *<span>最多可邀请3位员工</span>
          </span>
        </div>
        <div
          class="boderT1"
          style="
            min-height: 400px;
            max-height: 400px;
            overflow: auto;
            width: 100%;
          "
        >
          <div
            v-for="item of inRoom"
            :key="item.uid"
            class="p10 member"
            style="border-bottom: 1px solid #e5e5e5"
          >
            <div>
              <el-avatar class="ml10" size="large" icon="el-icon-user" />
              <span class="ml10" style="color: #38434c">{{ item.name }}</span>
            </div>
            <!-- {
                        this.props.userInfo.holoview_uid == item.holoviewuid &&
                        <span class="ml10 sys-color">({intl.get('myself')})</span>
                      } -->
            <i
              v-if="item.role != 1 && item.role != 0"
              class="el-icon-close mouse-pointer float-right"
              @click="removeMember(item)"
            ></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="addMember">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { members, list } from "../../../api/test";
export default {
  props: ["inviteVisible", "id"],
  data() {
    return {
      inviteRoom: [],
      inRoom: [],
    };
  },
  watch: {
    inviteVisible(n, o) {
      if (n) {
        this.room();
      }
    },
  },
  methods: {
    close() {
      this.$emit("update:inviteVisible", false);
    },
    async room(flag, getInRoom) {
      //在房间
      let res = await members({ id: this.id });
      this.inRoom = res.result;

      // getInRoom ? getInRoom(res.result) : ""; //获取列表

      if (!getInRoom) {
        //不在房间
        list().then((r) => {
          let list = [];
          if (res.result && res.result.length) {
            for (let item of res.result) {
              for (let item2 of r.result) {
                if (item.uid == item2.uid) {
                  item2.inRoom = true;
                }
              }
            }
            for (let item3 of r.result) {
              if (!item3.inRoom) {
                list.push(item3);
              }
            }
            this.inviteRoom = list;
            this.inRoom = res.result;
          } else {
            this.inviteRoom = r.result;
          }
        });
      }
    },
    async addMember() {
      const uid = this.inviteRoom
        .map((per) => per.checked && per.uid)
        .filter((per) => per)
        .join();
      if (uid.length) {
        if(uid.length + this.inRoom.length > 5) {
          this.$message({
            message: "最多可邀请3位员工",
            type: "warning",
          });
          return
        }
        let { code } = await members({ id: this.id, uid }, "post");
        if (code === 0) {
          this.close();
          this.$message({
            message: "邀请成功！",
            type: "success",
          });
        }
      } else {
        this.$message({
          message: "请选择邀请成员",
          type: "warning",
        });
      }
    },
    async removeMember({uid}) {
      let { code } = await members(
        { id: this.id, uid },
        "delete"
      );
      if(code === 0) {
        this.room();
      }
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.dialog {
  /deep/ {
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
.checkbox {
  display: flex;
  align-items: center;
  /deep/ {
    .el-checkbox__label {
      display: flex;
      align-items: center;
    }
  }
}
.font-bold {
  font-weight: bold;
}
.scroll-bar {
  &::-webkit-scrollbar {
    width: 8px;
    height: 0;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    box-shadow: inset 0 0 6px rgba(212, 213, 214, 0.6);
    -webkit-box-shadow: inset 0 0 6px rgba(212, 213, 214, 0.6);
    background-color: rgba(212, 213, 214, 0.8);
  }
  &::-webkit-scrollbar-button,
  &::-webkit-resizer,
  &::-webkit-scrollbar-corner,
  &::-webkit-scrollbar-track {
    display: none;
  }
}
.member {
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
}
.boderT1 {
  border-top: 1px solid #f0f0f0;
}
.p10 {
  padding: 10px;
}
.mr10 {
  margin-right: 10px !important;
}
.mr20 {
  margin-right: 20px;
}
.mb20 {
  margin-bottom: 20px;
}
.mt10 {
  margin-top: 10px;
}
.mt5 {
  margin-top: 5px;
}
.ml10 {
  margin-left: 10px;
}
.float-right {
  float: right;
}
</style>