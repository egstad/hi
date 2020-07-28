<template>
  <form v-if="$store.state.user.isLoggedIn" @submit.prevent="beginSubmission">
    <h1>let's add a new post</h1>
    <input type="text" v-model="title" required />
    <FileUpload ref="file" />
    <button>Submit</button>
  </form>
</template>

<script>
import * as firebase from 'firebase/app'
import FileUpload from '@/components/molecules/post-uploader'
export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      title: '',
      asset: '',
    }
  },
  mounted() {
    this.$app.$on('post::author', this.authorPost)
    this.$on('fileUploadedSuccess', val => {
      this.asset = val
      this.submitPost()
    })
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
    beginSubmission() {
      const attachedFile = this.$refs.file.$refs.fileInput.value !== ''
      // if has file?
      if (attachedFile) {
        this.uploadImage()
      } else {
        this.submitPost()
      }
    },
    uploadImage() {
      this.$refs.file.validateAndUpload()
    },
    submitPost() {
      this.$firebase
        .firestore()
        .collection('posts')
        .add({
          title: this.title,
          author: this.$store.state.user.uid,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          tag: '',
          media: {
            type: 'text',
            asset: this.asset,
          },
        })
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        })
    },
  },
}
</script>
