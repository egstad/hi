<template>
  <div
    class="attachment text"
    :class="{ 'is-scrollable': isScrollable }"
    ref="container"
  >
    <p
      class="body"
      :class="{ lg: body.length < 40, xl: body.length < 10 }"
      ref="body"
    >
      <span>{{ body }}</span>
    </p>
    <a :href="link" target="_blank" v-if="link" class="t-link">{{ link }}</a>
  </div>
</template>

<style lang="scss" scoped>
.text {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding: calc(var(--grid-gutter));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;

  &.is-scrollable {
    padding-top: calc(var(--grid-gutter) * 4);
  }
}

.lg {
  font-size: 200%;
  line-height: 0.8;
}

.xl {
  font-size: 300%;
  line-height: 0.65;
  line-height: 0.8;
  align-items: center !important;
  justify-content: center;
}

.body {
  flex: 1 1;
  display: flex;
  align-items: flex-end;
  width: 100%;
}
</style>

<script>
export default {
  props: {
    body: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isScrollable: false,
    }
  },
  mounted() {
    const container = this.$refs.container.getBoundingClientRect().height
    const entry = this.$refs.body.getBoundingClientRect().height

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
