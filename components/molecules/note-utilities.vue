<template>
  <footer class="note__utilities" :class="`tag--${type}`">
    <p class="icon tag" :class="{ opaque: isOpaque }">
      <span class="-hidden">note type: {{ type }}</span>
      <span class="svg"><Icon :type="tag"/></span>
    </p>
    <button
      class="icon delete"
      v-if="userCanEdit"
      @click="deleteNote"
      :class="{ opaque: isOpaque }"
    >
      <span class="-hidden">delete note</span>
      <span class="svg"><Icon type="close"/></span>
    </button>
  </footer>
</template>

<style lang="scss" scoped>
.note__utilities {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: calc(var(--grid-gutter));
  font-size: var(--note-icon-size);
  line-height: var(--note-icon-size);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
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
    deleteNote() {
      this.$parent.$emit('deleteNote', this.id)
    },
  },
}
</script>
