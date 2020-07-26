<template>
  <div>
    <table>
      <tr>
        <td>isAnon</td>
        <td>{{ $store.state.user.isAnon }}</td>
      </tr>
      <tr>
        <td>email</td>
        <td>{{ $store.state.user.email }}</td>
      </tr>
      <tr>
        <td>uid</td>
        <td>{{ $store.state.user.uid }}</td>
      </tr>
    </table>

    <button @click="$store.commit('user/logout')">
      logout
    </button>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  border: 1px solid black;
  margin-bottom: 20px;
}
tr {
  border-bottom: 1px solid #000;
}
td {
  padding: 10px;
  border-right: 1px solid black;

  &:last-child {
    border: none;
  }
}
</style>
