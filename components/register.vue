<template>
  <div v-if="!$store.state.user.isLoggedIn">
    <form @submit.prevent="registerUser">
      <p>let's get you an account</p>
      <div>
        <label for="email">email</label>
        <input v-model="email" type="email" id="email" />
      </div>
      <div>
        <label for="password">password</label>
        <input v-model="password" type="password" id="password" />
      </div>
      <div v-if="error">{{ error.message }}</div>
      <button>Register</button>
    </form>
  </div>
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
    async registerUser() {
      await this.$firebase.auth().signInAnonymously()
    },
  },
}
</script>
