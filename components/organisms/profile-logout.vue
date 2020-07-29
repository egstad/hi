<template>
  <div class="wrap">
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
        <td>
          <p>{{ $store.state.user.uid }}</p>
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  overflow: hidden;
}

table {
  width: 100%;
  border: 1px solid black;
  margin-bottom: var(--grid-gutter);
}
tr {
  border-bottom: 1px solid #000;
}
td {
  padding: 10px;
  border-right: 1px solid black;

  p {
    word-break: break-all;
  }

  &:last-child {
    border: none;
  }
}
</style>
