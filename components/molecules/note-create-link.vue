<template>
  <div class="link">
    <template>
      <FormInput
        v-model="link"
        type="url"
        ref="link"
        placeholder="link a site, video, or image..."
        label="add a link"
        theme="dark"
        autocomplete="off"
        @input="validate"
        required
      />
      <template>
        <div class="preview thumbnail" v-if="linkEmbed.thumbnail">
          <img :src="linkEmbed.thumbnail" alt="" />
        </div>

        <div
          class="preview embed"
          v-else-if="linkEmbed.html"
          v-html="linkEmbed.html"
        ></div>
      </template>
    </template>

    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import FormInput from '@/components/molecules/form-input'
export default {
  components: {
    FormInput,
  },
  data() {
    return {
      apiKey: '922bdfb9544ae6d6d87664139e5c4042',
      link: null,
      linkIsFormatted: false,
      linkIsValid: false,
      keyupTimeout: null,
      keyupTimeoutDuration: 500,
      error: null,
      linkPreview: null,
      linkEmbed: {
        html: null,
        url: null,
        thumbnail: null,
        type: 'website',
      },
    }
  },
  methods: {
    checkLinkFormat() {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      )

      this.linkIsFormatted = !!pattern.test(this.link)
    },
    validate() {
      clearTimeout(this.keyupTimeout)

      this.keyupTimeout = setTimeout(() => {
        // 1. is it actually a link? be real, dude.
        this.checkLinkFormat()

        // 2. is it a video? is it an image? is it just a link?
        if (this.linkIsFormatted) {
          this.fetchLinkPreview()
          this.handleEmbed()
        } else {
          this.linkEmbed.thumbnail = null
        }
      }, this.keyupTimeoutDuration)

      // this.handleEmbed()
      // if link is formatted, let's double check that this link is real
      // this.linkIsValid = !!this.linkIsFormatted
    },
    handleEmbed() {
      let input = this.link
      let replacement = null
      let type = 'website'
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
          input = input.replace('&amp;t=', '?t=')
          type = 'youtube'
          break

        case isVimeo.test(input):
          // https://vimeo.com/441172521
          console.log('vimeo')
          replacement = `<iframe src="https://player.vimeo.com/video/$1?autoplay=1&muted=1&loop=1&autopause=0&background=1" width="400" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`
          input = input.replace(isVimeo, replacement)
          type = 'vimeo'
          break

        case isLinkedVideo.test(input):
          // https://res.cloudinary.com/instrument-com/video/upload/q_75:qmax_45/homepage/dot_com_loop_v1_2_mckh3o.webm
          replacement = '<video controls muted autoplay loop src="$1"></video>'
          input = input.replace(isLinkedVideo, replacement)
          type = 'video'
          break

        case isLinkedImage.test(input):
          replacement = '<img src="$1" />'
          input = input.replace(isLinkedImage, replacement)
          this.linkEmbed.thumbnail = this.link
          console.log('linked image', input)
          type = 'image'
          break

        default:
          type = 'website'
          input = null
          break
      }

      this.linkEmbed = {
        html: input,
        url: this.link,
        thumbnail: this.linkEmbed.thumbnail,
        type,
      }
    },
    reset() {
      this.link = null
      this.linkEmbed = null
      this.linkIsFormatted = false
      this.linkIsValid = false
      this.error = null
    },
    fetchLinkPreview() {
      this.$axios
        .get(`https://api.linkpreview.net/?key=${this.apiKey}&q=${this.link}`)
        .then(res => {
          if (res.status === 200) {
            this.linkEmbed.thumbnail = res.data.image
          } else {
            this.linkEmbed.thumbnail = null
            this.error = 'sorry, we cant find a preview image for that'
            console.log('failed', this.error)
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.link-preview {
  background: white;
  max-width: 500px;
  border-radius: var(--note-radius);
  overflow: hidden;
  display: flex;

  iframe,
  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
