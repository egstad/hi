<template>
  <button :class="`button button--${theme}`">
    <span class="text">{{ text }}</span>
    <span class="icon">→</span>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: false,
      default: '',
    },
    theme: {
      type: String,
      required: false,
      default: 'light',
    },
  },
}
</script>

<style lang="scss" scoped>
$indent: 15px;

$light: white;
$dark: black;

$trans: 200ms ease-out;

.button {
  appearance: none;
  transition: background $trans;
  width: 100%;
  font-size: 32px !important;
  line-height: 44px;
  padding: 3px $indent;
  border-radius: var(--note-radius);
  outline: none;
  letter-spacing: 0.04em;
  border: 0;
  text-align: left;

  .icon {
    display: inline-block;
    transition: transform $trans;
  }

  &--light {
    background: rgba($light, 0.7);

    &:hover {
      background: rgba($light, 1);
    }

    &:hover,
    &:focus {
      background: rgba($light, 1);

      .icon {
        transform: translate3d($indent/2, 0, 0);
      }
    }
  }
}
</style>
