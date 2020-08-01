<template>
  <li class="note" :class="type" ref="note">
    <article class="content">
      <template v-if="type === 'image'">
        <figure class="attachment image">
          <img :src="media.image" alt="" />
        </figure>
      </template>

      <template v-else-if="type === 'text'">
        <div class="attachment text">
          <p class="">{{ title }}</p>
        </div>
      </template>

      <!-- <template v-else-if="media.link">
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
      </template> -->

      <footer class="utils">
        <p class="icon">
          <span class="-hidden">tag name</span>
          <span>☂</span>
        </p>
        <button class="icon" v-if="userCanEdit" @click="deletePost(docId)">
          <span class="-hidden">delete note</span>
          <span>☓</span>
        </button>
      </footer>
    </article>
  </li>
</template>

<style lang="scss" scoped>
$icon-size: 54px;

.note {
  position: relative;
  background: var(--note-background);
  color: var(--note-foreground);
  overflow: hidden;
  padding: var(--grid-gutter) !important;
  border-radius: var(--note-radius);

  .content {
    // makes it a perfect square
    &::before {
      content: '';
      display: block;
      width: 0;
      padding-bottom: 100%;
      grid-row: 1 / 1;
      grid-column: 1 / 1;
    }
  }

  // wraps content

  &:hover {
    z-index: 2;
  }

  .title {
    font-size: 44px;
    margin-bottom: calc(var(--grid-gutter) * 0.6);
  }
}

.utils {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: calc(var(--grid-gutter) * 0.5);
  font-size: $icon-size;
  line-height: $icon-size;
  display: flex;
  justify-content: space-between;

  .icon {
    appearance: none;
    border: 0;
    position: relative;
    top: 0;
    left: 0;
    width: $icon-size;
    height: $icon-size;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: rgba(white, 0.7);
    backdrop-filter: blur(5px);
    border-radius: var(--note-radius-child);
  }

  // this hides descriptions
  // while keeping them accessible for screen readers
  .-hidden {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute !important;
    white-space: nowrap;
    width: 1px;
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
  &.text {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    padding: calc(var(--grid-gutter));
    display: flex;
    align-items: flex-end;
    background: var(--note-color-default);
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
