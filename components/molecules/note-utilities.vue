<template>
  <footer class="utils">
    <p class="icon tag" :class="{ opaque: isOpaque }">
      <span class="-hidden">note type: {{ type }}</span>
      <span class="svg"><Icon :type="tag"/></span>
    </p>
    <button
      class="icon delete"
      v-if="userCanEdit"
      @click="deletePost(noteId)"
      :class="{ opaque: isOpaque }"
    >
      <span class="-hidden">delete note</span>
      <span class="svg"><Icon type="close"/></span>
    </button>
  </footer>
</template>

<style lang="scss" scoped>
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
</style>

<script>
import Icon from '@/components/atoms/icons'
export default {
  components: {
    Icon,
  },
  props: {
    isOpaque: {
      type: Boolean,
      required: true,
    },
    noteId: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    // @string
    // @returns: boolean
    userCanEdit() {
      return this.$store.state.user.uid === this.author
    },
  },
  methods: {
    deletePost() {
      this.$firebase
        .firestore()
        .collection('notes')
        .doc(this.noteId)
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
