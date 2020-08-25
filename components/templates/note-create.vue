<template>
  <aside class="note-creator" :class="`tag--${tag}`">
    <form @submit.prevent.stop="submitNote" class="content">
      <CreatorToolbar
        class="toolbar"
        :tags="tags"
        :types="types"
        ref="utils"
        @input="onTypeChange"
      />

      <div class="inputs">
        <Message
          v-if="type === 'text'"
          ref="message"
          @input="onMessageChange"
        />
        <Link v-if="type === 'link'" ref="link" @input="onLinkChange" />
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
import * as firebase from 'firebase/app'
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
      link: null,
      formIsValid: false,
      tags: ['none', 'love', 'cute', 'sad', 'joy', 'idk'],
      types: [
        { value: 'text', message: 'message', defaultChecked: true },
        { value: 'link', message: 'link' },
        { value: 'image', message: 'image' },
      ],
      coords: {
        x: null,
        y: null,
        z: null,
        r: null,
      },
      submissionRef: null,
      submissionData: null,
    }
  },
  mounted() {
    this.type = this.$refs.utils.type
    this.tag = this.tags[0]
    this.$on('tagUpdated', this.onTagChange)
    this.$on('embedDataReady', this.onLinkEmbed)
  },
  beforeDestroy() {
    this.$off('tagUpdated', this.onTagChange)
  },
  methods: {
    onTypeChange(newType) {
      this.type = newType
      this.validate()
    },
    onTagChange(newIndex) {
      this.tag = this.tags[newIndex]
      this.validate()
    },
    onMessageChange(val) {
      this.message = val
      this.validate()
    },
    onLinkChange(val) {
      this.link = val
      this.validate()
    },
    onLinkEmbed(val) {
      this.linkEmbed = val
    },
    validate() {
      switch (this.type) {
        case 'text':
          this.formIsValid = this.message && this.message.length > 0
          break

        case 'link':
          this.formIsValid = this.$refs.link && this.$refs.link.linkIsValid
          break

        default:
          this.formIsValid = false
          break
      }
    },
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return (Math.random() * (max - min) + min).toFixed(3)
    },
    setRandomCoords() {
      const xBounds = this.$store.state.notes.canvasWidth
      const yBounds = this.$store.state.notes.canvasHeight
      const selfWidth = 400
      const randomX = this.getRandomInt(0, xBounds - selfWidth)
      const randomY = this.getRandomInt(0, yBounds - selfWidth)
      this.coords.x = parseFloat(((randomX / xBounds) * 100).toFixed(4))
      this.coords.y = parseFloat(((randomY / yBounds) * 100).toFixed(4))
      this.coords.z = this.$store.state.notes.highestZ
      this.coords.r = this.getRandomInt(-4, 4)
    },
    createFirebaseRef() {
      // create a doc reference before we set/add it
      // we'll use it so we can edit/delete item later on...
      this.submissionRef = this.$firebase
        .firestore()
        .collection('notes')
        .doc()
    },
    modelSubmissionData() {
      this.submissionData = {
        author: this.$store.state.user.uid,
        id: this.submissionRef.id,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        tag: this.tag,
        type: this.type,
        coords: this.coords,
        data: {
          message: this.message
            ? // replace \n's with <br/>'s
              this.message.replace(/\n/g, '<br \\>')
            : null,
          link: this.linkEmbed || null,
        },
      }
      console.log(this.submissionData)
    },
    async submitNote(imageUrl) {
      // create a random, new location for the note
      this.setRandomCoords()
      // create firebase reference
      this.createFirebaseRef()
      // model data
      this.modelSubmissionData()

      // push data to firebase
      await this.$firebase
        .firestore()
        .collection('notes')
        .doc(this.submissionData.id)
        .set(this.submissionData)
        .then(() => {
          this.submitSuccess()
        })
        .catch(error => {
          this.submitError(error)
        })
    },
    submitSuccess() {
      this.resetForm()
    },
    resetForm() {
      if (this.$refs.message) {
        this.$refs.message.reset()
      }
      if (this.$refs.link) {
        this.$refs.link.reset()
      }
    },
    submitError(error) {
      this.error = error
      console.error('Error adding document: ', error)
    },
  },
}
</script>
