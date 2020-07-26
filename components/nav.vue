<template>
  <!-- index, list, collage, login/logout/register, add post -->
  <ul>
    <li>
      <p>list</p>
    </li>
    <li>
      <p>collage</p>
    </li>
    <li v-if="!$store.state.user.isLoggedIn">
      <button @click="$app.$emit('login/open')">sign-in</button>
    </li>
    <li v-else>
      <button @click="$store.commit('user/logout')">logout</button>
    </li>
    <li>
      <button @click="$app.$emit('post/author')">+</button>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  display: flex;
  margin-bottom: 1em;
}

li {
  margin-right: 1em;
}
</style>
