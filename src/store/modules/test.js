import { TEST } from '../constants/test'
import { testPort } from 'api/test'

const test = {
    state: {
        msg: 'Welcome to Your Vue.js App'
    },

    mutations: {
        [TEST](state, data){
            state.msg = data
        }
    },

    actions: {
        test({commit}, data){
            return testPort(data).then(res => {
                commit(TEST, res)
                return res
            })
        }
    },

    getters: {
        test: state => {
            return state.msg
        }
    }
}

export default test