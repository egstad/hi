<template>
  <figure class="attachment image">
    <div v-if="type === 'link'" v-html="image"></div>
    <img v-else :src="image" alt="" />
  </figure>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    // is this an linked image or an uploaded one?
  },
  mounted() {
    console.log(this.type)
  },
}
</script>

<style lang="scss" scoped></style>
