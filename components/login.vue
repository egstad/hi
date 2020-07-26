<template>
  <section class="user">
    <!-- login user -->
    <div v-if="!$store.state.user.isLoggedIn">
      <form @submit.prevent="validate">
        <p>let's get you signed in</p>
        <div>
          <label for="email">email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            ref="email"
            autocomplete="username"
          />
        </div>
        <div>
          <label for="password">password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            ref="password"
            autocomplete="current-password"
          />
        </div>
        <div v-if="error">{{ error.message }}</div>
        <button>Login</button>
      </form>
      <button @click="$store.dispatch('user/loginAnonymously')">
        Login Anonymously
      </button>
    </div>
  </section>
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
  beforeCreate() {
    this.$app.$on('login/error', this.updateError)
  },
  beforeDestroy() {
    // this.$app.$off('login/error', this.updateError)
  },
  methods: {
    updateError(err) {
      this.error = err.message
    },
    validate() {
      const emailIsValid =
        this.$refs.email.value !== '' && this.$refs.email.checkValidity()
      const passwordIsValid =
        this.$refs.password.value !== '' && this.$refs.password.checkValidity()

      if (emailIsValid && passwordIsValid) {
        this.$store.dispatch('user/loginByEmail', {
          email: this.email,
          password: this.password,
        })
      }

      // if (!passwordIsValid) {
      //   this.$refs.password.setCustomValidity('wrong password')
      // }
    },
  },
}
</script>

<style lang="scss" scoped>
.user {
  border: 2px solid black;
}
</style>
