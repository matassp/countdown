<template>
  <main-panel>
    <template #top>
      <div class="login">
        <h2>Log in</h2>
      </div>
    </template>

    <template #middle>
      <div class="tile is-child box top-box data-box">
        <section>
          <b-field label="Email" :type="email_error ? 'is-danger' : 'email'" :message="email_error">
            <b-input v-model="email" maxlength="30"></b-input>
          </b-field>

          <b-field
            label="Password"
            :type="password_error ? 'is-warning' : 'password'"
            :message="password_error"
          >
            <b-input type="password" v-model="password" maxlength="32" password-reveal></b-input>
          </b-field>

          <b-button type="is-light" @click="login">Login</b-button>
        </section>
      </div>
    </template>

    <template #bottom>
      <div class="tile is-6 is-child box bottom-box login-box" @click="navigateTo({name: 'Login'})">
        <p>Log in</p>
      </div>
      <div
        class="tile is-6 is-child box bottom-box register-box"
        @click="navigateTo({name: 'Register'})"
      >
        <p>Register</p>
      </div>
    </template>
  </main-panel>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
import MainPanel from "@/components/MainPanel";
export default {
  components: {
    MainPanel
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
    async login() {
      this.resetErrors();
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        });
        this.resetErrors();
        this.getSubscribedShows(response.data.user.id);
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
        this.navigateTo({ name: "MyList" });
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
    },
    async getSubscribedShows(userId) {
      try {
        const response = await AuthenticationService.getList(userId);
        console.log(response.data);
        let subscribedShows = [];
        response.data.forEach(element => {
          subscribedShows.push(element.showId);
        });
        console.log(subscribedShows);
      } catch (error) {}
    }
  }
};
</script>

<style scoped>
.login,
h2 {
  text-align: center;
  color: #363636;
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
