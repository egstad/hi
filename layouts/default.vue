<template>
  <div class="site">
    <logo class="logo" />
    <navigation class="nav" />
    <post class="post" />
    <login v-if="!$store.state.user.isLoggedIn" class="login" />
    <main class="main">
      <nuxt />
    </main>
  </div>
</template>

<script>
import navigation from '@/components/nav'
import logo from '@/components/logo'
import post from '@/components/post'
import login from '@/components/login'
export default {
  components: {
    navigation,
    post,
    logo,
    login,
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

.site {
  padding: 24px;
  display: grid;
  // grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas: 'nav' 'login' 'logo' 'main';
}

.nav {
  grid-area: nav;
}

.login {
  grid-area: login;
}
</style>
