<template>
  <li
    class="note"
    :class="(`type--${type}`, `tag--${tag}`)"
    ref="note"
    :style="
      `transform:rotate(${Math.random() *
        3 *
        (Math.random() * 2 < 1 ? 1 : -0.5)}deg)`
    "
  >
    <article class="content">
      <pre>{{ type }}</pre>
      <template v-if="type === 'image'">
        <figure class="attachment image">
          <img :src="media.image" alt="" />
        </figure>
      </template>

      <template v-else-if="type === 'link'">
        <NoteEmbed
          class="attachment embed"
          type="?"
          :embed="media.embed"
          :body="title"
          :link="link"
        />
      </template>

      <!-- <template v-else-if="type === 'link'">
        <pre>{{ media }}</pre>
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

      <template v-else>
        <NoteText :body="title" :link="link" class="attachment text" />
      </template>

      <footer class="utils">
        <p
          class="icon tag"
          :class="{ opaque: iconsAreOpaque || type === 'image' }"
        >
          <span class="-hidden">note type: {{ type }}</span>
          <span class="svg"><Icon :type="tag"/></span>
        </p>
        <button
          class="icon delete"
          v-if="userCanEdit"
          @click="deletePost(docId)"
          :class="{ opaque: iconsAreOpaque || type === 'image' }"
        >
          <span class="-hidden">delete note</span>
          <span class="svg"><Icon type="close"/></span>
        </button>
      </footer>
    </article>
  </li>
</template>

<style lang="scss" scoped>
.note {
  position: relative;
  color: var(--note-foreground);
  overflow: hidden;
  padding: var(--grid-gutter) !important;
  border-radius: var(--note-radius);
  transition: background-color 700ms ease-in-out, color 700ms ease-in-out;
  background-color: var(--note-default-bg);
  color: var(--note-default-fg);

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

  &:hover {
    .icon {
      background-color: rgba(var(--primary), 1);
    }
  }

  &.tag {
    &--none {
      background: var(--note-default-bg);
      color: var(--note-default-fg);

      /deep/path {
        fill: var(--note-default-fg);
      }
    }
    &--curious {
      background: var(--note-curious-bg);
      color: var(--note-curious-fg);

      /deep/path {
        fill: var(--note-curious-fg);
      }
    }
    &--nostalgic,
    &--cute {
      background: var(--note-cute-bg);
      color: var(--note-cute-fg);
      fill: var(--note-cute-fg);

      /deep/path {
        fill: var(--note-cute-fg);
      }
    }
    &--sad {
      background: var(--note-sad-bg);
      color: var(--note-sad-fg);

      /deep/path {
        fill: var(--note-sad-fg);
      }
    }
    &--encouraging {
      background: var(--note-encouraging-bg);
      color: var(--note-encouraging-fg);

      /deep/path {
        fill: var(--note-encouraging-fg);
      }
    }
  }
}

.utils {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: calc(var(--grid-gutter));
  font-size: var(--note-icon-size);
  line-height: var(--note-icon-size);
  display: flex;
  justify-content: space-between;

  .icon {
    appearance: none;
    border: 0;
    position: relative;
    overflow: hidden;
    top: 0;
    left: 0;
    padding: calc(var(--grid-gutter) * 0.5);
    width: var(--note-icon-size);
    height: var(--note-icon-size);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    border-radius: var(--note-radius-child);
    background-color: rgba(var(--primary), 0);
    transition: background-color 400ms ease-in-out;

    &.opaque {
      background: rgba(var(--primary), 1);
    }

    &.tag {
      pointer-events: none;
    }

    &.delete {
      svg {
        transition: transform 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transform: translate(0, 0, 0) rotate(0deg);
      }

      &:hover {
        cursor: pointer;
        svg {
          transform: translate3d(0, 0, 0) rotate(90deg);
        }
      }
    }
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
  // &.text {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   height: 100%;
  //   width: 100%;
  //   padding: calc(var(--grid-gutter));
  //   display: flex;
  //   align-items: flex-end;
  //   background: var(--note-color-default);
  // }
}
</style>

<script>
import Icon from '@/components/atoms/icons'
import NoteText from '@/components/molecules/note-text'
import NoteEmbed from '@/components/molecules/note-embed'
export default {
  components: {
    Icon,
    NoteText,
    NoteEmbed,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
      default: null,
    },
    author: {
      type: String,
      required: true,
    },
    docId: {
      type: String,
      required: true,
    },
    tag: {
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
      newTitle: null,
      isExpanded: false,
      iconsAreOpaque: false,
    }
  },
  computed: {
    userCanEdit() {
      return this.$store.state.user.uid === this.author
    },
  },
  beforeMount() {
    this.$on('setIconOpacity', this.onIconOpacity)
  },
  beforeDestroy() {
    this.$off('setIconOpacity', this.onIconOpacity)
  },
  methods: {
    onIconOpacity(state) {
      if (state === 'show') {
        this.iconsAreOpaque = true
      } else if (state === 'hide') {
        this.iconsAreOpaque = false
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
