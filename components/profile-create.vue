<template>
  <section>
    <!-- login user -->
    <div>
      <form @submit.prevent="validate">
        <div>
          <label for="email">email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            ref="email"
            placeholder="name@emailaddress.com"
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
        <button>create profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'
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
        this.registerAnonymous()
      }
    },
    async registerAnonymous() {
      // Create the email and password credential to upgrade the anon user
      const credential = await firebase.auth.EmailAuthProvider.credential(
        this.email,
        this.password
      )

      // 2. Links the credential to the currently signed in user the anon user
      await this.$firebase
        .auth()
        .currentUser.linkWithCredential(credential)
        .then(
          user => {
            this.$store.commit('user/login', {
              email: this.email,
              password: this.password,
            })
          },
          error => {
            this.error = error
          }
        )
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
