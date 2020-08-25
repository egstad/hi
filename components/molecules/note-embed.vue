<template>
  <figure class="embed">
    <pre>{{ embed }}</pre>

    <template v-if="embed.type === 'youtube' || embed.type === 'vimeo'">
      <a :href="embed.url" target="_blank">
        <!-- <a :href="embed.url" target="_blank" :class="['playhead', tag]">
        <Icon type="play" />
      </a> -->
        <div :class="['thumbnail', embed.type]">
          <!-- <img :src="embed.thumbnail" alt="" v-if="embed.thumbnail" />
        <div class="iframe" v-else v-html="embed.html"></div> -->
          <div class="iframe" v-html="embed.html"></div>
        </div>
      </a>
    </template>

    <template v-if="embed.type === 'image'">
      <div class="thumbnail image">
        <img v-if="embed.thumbnail" :src="embed.thumbnail" alt="" />
        <img v-else-if="embed.url" :src="embed.url" alt="" />
      </div>
    </template>

    <!-- <template v-if="embed.type === 'video'">
      <div class="thumbnail video" v-html="embed.embed"></div>
    </template> -->

    <template v-if="embed.type === 'website'">
      <div class="thumbnail video" v-if="embed.thumbnail">
        <img :src="embed.thumbnail" alt="" />
      </div>
    </template>

    <!-- <div class="wrapper" v-else v-html="embed.embed"></div> -->

    <!-- <figcaption>
      <p class="body">{{ message }}</p>
      <a class="t-link" :href="embed.link" target="_blank">{{ embed.link }}</a>
    </figcaption> -->
  </figure>
</template>

<script>
// import Icon from '@/components/atoms/icons'

export default {
  components: {
    // Icon,
  },
  props: {
    embed: {
      type: Object,
      required: true,
    },
    tag: {
      type: String,
      required: false,
      default: 'none',
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

.link-out {
  color: inherit;
  text-decoration: none;
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
  transition: transform 0.25s ease-in-out;

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

  &:hover {
    transform: scale(1.15);
  }

  /deep/.iframe > iframe {
    pointer-events: none;
    transform: scale(2);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
