<template>
  <div class="site">
    <div class="site-nav">
      <logo class="logo" />
      <navigation class="nav" />
    </div>

    <main class="site-content">
      <nuxt />
    </main>
  </div>
</template>

<script>
import navigation from '@/components/nav'
import logo from '@/components/logo'
export default {
  components: {
    navigation,
    logo,
  },
  async beforeCreate() {
    await this.$store.dispatch('user/authenticate')
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
  padding: 20px;
  display: grid;
  height: 100%;
  width: 100%;
  // grid-template-columns: 1fr;
  // grid-template-rows: auto;
  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
    // grid-template-areas: 'logo nav';
  }

  // logo and navigation
  &-nav {
    display: grid;
    grid-template-areas: 'nav' 'logo';
    grid-template-rows: auto;
    height: 40vmin;

    @media (min-width: 600px) {
      height: auto;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr auto;
      grid-template-areas: 'logo' 'nav';
    }

    .logo {
      grid-area: logo;
    }

    .nav {
      grid-area: nav;
    }
  }

  &-content {
    align-self: end;

    @media (min-width: 600px) {
      align-self: start;
    }
  }
}

.nav {
  // grid-area: nav;
}

.login {
  // grid-area: login;
}
</style>
