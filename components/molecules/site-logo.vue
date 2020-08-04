<template>
  <header>
    <h1>
      <span>hi,</span>
    </h1>
    <h2>
      <span>leave a note for the internet</span><br />
      <span>anyone can post</span><br />
      <span>notes expire after a day</span>
    </h2>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  margin-bottom: 80px;
  justify-content: space-between;
  color: var(--foreground);

  @media (min-width: 500px) {
    justify-content: normal;
  }

  @media (max-width: 400px) {
    flex-direction: column;
  }
}
h1 {
  font-size: 130px;
  line-height: 0.6;
  text-indent: -0.036em;
  margin-right: var(--grid-gutter);
  font-weight: bold;
}

h2 span {
  &:before {
    content: '• ';
  }
}
</style>
