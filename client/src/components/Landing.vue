<template>
  <div class="section">
    <!-- <div class="container">
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
            <transition name="fade">
              <div v-if="isRequested" class="tile is-child box top-box data-box">
                <transition name="fade">
                  <p v-text="isFetching ? 'Loading...' : show"></p>
                </transition>
              </div>
            </transition>
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
    </div>-->
    <main-panel>
      <template #top>
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
      </template>
      <template #middle show="true">
        <transition name="fade">
          <div v-if="isRequested" class="tile is-child box top-box data-box">
            <transition name="fade">
              <p v-text="isFetching ? 'Loading...' : show"></p>
            </transition>
          </div>
        </transition>
      </template>
      <template #bottom>
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
      </template>
    </main-panel>
  </div>
</template>

<script>
import ShowRetrieval from "@/services/ShowRetrieval";
import Footer from "@/components/Footer";
import MainPanel from "@/components/MainPanel";
import debounce from 'lodash/debounce';
export default {
  name: "Landing",
  components: {
    Footer,
    MainPanel
  },
  data() {
    return {
      data: [],
      selected: null,
      query: "",
      show: null,
      isFetching: false,
      isRequested: false,
      isFetchingSuggestions: false
    };
  },
  methods: {
    async getShow() {
      this.isFetching = true;
      this.isRequested = true;
      try {
        const res = await ShowRetrieval.getShow(this.query);
        this.error = "success";
        this.show = res.data;
        this.isFetching = false;
        this.query = res.data.name;
        return res.data;
      } catch (e) {
        this.error = e.response.data.error;
      }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    getAsyncData: debounce(function (name) {
                if (!name.length) {
                    this.data = []
                    return
                }
                this.isFetchingSuggestions = true
                this.$http.get(`https://api.themoviedb.org/3/search/movie?api_key=bb6f51bef07465653c3e553d6ab161a8&query=${name}`)
                    .then(({ data }) => {
                        this.data = []
                        data.results.forEach((item) => this.data.push(item))
                    })
                    .catch((error) => {
                        this.data = []
                        throw error
                    })
                    .finally(() => {
                        this.isFetchingSuggestions = false
                    })
            }, 500)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.register-box,
.login-box {
  cursor: pointer;
  color: #7957d5;
}
</style>
