<template>
  <button :class="`input button button--${theme}`">
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

.button {
  appearance: none;
  width: 100%;
  font-size: $t-input !important;
  line-height: var(--input-height);
  padding: 0 $indent;
  border-radius: var(--note-radius-child);
  outline: none;
  letter-spacing: 0.04em;
  border: 0;
  text-align: left;

  &.input {
    background-color: rgba($form-dark, 1);
    color: $form-light;

    &:hover {
      background-color: rgba($form-dark, 1);
    }

    &:hover,
    &:focus {
      background-color: rgba($form-dark, 1);
      color: $form-light;
      cursor: pointer;

      .icon {
        transform: translate3d($indent/2, 0, 0);
      }
    }

    &:focus {
      box-shadow: inset 0 0 0 2px black, inset 0 0 0 4px white;
    }
  }
}

.icon {
  display: inline-block;
  transition: transform $form-trans;
}
</style>
