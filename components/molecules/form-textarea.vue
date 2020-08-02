<template>
  <div class="form-item" :class="`theme--${theme}`">
    <label>
      <span class="label" v-if="label"
        >{{ label
        }}<template v-if="value.length">
          – {{ value.length }}/{{ max }}</template
        ></span
      >
      <textarea
        ref="input"
        :maxlength="max"
        :value="value"
        :placeholder="placeholder"
        :class="`textarea`"
        :required="required"
        @input="$emit('input', $event.target.value)"
      ></textarea>
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
    required: {
      type: Boolean,
      required: false,
      default: false,
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
    max: {
      type: Number,
      required: false,
      default: 200,
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
  padding-top: var(--grid-gutter);
  .label {
    font-size: 16px;
    text-transform: uppercase;
    display: block;
    font-weight: bold;
    letter-spacing: 0.125em;
    padding: 6px $indent;
  }

  .textarea {
    appearance: none;
    resize: vertical;
    transition: background $trans, color $trans;
    width: 100%;
    min-height: calc(var(--input-height) * 2);
    max-height: 300px;
    font-size: $t-input;
    line-height: 1;
    padding: calc(var(--grid-gutter) * 0.5) $indent;
    border-radius: var(--note-radius);
    outline: none;
    letter-spacing: 0.04em;
    border: 0;

    &::placeholder {
      transition: color $trans;
    }
  }

  &.theme {
    &--light {
      .label {
        color: $light;
      }

      .textarea {
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

      .textarea {
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
