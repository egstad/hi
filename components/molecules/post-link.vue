<template>
  <div class="link">
    <template v-if="!linkPreview">
      <FormInput
        v-model="link"
        type="url"
        ref="link"
        placeholder="link a site, video, or image..."
        label="add a link"
        theme="dark"
        autocomplete="off"
        @input="validate()"
      />
      <div v-if="linkIsFormatted">
        <div class="link-preview" v-html="linkEmbed"></div>
      </div>
      <!-- <FormSubmit
        v-if="linkIsFormatted"
        text="add link"
        type="button"
        @click.native.stop="fetchLinkPreview()"
      /> -->
    </template>
    <div class="link-preview" v-else>
      <a :href="linkPreview.url">
        <h3 v-if="linkPreview.title">{{ linkPreview.title }}</h3>
        <p v-if="linkPreview.description">{{ linkPreview.description }}</p>
        <img v-if="linkPreview.image" :src="linkPreview.image" />
      </a>
    </div>

    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import FormInput from '@/components/molecules/form-input'
// import FormSubmit from '@/components/molecules/form-submit'
export default {
  components: {
    FormInput,
    // FormSubmit,
  },
  data() {
    return {
      apiKey: '922bdfb9544ae6d6d87664139e5c4042',
      link: null,
      linkEmbed: null,
      linkIsFormatted: false,
      linkIsValid: false,
      linkPreview: null,
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
    },
    validate() {
      // 1. is it actually a link? be real, dude.
      this.checkLinkFormat()
      // 2. is it a video? is it an image? is it just a link?
      this.handleEmbed()
      // if link is formatted, let's double check that this link is real
      this.linkIsValid = !!this.linkIsFormatted
    },
    handleEmbed() {
      let input = this.link
      const isYoutube = this.link.includes('youtube.com')

      // https://www.youtube.com/watch?v=HrBhuzHHlhQ
      if (isYoutube) {
        const pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(\S+)/g
        if (pattern.test(input)) {
          const replacement =
            '<iframe src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'
          input = input.replace(pattern, replacement)
          // For start time, turn get param & into ?
          input = input.replace('&amp;t=', '?t=')
        }
        this.linkEmbed = input
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
      await this.$axios
        .get(`http://api.linkpreview.net/?key=${this.apiKey}&q=${this.link}`)
        .then(res => {
          if (res.status === 200) {
            console.log('got it')
            this.linkPreview = res.data
            this.$parent.$emit('linkPreviewReady', this.linkPreview)
          } else {
            console.log('failed')
            this.error = 'sorry, we cant find a preview image for that'
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
