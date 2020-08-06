<template>
  <figure class="embed">
    <div class="wrapper" v-html="embed.source"></div>
    <!-- <figcaption>
      <p class="body">{{ body }}</p>
    </figcaption> -->
  </figure>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    embed: {
      type: Object,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
$padding: calc((var(--grid-gutter) * 2) + var(--note-icon-size));

.embed {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: $padding auto;
}

.wrapper {
  grid-row: 2;
  // position: relative;
  // padding-bottom: 56.25%; /* 16:9 */
  // padding-top: 25px;
  // height: 0;
}

/deep/iframe {
  // position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 100%;
}

figcaption {
  grid-row: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  padding: 0 var(--grid-gutter) var(--grid-gutter);

  * > {
    min-width: 0;
  }
}

.body {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  transform: translateY(5px);
}
</style>
