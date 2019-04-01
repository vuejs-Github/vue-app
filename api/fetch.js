import axios from 'axios'

// 创建axios实例
const options = {
    baseURL: "http://192.168.36.213:19000",
    timeout: 300000
}
const service = axios.create(options)
// request拦截器
service
    .interceptors
    .request
    
    .use(request => {
        return request
    }, error => {
        // Do something with request error
        Promise.reject(error)
    })

// respone拦截器
service
    .interceptors
    .response
    .use(response => {
        return response.data
    }, error => {
        return Promise.reject(error)
    })

export default service
