<template>
  <li class="note" :class="type" ref="note" :data-id="docId" :data-uid="author">
    <article>
      <header>
        <h2 class="title">{{ title }}</h2>
      </header>

      <!-- Image Note -->
      <template v-if="media.image">
        <figure class="attachment image">
          <img :src="media.image" alt="" />
        </figure>
      </template>

      <!-- Link Embed Note -->
      <template v-else-if="media.link">
        <a class="attachment link" :href="media.link.url" target="_blank">
          <figure v-if="media.link.image">
            <img :src="media.link.image" alt="" />
          </figure>

          <p v-if="media.link.title" class="link-title">
            {{ media.link.title }}
          </p>
          <p v-if="media.link.description" class="link-description">
            {{ media.link.description }}
          </p>
        </a>
      </template>
      <!-- delete after edit/delete functionality exists -->
      <p style="font-size:16px;">author: {{ author }}</p>
    </article>
  </li>
</template>

<style lang="scss" scoped>
.note {
  background: var(--note-background);
  color: var(--note-foreground);
  border-radius: var(--note-radius);
  overflow: hidden;
  padding: var(--grid-gutter) !important;

  .title {
    font-size: 44px;
    margin-bottom: calc(var(--grid-gutter) * 0.6);
  }
}

.attachment {
  &.link {
    color: inherit;
    text-decoration: none;

    img {
      border-radius: calc(var(--note-radius-child));
      margin-bottom: calc(var(--grid-gutter));
      overflow: hidden;
    }

    .link-title {
      font-weight: bold;
      font-size: 24px;
      margin-bottom: calc(var(--grid-gutter) * 0.25);
    }

    .link-description {
      margin-bottom: calc(var(--grid-gutter) * 0.5);
    }
  }
  // &.image {}
}
</style>

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
    docId: {
      type: String,
      required: true,
    },
    media: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      type: null,
    }
  },
  beforeMount() {
    this.setType()
  },
  methods: {
    setType() {
      if (this.media.image !== '') {
        this.type = 'image'
      } else if (this.media.link !== '') {
        this.type = 'link'
      } else {
        this.type = 'text'
      }
    },
  },
}
</script>
