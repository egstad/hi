<template>
  <aside class="note-creator">
    <form @submit.prevent class="content">
      <CreatorToolbar
        class="toolbar"
        :tags="tags"
        :types="types"
        ref="utils"
        @input="onTypeChange"
      />

      <div class="inputs">
        <Message />
      </div>

      <div class="submit">
        <FormSubmit text="publish" />
      </div>
    </form>

    <div class="square"></div>
    <table>
      <tr>
        <td>type: {{ type }}</td>
        <td>tag: {{ tag }}</td>
      </tr>
    </table>
  </aside>
</template>

<style lang="scss" scoped>
$short-row: calc(var(--note-icon-size) + var(--grid-gutter));

.note-creator {
  position: relative;
  color: var(--note-foreground);
  overflow: hidden;
  border-radius: var(--note-radius);
  transition: background-color 700ms ease-in-out, color 700ms ease-in-out;
  background-color: var(--note-default-bg);
  color: var(--note-default-fg);
  max-width: 400px;
  max-height: 400px;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--grid-gutter);
  display: grid;
  grid-template-rows: $short-row auto $short-row;

  // .toolbar {
  // }

  .submit {
    margin-top: var(--grid-gutter);
  }
}

.square {
  &::before {
    content: '';
    display: block;
    width: 0;
    padding-bottom: 100%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }
}

table {
  position: fixed;
  bottom: 0;
  background: gray;
  color: white;
  z-index: 1000;
}
</style>

<script>
import CreatorToolbar from '@/components/organisms/note-create/create-toolbar'
import Message from '@/components/organisms/note-create/create-message'
import FormSubmit from '@/components/molecules/form-submit'

export default {
  components: {
    CreatorToolbar,
    Message,
    FormSubmit,
  },
  data() {
    return {
      tag: null,
      tags: ['none', 'love', 'cute', 'sad', 'joy', 'idk'],
      type: null,
      types: [
        { value: 'text', message: 'message', defaultChecked: true },
        { value: 'link', message: 'link' },
        { value: 'image', message: 'image' },
      ],
    }
  },
  mounted() {
    this.type = this.$refs.utils.type
    this.tag = this.tags[0]
    this.$on('tagUpdated', this.onTagChange)
  },
  methods: {
    onTypeChange(newType) {
      this.type = newType
    },
    onTagChange(newIndex) {
      this.tag = this.tags[newIndex]
    },
  },
}
</script>
