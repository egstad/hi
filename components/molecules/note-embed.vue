<template>
  <figure class="embed">
    <template v-if="embed.type === 'website'">
      <div class="thumbnail website" v-if="embed.thumbnail">
        <img :src="embed.thumbnail" alt="" />
      </div>
    </template>

    <template v-if="embed.type === 'youtube' || embed.type === 'vimeo'">
      <a :href="embed.source" target="_blank" :class="['playhead', tag]">
        <Icon type="play" />
      </a>
      <div :class="['thumbnail', embed.type]">
        <img :src="embed.thumbnail" alt="" v-if="embed.thumbnail" />
        <div class="iframe" v-else v-html="embed.embed"></div>
      </div>
    </template>

    <template v-if="embed.type === 'image'">
      <div class="thumbnail image">
        <img v-if="embed.thumbnail" :src="embed.thumbnail" alt="" />
        <img v-else-if="embed.source" :src="embed.source" alt="" />
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
import Icon from '@/components/atoms/icons'
// import Youtube from '@/components/molecules/note-embed-youtube'

export default {
  components: {
    Icon,
    // Youtube,
  },
  props: {
    embed: {
      type: Object,
      required: true,
    },
    message: {
      type: String,
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

.playhead {
  position: absolute;
  z-index: 2000;
  top: 50%;
  left: 50%;
  height: 100%;
  transform: translate3d(-50%, -50%, 0);
  width: calc(var(--note-icon-size) * 2);
  height: calc(var(--note-icon-size) * 2);
  border-radius: var(--note-radius);
  padding: var(--grid-gutter);
  backdrop-filter: blur(24px);
  color: inherit;
  overflow: hidden;

  /deep/svg {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    z-index: 3;
    transform: translate3d(-50%, -50%, 0);
    display: block;
    width: calc(var(--note-icon-size) * 1);
    height: calc(var(--note-icon-size) * 1);
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.7;
  }

  &.none:after {
    background: var(--note-default-bg);
  }
  &.love:after {
    background: var(--note-love-bg);
  }
  &.cute:after {
    background: var(--note-cute-bg);
  }
  &.sad:after {
    background: var(--note-sad-bg);
  }
  &.sparkle:after {
    background: var(--note-curious-bg);
  }
  &.curious:after {
    background: var(--note-curious-bg);
  }
}
</style>
