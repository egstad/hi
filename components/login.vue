<template>
  <div v-if="!$store.state.user.isLoggedIn">
    <form @submit.prevent="loginUser">
      <p>let's get you signed in</p>
      <div>
        <label for="email">email</label>
        <input v-model="email" type="email" id="email" />
      </div>
      <div>
        <label for="password">password</label>
        <input v-model="password" type="password" id="password" />
      </div>
      <div v-if="error">{{ error.message }}</div>
      <button>Login</button>
    </form>
    <button @click="loginAnon">Login Anonymously</button>
  </div>

  <button v-else @click="logout">
    Logout
  </button>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    }
  },
  methods: {
    async loginAnon() {
      await this.$firebase.auth().signInAnonymously()
    },
    async loginUser() {
      try {
        await this.$firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(data => {
            this.$store.commit('user/login', data.user)
            // this.$router.push('/secret')
          })
      } catch (error) {
        this.error = error
      }
    },
    async logout() {
      try {
        await this.$firebase
          .auth()
          .signOut()
          .then(() => {
            this.$store.commit('user/logout')
          })
      } catch (error) {
        console.warn(error)
      }
    },
  },
}
</script>
