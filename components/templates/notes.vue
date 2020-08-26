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
    height: 100vmax;
    max-height: 1400px;

    /deep/.note {
      position: absolute;
      width: 400px;
      height: 400px;

      .theme-light & {
        box-shadow: 0px 28px 36px rgba(#{var(--note-shadow)}, 0.0282725),
          0px 8px 12px rgba(#{var(--note-shadow)}, 0.0417275),
          0px -2px 6px rgba(#{var(--note-shadow)}, 0.07);

        &.is-dragging {
          box-shadow: 0px 420px 86px rgba(#{var(--note-shadow)}, 0.0125319),
            0px 112px 64px rgba(#{var(--note-shadow)}, 0.0223319),
            0px 6px 34px rgba(#{var(--note-shadow)}, 0.05);
        }
      }

      .theme-dark & {
        box-shadow: 0px 21px 32px rgba(#{var(--note-shadow)}, 0.06),
          0px 8px 12px rgba(#{var(--note-shadow)}, 0.1),
          0px -2px 6px rgba(#{var(--note-shadow)}, 0.15);

        &.is-dragging {
          box-shadow: 0px 420px 86px rgba(#{var(--note-shadow)}, 0.0125319),
            0px 112px 64px rgba(#{var(--note-shadow)}, 0.0223319),
            0px 6px 34px rgba(#{var(--note-shadow)}, 0.05);
        }
      }
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
    this.$store.dispatch('notes/getCanvasDimensions')
    this.$on('note::mounted', this.onNoteMount)
    window.addEventListener('resize', this.onResize)
    console.log(this.notes)
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
    onNoteMount(zIndex) {
      this.$store.dispatch(
        'notes/getCanvasDimensions',
        this.$refs.notes.getBoundingClientRect()
      )
      this.$store.dispatch('notes/updateHighestZ', parseInt(zIndex))
    },
  },
}
</script>
