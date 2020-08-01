<template>
  <div
    class="attachment text"
    :class="{ 'is-scrollable': isScrollable }"
    ref="container"
  >
    <p
      class="body"
      :class="{ lg: body.length < 40, xl: body.length < 20 }"
      ref="body"
    >
      <span>{{ body }}</span>
    </p>
    <a href="#" v-if="link" class="link">http://egstad.com/</a>
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
  align-items: flex-end;
  overflow-y: auto;

  &.is-scrollable {
    padding-top: calc(var(--grid-gutter) * 4);
  }
}

.lg {
  font-size: 175%;
  line-height: 0.8;
}

.xl {
  font-size: 250%;
  line-height: 0.65;
}

.body {
  flex: 1 1;
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.link {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  font-size: 16px !important;
  line-height: 1;
  padding-top: calc(var(--grid-gutter) * 0.6);
  color: inherit;
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
