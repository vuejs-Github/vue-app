import axios from './axios'
import url from './url'
import { stringify } from 'qs'

export function taskList(data) {
  data.num = data.num - 1
  return axios({
    url: `${url.taskList}?${stringify(data)}`,
    method: 'get',
    data
  })
}

export function session(data) {
  return axios({
    url: `${url.session}/expert`,
    method: 'post',
    data
  })
}