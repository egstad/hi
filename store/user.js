export const state = () => ({
  isLoggedIn: false,
  isAnon: false,
  email: null,
  uid: null,
})

export const mutations = {
  login(state, user) {
    state.isLoggedIn = true
    state.isAnon = user.isAnonymous
    state.email = user.email
    state.uid = user.uid
    console.table('user updated', state)
  },
  logout(state) {
    state.isLoggedIn = false
    state.isAnon = null
    state.email = null
    state.uid = null
    console.log('user logged-out', state)
  },
}

export const actions = {
  async loginByEmail({ commit }, payload) {
    try {
      await this.$firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(data => {
          commit('login', data.user)
        })
    } catch (error) {
      window.$app.$emit('login/error', error)
    }
  },
  async loginAnonymously({ dispatch }) {
    await this.$firebase.auth().signInAnonymously()
    dispatch('authenticate')
  },
  async authenticate({ commit }) {
    await this.$firebase.auth().onAuthStateChanged(user => {
      if (user) {
        commit('login', user)
      } else {
        commit('logout')
      }
    })
  },
}
