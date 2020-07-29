<template>
  <article class="note">
    <h2>{{ title }}</h2>
    <p style="font-size:16px;">author: {{ author }}</p>

    <template v-if="media">
      <figure v-if="media.image">
        <img :src="media.image" alt="" />
      </figure>

      <a v-else-if="media.link" :href="media.link.url" target="_blank">
        <h3 v-if="media.link.title">{{ media.link.title }}</h3>
        <p v-if="media.link.description">
          {{ media.link.description }}
        </p>
        <img v-if="media.link.image" :src="media.link.image" alt="" />
      </a>
    </template>
  </article>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    media: {
      type: Object,
      required: false,
      default: null,
    },
  },
}
</script>
