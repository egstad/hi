<template>
  <div
    class="attachment text"
    :class="{ 'is-scrollable': isScrollable }"
    ref="container"
  >
    <p
      class="message"
      :class="{
        lg: message.length < 40,
        xl: message.length < 30,
        xx: message.length < 6,
      }"
      ref="message"
    >
      <span>{{ message }}</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.text {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: calc(var(--grid-gutter) * 2);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;

  &.is-scrollable {
    padding-top: calc(var(--grid-gutter) * 4);
  }
}

.message {
  flex: 1 1;
  display: flex;
  align-items: flex-end;
  width: 100%;
  font-size: 150%;

  &.lg {
    font-size: 200%;
    line-height: 0.8;
  }

  &.xl {
    font-size: 250%;
    line-height: 0.65;
    line-height: 0.8;
    align-items: center;
    justify-content: center;
  }

  &.xx {
    font-size: 400%;
    line-height: 0;
    align-items: center;
    justify-content: center;
  }
}
</style>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isScrollable: false,
    }
  },
  mounted() {
    const container = this.$refs.container.getBoundingClientRect().height
    const entry = this.$refs.message.getBoundingClientRect().height

    if (entry > container) {
      // make scrollable
      this.isScrollable = true
      // make icons opaque
      this.$parent.$emit('setIconOpacity', 'show')
    } else {
      // no scroll
      this.isScrollable = false
      // make icons transparent
      this.$parent.$emit('setIconOpacity', 'hide')
    }
  },
}
</script>
