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
      v-if="$store.state.notes.canvasWidth"
    >
      <Note
        v-for="(note, noteIndex) in notes"
        :key="note.id"
        :note="note"
        :index="noteIndex"
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
      box-shadow: 0 4px 12px rgba(black, 0.2);
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
      resizeTimer: null,
      resizeTime: 250,
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.$on('note::mounted', this.onNoteMount)
    this.$store.dispatch('notes/getCanvasDimensions')
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    this.$off('note::mounted', this.onNoteMount)
  },
  methods: {
    onResize() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.$store.dispatch(
          'notes/getCanvasDimensions',
          this.$refs.notes.getBoundingClientRect()
        )
      }, this.resizeTime)
    },
    onNoteMount() {
      this.$store.dispatch(
        'notes/getCanvasDimensions',
        this.$refs.notes.getBoundingClientRect()
      )
    },
  },
}
</script>
