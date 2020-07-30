<template>
  <ul class="notes">
    <template v-for="(note, noteIndex) in notes">
      <Note
        :title="note.title"
        :author="note.author"
        :media="note.media"
        :doc-id="note.id"
        :key="noteIndex"
      />
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.notes {
  display: grid;
  grid-gap: var(--grid-gutter);
  height: 100%;
  margin-top: calc(var(--grid-gutter) * 4);

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1400px) {
    grid-auto-rows: auto;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    align-items: start;
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
}
</script>
