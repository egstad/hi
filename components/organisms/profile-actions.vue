<template>
  <div>
    <p v-if="error">{{ error.message }}</p>
    <button @click="$store.dispatch('user/logout')">
      logout
    </button>
    <button @click="doubleCheck = true">
      delete account
    </button>

    <div v-if="doubleCheck">
      <hr />
      <p>are you sure that you want to delete your account?</p>
      <button @click="userDelete">
        yep, bye bye!
      </button>
      <button @click="doubleCheck = false">nevermind</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      doubleCheck: false,
    }
  },
  methods: {
    async userDelete() {
      await this.$firebase
        .auth()
        .currentUser.delete()
        .then(() => {
          // route to new 'sorry to see you go' page?
        })
        .catch(error => {
          this.success = null
          this.error = error
        })
    },
  },
}
</script>
