<template>
  <li class="note" :class="type" ref="note">
    <article>
      <div>
        <header>
          <h2 class="title">{{ title }}</h2>
        </header>

        <button v-if="userCanEdit" @click="deletePost(docId)">Delete</button>
      </div>

      <!-- Image Note -->
      <div class="attachments" :class="{ expanded: isExpanded, type }">
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
      </div>
    </article>
  </li>
</template>

<style lang="scss" scoped>
.note {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--note-background);
  color: var(--note-foreground);
  border-radius: var(--note-radius);
  overflow: hidden;
  padding: var(--grid-gutter) !important;
  max-width: 300px;

  &:hover {
    z-index: 2;
  }

  .title {
    font-size: 44px;
    margin-bottom: calc(var(--grid-gutter) * 0.6);
  }
}

// .attachments {
//   transition: max-height 400ms ease-in-out;
//   height: 0;
//   overflow: hidden;

//   &.expanded {
//     height: auto;
//   }
// }

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
  &.image {
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
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
      newTitle: null,
      isExpanded: false,
    }
  },
  computed: {
    userCanEdit() {
      return this.$store.state.user.uid === this.author
    },
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
    async deletePost() {
      await this.$firebase
        .firestore()
        .collection('posts')
        .doc(this.docId)
        .delete()
        .then(() => {
          console.log('note deleted')
        })
        .catch(error => {
          console.log("sorry, the note couldn't be deleted", error)
        })
    },
  },
}
</script>
