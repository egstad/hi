<template>
  <div>
    <CreateNote v-show="$store.state.user.isLoggedIn" class="post" />
    <ul>
      <li v-for="(note, noteIndex) in notes" :key="noteIndex">
        <Note :title="note.title" :author="note.author" :media="note.media" />
      </li>
    </ul>
  </div>
</template>

<script>
import CreateNote from '@/components/molecules/note-create'
import Note from '@/components/molecules/note'

export default {
  components: {
    CreateNote,
    Note,
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
      notes: data.docs.map(doc => doc.data()),
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
