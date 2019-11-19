<template>
  <!-- <div class="application"> -->
  <section id="page-content">
    <!-- Header -->
    <nav id="custom-nav-bar" class="navbar fixed-top">
      <div id="headerMenu"></div>
      <div id="leftMenuPanel"></div>
    </nav>

    <div class="mainContent">
      <section class="appcontent container-fluid">
        <router-view></router-view>
      </section>
    </div>
  </section>

  <!-- </div> -->
</template>

<script>
// import "ag-grid-enterprise";
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<style lang="scss">
/* @import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css"; */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* // margin-top: 60px; */
}

h1,
h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
