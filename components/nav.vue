<template>
  <!-- index, list, collage, login/logout/register, add post -->
  <ul>
    <li>
      <nuxt-link to="/">index</nuxt-link>
    </li>
    <li>
      <nuxt-link to="/profile">profile</nuxt-link>
    </li>
    <li v-if="$store.state.user.isLoggedIn">
      <button @click="$store.commit('user/logout')">
        logout
      </button>
    </li>
    <li>
      <button @click="$app.$emit('post::author')">+</button>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  display: flex;
}

li {
  margin-right: 1em;
}
</style>
