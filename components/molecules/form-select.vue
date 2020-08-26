<template>
  <div class="form-item" :class="`theme--${theme}`">
    <label>
      <span class="label" v-if="label">{{ label }}</span>
      <select
        ref="input"
        class="select ts1 input"
        :placeholder="placeholder"
        @input="$emit('input', $event.target.value)"
      >
        <option
          :value="option.value"
          v-for="(option, optionIndex) in options"
          :key="optionIndex"
          >{{ option.message }}</option
        >
      </select>
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
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    options: {
      type: Array,
      required: true,
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

.form-item {
  position: relative;
  padding-top: var(--grid-gutter);

  .label {
    font-size: 16px;
    text-transform: uppercase;
    display: block;
    font-weight: bold;
    letter-spacing: 0.125em;
    padding: 6px $indent;
  }

  .select {
    position: relative;
    appearance: none;
    display: block;
    transition: background $form-trans, color $form-trans;
    width: 100%;
    line-height: var(--input-height);
    padding: 0 $indent;
    border-radius: var(--note-radius-child);
    border: 0;

    &::placeholder {
      transition: color $form-trans;
    }

    &.input--password {
      letter-spacing: 0.2em;

      &::placeholder {
        opacity: 0.3;
      }
    }
  }

  .icon {
    position: absolute;
    top: -2px;
    font-size: var(--t2);
    opacity: 0.8;
    right: var(--grid-gutter);
    // bottom: $t-input * 0.15;
    // font-size: $t-input * 1.4;
    pointer-events: none;
    content: '';
    display: block;
    z-index: 1000;
  }
}
</style>
