// import * as firebase from 'firebase/app'

export const state = () => ({
  isLoggedIn: false,
  isAnon: null,
  email: null,
  uid: null,
})

export const mutations = {
  login(state, user) {
    state.isLoggedIn = true
    state.isAnon = user.isAnonymous
    state.email = user.email
    state.uid = user.uid
    console.info('user logged-in', state.uid)
  },
  logout(state) {
    state.isLoggedIn = false
    state.isAnon = null
    state.email = null
    state.uid = null
    console.info('user logged-out', state.uid)
  },
}

export const actions = {
  // LOGIN ANONYMOUSLY
  // Because sometimes being unknown is freeing...
  async loginAnonymously({ dispatch }) {
    await this.$firebase.auth().signInAnonymously()
    dispatch('authenticate')
  },

  // AUTHENTICATE
  // See who is currently logged in...
  async authenticate({ commit, dispatch }) {
    await this.$firebase.auth().onAuthStateChanged(user => {
      if (user) {
        commit('login', user)
      } else {
        dispatch('logout')
      }
    })
  },

  // LOGOUT
  async logout({ commit }) {
    await this.$firebase.auth().signOut()
    commit('logout')
  },
}
