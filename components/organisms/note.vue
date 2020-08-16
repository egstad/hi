<template>
  <li
    class="note"
    :class="(`type--${type}`, `tag--${tag}`)"
    ref="note"
    :data-x="coords.x"
    :data-y="coords.y"
  >
    <article class="content">
      <template v-if="type === 'image'">
        <NoteImage :image="image" :message="message" />
      </template>

      <template v-else-if="type === 'link'">
        <NoteEmbed :embed="embed" :message="message" />
      </template>

      <template v-else>
        <NoteText :message="message" />
      </template>

      <NoteUtilities
        :is-opaque="iconsAreOpaque"
        :tag="tag"
        :type="type"
        :author="author"
        :note-id="noteId"
      />
    </article>
  </li>
</template>

<style lang="scss" scoped>
.note {
  position: relative;
  color: var(--note-foreground);
  overflow: hidden;
  padding: var(--grid-gutter) !important;
  border-radius: var(--note-radius);
  transition: background-color 700ms ease-in-out, color 700ms ease-in-out;
  background-color: var(--note-default-bg);
  color: var(--note-default-fg);

  .content {
    // makes it a perfect square
    &::before {
      content: '';
      display: block;
      width: 0;
      padding-bottom: 100%;
      grid-row: 1 / 1;
      grid-column: 1 / 1;
    }
  }

  &:hover {
    /deep/.note__utilities {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // default, love, cute, sad, sparkle, curious
  &.tag {
    &--none {
      background: var(--note-default-bg);
      color: var(--note-default-fg);
    }
    &--love {
      background: var(--note-love-bg);
      color: var(--note-love-fg);
    }
    &--cute {
      background: var(--note-cute-bg);
      color: var(--note-cute-fg);
      fill: var(--note-cute-fg);
    }
    &--sad {
      background: var(--note-sad-bg);
      color: var(--note-sad-fg);
    }
    &--sparkle {
      background: var(--note-curious-bg);
      color: var(--note-curious-fg);
    }
    &--curious {
      background: var(--note-curious-bg);
      color: var(--note-curious-fg);
    }
  }

  // /deep/.note__utilities {
  //   opacity: 0;
  //   pointer-events: none;
  //   transition: opacity 200ms ease-out;
  // }
}
</style>

<script>
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from '@/plugins/inertia'
import NoteText from '@/components/molecules/note-text'
import NoteEmbed from '@/components/molecules/note-embed'
import NoteImage from '@/components/molecules/note-image'
import NoteUtilities from '@/components/molecules/note-utilities'

gsap.registerPlugin(Draggable, InertiaPlugin)

export default {
  components: {
    NoteText,
    NoteEmbed,
    NoteImage,
    NoteUtilities,
  },
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newTitle: null,
      isExpanded: false,
      isDraggable: false,
      isMoving: false,
      draggableInstance: null,
    }
  },
  computed: {
    iconsAreOpaque: {
      get() {
        return false
      },
      set() {
        if (
          this.type === 'image' ||
          (this.type === 'link' && this.embed.thumbnail) ||
          (this.embed && this.embed.type === 'image') ||
          (this.type === 'link' &&
            this.embed.type === 'video' &&
            this.embed.embed)
        ) {
          return true
        } else {
          return false
        }
      },
    },
    // @string
    // @returns: none, link, image
    type() {
      return this.note.type
    },
    // @string
    // @returns: main message from note
    message() {
      return this.note.message
    },
    // @string
    // @returns: default, love, cute, sad, sparkle, curious
    tag() {
      return this.note.tag
    },
    // @string
    // @returns: a unique id for the author
    author() {
      return this.note.author
    },
    // @string
    // @returns: a bunch of random letters and numbers
    noteId() {
      return this.note.id
    },
    // @string
    // @returns: a url attached to the note
    link() {
      return this.note.media.link
    },
    // @string
    // @returns: a firebase url to the uploaded image
    image() {
      return this.note.media.image
    },
    // @string
    // @returns: an embed attached to the note
    embed() {
      return this.note.media.embed
    },
    // @object
    // @returns: the coordinates of the note
    coords(old) {
      return this.note.coords
    },
    // @number
    // @returns: a random number
    rotation() {
      return this.note.rotation
    },
  },
  watch: {
    coords(newValue, oldValue) {
      const xChange = newValue.x !== oldValue.x
      const yChange = newValue.y !== oldValue.y

      if (xChange || yChange) {
        this.moveNote()
      }
    },
  },
  beforeMount() {
    this.$on('setIconOpacity', this.onIconOpacity)
  },
  beforeDestroy() {
    this.$off('setIconOpacity', this.onIconOpacity)
  },
  mounted() {
    this.$app.$on('draggableInit', this.draggableInit)
    this.$app.$on('draggableDestroy', this.draggableDestroy)
    this.$on('deleteNote', this.deleteNote)
    this.draggableInit()
    this.showNote()
  },
  methods: {
    showNote() {
      // stagger animation speeds
      const time = Math.random() * 0.5 + 0.5

      gsap.fromTo(
        this.$refs.note,
        {
          scale: 0,
          rotation: Math.random() * 10,
          x: 0,
          y: 0,
        },
        {
          scale: 1,
          rotation: this.$store.state.notes.areDraggable ? this.rotation : 0,
          x: this.$store.state.notes.areDraggable ? this.coords.x : 0,
          y: this.$store.state.notes.areDraggable ? this.coords.y : 0,
          duration: time,
          onComplete: () => {
            this.moveNote()
          },
          ease: 'elastic.out(1, 0.8)',
        }
      )
    },
    deleteNote() {
      const time = Math.random() * 0.5 + 0.5

      gsap.to(this.$refs.note, {
        y: this.$store.state.notes.canvasHeight * 2,
        rotation: `+=${this.getRandomInt(-90, 90)}`,
        duration: time,
        ease: 'power4.in',
        onComplete: () => {
          this.deleteFromFirebase()
        },
      })
    },
    moveNote() {
      // lets make sure there is something to move in the first place
      if (this.$refs.note && this.draggableInstance) {
        // these vars are helpful in determining if note is offscreen
        const bounds = document.querySelector('.notes').getBoundingClientRect()
        const self = this.$refs.note.getBoundingClientRect()
        const boundsWidth = bounds.width
        const boundsHeight = bounds.height
        const selfWidth = self.width
        const selfHeight = self.height
        const isOffscreenX = this.note.coords.x + selfWidth > boundsWidth
        const isOffscreenY = this.note.coords.y + selfHeight > boundsHeight

        // is note offscreen?
        // like, what if i create a note on a huge screen and you're on a small one?
        // you wouldn't be able to see it.
        gsap.to(this.$refs.note, 1.5, {
          x: isOffscreenX ? boundsWidth - selfWidth : this.coords.x,
          y: isOffscreenY ? boundsHeight - selfHeight : this.coords.y,
          rotation: this.rotation,
          ease: 'elastic.out(1, 0.8)',
        })
      }
    },
    updateCoords(x, y) {
      this.$firebase
        .firestore()
        .collection('notes')
        .doc(this.noteId)
        .update({
          coords: {
            x,
            y,
          },
        })
        .then(() => {
          this.moveNote()
        })
      // .catch(error => {
      //   console.log("sorry, the note couldn't be deleted", error)
      // })
    },
    deleteFromFirebase() {
      this.$firebase
        .firestore()
        .collection('notes')
        .doc(this.noteId)
        .delete()
        .then(() => {
          // console.log('note deleted')
        })
        .catch(error => {
          console.log("sorry, the note couldn't be deleted", error)
        })
    },
    draggableInit() {
      if (this.$store.state.notes.areDraggable) {
        // let notes
        this.draggableInstance = Draggable.create(this.$refs.note, {
          type: 'x,y',
          edgeResistance: 0.5,
          bounds: '.notes',
          inertia: true,
          onDragStart: e => {
            // add dragging class
            this.$refs.note.classList.add('is-dragging')
            // fetch all that aren't being dragged
            // notes = document.querySelectorAll('.note:not(.is-dragging)')
            // animate
            gsap.to(this.$refs.note, 0.1, {
              scale: 1.05,
              rotation: 0,
            })
          },
          // onDrag: () => {
          //   let i = notes.length
          //   let multiplier = 1
          //   const self = this.draggableInstance[0]

          //   while (--i > -1) {
          //     if (self.hitTest(notes[i], '20%')) {
          //       multiplier++

          //       gsap.to(notes[i], {
          //         scale: '1.0' + multiplier * 2,
          //         duration: 0.2,
          //       })
          //     } else {
          //       gsap.to(this.$refs.note, {
          //         scale: 1,
          //         duration: 0.2,
          //       })
          //     }
          //   }
          // },
          onDragEnd: e => {
            // remove dragging class
            this.$refs.note.classList.remove('is-dragging')
            // set the dragged item down
            gsap.to(this.$refs.note, 0.1, {
              scale: 1.0,
              rotation: this.rotation,
            })
          },
          // onThrowComplete: e => {
          //   const self = this.draggableInstance[0]
          //   // tell firebase
          //   this.updateCoords(self.endX, self.endY)
          // },
        })
        this.moveNote()
      }
    },
    draggableDestroy() {
      // lets make sure there is an instance to destoy
      if (this.$refs.note && this.draggableInstance) {
        const self = this.draggableInstance[0]
        const time = Math.random() * 1.5 + 0.5

        // set to original position
        gsap.to(this.$refs.note, time, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          ease: 'elastic.out(1, 0.8)',
          onComplete: () => {
            self.kill()
            this.isDraggable = false
            this.draggableInstance = null
            // this.$store.dispatch('notes/updateDraggable', false)
          },
        })
      }
    },
    onIconOpacity(state) {
      if (state === 'show') {
        this.iconsAreOpaque = true
      } else if (state === 'hide') {
        this.iconsAreOpaque = false
      }
    },
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return (Math.random() * (max - min) + min).toFixed(3)
    },
  },
}
</script>
