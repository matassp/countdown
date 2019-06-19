<template>
  <div class="container">
    <a @click="navigateTo({name: 'Landing'})">
      <h1>Countdown</h1>
    </a>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-vertical">
        <div class="tile is-parent no-bottom-padding">
          <div class="tile is-child box top-box">
            <slot name="top"></slot>
          </div>
        </div>
        <div class="tile is-parent no-bottom-padding no-top-padding">
          <slot name="middle"></slot>
        </div>
        <div class="tile is-parent no-top-padding">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Footer from "@/components/Footer";
export default {
  props: ["show"],
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  },
  components: {
    Footer
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
