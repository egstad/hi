<template>
  <form v-if="$store.state.user.isLoggedIn" @submit.prevent="submitPost">
    <h1>let's add a new post</h1>
    <input type="text" v-model="title" />
    <button>Submit</button>
  </form>
</template>

<script>
import * as firebase from 'firebase/app'
export default {
  data() {
    return {
      title: '',
    }
  },
  mounted() {
    this.$app.$on('post::author', this.authorPost)
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
    submitPost() {
      this.$firebase
        .firestore()
        .collection('posts')
        .add({
          title: this.title,
          media: {
            image: '//placehold.it/400',
          },
          // timestamp: https://maye.pwafire.org/articles/using-timestamp-to-filter-and-order-firebase-cloud-firestore-documents/
          created: firebase.firestore.FieldValue.serverTimestamp(),
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
