import { GETASSISTS, GETSYNERGYS, SYNERGYSPAGE } from '../constants/test'
import { taskList } from '@/api/test'

const test = {
  state: {
    assists: {
      result: []
    },
    synergys: {
      result: []
    },
    synergysPage: {
      mNum: 1,
      mSize: 10
    }
  },

  mutations: {
    [GETASSISTS](state, data) {
      state.assists = data
    },
    [GETSYNERGYS](state, data) {
      state.synergys = data
    },
    [SYNERGYSPAGE](state, data) {
      state.synergysPage = {...state.synergysPage, ...data}
    }
  },

  actions: {
    taskList({ commit }, data) {
      return taskList(data).then(res => {
        if(data.ttype == 2) {
          commit(GETASSISTS, res)
        } else {
          commit(GETSYNERGYS, res)
        }
        return res
      })
    }
  },

  getters: {
    assists: state => {
      return state.assists
    },
    synergys: state => {
      return state.synergys
    },
    synergysPage: state => {
      return state.synergysPage
    }
  }
}

export default test