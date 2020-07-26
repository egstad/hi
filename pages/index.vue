<template>
  <div>
    <post v-show="$store.state.user.isLoggedIn" class="post" />
    <ul>
      <li v-for="(post, postIndex) in posts" :key="postIndex">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import post from '@/components/post'

export default {
  components: {
    post,
  },
  async asyncData(context) {
    // are we athenticated?
    // context.store.dispatch('user/authenticate')

    const data = await context.$firebase
      .firestore()
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .get()

    return {
      posts: data.docs.map(doc => doc.data()),
    }
  },
  data() {
    return {
      posts: null,
    }
  },
  mounted() {
    this.watchData()
  },
  methods: {
    watchData() {
      this.$firebase
        .firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.posts = snapshot.docs.map(doc => doc.data())
            }
            // if (change.type === 'modified') {
            //   console.log('Modified city: ', change.doc.data())
            // }
            // if (change.type === 'removed') {
            //   console.log('Removed city: ', change.doc.data())
            // }
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
li {
  font-size: calc(1em + 1vw);
}
</style>
