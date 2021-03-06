<template>
  <li class="note" :class="[type, `tag--${tag}`]" ref="note">
    <article class="content">
      <NoteImage v-if="type === 'image'" :image="image" />
      <NoteEmbed v-else-if="type === 'link'" :embed="link" :tag="tag" />
      <NoteText v-else :message="message" />

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
}
</style>

<script>
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { mapState } from 'vuex'
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
      dragInitialized: false,
      draggableInstance: null,
      isBlurred: false,
      gsap: null,
      xPercent: null,
      yPercent: null,
    }
  },
  computed: {
    iconsAreOpaque: {
      get() {
        return false
      },
      set() {
        return true
        // if (
        //   this.type === 'image' ||
        //   this.type === 'link' ||
        //   this.embed ||
        //   (this.type === 'link' &&
        //     this.embed.type === 'video' &&
        //     this.embed.embed)
        // ) {
        //   return true
        // } else {
        //   return false
        // }
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
      return this.note.data.message
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
      return this.note.data.link
    },
    // @string
    // @returns: a firebase url to the uploaded image
    image() {
      return this.note.data.image
    },
    // @object
    // @returns: the coordinates of the note
    coords() {
      return this.note.coords
    },
    ...mapState({
      dragEnabled: state => state.notes.areDraggable,
      xBounds: state => state.notes.canvasWidth,
      yBounds: state => state.notes.canvasHeight,
      highestZ: state => state.notes.highestZ,
    }),
  },
  watch: {
    coords(newValue, oldValue) {
      const xChange = newValue.x !== oldValue.x
      const yChange = newValue.y !== oldValue.y

      // on change, move note to new position
      if (xChange || yChange) {
        this.moveNote()
      }
    },
  },
  mounted() {
    console.log(this.note)
    this.$app.$on('draggableInit', this.draggableInit)
    this.$app.$on('draggableDestroy', this.draggableDestroy)
    this.$app.$on('canvasResized', this.moveNote)
    // not very performant... remove l8r
    this.$app.$on('newNote::open', this.dimNote)
    this.$app.$on('undimNote', this.resetNote)
    // end
    this.$on('setIconOpacity', this.onIconOpacity)
    this.$on('deleteNote', this.deleteNote)
    // set the z-index
    gsap.set(this.$refs.note, { zIndex: this.coords.z })
    // share index with parent (to make sure dragged item stacks to top)
    this.$parent.$emit('note::mounted', this.coords.z)
  },
  beforeDestroy() {
    this.$off('setIconOpacity', this.onIconOpacity)
    this.$app.$off('draggableInit', this.draggableInit)
    this.$app.$off('draggableDestroy', this.draggableDestroy)
    this.$app.$off('canvasResized', this.moveNote)
    this.$app.$off('newNote::open', this.dimNote)
    this.$app.$off('undimNote', this.resetNote)
    this.$off('setIconOpacity', this.onIconOpacity)
    this.$off('deleteNote', this.deleteNote)
  },
  methods: {
    deleteNote() {
      this.gsap = gsap.to(this.$refs.note, {
        y: this.$store.state.notes.canvasHeight * 2,
        rotation: `+=${this.randomFloat(-90, 90)}`,
        duration: this.randomFloat(1, 2),
        ease: 'power4.in',
        onComplete: () => {
          this.deleteFromFirebase()
        },
      })
    },
    dimNote() {
      if (this.$refs.note) {
        gsap.to(this.$refs.note, {
          duration: 0.5,
          filter: 'blur(20px)',
          ease: 'power4.out',
          onStart: () => {
            this.isBlurred = true
          },
        })
      }
    },
    resetNote() {
      // this.moveNote()
      gsap.to(this.$refs.note, {
        duration: 0.5,
        filter: 'blur(0px)',
        ease: 'power4.out',
        overwrite: true,
        onComplete: () => {
          this.isBlurred = false
        },
      })
    },
    moveNote() {
      if (this.$refs.note && this.dragEnabled) {
        // lets make sure there is something to move in the first place
        // these vars are helpful in determining if note is offscreen
        const self = this.$refs.note.getBoundingClientRect()
        const selfWidth = self.width
        const selfHeight = self.height
        const isOffscreenX = this.coords.x + selfWidth > this.xBounds
        const isOffscreenY = this.coords.y + selfHeight > this.yBounds
        gsap.set(this.$refs.note, { zIndex: this.coords.z })

        // is note offscreen?
        // like, what if i create a note on a huge screen and you're on a small one?
        // you wouldn't be able to see it.
        this.gsap = gsap.to(this.$refs.note, {
          x: isOffscreenX
            ? this.xBounds - selfWidth
            : (this.coords.x / 100) * this.xBounds,
          y: isOffscreenY
            ? this.yBounds - selfHeight
            : (this.coords.y / 100) * this.yBounds,
          rotation: this.coords.r,
          ease: 'elastic.out(1, 0.8)',
          duration: this.randomFloat(0.5, 1.5),
        })
      }
    },
    updateCoords(x, y, z, r) {
      this.getPositionPercentages(x, y)

      this.$firebase
        .firestore()
        .collection('notes')
        .doc(this.noteId)
        .update({
          coords: {
            x: this.xPercent,
            y: this.yPercent,
            z,
            r,
          },
        })
        .then(() => {
          console.log('updated pos')
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
      if (this.dragEnabled && !this.dragInitialized) {
        this.dragInitialized = true
        this.draggableInstance = Draggable.create(this.$refs.note, {
          type: 'x,y',
          bounds: '.notes',
          inertia: true,
          edgeResistance: 0.75,
          throwResistance: 3000,
          zIndexBoost: false,
          // zIndex: parseInt(this.highestZ) + 1,
          overshootTolerance: 0,
          allowContextMenu: true,
          onDragStart: this.onDragStart,
          onDragEnd: this.onDragEnd,
          onClick: this.onClick,
        })

        this.moveNote()
      }
    },
    draggableDestroy() {
      // lets make sure there is an instance to destoy
      if (this.$refs.note && this.draggableInstance) {
        const self = this.draggableInstance[0]
        const time = this.randomFloat(1, 2)

        // teardown draggable
        self.disable()
        this.dragInitialized = false
        this.draggableInstance = null

        // this.gsap.kill()
        this.gsap = gsap.to(this.$refs.note, time, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          overwrite: true,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => {
            this.gsap = gsap.set(this.$refs.note, { clearProps: 'all' })
          },
        })
      }
    },
    onDragStart() {
      const newZ = parseInt(this.highestZ) + 1

      // add dragging class
      this.$refs.note.classList.add('is-dragging')
      // set new z
      gsap.set(this.$refs.note, { zIndex: newZ })
      // handle animation
      this.gsap = gsap.to(this.$refs.note, 0.3, {
        scale: 1.1,
        rotation: 0,
        ease: 'elastic.out(1, 0.5)',
        overwrite: true,
      })
    },
    onDragEnd() {
      const self = this.draggableInstance[0]
      const posOrNeg = self.endX > self.startX ? 1 : -1
      const newRotation = Math.abs(this.coords.r) * posOrNeg
      const newZIndex = self.target.style.zIndex
      this.$store.dispatch('notes/updateHighestZ', newZIndex)

      // remove dragging class
      this.$refs.note.classList.remove('is-dragging')
      // set the dragged item down
      this.gsap = gsap.to(this.$refs.note, 0.4, {
        scale: 1.0,
        rotation: newRotation,
        ease: 'elastic.out(1, 0.5)',
      })
      // tell firebase
      this.updateCoords(self.endX, self.endY, newZIndex, newRotation)
    },
    onClick() {
      console.log('click')
      const newZ = parseInt(this.highestZ) + 1
      // set new z
      gsap.set(this.$refs.note, { zIndex: newZ })
      this.$store.dispatch('notes/updateHighestZ', newZ)
    },
    onIconOpacity(state) {
      if (state === 'show') {
        this.iconsAreOpaque = true
      } else if (state === 'hide') {
        this.iconsAreOpaque = false
      }
    },
    randomFloat(min, max) {
      return parseFloat((Math.random() * (max - min) + min).toFixed(3))
    },
    getPositionPercentages(x, y) {
      this.xPercent = parseFloat(((x / this.xBounds) * 100).toFixed(4))
      this.yPercent = parseFloat(((y / this.yBounds) * 100).toFixed(4))
    },
  },
}
</script>
