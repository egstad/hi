<template>
  <div class="link">
    <template v-if="!linkPreview">
      <FormInput
        v-model="link"
        type="url"
        ref="link"
        placeholder="https://website.com"
        label="url address"
        theme="dark"
        autocomplete="off"
        @input="validate()"
      />
      <FormSubmit
        v-if="linkIsFormatted"
        text="add link"
        @click.native.stop="fetchLinkPreview()"
      />
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
import FormSubmit from '@/components/molecules/form-submit'
export default {
  components: {
    FormInput,
    FormSubmit,
  },
  data() {
    return {
      apiKey: '922bdfb9544ae6d6d87664139e5c4042',
      link: null,
      linkType: null,
      linkIsFormatted: false,
      linkWorks: false,
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
      this.checkLinkFormat()

      // if link is formatted, let's double check that this link is real
      if (this.linkIsFormatted) {
        this.linkIsValid = true
      }
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

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
