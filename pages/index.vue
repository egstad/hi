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

    // what time is it?
    const date = new Date()
    // but like, in seconds plz
    const now = Math.round(date.getTime() / 1000)
    // how many seconds should posts last? (a day)
    const noteDuration = 86400
    // fetch posts only a day old
    const recentNotes = data.docs.filter(doc => {
      const created = doc.data().created.seconds

      return now - created < noteDuration
    })

    return {
      notes: recentNotes.map(doc => doc.data()),
    }
  },
  created() {
    this.watchData()
  },
  methods: {
    filterNotes(data) {
      // what time is it?
      const date = new Date()
      // but like, in seconds plz
      const now = Math.round(date.getTime() / 1000)
      // how many seconds should posts last? (a day)
      const noteDuration = 86400
      // fetch posts only a day old
      const recentNotes = data.filter(doc => {
        // newly created items don't have a time assigned quite yet...
        // hacky fix is to set the time to right now
        const created = doc.data().created ? doc.data().created.seconds : now
        const isNotExpired = now - created < noteDuration

        return isNotExpired
      })

      return recentNotes
    },
    watchData() {
      this.$firebase
        .firestore()
        .collection('notes')
        .orderBy('created', 'desc')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const updates = this.filterNotes(snapshot.docs)
              this.notes = updates.map(doc => doc.data())
              // this.notes = snapshot.docs.map(doc => doc.data())
            }
            if (change.type === 'modified') {
              const updates = this.filterNotes(snapshot.docs)
              this.notes = updates.map(doc => doc.data())
              // console.log('Modified: ', change.doc.data())
            }
            if (change.type === 'removed') {
              const updates = this.filterNotes(snapshot.docs)
              this.notes = updates.map(doc => doc.data())
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
