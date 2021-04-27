import fetch from './axios'
import url from './url'
import { stringify } from 'qs'

export function taskList(data) {
  data.num = data.num - 1
  return fetch({
    url: `${url.taskList}?${stringify(data)}`,
    method: 'get',
    data
  })
}