<!--
POST
This component is a post creation form. In the future, users can add a title, image, url,
and more. But for now, it's just a title and image.

So how's it work?
1. If an image exists, it's uploaded first. If it errors out, the post isn't created.
2. Once the image is successfully uploaded (fileUploadedSuccess), let' create the post
-->
<template>
  <section class="writing">
    <header>
      <h2 class="t-headline">new note</h2>
    </header>

    <form v-if="$store.state.user.isLoggedIn" @submit.prevent="onSubmit">
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
        label="select a tag"
        name="tag"
        theme="dark"
        ref="tag"
      />

      <FormRadio
        :options="postAttachmentOptions"
        v-model="postAttachment"
        label="attachment (optional)"
        name="attachment"
        theme="dark"
        ref="attachment"
      />

      <div v-if="postAttachment === 'link'">
        <PostLinkUploader ref="link" required />
      </div>

      <!-- <FormSelect
        :options="postTagOptions"
        v-model="postTag"
        ref="tag"
        label="note type"
        theme="dark"
      /> -->

      <div v-if="postAttachment === 'image'">
        <PostImageUploader ref="image" />
      </div>

      <p v-if="error">{{ error }}</p>
      <FormSubmit text="add note" theme="dark" />
    </form>
  </section>
</template>

<style lang="scss" scoped>
.writing {
  margin: 0 auto;
  background: var(--tertiary);
  border-radius: var(--note-radius);
  padding: calc(var(--grid-gutter));
  box-shadow: 0px 45px 123px rgba(black, 0.07),
    0px 25.8654px 57.5993px rgba(black, 0.0444941),
    0px 12.4704px 34.8483px rgba(black, 0.0340904),
    0px 4.35011px 18.7879px rgba(black, 0.0210947);

  width: 100%;
  max-width: 400px;

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
import FormTextarea from '@/components/molecules/form-textarea'
import FormRadio from '@/components/molecules/form-radio'
// import FormSelect from '@/components/molecules/form-select'
import FormSubmit from '@/components/molecules/form-submit'
import PostImageUploader from '@/components/molecules/post-image'
import PostLinkUploader from '@/components/molecules/post-link'
export default {
  components: {
    PostImageUploader,
    PostLinkUploader,
    FormRadio,
    FormSubmit,
    // FormInput,
    FormTextarea,
    // FormSelect,
  },
  data() {
    return {
      title: '',
      titleMaxChars: 200,
      error: '',
      postType: null,

      postHasImage: false,
      postHasLink: false,
      postImage: null,
      postLink: null,
      postData: null,
      postRef: null,
      postAttachment: 'null',
      postAttachmentOptions: [
        { value: 'null', message: 'none' },
        { value: 'link', message: 'link' },
        { value: 'image', message: 'image' },
      ],
      postTag: 'none',
      postTagOptions: [
        { value: 'none', message: '¶' },
        { value: 'encouraging', message: '♥' },
        { value: 'cute', message: '☃️' },
        { value: 'sad', message: '☔' },
        { value: 'nostalgic', message: '✨' },
        { value: 'curious', message: '?' },
      ],
    }
  },
  mounted() {
    this.$app.$on('post::author', this.authorPost)
    this.$on('imageUploaded', this.onImageUpload)
    this.$on('linkPreviewReady', this.onLinkPreviewReady)
  },
  methods: {
    async authorPost() {
      // let's see who is logged in
      await this.$store.dispatch('user/authenticate')

      // no one? let's sign them in anonymously
      if (!this.$store.state.user.isLoggedIn) {
        await this.$store.dispatch('user/loginAnonymously')
      }
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

        case 'null':
          // only submits title
          this.submitPost()
          break

        default:
          console.warn('this.postAttachment was undefined')
          break
      }

      // if (this.postAttachment === 'image') {
      // } else {
      //   this.submitPost()
      // }
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
    },
    onSubmitError(error) {
      this.error = error
      console.error('Error adding document: ', error)
    },
    onImageUpload(imageUrl) {
      this.postImage = imageUrl
      this.submitPost()
    },
    onLinkPreviewReady(data) {
      this.postLink = data
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
    modelData() {
      this.setType()

      // create a doc reference before we set/add it
      // we'll use it so we can edit/delete item later on...
      this.postRef = this.$firebase
        .firestore()
        .collection('posts')
        .doc()

      this.postData = {
        title: this.title,
        type: this.postType,
        author: this.$store.state.user.uid,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        id: this.postRef.id,
        tag: this.postTag || null,
        link: this.$refs.link ? this.$refs.link.link : null,
        media: {
          embed: this.$refs.link ? this.$refs.link.linkEmbed : null,
          image: this.postImage || null,
        },
      }
    },
    async submitPost(imageUrl) {
      // create data
      this.modelData()

      // push data to firebase
      await this.$firebase
        .firestore()
        .collection('posts')
        .doc(this.postData.id)
        .set(this.postData)
        .then(() => {
          this.onSubmitComplete()
        })
        .catch(error => {
          this.onSubmitError(error)
        })
    },
  },
}
</script>
