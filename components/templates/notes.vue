<template>
  <div>
    <button @click="$store.dispatch('notes/updateDraggable', true)">
      Init
    </button>
    <button @click="$store.dispatch('notes/updateDraggable', false)">
      Kill
    </button>
    <ul
      class="notes"
      :class="{ 'is-draggable': $store.state.notes.areDraggable }"
      ref="notes"
    >
      <Note
        v-for="note in notes"
        :key="note.id"
        :note="note"
        ref="note"
        class="draggable"
      />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.notes {
  display: grid;
  grid-gap: var(--grid-gutter);
  margin-top: calc(var(--grid-gutter) * 4);
  grid-gap: calc(var(--grid-gutter));
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));

  &.is-draggable {
    display: block;
    width: 100%;
    height: 100vh;

    /deep/.note {
      position: absolute;
      width: 400px;
      height: 400px;
    }
  }
}
</style>

<script>
import Note from '@/components/organisms/note'

export default {
  components: {
    Note,
  },
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      windowWidth: null,
      draggableBreakpoint: 1200,
      resizeTimer: null,
      resizeTime: 300,
    }
  },
  watch: {
    windowWidth(newValue, oldValue) {
      // if window is larger than breakpoint
      newValue > this.draggableBreakpoint
        ? //  init draggable
          this.$store.dispatch('notes/updateDraggable', true)
        : // destroy draggable
          this.$store.dispatch('notes/updateDraggable', false)
    },
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.handleResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.handleResize()
      }, this.resizeTime)
    },
    handleResize() {
      const boundingBox = this.$refs.notes.getBoundingClientRect()

      this.windowWidth = window.innerWidth
      this.$store.dispatch('notes/updateWidth', boundingBox.width)
      this.$store.dispatch('notes/updateHeight', boundingBox.height)
      this.$app.$emit('windowResized')
    },
  },
}
</script>
