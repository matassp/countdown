<template>
  <main-panel>
    <template #top>
      <h2>My list</h2>
    </template>

    <template #middle>
      <transition name="fade">
        <div class="tile is-child box top-box data-box" v-if="!isFetchingList">
          <div v-for="show in list" class="columns">
            <div class="column">
              <img width="80%" :src="`https://image.tmdb.org/t/p/w500/${show.poster_path}`" alt>
            </div>
            <div class="column data">
              <h2>{{show.name}}</h2>
              <br>
              <p>
                Status:
                <b
                  v-if="show.status == 'Ended' || show.status == 'Canceled'"
                  style="color:#ff3860"
                >{{show.status}}</b>
                <b v-else style="color:#23d160">{{show.status}}</b>
              </p>
              <p>
                Next Episode:
                <b>{{show.next_episode_to_air ? show.next_episode_to_air.air_date : 'N/A'}}</b>
              </p>
              <br>
              <countdown :time="show.duration" v-if="show.next_episode_to_air">
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
              <b-button @click="remove(show.id)" type="is-dark">Remove</b-button>
              <br>
              <br>
            </div>
          </div>
        </div>
      </transition>
    </template>

    <template #bottom>
      <div class="tile is-6 is-child box bottom-box login-box" @click="logOut">
        <p>Log out</p>
      </div>
      <div
        class="tile is-6 is-child box bottom-box register-box"
        @click="navigateTo({name: 'Landing'})"
      >
        <p>Add shows</p>
      </div>
    </template>
  </main-panel>
</template>

<script>
import MainPanel from "@/components/MainPanel";
import AuthenticationService from "@/services/AuthenticationService";
import { Snackbar } from "buefy/dist/components/snackbar";
import { debounce } from "debounce";
import TimeService from "@/services/TimeService";
import Vue from "vue";

export default {
  components: {
    MainPanel
  },
  data() {
    return {
      list: [],
      isFetchingList: false
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    logOut() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.navigateTo({ name: "Landing" });
    },
    async getList() {
      this.isFetchingList = true;
      try {
        const userId = this.$store.state.user.id;
        const response = await AuthenticationService.getList(userId);
        this.list = response.data;

        let promises = [];
        this.list.forEach(show => {
          const detailedData = axios.get(
            `https://api.themoviedb.org/3/tv/${
              show.showId
            }?api_key=7f7bd921fea0a399b29575823572435c`
          );
          promises.push(detailedData);
        });
        Promise.all(promises).then(values => {
          let data = [];
          values.forEach(element => {
            // GET MILLISECONDS
            const nextEpisode = element.data.next_episode_to_air;
            if (nextEpisode) {
              const nextEpisodeDate = nextEpisode.air_date;
              element.data.duration = TimeService.getMillis(nextEpisodeDate);
            }
            data.push(element.data);
          });
          this.list = data;
        });

        this.isFetchingList = false;
      } catch (e) {}
    },
    async remove(showId) {
      try {
        const userId = this.$store.state.user.id;
        console.log(showId);
        console.log(userId);
        await AuthenticationService.unsubscribe({
          showId: showId,
          userId: userId
        });
        this.getList();
        Snackbar.open("Removed");
      } catch (e) {}
    }
  },
  beforeMount() {
    this.getList();
  }
};
</script>

<style scoped>
h1 {
  font-weight: bold;
  font-size: 48px;
}
h2 {
  font-weight: bold;
  font-size: 24px;
}
.data-box {
  border-radius: 0;
}
img {
  border-radius: 5px;
}
.data {
  text-align: left;
}
body {
  background: #004d40;
  text-align: center;
  padding: 50px 0;
}
body h1 {
  font-size: 26px;
  color: #fff;
}
.label {
  font-size: 0.7em;
}
.countdown {
  max-width: 55px;
}
</style>
