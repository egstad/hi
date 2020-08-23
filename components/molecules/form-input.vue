<template>
  <div class="form-item" :class="`theme--${theme}`">
    <label>
      <div class="label" v-if="label">
        <span>{{ label }}</span>

        <transition name="fade">
          <span class="tip" v-if="tip">{{ tip }}</span>
        </transition>
      </div>

      <input
        ref="input"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :class="`input input--${type} ts1`"
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
    tip: {
      type: String,
      required: false,
      default: null,
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
$trans: 200ms ease-out;

.form-item {
  padding-top: var(--grid-gutter);

  label {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-rows: calc(var(--t0) + var(--grid-gutter)) auto;
  }

  .input {
    appearance: none;
    width: 100%;
    font-size: $t-input;
    line-height: var(--input-height);
    padding: 0 var(--grid-gutter);
    border-radius: var(--note-radius-child);
    outline: none;
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
