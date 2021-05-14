<template>
  <el-dialog title="环境配置" :visible.sync="dialogVisible" width="40%">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="环境：">
        <el-select style="width: 100%" value-key="appKey" v-model="form.env" placeholder="请选择活动区域">
          <el-option v-for="item of envs" :key="item.label" :label="item.label" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="token：">
        <el-input type="textarea" placeholder="token相当于登录的账户，需要找马克伟要" :rows="5" v-model="form.token"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "config",
  data() {
    return {
      dialogVisible: false,
      form: {
        env: {},
        token: ''
      },
      envs: [
        {
          label: '252',
          baseUrl: 'https://192.168.11.252',
          appKey: '000001'
        },
        {
          label: '小拿',
          baseUrl: 'https://demo.holoview-lab.com',
          appKey: '000001'
        },
      ]
    };
  },
  methods: {
    config(flag) {
      this.dialogVisible = flag;
    },
    confirm() {
      const data = {...this.form.env, token: this.form.token}
      localStorage.setItem('holoview-config', JSON.stringify(data))
      this.dialogVisible = false
      window.location.reload()
    }
  },
  created(){
    const config = localStorage.getItem('holoview-config')
    if(config) {
      this.form.token = JSON.parse(config).token
      const data = {...JSON.parse(config)}
      delete data.token
      this.form.env = data
    }
  }
};
</script>
