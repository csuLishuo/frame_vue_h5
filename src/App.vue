<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
  },
  mounted () {
  }
}
</script>
<style type="text/scss" lang="scss">
  * {
    margin: 0;
    padding: 0;
  }
  #app{
    height:100%;
    width:100%;
  }
</style>
