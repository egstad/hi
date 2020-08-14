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
      <template v-if="linkEmbed">
        <div class="preview thumbnail" v-if="linkEmbed.thumbnail">
          <img :src="linkEmbed.thumbnail" alt="" />
        </div>

        <div
          class="preview embed"
          v-else-if="linkEmbed.embed"
          v-html="linkEmbed.embed"
        ></div>

        <div v-else>
          there's no preview image for that, but we'll include the link 4 u
        </div>
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
      linkEmbed: null,
      linkIsFormatted: false,
      linkIsValid: false,
      linkPreview: null,
      keyupTimeout: null,
      keyupTimeoutDuration: 500,
      error: null,
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

      // not valid? cool. hide the previews
      if (!this.linkIsFormatted) {
        this.linkPreview = null
        this.linkEmbed = null
      }
    },
    validate() {
      clearTimeout(this.keyupTimeout)

      this.keyupTimeout = setTimeout(() => {
        // 1. is it actually a link? be real, dude.
        this.checkLinkFormat()

        // 2. is it a video? is it an image? is it just a link?
        if (this.linkIsFormatted) {
          this.handleEmbed()
        }
      }, this.keyupTimeoutDuration)

      // this.handleEmbed()
      // if link is formatted, let's double check that this link is real
      // this.linkIsValid = !!this.linkIsFormatted
    },
    async handleEmbed() {
      let input = this.link
      let replacement = null
      let type = null
      const thumbnail = await this.fetchLinkPreview()
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
            '<iframe src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'
          input = input.replace(isYoutube, replacement)
          // For start time, turn get param & into ?
          input = input.replace('&amp;t=', '?t=')
          type = 'youtube'
          break

        case isVimeo.test(input):
          // https://vimeo.com/441172521
          console.log('vimeo')
          replacement =
            '<iframe src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
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
          type = 'image'
          break

        default:
          type = 'website'
          input = null
          break
      }

      this.linkEmbed = {
        source: this.link,
        embed: input,
        thumbnail,
        type,
      }
    },
    reset() {
      this.link = null
      this.linkEmbed = null
      this.linkIsFormatted = false
      this.linkIsValid = false
      this.linkPreview = false
      this.error = null
    },
    async fetchLinkPreview() {
      const image = await this.$axios
        .get(`http://api.linkpreview.net/?key=${this.apiKey}&q=${this.link}`)
        .then(res => {
          if (res.status === 200) {
            // this.linkPreview = res.data
            return res.data.image
            // this.linkEmbed = null
            // this.linkEmbed = {
            //   source: this.link,
            //   embed: `<img src="${res.data.image}" />`,
            //   type: 'image',
            // }
          } else {
            console.log('failed')
            this.error = 'sorry, we cant find a preview image for that'
          }
        })

      return image
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
