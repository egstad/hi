<template>
  <section>
    <!-- login user -->
    <div>
      <form @submit.prevent="validate">
        <div>
          <label for="login-email">email</label>
          <input
            v-model="email"
            type="email"
            id="login-email"
            ref="email"
            placeholder="name@emailaddress.com"
            autocomplete="username"
          />
        </div>
        <div>
          <label for="login-password">password</label>
          <input
            v-model="password"
            type="password"
            id="login-password"
            ref="password"
            autocomplete="current-password"
          />
        </div>
        <div v-if="error">{{ error.message }}</div>
        <button>login</button>
      </form>

      <hr />
      <button @click="$store.dispatch('user/loginAnonymously')">
        login anonymously
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
        // SIGN IN WITH EMAIL
        this.loginByEmail(this.email, this.password)
      }
    },
    async loginByEmail(email, password) {
      try {
        await this.$firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(data => {
            this.$store.commit('user/login', data.user)
          })
      } catch (error) {
        console.log('loginbyemail error: ', error)
        this.error = error
      }
    },
    async resetPassword() {
      await console.log('reset')
    },
  },
}
</script>

<style lang="scss" scoped>
label {
  display: block;
}

input {
  width: 100%;
  margin-bottom: 20px;
  appearance: none;
  border: 1px solid black;
  border-radius: 1px;
  padding: 10px;
  font-size: 44px;
}
</style>
