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
    <table style="border: 1px solid black;width: 200px;text-align: center;">
      <tr>
        <td style="border: 1px solid black">
          <label
            >note
            <input type="radio" v-model="postType" value="note" />
          </label>
        </td>
        <td style="border: 1px solid black">
          <label
            >link
            <input type="radio" v-model="postType" value="link" />
          </label>
        </td>
        <td style="border: 1px solid black">
          <label
            >image
            <input type="radio" v-model="postType" value="image" />
          </label>
        </td>
      </tr>
    </table>

    <label>
      let's add a new post
      <input type="text" v-model="title" required /> </label
    ><br />

    <div v-if="postType === 'image'">
      <PostImageUploader ref="image" />
    </div>

    <div v-if="postType === 'link'">
      <PostLinkUploader ref="link" />
    </div>

    <p v-if="error">{{ error }}</p>
    <button>Submit</button>
  </form>
</template>

<script>
import * as firebase from 'firebase/app'
import PostImageUploader from '@/components/molecules/post-image'
import PostLinkUploader from '@/components/molecules/post-link'
export default {
  components: {
    PostImageUploader,
    PostLinkUploader,
  },
  data() {
    return {
      title: '',
      error: '',
      postType: 'note',
      postHasImage: false,
      postHasLink: false,
      postImage: null,
      postLink: null,
      postData: null,
      postRef: null,
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
      switch (this.postType) {
        case 'image':
          // submits title + image
          this.$refs.image.validateAndUpload()
          break

        case 'link':
          // submits title + link
          this.submitPost()
          break

        case 'note':
          // only submits title
          this.submitPost()
          break

        default:
          console.warn('this.postType was undefined')
          break
      }

      // if (this.postType === 'image') {
      // } else {
      //   this.submitPost()
      // }
    },
    onSubmitComplete() {
      // reset image
      if (this.$refs.image) {
        this.$refs.image.reset()
      }
      // reset link
      if (this.$refs.link) {
        this.$refs.link.reset()
      }
      // reset note
      this.title = ''
      this.postType = 'note'
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
    modelData() {
      // create a doc reference before we set/add it
      // we'll use it so we can edit/delete item later on...
      this.postRef = this.$firebase
        .firestore()
        .collection('posts')
        .doc()

      this.postData = {
        title: this.title,
        author: this.$store.state.user.uid,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        id: this.postRef.id,
        media: {
          image: this.postImage || '',
          link: this.postLink || '',
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
