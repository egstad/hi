<template>
  <figure>
    <div></div>
    <div class="wrapper" v-html="embed.source"></div>
    <!-- <figcaption>
      <p class="body">{{ body }}</p>
      <a class="t-link" :href="link" target="_blank">{{ link }}</a>
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
.embed {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: calc(var(--grid-gutter) + var(--note-icon-size)) auto;
}

/deep/iframe {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

figcaption {
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
