<template>
  <div>
    <main>
      <h1>hi,</h1>
      <login />
      <post v-if="$store.state.user.isLoggedIn" />
      <nuxt />
    </main>
  </div>
</template>

<script>
import login from '@/components/login'
import post from '@/components/post'
export default {
  components: {
    login,
    post,
  },
  beforeCreate() {
    // user already logged in?
    this.$firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit('user/login', user)
      } else {
        this.$store.commit('user/logout')
      }
    })
  },
}
</script>
