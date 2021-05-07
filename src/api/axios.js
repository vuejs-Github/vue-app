import axios from 'axios';
import { Message, Loading } from 'element-ui'
import codes from '@/assets/js/codes'

const instance = axios.create({
  baseURL: '',
  timeout: 1000 * 60,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

//Interceptors
let loadingService
// Add a request interceptor
instance.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiAiMDEwMDAxMTI3Mzg5MzkxIiwgInRlbmFudGlkIjogIjE2MzE1ODk5NDAxMjA4MjY0IiwgInVzZXJuYW1lIjogIm1hcmtfMyIsICJpZGVudGl0eSI6IDEsICJyb2xlIjogIjEiLCAiZGV2aWNlIjogIjMwMSIsICJob3N0IjogImFhIn0.23Ddi6a1JhN7RzZ2CZQ9mzriKIizb83DvNbdsB7D7AM'
  // Do something before request is sent
  loadingService = Loading.service({
    lock: true,
    text: 'Loading',
  })
  return config
}, error => {
  loadingService.close()
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(response => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  loadingService.close()
  return response.data;
}, error => {  
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if(error.response) {
    Message({
      type: 'error',
      showClose: true,
      message: codes.errorCodes[error.response.status]
    })
  }
  loadingService.close()
  return Promise.reject(error);
});

export default instance;