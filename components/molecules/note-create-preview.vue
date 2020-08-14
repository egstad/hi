<template>
  <form @submit.stop.prevent="fetchMetaData">
    <input type="url" v-model="link" @keyup="validate" />
    <pre style="color:magenta">{{ query }}</pre>
    <div v-if="data" style="color:magenta">
      <h1>{{ data.openGraph.title }}</h1>
      <h2>{{ data.openGraph.description }}</h2>
      <img :src="data.openGraph.image.url" alt="" />
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      data: null,
      link: '',
      linkIsFormatted: '',
      keyupTimeout: null,
      keyupTimeoutDuration: 500,
      // mine
      // 78eb2bba-ef9f-4e8c-be19-4d6bbff0d3e1
      // more
      // https://github.com/search?q=https%3A%2F%2Fopengraph.io%2Fapi%2F1.1%2Fsite+extension%3Ajs&type=Code
      id: 'f1c711d0-853a-485e-b185-97f0a93901f8',
    }
  },
  computed: {
    query() {
      return `https://opengraph.io/api/1.1/site/${encodeURIComponent(
        this.link
      )}?app_id=${this.id}`
    },
  },
  mounted() {},
  methods: {
    validate() {
      clearTimeout(this.keyupTimeout)

      this.keyupTimeout = setTimeout(() => {
        this.checkLinkFormat()
      }, this.keyupTimeoutDuration)
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

      this.linkIsFormatted = !!pattern.test(this.link)

      if (this.linkIsFormatted) {
        this.fetchMetaData()
      }
    },
    async fetchMetaData() {
      await this.$axios
        .$get(this.query)
        .then(response => {
          this.data = response
        })
        .catch(error => console.log(error))
    },
  },
}
</script>
