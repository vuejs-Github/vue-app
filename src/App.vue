<template>
  <div>
    <router-view />
    <holoview-sdk widget="Main" baseUrl="https://192.168.11.252" v-if="token" :token="token" appKey="000001" />
  </div>
</template>

<script>
import HoloviewSdk from 'holoview-sdk'
import { mapActions, mapGetters, mapMutations } from "vuex";
import PubSub from "pubsub-js";
import { session } from "@/api/test.js";
import { SYNERGYSPAGE } from './store/constants/test'
import { uuid } from "@/assets/js/common";
import {
  GET_MY_SYNERGYS,
  GET_INIT_SYNERGY,
  GET_INIT_MY_SYNERGY,
  FILTER_SYNERGY,
  NEW_TASK_LIST,
  CHANGE_INIT_PAGE,
} from "@/constants/types.js";

export default {
  name: "app",
  components: {
    HoloviewSdk
  },
  computed: {
    ...mapGetters(["assists", "synergys"]),
  },
  data() {
    return {
      changeTask: {},
      token: ''
    };
  },

  methods: {
    ...mapActions(["taskList", "initMySynergy"]),
    ...mapMutations([SYNERGYSPAGE]),

    async session() {
      const data = {
        device: 301,
        host: uuid()
      }
      const { result } = await session(data);
      this.token = result.token
    },

    dealTags() {
      // if (window.name == "") {
      //   //处理复制标签重新登录
      //   this.$router.history.push("/");
      //   window.location.reload();
      // } else {
      //   window.name = "isReload";
      // }
    },
    // 列表消息tip
    getTipIcon(list, res, page) {
      list.forEach((item, i) => {
        //消息条数、icon
        if (item.rid === res.targetId) {
          if (!res.hasOwnProperty("clearMsgTip")) {
            if (res.vv || !res.hasOwnProperty("vv")) {
              if (!item.msgTip) {
                item.msgTip = 1;
              } else {
                item.msgTip++;
              }
              let httpUrl = this.props.location.search;
              let rid = url.parse(httpUrl, true).query.rid;
              if (res.targetId != rid) {
                this.stockpile(res, page, item);
              }
              item.timer = new Date().getTime();
            }
            if (res.hasOwnProperty("vv")) {
              //未接听，别人再次呼叫或发消息处理
              item.vv = res.vv;
            }
          } else {
            item.msgTip = "";
            this.stockpile(res, page, item);
          }
        }
      });
      list.sort((a, b) => {
        //排序
        return (b.timer || 0) - (a.timer || 0);
      });
      return list;
    },

    //tipNum
    stockpile(res, page, item) {
      let tipNum =
        sessionStorage.getItem("tipNum") &&
        sessionStorage.getItem("tipNum") != "undefined"
          ? JSON.parse(sessionStorage.getItem("tipNum"))
          : {};
      let data = {
        ...tipNum,
        [res.targetId]: {
          page,
          msgTip: item.msgTip,
        },
      };
      if (!item.msgTip) {
        delete data[res.targetId];
      }
      sessionStorage.setItem("tipNum", JSON.stringify(data));
    },

    //监听
    monitor() {
      //接听弹框
      PubSub.subscribe("CALLEDMODAL_SDK", (n, flag) => {
        this.props.getPopout({ incomingCallModal: flag });
      });
      //被踢
      PubSub.subscribe("KICKED_SDK", () => {
        this.$router.history.push("/expert");
      });
      //结束协同后重新查询
      PubSub.subscribe("END_SDK", (n, rid) => {
        this.init();
        PubSub.publish("OVER_SYNERGY");
        PubSub.publish("IS_NEED_GOBACK", rid);
      });
      //搜索我的协同
      PubSub.subscribe(FILTER_SYNERGY, (n, v) => {
        this.setState(
          {
            filter: v,
          },
          () => {
            this.initMySynergy("", "noGetNewTaskList");
          }
        );
      });
      PubSub.subscribe("ADDMEMBER_SDK", (n, changeTask) => {
        this.changeTask = changeTask;
        this.init();
      });
      //查询协助系统，和我的协同
      PubSub.subscribe(GET_INIT_SYNERGY, (n, v) => {
        //退出协同后，需要重新查询
        this.init(v);
      });
      //查询我的协同
      PubSub.subscribe(GET_INIT_MY_SYNERGY, (n, data) => {
        this.initMySynergy(data);
      });
      //刷新列表数据
      PubSub.subscribe(GET_MY_SYNERGYS, async (type, res) => {
        let mySynergys = this.synergys.result; //我的协同
        let assists = this.assists.result; //协助协同

        let pages = {
          mySynergys,
          assists,
        };
        let whichPage;
        for (let i in pages) {
          if (this.findPage(pages[i], res)) {
            whichPage = i;
            break;
          }
        }

        if (!whichPage) {
          //邀请专家不执行,收到消息的协同不在第一页时,需要查询单条信息，添加到第一页
          this.props.setNumSize({ myLoading: true, synergyLoading: true }); //loading
          let { result } = await $api.agenttask(
            `${res.targetId}&extend=true`,
            "get",
            "rid"
          );
          this.props.setNumSize({ myLoading: false, synergyLoading: false });
          if (result.status >= 4) {
            return intl.get("ClosedSynergy");
          }
          result.nickname = result.createrName;
          result.taskid = result.id;
          switch (
            result.tasktype //1 辅助协同  0 我的协同 2 我的任务
          ) {
            case 1:
              whichPage = "assists";
              assists.unshift(result);
              break;
            case 0:
              whichPage = "mySynergys";
              if (mySynergys.length == this.props.mySize) {
                mySynergys.pop();
              }
              mySynergys.unshift(result);
              break;
            case 2:
              whichPage = "newTaskList";
              if (newTaskList.length == this.state.newTaskListPageSize) {
                newTaskList.pop();
              }
              newTaskList.unshift(result);
              break;
          }
        }
        if (whichPage == "mySynergys") {
          this.getTipIcon(mySynergys, res, "mySynergys");
          // this.props.mySynergy({
          //   mySynergys: this.getTipIcon(mySynergys, res, "mySynergys"),
          //   sync: true,
          // });
        } else if (whichPage == "assists") {
          this.props.getAssists({
            assists: this.getTipIcon(assists, res, "assists"),
            sync: true,
          });
        }
      });
    },

    //查找在哪个页面中
    findPage(list, res) {
      for (let item of list) {
        if (res.targetId == item.rid) {
          return true;
        }
      }
    },

    init(v) {
      //协助协同总条数  注意要先查询协助协同，否则邀请专家会出现添加到我的协同的bug
      this.taskList({ num: 1, size: 100, ttype: 2 }).then(() => {
        //我的协同
        if (!v) {
          this.initMySynergy();
        }
      });
    },

    //我的协同
    async initMySynergy(data, NO) {
      if(!data) {
        //分页重置
        this[SYNERGYSPAGE]({mNum: 1, mSize: 10})
      }
      let params = {
        num: data ? data.current : 1,
        size: data ? data.pageSize : 10,
        ttype: 1,
      };
      //我的协同总条数及列表信息
      let { result } = await this.taskList(params);

      //待接受协同
      // let { result } = await $api.agenttaskList()
      // if(result.length >= 10) {
      //   this.props.mySynergy({mySynergys: result.slice(0, 10), sync: true})
      // } else if(result.length) {
      //   let mySynergys = JSON.parse(JSON.stringify(this.props.mySynergys)) //我的协同
      //   let list = [...result, ...mySynergys]
      //   if(list.length > 10) {
      //     list = list.slice(0, 10)
      //   }
      //   this.props.mySynergy({mySynergys: list, sync: true})
      // }

      if (this.changeTask.targetId) {
        //为新增协同准备
        PubSub.publish(GET_MY_SYNERGYS, this.changeTask);
        //清空新增协同数据
        this.changeTask = {};
      }

      for (let item of result) {
        //改变接受状态
        if (item.status == 0) {
          $api.status({ taskid: item.taskid, opercode: "accept" });
        }
      }
    },
  },
  mounted() {
    //登录
    this.session()
  },
  created() {
    this.dealTags();
    //查询协同
    this.init();
    //监听
    this.monitor();
  },
  beforeDestroy() {
    window.name = "";
    PubSub.clearAllSubscriptions();
    let lan = sessionStorage.getItem("lang_type");
    sessionStorage.clear();
    sessionStorage.setItem("lang_type", lan || "zh_CN");
  },
};
</script>

<style lang="scss">
// @import '~normalize.css/normalize.css';
// @import './styles/index.scss';
</style>
