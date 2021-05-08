import axios from './axios'
import url from './url'
import { stringify } from 'qs'

export function taskList(data) {
  data.num = data.num - 1
  return axios({
    url: `${url.taskList}?${stringify(data)}`,
    method: 'get'
  })
}
export function session(data) {
  return axios({
    url: `${url.session}/expert`,
    method: 'post',
    data
  })
}
export function status(data) {
  return axios({
    url: url.status,
    method: 'put',
    data
  })
}
export function task(data) {
  return axios({
    url: `${url.task}?${stringify(data)}`,
    method: 'get'
  })
}
export function list(data) {
  return axios({
    url: `${url.list}?${stringify(data)}`,
    method: 'get'
  })
}
export function members(data, method) {
  return axios({
    url: `${url.members}?${stringify(data)}`,
    method: method || 'get',
    data
  })
}