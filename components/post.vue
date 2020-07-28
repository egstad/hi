<!--
POST
This component is a post creation form. In the future, users can add a title, image, url,
and more. But for now, it's just a title and image.

So how's it work?
1. If an image exists, it's uploaded first. If it errors out, the post isn't created.
2. Once the image is successfully uploaded (fileUploadedSuccess), let' create the post
-->
<template>
  <form v-if="$store.state.user.isLoggedIn" @submit.prevent="onSubmit">
    <label>
      let's add a new post
      <input type="text" v-model="title" required /> </label
    ><br />

    <label>
      attach image?
      <input type="checkbox" v-model="postHasImage" /> </label
    ><br />
    <FileUploader v-if="postHasImage" ref="fileUploader" />

    <p v-if="error">{{ error }}</p>
    <button>Submit</button>
  </form>
</template>

<script>
import * as firebase from 'firebase/app'
import FileUploader from '@/components/molecules/post-uploader'
export default {
  components: {
    FileUploader,
  },
  data() {
    return {
      title: '',
      error: '',
      postHasImage: false,
    }
  },
  mounted() {
    this.$app.$on('post::author', this.authorPost)
    this.$on('fileUploadedSuccess', this.submitPost)
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
      if (this.postHasImage) {
        this.$refs.fileUploader.validateAndUpload()
      } else {
        this.submitPost()
      }
    },
    createPost() {},
    async submitPost(imageUrl) {
      await this.$firebase
        .firestore()
        .collection('posts')
        .add({
          title: this.title,
          author: this.$store.state.user.uid,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          media: {
            image: imageUrl || '',
          },
        })
        .then(docRef => {
          this.title = ''
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        })
    },
  },
}
</script>
