<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld/>
    <el-button type="info" @click="changeMsg(books)">changeMsg</el-button>
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

  data(){
    return {
      books: ['水浒传','红楼梦']
    }
  },

  methods: {
    ...mapActions(['test']),

    changeMsg(books){
      for(const [index, value] of books.entries()){
        console.log(`第${index}本书是${value}`)
      }
      this.test(books)
    }
  },
}
</script>

<style lang="scss">
  @import '~normalize.css/normalize.css';
  @import './styles/index.scss';
</style>
