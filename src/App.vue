<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld/>
    <el-button type="info" @click="changeMsg('is my-project')">changeMsg</el-button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { mapActions } from 'vuex'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  methods: {
    ...mapActions(['test']),

    changeMsg(msg){
      this.test(msg)
    }
  }
}
</script>

<style lang="scss">
  @import '~normalize.css/normalize.css';
  @import './styles/index.scss';
</style>
