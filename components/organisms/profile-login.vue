<template>
  <section>
    <!-- login user -->
    <div>
      <form @submit.prevent="validate" id="login">
        <div>
          <FormInput
            ref="email"
            v-model="email"
            label="email address"
            type="email"
            placeholder="name@address.com"
            autocomplete="email"
          />
        </div>
        <div>
          <FormInput
            ref="password"
            v-model="password"
            label="password"
            type="password"
            placeholder="••••••"
            autocomplete="current-password"
          />
        </div>
        <div v-if="error">{{ error.message }}</div>
      </form>
      <div class="buttons">
        <FormSubmit @click.native="validate" form="login" text="login" />
        <FormSubmit
          text="stay anon"
          @click.native="$store.dispatch('user/loginAnonymously')"
        />
      </div>
    </div>
  </section>
</template>

<script>
import FormInput from '@/components/molecules/form-input'
import FormSubmit from '@/components/molecules/form-submit'

export default {
  components: {
    FormInput,
    FormSubmit,
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
/deep/.button {
  color: #92877f;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4px;

  @media (min-width: 700px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1400px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 1600px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
