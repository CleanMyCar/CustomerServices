<template src="./Helloworld.template.html">  
</template>

<script>
import axios from 'axios';

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "This module is rendering through router"
    };
  },
  mounted() {
    console.log("Hello world initiated");

    // axios
    //   .post("http://192.168.1.9:1339/api", {})
    //   .then(response => {
    //     // JSON responses are automatically parsed.
    //     this.posts = response.data;
    //   })
    //   .catch(e => {
    //     this.errors.push(e);
    //   });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
