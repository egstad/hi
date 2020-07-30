<template>
  <section>
    <div class="text-wrap">
      <header>
        <h2 class="t-headline">create a profile</h2>
      </header>
      <p>
        we don’t know you, but we love you just the way you are. stay anonymous
        if you’d like. however, if you’d like to tie a name to your notes, sign
        up!
      </p>
    </div>

    <div>
      <!-- logged-in anonymous user -->
      <form @submit.prevent="validate">
        <FormInput
          v-model="email"
          type="email"
          ref="email"
          placeholder="name@address.com"
          label="email address"
          theme="light"
          autocomplete="email"
          @input="onInput('email', $event)"
          @keydown.native.space.prevent
        />

        <FormInput
          v-model="password"
          type="password"
          ref="password"
          placeholder="••••••"
          label="password"
          theme="light"
          @input="onInput('password', $event)"
          autocomplete="current-password"
        />
        <div v-if="error">{{ error.message }}</div>

        <div class="contextual button" :class="{ 'is-expanded': showButtons }">
          <FormSubmit text="create profile" />
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/auth'
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
      showButtons: false,
    }
  },
  methods: {
    validate() {
      const emailIsValid =
        this.email !== '' && this.$refs.email.$refs.input.checkValidity()

      const passwordIsValid =
        this.password !== '' && this.$refs.password.$refs.input.checkValidity()

      if (emailIsValid && passwordIsValid) {
        // if user is anonymously logged-in
        if (
          this.$store.state.user.isLoggedIn &&
          this.$store.state.user.isAnon
        ) {
          this.registerAnonymous()
        }
        // user isn't logged in at all, let's create a brand new account
        else {
          this.registerNewEmail()
        }
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
    async registerNewEmail() {
      await this.$firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .catch(error => {
          this.error = error
        })
    },
    onInput() {
      if ((this.email !== '') & (this.password !== '')) {
        this.showButtons = true
      } else {
        this.showButtons = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$label-height: 28px;

.text-wrap {
  margin-bottom: var(--grid-gutter);
}

// factor label into height here
.contextual.input.is-expanded {
  height: calc(var(--input-height) + var(--grid-gutter) + #{$label-height});
}

.contextual.button .button {
  margin-top: var(--grid-gutter);
}
</style>
