<template>
  <section class="message-wrap">
    <div class="message">
      <FormTextarea
        v-model="message"
        ref="message"
        :placeholder="messagePrompts[promptIndex].placeholder"
        :label="messagePrompts[promptIndex].label"
        :max="messageMaxChars"
        :tip="messageTip"
        :text-size="messageSize"
        autocomplete="off"
        required
        @input="$emit('input', $event)"
      />
      <div class="label prompt" ref="prompt" @click="nextPrompt">
        <span class="char">I</span>
        <span class="char">D</span>
        <span class="char">F</span>
        <span class="char">K</span>
      </div>
    </div>

    <!-- <FormInput
        v-model="link"
        type="url"
        ref="link"
        :tip="linkTip"
        placeholder="link to a site, video, or image..."
        label="add a link"
        theme="dark"
        autocomplete="off"
        required
      /> -->
  </section>
</template>

<style lang="scss" scoped>
.message-wrap {
  display: grid;
  grid-template-rows: auto;
  height: 100%;
  align-items: start;
  padding-top: 0.3em;

  .message {
    position: relative;
    height: 100%;

    /deep/.form-item {
      display: grid;
      grid-template-rows: auto;
      height: 100%;
    }
  }

  .prompt {
    position: absolute;
    top: calc(var(--grid-gutter * 0.5));
    right: 0;
    opacity: 0.8;
    mix-blend-mode: hue-rotate(120deg);
    border-radius: var(--note-radius-child);
    font-variant-numeric: tabular-nums;
    display: inline-flex;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<script>
import gsap from 'gsap'
import FormTextarea from '@/components/molecules/form-textarea'
// import FormInput from '@/components/molecules/form-input'

export default {
  components: {
    FormTextarea,
    // FormInput,
    // Toolbar,
  },
  data() {
    return {
      message: '',
      messageMaxChars: 200,
      promptIndex: 0,
      messagePrompts: [
        {
          label: 'write a note',
          placeholder: 'dear internet diary...',
        },
        { label: 'write a haiku', placeholder: '5-7-5' },
        {
          label: 'put ur feelings into a word',
          placeholder: 'peaceful? opera? butts? prob butts...',
        },
        {
          label: 'what do u admire?',
          placeholder: 'a person, place, thing...',
        },
        {
          label: 'write about a missed connection',
          placeholder: 'last week on the bus...',
        },
        {
          label: 'what gives you hope?',
          placeholder: "(don't lie)",
        },
        {
          label: 'write about something you lost',
          placeholder: "it's okay to be sad",
        },
        {
          label: 'tell us something sweet',
          placeholder: 'laughing is nice',
        },
        {
          label: 'what makes you smile?',
          placeholder: 'cute cats, good burps...',
        },
        {
          label: 'tell us a joke',
          placeholder: 'so, a duck walks into a bar...',
        },
        {
          label: 'write about a peaceful memory',
          placeholder: 'dear internet diary...',
        },
        {
          label: 'give the internet some advice',
          placeholder: 'tell us what we need to hear',
        },
        { label: 'write a short story', placeholder: 'in the beginning... jk' },
      ],
      messageLabelInterval: null,
      messageTip: '',
      messageSize: 't6',
      link: '',
      linkTip: '',
    }
  },
  mounted() {
    this.animatePrompt()
  },
  methods: {
    reset() {
      this.message = ''
      this.link = ''
    },
    shufflePrompts() {
      for (let i = this.messagePrompts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.messagePrompts[i], this.messagePrompts[j]] = [
          this.messagePrompts[j],
          this.messagePrompts[i],
        ]
      }
    },
    nextPrompt() {
      if (this.promptIndex + 1 === this.messagePrompts.length) {
        this.promptIndex = 0
      } else {
        this.promptIndex++
      }

      const chars = this.$refs.prompt.querySelectorAll('.char')

      gsap.fromTo(
        chars,
        {
          rotation: 0,
          opacity: 1,
        },
        {
          rotation: 360,
          stagger: 0.2,
          opacity: 1,
        }
      )
    },
    animatePrompt() {
      const chars = this.$refs.prompt.querySelectorAll('.char')

      gsap.fromTo(
        chars,
        {
          opacity: 1,
          y: 0,
        },
        {
          y: 0,
          opacity: 0.3,
          repeat: '-1',
          yoyo: true,
          ease: 'power3.inOut',
          stagger: 0.1,
          duration: 1.2,
        }
      )
    },
  },
}
</script>
