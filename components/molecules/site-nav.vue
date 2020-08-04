<template>
  <!-- index, list, collage, login/logout/register, add post -->
  <ul>
    <li>
      <nuxt-link to="/">index</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/profile">profile</nuxt-link>
    </li>
    <li v-if="$store.state.user.isLoggedIn && !$store.state.user.isAnon">
      <button @click="$store.dispatch('user/logout')">
        logout
      </button>
    </li>
    <li>
      <button @click="$store.dispatch('theme/setTheme', 'dark')">
        dark
      </button>
      <button @click="$store.dispatch('theme/setTheme', 'light')">
        light
      </button>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  display: flex;
  // padding: var(--grid-gutter);
  margin-bottom: 40px;

  @media (min-width: 700px) {
    position: fixed;
    top: var(--grid-gutter);
    right: 0;
  }
}

li {
  margin-right: 1em;
}
</style>
