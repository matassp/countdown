import Api from '@/services/Api'

export default {
    register(credentials) {
        return Api().post('register', credentials)
    },
    login(credentials) {
        return Api().post('login', credentials)
    },
    subscribe(show) {
        return Api().post('subscribe', show)
    },
    getList(userId) {
        return Api().get(`list/${userId}`)
    },
    unsubscribe(data) {
        return Api().post('unsubscribe', data)
    }
}