<template>
  <div>
    <post v-show="$store.state.user.isLoggedIn" class="post" />
    <ul>
      <li v-for="(post, postIndex) in posts" :key="postIndex">
        <h2 v-if="post.title">{{ post.title }}</h2>
        <p v-if="post.author" style="font-size:16px;">
          author: {{ post.author }}
        </p>
        <figure v-if="post.media">
          <img v-if="post.media.image" :src="post.media.image" alt="" />
        </figure>
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
    context.store.dispatch('user/authenticate')

    const data = await context.$firebase
      .firestore()
      .collection('posts')
      .orderBy('created', 'desc')
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
        .orderBy('created', 'desc')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.posts = snapshot.docs.map(doc => doc.data())
            }
            if (change.type === 'modified') {
              console.log('Modified city: ', change.doc.data())
            }
            if (change.type === 'removed') {
              console.log('Removed city: ', change.doc.data())
            }
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
