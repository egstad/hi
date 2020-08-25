<template>
  <a :href="link" target="_blank" class="link-preview" :class="linkEmbed.type">
    <figure v-if="linkEmbed.thumbnail" class="link-preview__image">
      <img :src="linkEmbed.thumbnail" alt="" />
    </figure>

    <div
      class="error"
      v-else-if="linkEmbed.type === 'image' && !linkEmbed.thumbnail"
    >
      <h2 class="ts4">☹</h2>
      <p class="ts1">
        this image won't let us link to it.<br />try uploading it instead.
      </p>
    </div>

    <div v-if="linkEmbed.title" class="link-preview__info">
      <h3 class="ts">{{ linkEmbed.title | truncate(40) }}</h3>
      <p class="ts0">{{ link | truncate(25) }}</p>
    </div>
  </a>
</template>

<script>
export default {
  filters: {
    truncate(value, length) {
      if (!value) {
        return ''
      }
      value = value.toString()
      if (value.length > length) {
        return value.substring(0, length) + '...'
      } else {
        return value
      }
    },
  },
  props: {
    link: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      apiKey: '922bdfb9544ae6d6d87664139e5c4042',
      error: null,
      linkPreview: null,
      linkEmbed: {
        html: null,
        url: null,
        thumbnail: null,
        type: null,
        title: null,
        description: null,
      },
    }
  },
  mounted() {
    this.handleEmbed()
    this.fetchLinkPreview()
  },
  methods: {
    handleEmbed() {
      let input = this.link
      let replacement = null
      /* eslint-disable */
      const isYoutube = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(\S+)/g
      const isVimeo = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(\S+)/g
      const isLinkedVideo = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:webm|mp4|ogv))/gi
      const isLinkedImage = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:jpg|jpeg|gif|png))/gi
      /* eslint-enable */

      switch (true) {
        case isYoutube.test(input):
          // https://www.youtube.com/watch?v=Ya0dS63YTnU
          replacement =
            '<iframe src="https://www.youtube.com/embed/$1?rel=0;&autoplay=1&mute=1&loop=1?enablejsapi=1&version=3&playerapiid=ytplayer" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>'
          input = input.replace(isYoutube, replacement)
          // For start time, turn get param & into ?
          this.linkEmbed.html = input.replace('&amp;t=', '?t=')
          this.linkEmbed.type = 'youtube'
          break

        case isVimeo.test(input):
          // https://vimeo.com/441172521
          replacement = `<iframe src="https://player.vimeo.com/video/$1?autoplay=1&muted=1&loop=1&autopause=0&background=1" width="400" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
          this.linkEmbed.html = input.replace(isVimeo, replacement)
          this.linkEmbed.type = 'vimeo'
          break

        case isLinkedVideo.test(input):
          // https://res.cloudinary.com/instrument-com/video/upload/q_75:qmax_45/homepage/dot_com_loop_v1_2_mckh3o.webm
          replacement = '<video controls muted autoplay loop src="$1"></video>'
          this.linkEmbed.html = input.replace(isLinkedVideo, replacement)
          this.linkEmbed.type = 'video'
          break

        case isLinkedImage.test(input):
          replacement = '<img src="$1" alt="" />'
          this.linkEmbed.html = input.replace(isLinkedImage, replacement)
          this.linkEmbed.type = 'image'
          break

        default:
          this.linkEmbed.type = 'website'
          this.linkEmbed.html = null
          break
      }

      this.linkEmbed.url = this.link
    },
    reset() {
      this.link = null
      this.linkEmbed = null
      this.error = null
    },
    fetchLinkPreview() {
      this.$axios
        .get(`https://api.linkpreview.net/?key=${this.apiKey}&q=${this.link}`)
        .then(res => {
          if (res.status === 200) {
            this.linkEmbed.thumbnail = res.data.image
            this.linkEmbed.title = res.data.title
            this.linkEmbed.description = res.data.description
          } else {
            this.linkEmbed.thumbnail = null
            this.error = 'sorry, we cant find a preview image for that'
            console.warn('fetchLinkPreview() failed', this.error)
          }
          this.$parent.$emit('previewReady', this.linkEmbed)
          console.log(this.linkEmbed)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.link-preview {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 2fr;
  grid-gap: var(--grid-gutter);
  border-radius: var(--note-radius-child);
  overflow: hidden;
  height: 100%;
  color: inherit;
  text-decoration: none;

  &.image {
    grid-template-columns: 1fr;
    grid-template-rows: auto;

    .link-preview__image {
      display: grid;
      grid-template-rows: auto;
      height: 100%;

      img {
        object-fit: contain;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--grid-gutter);
    padding-left: 0;
  }

  &__image {
    iframe,
    img {
      display: flex;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--grid-gutter);
    text-align: center;

    p {
      font-weight: normal;
    }
  }
}
</style>
