<template>
  <ul class="notes" ref="notes">
    <Note
      v-for="(note, noteIndex) in notes"
      :key="noteIndex"
      :note="note"
      ref="note"
      class="draggable"
    />
  </ul>
</template>

<style lang="scss" scoped>
.notes {
  display: grid;
  grid-gap: var(--grid-gutter);
  margin-top: calc(var(--grid-gutter) * 4);

  @media (min-width: 600px) {
    grid-gap: calc(var(--grid-gutter) * 2);
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}
</style>

<script>
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import * as Inertia from '@/plugins/inertia'
import Note from '@/components/organisms/note'

gsap.registerPlugin(Draggable)
gsap.registerPlugin(Inertia)

export default {
  components: {
    Note,
  },
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    const draggableEls = this.$refs.notes.querySelectorAll('.draggable')

    Draggable.create(draggableEls, {
      type: 'x,y',
      edgeResistance: 0.5,
      bounds: '.notes',
      inertia: true,
      onDrag(e) {},
      onThrowComplete(e) {
        console.log('drag end')
        let i = draggableEls.length
        while (--i > -1) {
          if (this.hitTest(draggableEls[i], '80%')) {
            // note behind item
            gsap.to(draggableEls[i], 0.2, {
              rotation: Math.random() * 10,
            })

            // item
            gsap.to(this.target, 0.2, {
              scale: 0.9,
              // left: '+=20',
              // top: '+=20',
            })
          } else {
            // note behind item
            gsap.to(draggableEls[i], 0.2, {
              rotation: 0,
            })

            // item
            gsap.to(this.target, 0.2, {
              scale: 1,
            })
          }
        }
      },
      // snap: {
      //   x(endValue) {
      //     return Math.round(endValue / gridCell) * gridCell
      //   },
      //   y(endValue) {
      //     return Math.round(endValue / gridCell) * gridCell
      //   },
      // },
    })
  },
}
</script>
