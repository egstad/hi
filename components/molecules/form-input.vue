<template>
  <div class="form-item" :class="`theme--${theme}`">
    <label>
      <span class="label" v-if="label">{{ label }}</span>
      <input
        ref="input"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :class="`input input--${type}`"
        :required="required"
        @input="$emit('input', $event.target.value)"
      />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
    type: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    value: {
      type: String,
      required: false,
      default: '',
    },
    theme: {
      type: String,
      required: false,
      default: 'light',
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
$indent: 15px;
$trans: 200ms ease-out;

.form-item {
  padding-top: var(--grid-gutter);

  .label {
    font-size: 16px;
    text-transform: uppercase;
    display: block;
    font-weight: bold;
    letter-spacing: 0.125em;
    padding: 6px $indent;
  }

  .input {
    appearance: none;
    width: 100%;
    font-size: $t-input;
    line-height: var(--input-height);
    padding: 0 $indent;
    border-radius: var(--note-radius-child);
    outline: none;
    letter-spacing: 0.04em;
    border: 0;

    &::placeholder {
      transition: color $trans;
    }

    &.input--password {
      letter-spacing: 0.2em;

      &::placeholder {
        opacity: 0.3;
      }
    }
  }
}
</style>
