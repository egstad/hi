<template>
  <section>
    <!-- login user -->
    <div>
      <form @submit.prevent="validate">
        <div>
          <TextInput
            ref="email"
            v-model="email"
            label="email address"
            type="email"
            placeholder="name@address.com"
            theme="light"
            autocomplete="email"
          />
        </div>
        <div>
          <TextInput
            ref="password"
            v-model="password"
            label="password"
            type="password"
            placeholder="••••••"
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
import TextInput from '@/components/molecules/input'

export default {
  components: {
    TextInput,
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      testInput: '',
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
        this.email !== '' && this.$refs.email.$refs.input.checkValidity()

      const passwordIsValid =
        this.password !== '' && this.$refs.password.$refs.input.checkValidity()

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
