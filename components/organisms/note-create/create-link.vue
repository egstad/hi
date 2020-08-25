<template>
  <section class="link-wrap">
    <div class="link-paste">
      <button
        @click="pasteLink"
        ref="paste"
        class="input instructions"
        type="button"
        v-if="!linkIsValid"
      >
        <span class="ts4">☕</span><br />
        <span class="ts1"><strong>click to paste link</strong></span>
      </button>

      <div class="input instructions" v-else>
        <LinkPreview :link="link" />
      </div>
    </div>

    <FormInput
      v-model="link"
      type="url"
      ref="text"
      :tip="linkTip"
      placeholder="link to a site, video, or image..."
      label="add a link"
      theme="dark"
      autocomplete="off"
      required
      @keydown.space.prevent
      @input="onInput($event)"
    />
  </section>
</template>

<style lang="scss" scoped>
$short-row: calc(var(--note-icon-size) + var(--grid-gutter));

.link-wrap {
  display: grid;
  grid-template-rows: auto $short-row;
  height: calc(100% - 30px);
  align-items: start;
  padding-top: 0.3em;

  .link-paste {
    position: relative;
    display: grid;
    grid-template-rows: auto;
    height: 100%;

    .instructions {
      border-radius: var(--note-radius-child);
      display: flex;
      height: 100%;
      width: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-weight: bold;

      .ts5,
      .ts2 {
        line-height: 0.4 !important;
      }
    }
  }
}
</style>

<script>
import LinkPreview from '@/components/organisms/note-create/create-link-preview'
import FormInput from '@/components/molecules/form-input'

export default {
  components: {
    FormInput,
    LinkPreview,
  },
  data() {
    return {
      link: '',
      linkTip: '',
      linkIsValid: false,
      linkEmbedData: null,
      linkKeyupTimeout: null,
      linkKeyupTimeoutDuration: 500,
    }
  },
  mounted() {
    this.$on('previewReady', this.handleLinkEmbed)
  },
  beforeDestroy() {
    this.$off('previewReady', this.handleLinkEmbed)
  },
  methods: {
    reset() {
      this.link = ''
      this.linkTip = ''
      this.linkIsValid = false
      this.linkEmbedData = null
    },
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

      if (pattern.test(this.link)) {
        this.linkIsValid = true
        this.linkTip = null
      } else {
        this.linkIsValid = false
      }
    },
    onInput() {
      this.validate()
    },
    validate() {
      // a timeout is used to throttle validation.
      clearTimeout(this.linkKeyupTimeout)
      this.linkKeyupTimeout = setTimeout(() => {
        this.checkLinkFormat()
        this.$emit('input', this.link)
      }, this.linkKeyupTimeoutDuration)
    },
    async pasteLink() {
      const text = await navigator.clipboard.readText()
      this.link = text
      this.validate()
    },
    handleLinkEmbed(val) {
      this.linkEmbedData = val
      this.$parent.$emit('embedDataReady', this.linkEmbedData)
    },
  },
}
</script>
