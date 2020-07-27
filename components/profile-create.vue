<template>
  <section>
    <div>
      <!-- logged-in anonymous user -->
      <form @submit.prevent="validate">
        <div>
          <FormInput
            v-model="email"
            type="email"
            ref="email"
            placeholder="name@address.com"
            label="email address"
            theme="light"
            autocomplete="email"
          />
        </div>
        <div>
          <FormInput
            v-model="password"
            type="password"
            ref="password"
            placeholder="••••••"
            label="password"
            theme="light"
            autocomplete="current-password"
          />
        </div>
        <div v-if="error">{{ error.message }}</div>
        <FormSubmit text="create profile" />
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
