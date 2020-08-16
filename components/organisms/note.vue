<template>
  <li
    class="note"
    :class="(`type--${type}`, `tag--${tag}`)"
    ref="note"
    :data-x="coords.x"
    :data-y="coords.y"
  >
    <article class="content">
      <pre>{{ note.coords.x }},{{ note.coords.y }}</pre>

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

  /deep/.note__utilities {
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms ease-out;
  }
}
</style>

<script>
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import NoteText from '@/components/molecules/note-text'
import NoteEmbed from '@/components/molecules/note-embed'
import NoteImage from '@/components/molecules/note-image'
import NoteUtilities from '@/components/molecules/note-utilities'
import * as Inertia from '@/plugins/inertia'

gsap.registerPlugin(Draggable, Inertia)

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
    coords() {
      // only i can move my notes...
      if (this.author !== this.$store.state.user.uid) {
        this.moveNote()
      }
      return this.note.coords
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
      const posOrNeg = Math.random() < 0.5 ? -1 : 1
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
          rotation: (Math.random() * 2 + 2) * posOrNeg,
          x: this.$store.state.notes.areDraggable
            ? this.$refs.note.dataset.x
            : 0,
          y: this.$store.state.notes.areDraggable
            ? this.$refs.note.dataset.y
            : 0,
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

      gsap.fromTo(
        this.$refs.note,
        {
          scale: 1,
          rotation: 0,
        },
        {
          scale: 0,
          rotation: Math.random() * 10,
          duration: time,
          ease: 'power4.in',
          onComplete: () => {
            this.deleteFromFirebase()
          },
        }
      )
    },
    moveNote() {
      // lets make sure there is something to move in the first place
      if (this.$refs.note && this.draggableInstance) {
        // these vars are helpful in determining if note is offscreen
        const bounds = document.querySelector('.notes').getBoundingClientRect()
        const self = this.$refs.note.getBoundingClientRect()
        const boundsWidth = bounds.width
        const selfWidth = self.width

        // is note offscreen?
        // like, what if i create a note on a huge screen and you're on a small one?
        // you wouldn't be able to see it.
        if (this.note.coords.x + selfWidth > boundsWidth) {
          gsap.to(this.$refs.note, 1.5, {
            x: boundsWidth - selfWidth,
          })
        } else {
          // if the coords are on screen, move it there!
          gsap.to(this.$refs.note, 1.5, {
            x: this.$refs.note.dataset.x,
            y: this.$refs.note.dataset.y,
            ease: 'elastic.out(1, 0.8)',
          })
        }
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
          // console.log('note updated')
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
        let notes
        this.draggableInstance = Draggable.create(this.$refs.note, {
          type: 'x,y',
          edgeResistance: 0.5,
          bounds: '.notes',
          inertia: true,
          minimumMovement: 5,
          // onDrag: e => {},
          onDragStart: e => {
            const posOrNeg = Math.random() < 0.5 ? -1 : 1
            // add dragging class
            this.$refs.note.classList.add('is-dragging')
            // fetch all that aren't being dragged
            notes = document.querySelectorAll('.note:not(.is-dragging)')
            // tell the app after adding the is-dragging class
            this.$app.$emit('dragStart')
            // animate
            gsap.to(this.$refs.note, 0.1, {
              scale: 1.05,
              rotation: (Math.random() * 5 + 5) * posOrNeg,
            })
          },
          onDragEnd: e => {
            const posOrNeg = Math.random() < 0.5 ? -1 : 1
            const self = this.draggableInstance[0]
            let i = notes.length
            let multiplier = 1
            // tell the app
            this.$app.$emit('dragEnd', self)
            // remove dragging class
            this.$refs.note.classList.remove('is-dragging')
            // set the dragged item down
            gsap.to(this.$refs.note, 0.1, {
              scale: 1,
              rotation: (Math.random() * 2 + 2) * posOrNeg,
            })

            while (--i > -1) {
              if (self.hitTest(notes[i], '50%')) {
                multiplier++

                gsap.to(notes[i], {
                  scale: '1.0' + multiplier * 2,
                  duration: 0.2,
                })
              } else {
                gsap.to(this.$refs.note, {
                  scale: 1,
                  duration: 0.2,
                })
              }
            }

            // update firebase with new coords
            this.updateCoords(self.endX, self.endY)
          },

          // onDrag(e) {
          //   console.log('drag end')
          //   let i = draggableEls.length
          //   while (--i > -1) {
          //     if (this.hitTest(draggableEls[i], '80%')) {
          //       // note behind item
          //       if (draggableEls[i].dataset.behind === 'false') {
          //         draggableEls[i].dataset.behind = true
          //         gsap.to(draggableEls[i], 0.2, {
          //           rotation: Math.random() * 10,
          //         })
          //       }

          //       // item
          //       // gsap.to(this.target, 0.2, {
          //       //   scale: 0.9,
          //       // })
          //     } else {
          //       // note behind item
          //       draggableEls[i].dataset.behind = false
          //       gsap.to(draggableEls[i], 0.2, {
          //         rotation: 0,
          //       })
          //       // // item
          //       // gsap.to(this.target, 0.2, {
          //       //   scale: 1,
          //       // })
          //     }
          //   }
          // },
          // snap: {
          //   x(endValue) {
          //     return Math.round(endValue / 30) * 30
          //   },
          //   y(endValue) {
          //     return Math.round(endValue / 30) * 30
          //   },
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
  },
}
</script>
