<template>
  <div class="form-item" :class="`theme--${theme}`">
    <p class="label">{{ label }}</p>
    <div class="radio-wrap">
      <div
        class="radio"
        v-for="(option, optionIndex) in options"
        :key="optionIndex"
      >
        <input
          class="radio"
          type="radio"
          :id="option.value"
          :name="name"
          :value="option.value"
          @input="$emit('input', $event.target.value)"
          ref="radio"
          :checked="optionIndex === 0"
        />
        <label class="radio-option" :for="option.value">
          <span>{{ option.message }}</span>
        </label>
      </div>
    </div>
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
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    options: {
      type: Array || Object,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'light',
    },
  },
  methods: {
    reset() {
      this.$refs.radio[0].checked = true
    },
  },
}
</script>

<style lang="scss" scoped>
$indent: 15px;

.form-item {
  padding-top: var(--grid-gutter);
}

.radio-wrap {
  display: flex;
}

.label {
  font-size: 16px;
  text-transform: uppercase;
  display: block;
  font-weight: bold;
  letter-spacing: 0.125em;
  padding: 6px $indent;
}

.radio {
  width: 100%;

  &:hover + .radio-option {
    background-color: rgba($form-dark, 0.15);
  }

  &:checked + .radio-option {
    background-color: rgba($form-dark, 0.6);
    color: $form-light;
  }

  &:active + .radio-option,
  &:focus + .radio-option {
    box-shadow: inset 0 0 0 2px $form-dark, inset 0 0 0 4px $form-light;
    background-color: $form-dark;
    color: $form-light;
  }

  .radio-option {
    transition: background-color $form-trans, color 100ms ease-out,
      box-shadow $form-trans;
    display: block;
    text-align: center;
    background-color: rgba($form-dark, 0.08);
    color: $form-dark;
  }

  &:first-child .radio-option {
    border-radius: var(--note-radius-child) 0 0 var(--note-radius-child);
    text-align: center;
  }

  &:last-child .radio-option {
    border-radius: 0 var(--note-radius-child) var(--note-radius-child) 0;
  }

  .radio-option {
    width: 100%;
    font-size: $t-input;
    line-height: var(--input-height);
    text-align: center;
  }

  // hide the inputs, we only wanna style the labels
  .radio {
    opacity: 0;
    position: fixed;
    width: 0;
  }
}
</style>
