<template>
  <div class="hello">
    <h1>{{ test }}</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',

  computed: {
    ...mapGetters(['assists'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
