<template>
  <div>
    <button @click="toggle">Play</button>
    <div class="wrapper" v-html="iframe" ref="iframe"></div>
  </div>
</template>

<script>
export default {
  props: {
    iframe: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      apiLoaded: false,
      ytReady: false,
      ytCheckInterval: null,
      player: null,
    }
  },
  watch: {
    apiLoaded(hasLoaded) {
      if (hasLoaded) {
        console.clear()
        console.log('apiLoaded')
        this.isYoutubeReady()
      }
    },
  },
  methods: {
    isYoutubeReady() {
      if (!this.ytReady) {
        this.ytCheckInterval = setInterval(() => {
          if (window.YT.loaded) {
            this.ytReady = true
            this.playerInit()
            clearInterval(this.ytCheckInterval)
          }
        }, 100)
      }
    },
    playerInit() {
      const video = this.$refs.iframe.querySelector('iframe')

      this.player = new window.YT.Player(video, {
        // height: '400',
        // width: '400',
        // videoId: 'M7lc1UVf-VE',
        events: {
          onReady: this.onPlayerReady,
        },
      })
    },
    onPlayerReady() {
      // console.log(this.player)
    },
    toggle() {
      this.player().pauseVideo()
    },
  },
  head() {
    return {
      script: [
        {
          src: 'https://www.youtube.com/player_api',
          defer: true,
          callback: () => {
            this.apiLoaded = true
          },
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /deep/iframe {
    pointer-events: none;
    transform: scale(2);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

button {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;

  &:last-of-type {
    left: 100px;
  }
}
</style>
