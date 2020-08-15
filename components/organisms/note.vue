<template>
  <li class="note" :class="(`type--${type}`, `tag--${tag}`)" ref="note">
    <article class="content">
      <!-- <pre>{{ type }}</pre> -->

      <template v-if="type === 'image'">
        <NoteImage :image="image" :message="message" />
      </template>

      <template v-else-if="type === 'link'">
        <NoteEmbed :embed="embed" :message="message" />
      </template>

      <template v-else>
        <NoteText :message="message" />
      </template>

      <NoteUtilities
        :is-opaque="iconsAreOpaque"
        :tag="tag"
        :type="type"
        :author="author"
        :note-id="noteId"
      />
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
    /deep/.note__utilities {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // default, love, cute, sad, sparkle, curious
  &.tag {
    &--none {
      background: var(--note-default-bg);
      color: var(--note-default-fg);
    }
    &--love {
      background: var(--note-love-bg);
      color: var(--note-love-fg);
    }
    &--cute {
      background: var(--note-cute-bg);
      color: var(--note-cute-fg);
      fill: var(--note-cute-fg);
    }
    &--sad {
      background: var(--note-sad-bg);
      color: var(--note-sad-fg);
    }
    &--sparkle {
      background: var(--note-curious-bg);
      color: var(--note-curious-fg);
    }
    &--curious {
      background: var(--note-curious-bg);
      color: var(--note-curious-fg);
    }
  }

  /deep/.note__utilities {
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms ease-out;
  }
}
</style>

<script>
import NoteText from '@/components/molecules/note-text'
import NoteEmbed from '@/components/molecules/note-embed'
import NoteImage from '@/components/molecules/note-image'
import NoteUtilities from '@/components/molecules/note-utilities'
export default {
  components: {
    NoteText,
    NoteEmbed,
    NoteImage,
    NoteUtilities,
  },
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newTitle: null,
      isExpanded: false,
    }
  },
  computed: {
    iconsAreOpaque: {
      get() {
        return false
      },
      set() {
        if (
          this.type === 'image' ||
          (this.type === 'link' && this.embed.thumbnail) ||
          (this.type === 'link' &&
            this.embed.type === 'video' &&
            this.embed.embed)
        ) {
          return true
        } else {
          return false
        }
      },
    },
    // @string
    // @returns: none, link, image
    type() {
      return this.note.type
    },
    // @string
    // @returns: main message from note
    message() {
      return this.note.message
    },
    // @string
    // @returns: default, love, cute, sad, sparkle, curious
    tag() {
      return this.note.tag
    },
    // @string
    // @returns: a unique id for the author
    author() {
      return this.note.author
    },
    // @string
    // @returns: a bunch of random letters and numbers
    noteId() {
      return this.note.id
    },
    // @string
    // @returns: a url attached to the note
    link() {
      return this.note.media.link
    },
    // @string
    // @returns: a firebase url to the uploaded image
    image() {
      return this.note.media.image
    },
    // @string
    // @returns: an embed attached to the note
    embed() {
      return this.note.media.embed
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
  },
}
</script>
