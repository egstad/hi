<template>
  <form @submit.stop.prevent="fetchMetaData">
    <input type="url" v-model="url" />
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
      url: '',
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
        this.url
      )}?app_id=${this.id}`
    },
  },
  mounted() {},
  methods: {
    async fetchMetaData() {
      const data = await this.$axios.$get(this.query)
      this.data = data
    },
  },
}
</script>
