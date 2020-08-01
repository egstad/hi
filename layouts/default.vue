<template>
  <div class="site">
    <div class="site-nav">
      <navigation class="nav" />
      <logo class="logo" />
    </div>

    <main class="site-content">
      <nuxt />
    </main>
  </div>
</template>

<script>
import navigation from '@/components/molecules/site-nav'
import logo from '@/components/molecules/site-logo'
export default {
  components: {
    navigation,
    logo,
  },
  beforeMount() {
    window.localStorage.removeItem('user')
    this.handleAuth()
  },
  methods: {
    async handleAuth() {
      /*
        Let's talk about logins...
        1. Out of the box, no one is logged in. Everyone is anonymous
        2. If they aren't logged-in, we create an anon account for them with firebase
        3. The UID is then saved for them
      */

      // is there a stored user UID?
      const storedUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user)
        : null

      // if so, log them in
      if (storedUser) {
        await this.$store.commit('user/login', storedUser)
      }
      // otherwise, let's log them into an anon account and write their uid to localstorage
      else {
        await this.$store.dispatch('user/loginAnonymously')

        const user = {
          isAnon: this.$store.state.user.isAnon,
          uid: this.$store.state.user.uid,
        }
        await localStorage.setItem('user', JSON.stringify(user))
      }
    },
  },
}
</script>

<style lang="scss">
@font-face {
  src: url('~static/fonts/neuebit-regular.woff');
  font-family: 'hi';
  font-display: fallback;
  font-weight: normal;
  font-style: normal;
}

@font-face {
  src: url('~static/fonts/neuebit-bold.woff');
  font-family: 'hi';
  font-display: fallback;
  font-weight: bold;
  font-style: normal;
}

.site {
  padding: var(--grid-gutter);
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
}

.site-content {
}
</style>
