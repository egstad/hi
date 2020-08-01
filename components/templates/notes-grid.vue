<template>
  <ul class="notes" ref="notes">
    <template v-for="(note, noteIndex) in notes">
      <Note
        :title="note.title"
        :author="note.author"
        :media="note.media"
        :doc-id="note.id"
        :key="noteIndex"
        ref="note"
      />
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.notes {
  width: 100%;
  height: 100%;
  position: relative;
  margin-top: calc(var(--grid-gutter) * 4);

  /deep/.note {
    transition: transform 400ms ease-in-out;
  }
}
</style>

<script>
import Note from '@/components/organisms/note-grid'
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
      size: null,
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.initGrid()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.size = {
        width: Math.round(this.$refs.notes.getBoundingClientRect().width),
        height: Math.round(this.$refs.notes.getBoundingClientRect().height),
      }

      this.initGrid()
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    initGrid() {
      this.$refs.note.forEach(note => {
        const w = Math.round(note.$el.getBoundingClientRect().width)
        const h = Math.round(note.$el.getBoundingClientRect().height)
        const x = this.getRandomInt(this.size.width - w)
        const y = this.getRandomInt(this.size.height - h)
        const r = Math.random() * 180

        note.$el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`
      })
    },
  },
}
</script>
