<template>
  <div class="site-wrapper">
    <Notes :notes="notes" />
    <br />
    <br />
    <CreateNote v-show="$store.state.user.isLoggedIn" class="post" />
  </div>
</template>

<script>
import CreateNote from '@/components/organisms/note-create'
import Notes from '@/components/templates/notes'

export default {
  components: {
    CreateNote,
    Notes,
  },
  async asyncData(context) {
    const data = await context.$firebase
      .firestore()
      .collection('notes')
      .orderBy('created', 'desc')
      .get()

    return {
      notes: data.docs.map(doc => doc.data()),
    }
  },
  created() {
    this.watchData()
  },
  methods: {
    watchData() {
      this.$firebase
        .firestore()
        .collection('notes')
        .orderBy('created', 'desc')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              this.notes = snapshot.docs.map(doc => doc.data())
            }
            if (change.type === 'modified') {
              this.notes = snapshot.docs.map(doc => doc.data())
              // console.log('Modified: ', change.doc.data())
            }
            if (change.type === 'removed') {
              this.notes = snapshot.docs.map(doc => doc.data())
              // console.log('Removed: ', change.doc.data())
            }
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.site-wrapper {
  height: 100%;
}
</style>
