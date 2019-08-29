<template>
  <div class="pay-container">
    测试页
    <div>
      <test></test>
    </div>
  </div>
</template>

<script>
import test from '../components/test'
export default {
  name: 'testPage',
  components: {
    test
  },
  data () {
    return {
      orderNo: ''
    }
  },
  computed: {
  },
  methods: {
  },
  beforeMount () {
  }
}
</script>

<style lang="scss">
  @import "../assets/css/app";
  body,html{
      height:100%;
      width:100%;
  }
  .pay-container{
    background-color: #F3F3F3;
    width:100%;
  }
</style>
