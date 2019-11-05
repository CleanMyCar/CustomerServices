<template src="./login.template.html">  
</template>
<style src="../../assets/css/login.css"></style>
<script>
//import './assets/css/pure-0.6.0/pure-min.css'
export default {
  name: "Login",
  data() {
    return {
      msg: "This is the Login Page",
      loginParams: {
        ClientCode: "DeeDee",
        UserName: "User1",
        Password: "User1"
      }
    };
  },
  methods: {
    login() {
      let self = this;
      var loginParams = {
        requestParams: {
          APIReg: "10003",
          UserName: this.loginParams.UserName,
          ClientCode: this.loginParams.ClientCode,
          Password: this.loginParams.Password
        },
        systemParams: {
          Source: "Web",
          SourceId: window.location.hostname
        }
      };
      $.ajax({
        dataType: "json",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "http://192.168.1.9:1339/api",
        data: JSON.stringify(loginParams),
        success: function(response) {
          console.log(response);
          if (response.length > 0) {
            window.localStorage.setItem("rttoken", response[0]["token"]);
            //window.location.href = "/login.html";
            self.$router.push("hello");
          } else {
            if (response.errno) {
              self.errLoginMsg("Server Error: " + response.errno);
            } else self.errLoginMsg("Invalid credentials");
          }
        },
        error: function(d) {
          console.log(d);
        }
      });
    }
  },
  mounted() {
    console.log("Login page initiated");
  }
};
</script>