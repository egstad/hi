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
        this.$store.dispatch('user/loginByEmail', {
          email: this.email,
          password: this.password,
        })
      }
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
