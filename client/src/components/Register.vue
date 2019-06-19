<template>
  <div class="container">
    <a href="/">
      <h1>Countdown</h1>
    </a>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical">
        <div class="tile is-parent no-bottom-padding">
          <div class="tile is-child box top-box">
            <b-field>
              <b-input
                custom-class="no-border"
                v-model="query"
                v-on:keyup.native.enter="getShow"
                placeholder="Search Shows"
                expanded
              ></b-input>
              <p class="control"></p>
            </b-field>
          </div>
        </div>
        <div class="tile is-parent no-bottom-padding no-top-padding">
          <div class="tile is-child box top-box data-box">
            <section>
              <b-field
                label="Email"
                :type="email_error ? 'is-danger' : 'email'"
                :message="email_error"
              >
                <b-input v-model="email" maxlength="30"></b-input>
              </b-field>

              <b-field
                label="Password"
                :type="password_error ? 'is-warning' : 'password'"
                :message="password_error"
              >
                <b-input type="password" v-model="password" maxlength="32" password-reveal></b-input>
              </b-field>

              <b-button type="is-light" @click="register">Submit</b-button>
            </section>
          </div>
        </div>
        <div class="tile is-parent no-top-padding">
          <div
            class="tile is-6 is-child box bottom-box login-box"
            @click="navigateTo({name: 'Login'})"
          >
            <p>Login</p>
          </div>
          <div
            class="tile is-6 is-child box bottom-box register-box"
            @click="navigateTo({name: 'Register'})"
          >
            <p>Register</p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
import Footer from "@/components/Footer";
export default {
  components: {
    Footer
  },
  data() {
    return {
      email: "",
      password: "",
      email_error: "",
      password_error: ""
    };
  },
  methods: {
    async register() {
      this.resetErrors();
      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password
        });
        this.resetErrors();
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
      } catch (e) {
        const error = e.response.data.error;
        if (error.startsWith("Password")) this.password_error = error;
        else this.email_error = error;
      }
    },
    resetErrors() {
      this.email_error = null;
      this.password_error = null;
    },
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
h1 {
  font-weight: bold;
  font-size: 48px;
}
.section {
  padding-top: 0;
}
.container {
  max-width: 600px;
}
.no-bottom-padding {
  padding-bottom: 0;
}
.no-top-padding {
  padding-top: 0;
}
.bottom-box {
  border-radius: 0;
  box-shadow: 0 !important;
}
.top-box {
  border-radius: 5px 5px 0 0;
  cursor: text;
}
@media only screen and (max-width: 768px) {
  .register-box {
    border-radius: 0 0 5px 5px;
  }
}
@media only screen and (min-width: 768px) {
  .register-box {
    border-radius: 0 0 5px 0;
  }
  .login-box {
    border-radius: 0 0 0 5px;
  }
}
.data-box {
  border-radius: 0;
}
section {
  text-align: left;
}
.login-box:hover,
.register-box:hover {
  cursor: pointer;
  color: #7957d5;
}
</style>
