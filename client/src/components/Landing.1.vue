<template>
  <div class="section">
    <main-panel>
      <template #top>
        <b-field>
          <b-autocomplete
            custom-class="no-border"
            :data="data"
            placeholder="e.g. Game of Thrones"
            field="title"
            :loading="isFetching"
            @typing="getAsyncData"
            @select="option => getDetailedData(option)"
            ref="autocomplete"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-left">
                  <img
                    width="32"
                    :src="`https://image.tmdb.org/t/p/w500/${props.option.poster_path}`"
                  >
                </div>
                <div class="media-content">
                  {{ props.option.name }}
                  <br>
                  <small>
                    Origin country
                    <b>{{ props.option.origin_country[0] ? props.option.origin_country[0] : 'N/A' }}</b>
                  </small>
                </div>
              </div>
            </template>
          </b-autocomplete>
        </b-field>
        <!-- <b-field>
          <b-input
            custom-class="no-border"
            v-model="query"
            v-on:keyup.native.enter="getShow"
            placeholder="Search Shows"
            expanded
          ></b-input>
          <p class="control"></p>
        </b-field>-->
      </template>
      <template #middle show="true">
        <transition name="fade">
          <div v-if="selected" class="tile is-child box top-box data-box">
            <!-- <p v-text="isFetching ? 'Loading...' : show"></p> -->
            <div class="columns">
              <div class="column">
                <img
                  width="80%"
                  :src="`https://image.tmdb.org/t/p/w500/${selected.poster_path}`"
                  alt
                >
              </div>
              <div class="column data">
                <h2>{{selected.name}}</h2>
                <br>
                <p>
                  Status:
                  <b
                    v-if="selected.status == 'Ended' || selected.status == 'Canceled'"
                    style="color:#ff3860"
                  >{{selected.status}}</b>
                  <b v-else style="color:#23d160">{{selected.status}}</b>
                </p>
                <p>
                  Next Episode:
                  <b>{{selected.next_episode_to_air ? selected.next_episode_to_air.air_date : 'Unknown'}}</b>
                </p>
                <br>
                <countdown :time="duration" v-if="selected.next_episode_to_air">
                  <template slot-scope="props">
                    <div class="columns is-mobile">
                      <div class="column countdown first">
                        <b>{{ props.days }}</b>
                        <span class="label">days</span>
                      </div>
                      <div class="column countdown">
                        <b>{{ props.hours }}</b>
                        <span class="label">hours</span>
                      </div>
                      <div class="column countdown">
                        <b>{{ props.minutes }}</b>
                        <span class="label">minutes</span>
                      </div>
                      <div class="column countdown">
                        <b>{{ props.seconds }}</b>
                        <span class="label">seconds</span>
                      </div>
                    </div>
                  </template>
                </countdown>
                <br>
                <b-button
                  @click="subscribe(selected)"
                  type="is-dark"
                  v-if="$store.state.isUserLoggedIn && !$store.state.subscribedShows.includes(selected.id)"
                >Add to my list</b-button>
                <b-button
                  @click="remove(selected.id)"
                  type="is-dark"
                  v-else-if="$store.state.isUserLoggedIn"
                >Remove from my list</b-button>
              </div>
            </div>
          </div>
        </transition>
      </template>
      <template #bottom>
        <div
          class="tile is-6 is-child box bottom-box login-box"
          @click="navigateTo({name: 'Login'})"
          v-if="!$store.state.isUserLoggedIn"
        >
          <p>Login</p>
        </div>
        <div class="tile is-6 is-child box bottom-box login-box" @click="logOut" v-else>
          <p>Log out</p>
        </div>
        <div
          class="tile is-6 is-child box bottom-box register-box"
          @click="navigateTo({name: 'Register'})"
          v-if="!$store.state.isUserLoggedIn"
        >
          <p>Register</p>
        </div>
        <div
          class="tile is-6 is-child box bottom-box register-box"
          @click="navigateTo({name: 'MyList'})"
          v-else
        >
          <p>My list</p>
        </div>
      </template>
    </main-panel>
  </div>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
import ShowRetrieval from "@/services/ShowRetrieval";
import Footer from "@/components/Footer";
import MainPanel from "@/components/MainPanel";
import { Snackbar } from "buefy/dist/components/snackbar";
import debounce from "lodash/debounce";
import TimeService from "@/services/TimeService";
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
      isFetchingSuggestions: false,
      duration: 0
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
    getAsyncData: function(name) {
      if (!name.length) {
        this.data = [];
        return;
      }
      this.isFetchingSuggestions = true;
      axios
        .get(
          `https://api.themoviedb.org/3/search/tv?api_key=7f7bd921fea0a399b29575823572435c&query=${name}`
        )
        .then(({ data }) => {
          this.data = [];
          data.results.forEach(item => {
            if (item.poster_path) return this.data.push(item);
          });
        })
        .catch(error => {
          this.data = [];
          throw error;
        })
        .finally(() => {
          this.isFetchingSuggestions = false;
        });
    },
    async getDetailedData(option) {
      const detailedData = await axios.get(
        `https://api.themoviedb.org/3/tv/${
          option.id
        }?api_key=7f7bd921fea0a399b29575823572435c`
      );
      const nextEpisode = detailedData.data.next_episode_to_air;
      if (nextEpisode) {
        const nextEpisodeDate = nextEpisode.air_date;
        this.duration = TimeService.getMillis(nextEpisodeDate);
      }
      this.selected = detailedData.data;
    },
    logOut() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.navigateTo({ name: "Landing" });
    },
    async subscribe(selected) {
      try {
        const userId = this.$store.state.user.id;
        await AuthenticationService.subscribe({
          title: selected.name,
          showId: selected.id,
          userId: userId
        });
        this.$store.dispatch("setSubscribedShows");
        Snackbar.open("Added");
      } catch (e) {
        console.log("Cant subscribe");
      }
    },
    async remove(showId) {
      try {
        console.log(showId);
        const userId = this.$store.state.user.id;
        await AuthenticationService.unsubscribe({
          showId: showId,
          userId: userId
        });
        this.$store.dispatch("setSubscribedShows");
        Snackbar.open("Removed");
      } catch (e) {}
    }
  },
  mounted() {
    this.$store.dispatch("setSubscribedShows");
    this.$refs.autocomplete.focus();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: bold;
  font-size: 48px;
}
h2 {
  font-weight: bold;
  font-size: 24px;
}
.section {
  padding-top: 0;
}
.container {
  max-width: 600px;
}
.no-bottom-padding {
  padding-bottom: 0 !important;
}
.no-top-padding {
  padding-top: 0 !important;
}
.bottom-box {
  border-radius: 0 !important;
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
img {
  border-radius: 5px;
}
.data {
  text-align: left;
}
.label {
  font-size: 0.7em;
}
.countdown {
  max-width: 55px;
}
</style>
