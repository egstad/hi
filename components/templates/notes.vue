<template>
  <ul class="notes">
    <Note
      v-for="(note, noteIndex) in notes"
      :title="note.title"
      :type="note.type"
      :author="note.author"
      :media="note.media"
      :doc-id="note.id"
      :key="noteIndex"
      :tag="note.tag || 'none'"
      :link="note.link"
    />
  </ul>
</template>

<style lang="scss" scoped>
.notes {
  display: grid;
  grid-gap: var(--grid-gutter);
  margin-top: calc(var(--grid-gutter) * 4);

  @media (min-width: 600px) {
    grid-gap: calc(var(--grid-gutter) * 2);
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
