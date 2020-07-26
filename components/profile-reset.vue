<template>
  <section>
    <!--
      logged-in with email
      no need to fill in an email if we already have it...
     -->
    <div v-if="!$store.state.user.email">
      <form @submit.prevent="validate">
        <div>
          <label for="reset-email">email</label>
          <input
            v-model="email"
            type="email"
            id="reset-email"
            ref="email"
            placeholder="name@emailaddress.com"
            autocomplete="username"
          />
        </div>
        <div v-if="error && !success">{{ error.message }}</div>
        <div v-if="success">{{ success }}</div>
        <button>reset password</button>
      </form>
    </div>

    <!-- logged in, but wants to reset password -->
    <div v-else>
      <div v-if="error && !success">{{ error.message }}</div>
      <div v-if="success">{{ success }}</div>
      <button @click="resetPassword($store.state.user.email)">
        reset password
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      error: '',
      success: '',
    }
  },
  methods: {
    validate() {
      const emailIsValid =
        this.$refs.email.value !== '' && this.$refs.email.checkValidity()

      if (emailIsValid) {
        this.resetPassword(this.email)
      } else if (this.$refs.email.value !== '') {
        this.error = { message: 'plz insert ur email' }
        this.succes = null
      }
    },
    async resetPassword(email) {
      await this.$firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          this.error = null
          this.success = 'just sent u a reset email'
        })
        .catch(error => {
          this.error = error
        })
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
