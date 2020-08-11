<template>
  <figure class="attachment image">
    <!-- <div v-if="type === 'link'" v-html="image"></div> -->
    <img :src="image" alt="" />
  </figure>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &::before {
    content: '';
    display: block;
    background: rgba(black, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  img {
    object-fit: cover;
    // display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
