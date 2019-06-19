import Api from '@/services/Api'

export default {
    getShow(title) {
        return Api().get(`show/${title}`)
    }
}