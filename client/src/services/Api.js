import axios from 'axios'

export default () => {
    return axios.create({
        baseURL: 'http://165.22.72.45:8081/'
    })
}
