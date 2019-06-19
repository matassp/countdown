import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import AuthenticationService from '@/services/AuthenticationService'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
    key: 'vuex',
    storage: window.localStorage
})

export default new Vuex.Store({
    strict: true,
    state: {
        token: null,
        user: null,
        isUserLoggedIn: false,
        subscribedShows: []
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            if (token) {
                state.isUserLoggedIn = true
            } else {
                state.isUserLoggedIn = false
            }
        },
        setUser(state, user) {
            state.user = user
        },
        setSubscribedShows(state, subscribedShows) {
            state.subscribedShows = subscribedShows
        }
    },
    actions: {
        setToken({ commit }, token) {
            commit('setToken', token)
        },
        setUser({ commit }, user) {
            commit('setUser', user)
        },
        async setSubscribedShows({ commit, state }, subscribedShows) {
            const { data } = await AuthenticationService.getList(state.user.id)
            let showIds = [];
            data.forEach(element => {
                showIds.push(element.showId);
            });
            console.log(showIds);
            commit('setSubscribedShows', showIds)
        }
    },
    plugins: [vuexLocalStorage.plugin]
})