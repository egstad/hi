<template>
  <aside class="note-creator" :class="`tag--${tag}`">
    <form @submit.prevent class="content">
      <CreatorToolbar
        class="toolbar"
        :tags="tags"
        :types="types"
        ref="utils"
        @input="onTypeChange"
      />

      <div class="inputs">
        <Message v-if="type === 'text'" @input="onMessageInput" />
        <Link v-if="type === 'link'" />
      </div>

      <div class="submit" :class="{ expanded: formIsValid }">
        <FormSubmit text="publish" />
      </div>
    </form>

    <div class="square"></div>
  </aside>
</template>

<style lang="scss" scoped>
$short-row: calc(var(--note-icon-size) + var(--grid-gutter));

.note-creator {
  position: relative;
  color: var(--note-foreground);
  overflow: hidden;
  border-radius: var(--note-radius);
  transition: background-color 400ms ease-out, color 400ms ease-out;
  max-width: 400px;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--grid-gutter);
  display: grid;
  grid-template-rows: $short-row 1fr auto;

  .submit {
    transition: max-height 0.5s var(--timing-elastic);
    overflow: hidden;
    max-height: 0;

    /deep/button {
      margin-top: var(--grid-gutter);
    }

    &.expanded {
      max-height: $short-row;
    }
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
</style>

<script>
import CreatorToolbar from '@/components/organisms/note-create/create-toolbar'
import Message from '@/components/organisms/note-create/create-message'
import Link from '@/components/organisms/note-create/create-link'
import FormSubmit from '@/components/molecules/form-submit'

export default {
  components: {
    CreatorToolbar,
    Message,
    Link,
    FormSubmit,
  },
  data() {
    return {
      tag: null,
      type: null,
      message: null,
      tags: ['none', 'love', 'cute', 'sad', 'joy', 'idk'],
      formIsValid: false,
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
  beforeDestroy() {
    this.$off('tagUpdated', this.onTagChange)
  },
  methods: {
    onTypeChange(newType) {
      this.type = newType
      this.resetAll()
      this.validate()
    },
    onTagChange(newIndex) {
      this.tag = this.tags[newIndex]
      this.validate()
    },
    onMessageInput(val) {
      this.message = val
      this.validate()
    },
    resetAll() {
      this.message = null
    },
    validate() {
      switch (this.type) {
        case 'text':
          this.formIsValid = this.message && this.message.length > 0
          break

        default:
          this.formIsValid = false
          break
      }
    },
  },
}
</script>
