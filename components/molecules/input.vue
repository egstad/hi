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
    color: {
      type: String,
      required: false,
      default: 'black',
    },
  },
}
</script>

<style lang="scss" scoped>
$indent: 15px;
$radius: 8px;

$light: white;
$dark: black;

$trans: 200ms ease-out;

.form-item {
  .label {
    font-size: 16px;
    text-transform: uppercase;
    display: block;
    font-weight: bold;
    letter-spacing: 0.1em;
    padding: 6px $indent;
  }

  .input {
    appearance: none;
    transition: background $trans, color $trans;
    width: 100%;
    font-size: 32px;
    line-height: 44px;
    padding: 3px $indent;
    border-radius: $radius;
    outline: none;
    letter-spacing: 0.04em;
    margin-bottom: 20px;
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

  &.theme {
    &--light {
      .label {
        color: $light;
      }

      .input {
        color: $light;
        background: rgba($light, 0.2);

        &::placeholder {
          color: rgba($light, 0.4);
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
  }
}
</style>
