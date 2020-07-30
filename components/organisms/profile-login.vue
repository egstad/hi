<template>
  <section>
    <header class="text-wrap">
      <h2 class="t-headline">login</h2>
    </header>
    <!-- login user -->
    <form @submit.prevent="validate" id="login">
      <FormInput
        ref="email"
        v-model="email"
        label="email address"
        type="email"
        placeholder="name@address.com"
        autocomplete="email"
        @input="onInput"
        @keydown.native.space.prevent
      />
      <FormInput
        ref="password"
        v-model="password"
        label="password"
        type="password"
        placeholder="••••••"
        autocomplete="current-password"
        @input="onInput"
      />
      <div v-if="error">{{ error.message }}</div>
    </form>

    <div class="contextual buttons" :class="{ 'is-expanded': showButtons }">
      <FormSubmit @click.native="validate" form="login" text="login" />
      <FormSubmit
        text="anon"
        @click.native="$store.dispatch('user/loginAnonymously')"
      />
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
      showButtons: false,
    }
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
    onInput() {
      if ((this.email !== '') & (this.password !== '')) {
        this.showButtons = true
      } else {
        this.showButtons = false
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
  color: #504e4d;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1px;
  pointer-events: none;

  .button {
    margin-top: var(--grid-gutter);
    transition: opacity 300ms ease-in-out;
    // transform: translate3d(0, -4em, 0);
    opacity: 0;

    &:first-of-type {
      border-radius: var(--note-radius) 0 0 var(--note-radius);
    }
    &:last-of-type {
      border-radius: 0 var(--note-radius) var(--note-radius) 0;
    }
  }
}
</style>
