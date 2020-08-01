<template>
  <div class="form-item" :class="`theme--${theme}`">
    <label>
      <span class="label" v-if="label">{{ label }}</span>
      <select
        ref="input"
        class="select"
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
      <div class="icon">↓</div>
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
    value: {
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

$light: white;
$dark: black;

$trans: 200ms ease-out;

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
    transition: background $trans, color $trans;
    width: 100%;
    font-size: $t-input;
    line-height: var(--input-height);
    padding: 0 $indent;
    border-radius: var(--note-radius);
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

  .icon {
    position: absolute;
    bottom: $t-input * 0.15;
    right: var(--grid-gutter);
    font-size: $t-input * 1.4;
    pointer-events: none;
    content: 'hi';
    display: block;
    z-index: 1000;
  }

  &.theme {
    &--light {
      .label {
        color: $light;
      }

      .select {
        color: $light;
        background: rgba($light, 0.2);

        &::placeholder {
          color: rgba($light, 0.6);
        }

        &:hover {
          background: rgba($light, 0.3);

          &::placeholder {
            color: $light;
          }
        }

        &:focus {
          background: rgba($light, 0.8);
          color: inherit;

          &::placeholder {
            transition: none;
            color: inherit;
          }
        }
      }
    }
    &--dark {
      .label {
        color: $dark;
      }

      .select {
        color: $dark;
        background: rgba($dark, 0.1);

        &::placeholder {
          color: rgba($dark, 0.6);
        }

        &:hover {
          background: rgba($dark, 0.15);

          &::placeholder {
            color: $dark;
          }
        }

        &:focus {
          background: rgba($dark, 0.2);
          color: $dark;

          &::placeholder {
            transition: none;
            color: $dark;
          }
        }
      }
    }
  }
}
</style>
