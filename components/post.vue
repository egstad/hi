<template>
  <form @submit.prevent="submit">
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
  methods: {
    submit() {
      this.$firebase
        .firestore()
        .collection('posts')
        .add({
          title: this.title,
          // timestamp: https://maye.pwafire.org/articles/using-timestamp-to-filter-and-order-firebase-cloud-firestore-documents/
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
