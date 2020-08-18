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
}
</script>
