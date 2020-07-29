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
import * as firebase from 'firebase/app'

import navigation from '@/components/molecules/site-nav'
import logo from '@/components/molecules/site-logo'
export default {
  components: {
    navigation,
    logo,
  },
  async beforeCreate() {
    // await this.$store.dispatch('user/authenticate')
    // remember me!
    // await this.$firebase
    //   .auth()
    //   .setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    // forget me!
    await this.$firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
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
