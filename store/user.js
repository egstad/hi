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
  },
  logout(state) {
    state.isLoggedIn = false
    state.isAnon = null
    state.email = null
    state.uid = null
  },
}
