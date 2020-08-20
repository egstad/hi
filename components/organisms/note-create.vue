<!--
POST
This component is a post creation form. In the future, users can add a title, image, url,
and more. But for now, it's just a title and image.

So how's it work?
1. If an image exists, it's uploaded first. If it errors out, the post isn't created.
2. Once the image is successfully uploaded (fileUploadedSuccess), let' create the post
-->
<template>
  <transition
    name="fade"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false"
  >
    <section class="writing" v-show="isOpen" ref="newNote">
      <VueFocusTrap
        ref="dialog"
        @open="open"
        @gofirst="goFirst"
        @golast="goLast"
      >
        <header>
          <h2 class="t-headline">new note</h2>
        </header>

        <form
          v-if="$store.state.user.isLoggedIn"
          @submit.prevent="onSubmit"
          @keydown.esc="$store.dispatch('notes/scatter', false)"
        >
          <FormTextarea
            v-model="title"
            ref="title"
            placeholder="dear internet diary..."
            label="write message"
            :max="titleMaxChars"
            theme="dark"
            autocomplete="off"
            required
          />

          <FormRadio
            :options="postTagOptions"
            v-model="postTag"
            label="choose tag"
            name="tag"
            theme="dark"
            ref="tag"
          />

          <FormRadio
            :options="postAttachmentOptions"
            v-model="postAttachment"
            label="add attachment"
            name="attachment"
            theme="dark"
            ref="attachment"
          />

          <div v-if="postAttachment === 'link'">
            <NoteLinkUploader ref="link" required />
          </div>

          <div v-if="postAttachment === 'image'">
            <NoteImageUploader ref="image" />
          </div>

          <p v-if="error">{{ error }}</p>
          <FormSubmit text="add note" theme="dark" ref="submit" />
        </form>
      </VueFocusTrap>
    </section>
  </transition>
</template>

<style lang="scss" scoped>
.writing {
  transition: background-color 700ms ease-in-out, color 700ms ease-in-out;
  margin: 0 auto;
  background: rgba(var(--tertiary), 1);
  color: rgba(var(--secondary), 1);
  border-radius: var(--note-radius);
  padding: calc(var(--grid-gutter));
  box-shadow: 0px 45px 123px rgba(black, 0.07),
    0px 25.8654px 57.5993px rgba(black, 0.0444941),
    0px 12.4704px 34.8483px rgba(black, 0.0340904),
    0px 4.35011px 18.7879px rgba(black, 0.0210947);

  width: 100%;
  max-width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 3000;
  transform: translate3d(-50%, -50%, 0);

  header {
    padding: calc(var(--grid-gutter) * 1) calc(var(--grid-gutter) * 0.75)
      calc(var(--grid-gutter) * 3);
  }

  .button {
    margin-top: var(--grid-gutter);
  }
}
</style>

<script>
import * as firebase from 'firebase/app'
// import FormInput from '@/components/molecules/form-input'
import { VueFocusTrap } from 'vue-a11y-utils'
import gsap from 'gsap'
import FormTextarea from '@/components/molecules/form-textarea'
import FormRadio from '@/components/molecules/form-radio'
// import FormSelect from '@/components/molecules/form-select'
import FormSubmit from '@/components/molecules/form-submit'
import NoteImageUploader from '@/components/molecules/note-create-image'
import NoteLinkUploader from '@/components/molecules/note-create-link'

export default {
  components: {
    NoteImageUploader,
    NoteLinkUploader,
    FormRadio,
    FormSubmit,
    // FormInput,
    FormTextarea,
    // FormSelect,
    VueFocusTrap,
  },
  data() {
    return {
      title: '',
      titleMaxChars: 200,
      error: '',
      isOpen: false,
      postType: null,

      postHasImage: false,
      postHasLink: false,
      postImage: null,
      postLink: null,
      postData: null,
      postRef: null,
      postAttachment: 'null',
      postAttachmentOptions: [
        { value: 'none', message: 'nope', defaultChecked: true },
        { value: 'link', message: 'link' },
        { value: 'image', message: 'image' },
      ],
      postTag: 'none',
      postTagOptions: [
        { value: 'default', message: '¶', defaultChecked: true },
        { value: 'love', message: '♥' },
        { value: 'cute', message: '☃️' },
        { value: 'sad', message: '☔' },
        { value: 'sparkle', message: '✨' },
        { value: 'curious', message: '?' },
      ],
    }
  },
  mounted() {
    this.$app.$on('newNote::open', this.openNewNote)
    this.$app.$on('newNote::close', this.closeNewNote)
    this.$app.$on('imageUploaded', this.onImageUpload)
    this.getHighestZ()
  },
  beforeDestroy() {
    this.$app.$off('newNote::open', this.openNewNote)
    this.$app.$off('imageUploaded', this.onImageUpload)
  },
  methods: {
    openNewNote() {
      this.isOpen = true
      this.$refs.dialog.open()
      this.goFirst()
    },
    closeNewNote() {
      this.isOpen = false
      this.$refs.dialog.close(true)
    },
    onSubmit() {
      switch (this.postAttachment) {
        case 'image':
          // submits title + image
          this.$refs.image.validateAndUpload()
          break

        case 'link':
          // submits title + link
          this.submitPost()
          break

        default:
          // only submits title
          this.submitPost()
          break
      }
    },
    onSubmitComplete() {
      // reset note
      this.title = ''
      this.postAttachment = 'link'
      this.postImage = null
      this.postAttachment = 'null'
      this.postTag = 'none'

      this.$refs.tag.reset()
      this.$refs.attachment.reset()

      if (this.$refs.image) {
        this.$refs.image.reset()
      } else if (this.$refs.link) {
        this.$refs.link.reset()
      }

      this.$store.dispatch('notes/scatter', false)
    },
    onSubmitError(error) {
      this.error = error
      console.error('Error adding document: ', error)
    },
    onImageUpload(imageUrl) {
      this.postImage = imageUrl
      console.log('onImageUpload', this.postImage)
      this.submitPost()
    },
    setType() {
      if (this.postImage) {
        this.postType = 'image'
      } else if (this.$refs.link) {
        this.postType = 'link'
      } else {
        this.postType = 'text'
      }
    },
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return (Math.random() * (max - min) + min).toFixed(3)
    },
    modelData() {
      const xBounds = this.$store.state.notes.canvasWidth
      const yBounds = this.$store.state.notes.canvasHeight
      const selfWidth = 400
      const randomX = this.getRandomInt(0, xBounds - selfWidth)
      const randomY = this.getRandomInt(0, yBounds - selfWidth)
      const x = parseFloat(((randomX / xBounds) * 100).toFixed(4))
      const y = parseFloat(((randomY / yBounds) * 100).toFixed(4))
      const z = parseInt(this.getHighestZ()) || 1100

      console.log(z)

      this.setType()

      // create a doc reference before we set/add it
      // we'll use it so we can edit/delete item later on...
      this.postRef = this.$firebase
        .firestore()
        .collection('notes')
        .doc()

      this.postData = {
        message: this.title,
        type: this.postType,
        author: this.$store.state.user.uid,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        id: this.postRef.id,
        tag: this.postTag || null,
        media: {
          link: this.$refs.link ? this.$refs.link.link : null,
          image: this.postImage || null,
          embed: this.$refs.link ? this.$refs.link.linkEmbed : null,
        },
        coords: {
          x,
          y,
          z,
        },
        rotation: this.getRandomInt(-4, 4),
      }
    },
    async submitPost(imageUrl) {
      // create data
      this.modelData()

      // push data to firebase
      await this.$firebase
        .firestore()
        .collection('notes')
        .doc(this.postData.id)
        .set(this.postData)
        .then(() => {
          this.onSubmitComplete()
        })
        .catch(error => {
          this.onSubmitError(error)
        })
    },
    open() {
      this.goFirst()
    },
    goFirst() {
      const firstItem = this.$refs.title.$refs.input
      firstItem.focus()
    },
    goLast() {
      const lastItem = this.$refs.submit.$el
      lastItem.focus()
    },
    getHighestZ() {
      const notes = this.$app.$el.querySelectorAll('.note')
      let highestZ = 0

      notes.forEach(note => {
        const zIndex = parseInt(note.style.zIndex)
        console.log(zIndex)
        if (zIndex > highestZ) {
          highestZ = zIndex
        }
      })

      console.log('higest', highestZ)

      return parseInt(highestZ) + 1
    },
    beforeEnter() {
      gsap.set(this.$refs.newNote, {
        yPercent: 100,
        rotation: 20,
      })
    },
    enter(el, done) {
      this.open()
      gsap.to(this.$refs.newNote, {
        yPercent: 0,
        rotation: 0,
        duration: 0.5,
        ease: 'power4.out',
        onComplete: () => {
          done()
        },
      })
    },
    leave(el, done) {
      gsap.to(this.$refs.newNote, {
        yPercent: 300,
        rotation: 40,
        duration: 1,
        ease: 'power4.in',
        onComplete: () => {
          done()
          this.$app.$emit('undimNote')
        },
      })
    },
  },
}
</script>
