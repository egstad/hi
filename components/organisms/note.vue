<template>
  <li class="note" :class="(type, `tag--${tag}`)" ref="note">
    <article class="content">
      <template v-if="type === 'image'">
        <figure class="attachment image">
          <img :src="media.image" alt="" />
        </figure>
      </template>

      <template v-else-if="type === 'text'">
        <div class="attachment text">
          <NoteText :body="title" :link="title" />
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
$icon-size: 48px;

.note {
  position: relative;
  color: var(--note-foreground);
  overflow: hidden;
  padding: var(--grid-gutter) !important;
  border-radius: var(--note-radius);
  background-color: var(--note-default-bg);

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
      background-color: rgba(white, 0.7);
      backdrop-filter: blur(5px);
    }
  }

  &.tag {
    &--curious {
      background: var(--note-curious-bg);
      color: var(--note-curious-fg);
    }
    &--cute {
      background: var(--note-cute-bg);
      color: var(--note-cute-fg);
    }
    &--sad {
      background: var(--note-sad-bg);
      color: var(--note-sad-fg);
    }
    &--encouraging {
      background: var(--note-encouraging-bg);
      color: var(--note-encouraging-fg);
    }
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
    padding: calc(var(--grid-gutter) * 0.5);
    width: $icon-size;
    height: $icon-size;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(0px);
    border-radius: var(--note-radius-child);

    transition: background-color 300ms ease-in-out,
      backdrop-filter 100ms ease-in-out;
    background-color: rgba(white, 0);

    &:hover,
    &:focus {
      background-color: rgba(white, 1);
      svg {
        transform: translate3d(0, 0, 0) rotate(90deg);
      }
    }

    &.opaque {
      background-color: rgba(white, 0.7);
      backdrop-filter: blur(5px);
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
export default {
  components: {
    Icon,
    NoteText,
  },
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
      type: null,
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
    this.setType()
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
