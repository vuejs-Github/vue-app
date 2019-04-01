import fetch from './fetch'
import url from './url'

export function testPort(data) {
    return fetch({
      url: url.test,
      method: 'post',
      data: data
    })
  }