<template>
  <div>
    <div v-if="permissions === 1333">
      <el-dialog
        title="暂无权限访问"
        :modal="false"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        :show-close="false"
      >
        <div style="display: flex; align-items: center;justify-content: center">
          <i class="el-icon-warning mr5" style="font-size: 26px;color: #f19d38"></i>
          <span>暂无权限访问</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" @click="$router.back()"
            >返回上页</el-button
          > -->
        </span>
      </el-dialog>
    </div>
    <div v-else>
      <div class="text-center">
        <el-radio-group v-model="radioType">
          <el-radio-button label="ing">在进行</el-radio-button>
          <el-radio-button label="over">已结束</el-radio-button>
        </el-radio-group>
        <i
          @click="showConfig"
          class="el-icon-setting float-right mouse-pointer"
          style="font-size: 22px; margin: 10px"
        ></i>
        <config ref="config" />
      </div>
      <div v-if="radioType === 'ing'">
        <h3>协助协同</h3>
        <el-table :data="assists.result" style="width: 100%">
          <el-table-column label="序号" type="index"> </el-table-column>
          <el-table-column prop="title" label="协同标题">
            <template slot-scope="scope">
              {{ scope.row.title }}
              <el-badge :value="scope.row.msgTip" style="margin-top: 9px"></el-badge>
            </template>
          </el-table-column>
          <el-table-column prop="creater_name" label="发起人">
          </el-table-column>
          <el-table-column prop="expert_name" label="专家负责人">
          </el-table-column>
          <el-table-column prop="addtime" label="发起时间"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button circle @click="goDetail(scope.row, 'assist')">
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <h3 class="inline-block mt10">我的协同</h3>
        <el-input
          placeholder="搜索"
          style="width: 200px"
          class="float-right mt10 mb10"
          prefix-icon="el-icon-search"
          @keyup.enter.native="query"
          v-model="filter"
        >
        </el-input>
        <el-table :data="synergys.result" style="width: 100%">
          <el-table-column label="序号" type="index"> </el-table-column>
          <el-table-column prop="title" label="协同标题">
            <template slot-scope="scope">
              {{ scope.row.title }}
              <el-badge :value="scope.row.msgTip" style="margin-top: 9px"></el-badge>
            </template>
          </el-table-column>
          <el-table-column prop="creater_name" label="发起人">
          </el-table-column>
          <el-table-column prop="addtime" label="发起时间"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button circle @click="goDetail(scope.row, 'synergy')">
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="initAM($event, 'size')"
          @current-change="initAM($event, 'num')"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="synergysPage.mSize"
          background
          :current-page.sync="synergysPage.mNum"
          class="float-right mt10"
          layout="prev, pager, next, sizes"
          :total="synergys.count"
        >
        </el-pagination>
      </div>
      <div v-else>
        <h3 class="inline-block mt10">已结束协同</h3>
        <el-input
          placeholder="搜索"
          style="width: 200px"
          class="float-right mt10 mb10"
          prefix-icon="el-icon-search"
          @keyup.enter.native="initOver()"
          v-model="overFilter"
        >
        </el-input>
        <el-table :data="overTable" style="width: 100%">
          <el-table-column type="index" label="序号"> </el-table-column>
          <el-table-column prop="title" label="协同标题"></el-table-column>
          <el-table-column prop="creater_name" label="发起人">
          </el-table-column>
          <el-table-column prop="addtime" label="发起时间"> </el-table-column>
          <el-table-column prop="address" label="协助专家"> </el-table-column>
          <el-table-column prop="address" label="结束时间"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button circle @click="goDetail(scope.row, 'over')">
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="initOver($event, 'size')"
          @current-change="initOver($event, 'num')"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="overSize"
          background
          class="float-right mt10"
          layout="prev, pager, next, sizes"
          :total="overCount"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { stringify } from "qs";
import config from "../config/config";
import { taskList } from "@/api/test.js";
import { SYNERGYSPAGE } from "../../store/constants/test";
import {
  HANG_UP,
  GET_INIT_MY_SYNERGY,
  FILTER_SYNERGY,
  GET_MY_SYNERGYS,
} from "@/constants/types.js";
export default {
  name: "expert",
  computed: {
    ...mapGetters(["assists", "synergys", "synergysPage", "permissions"]),
  },
  components: { config },
  data() {
    return {
      assistTable: [],
      myTable: [{}],
      radioType: "ing",
      overTable: [],
      overCount: 0,
      overSize: 10,
      overNum: 1,
      filter: "",
      overFilter: "",
      dialogVisible: true,
    };
  },
  methods: {
    ...mapMutations([SYNERGYSPAGE]),

    showConfig() {
      this.$refs.config.config(true);
    },

    async initOver(v, type) {
      type === "size" && (this.overSize = v);
      type === "num" && (this.overNum = v);
      !type && ((this.overSize = 10), (this.overNum = 1));
      const data = {
        status: 4,
        size: this.overSize,
        num: this.overNum,
        ttype: 1,
        filter: this.overFilter,
      };
      const { result, count } = await taskList(data);
      this.overTable = result;
      this.overCount = count;
    },
    //打开详情
    goDetail({ id, rid, taskid, sheetid }, status, pop) {
      // this.props.getPopout({ incomingCallModal: false })// 关闭接听弹框
      if (status != "over") {
        let data = {
          targetId: rid,
          clearMsgTip: 0,
        };
        PubSub.publish(GET_MY_SYNERGYS, data); ////重置消息条数
      }
      const query = { id, status, rid, taskid, sheetid };
      this.$router.history.push({
        path: `/detail`,
        query,
      });
    },

    //挂断
    hangUp() {
      let data = {
        reason: "REJECT",
      };
      PubSub.publish(HANG_UP, data);
    },

    //删除全部
    deleteAll(flag) {
      this.state[flag].forEach((id) => {
        $api.agenttask(id).then((res) => {
          if (res.code === 0) {
            if (flag == "selectedRowKeys") {
              PubSub.publish(GET_INIT_MY_SYNERGY); //重新获取协同列表
            } else {
              this.init();
            }
            message.success(intl.get("successfullyDelete"));
          }
        });
      });
    },

    //切换
    operate(e) {
      this.setState({
        flag: e.target.value,
      });
      sessionStorage.setItem("flag", e.target.value);
    },

    initAM(v, type) {
      type === "size" && this[SYNERGYSPAGE]({ mSize: v });
      type === "num" && this[SYNERGYSPAGE]({ mNum: v });
      let data = {
        current: this.synergysPage.mNum,
        pageSize: this.synergysPage.mSize,
      };
      PubSub.publish(GET_INIT_MY_SYNERGY, data);
    },
    //搜索
    query(v) {
      PubSub.publish(FILTER_SYNERGY, this.filter);
    },

    //关闭弹框
    onCancel(obj) {
      this.setState({
        ...obj,
      });
    },
  },
  beforeDestroy() {
    PubSub.unsubscribe("OVER_SYNERGY");
  },
  created() {
    this.initOver();
    //结束协同后重新查询
    PubSub.subscribe("OVER_SYNERGY", (n, rid) => {
      this.initOver();
    });
  },
};
</script>
<style scoped>
.inline-block {
  display: inline-block;
}
.text-center {
  text-align: center;
}
.float-right {
  float: right;
}
.mt10 {
  margin-top: 10px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>