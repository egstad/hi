<template>
  <figure class="embed">
    <br /><br /><br />

    <template v-if="embed.type === 'website'">
      <div class="thumbnail website" v-if="embed.thumbnail">
        <img :src="embed.thumbnail" alt="" />
      </div>
    </template>

    <template v-if="embed.type === 'youtube'">
      <!-- add modal trigger here for playing embed! -->
      <div class="thumbnail youtube" v-if="embed.thumbnail">
        <img :src="embed.thumbnail" alt="" />
      </div>
    </template>

    <template v-if="embed.type === 'vimeo'">
      <!-- add modal trigger here for playing embed! -->
      <div class="thumbnail vimeo" v-if="embed.thumbnail">
        <img :src="embed.thumbnail" alt="" />
      </div>
    </template>

    <template v-if="embed.type === 'image'">
      <div class="thumbnail image" v-if="embed.thumbnail">
        <img :src="embed.thumbnail" alt="" />
      </div>
    </template>

    <template v-if="embed.type === 'video'">
      <div class="thumbnail video" v-html="embed.embed"></div>
    </template>

    <!-- <div class="wrapper" v-else v-html="embed.embed"></div> -->

    <!-- <figcaption>
      <p class="body">{{ message }}</p>
      <a class="t-link" :href="embed.link" target="_blank">{{ embed.link }}</a>
    </figcaption> -->
  </figure>
</template>

<script>
export default {
  props: {
    embed: {
      type: Object,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.embed {
  position: absolute;
  overflow: hidden;
  border-radius: var(--note-radius);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: calc(var(--grid-gutter) + var(--note-icon-size)) auto;
}

.wrapper {
  grid-row: 2;
}

.body {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  transform: translateY(5px);
}

.thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &::before {
    content: '';
    display: block;
    background: rgba(white, 0.05);
    mix-blend-mode: exclusion;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /deep/video,
  img {
    object-fit: cover;
    // display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
