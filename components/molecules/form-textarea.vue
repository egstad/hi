<template>
  <div class="form-item" :class="`theme--${theme}`">
    <transition name="fade">
      <span class="label counter" v-if="max && value.length"
        >{{ value.length }}/{{ max }}</span
      >
    </transition>

    <label>
      <div class="label" @click="$emit('click')">
        <span>{{ label }}</span>

        <transition name="fade">
          <span class="tip" v-if="tip">{{ tip }}</span>
        </transition>
      </div>

      <textarea
        ref="input"
        :maxlength="max"
        :value="value"
        :placeholder="placeholder"
        class="textarea input ts3"
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
      required: true,
      default: '',
    },
    tip: {
      type: String,
      required: false,
      default: null,
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
.form-item {
  padding-top: var(--grid-gutter);
  position: relative;
  display: flex;

  label {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-rows: calc(var(--t0) + var(--grid-gutter)) auto;
  }

  .textarea {
    vertical-align: top;
    font-weight: bold;
    appearance: none;
    resize: none;
    width: 100%;
    height: 100%;
    min-height: calc(var(--input-height) * 2);
    padding: calc(var(--grid-gutter) * 0.8) var(--grid-gutter);
    border-radius: var(--note-radius-child);
    outline: none;
    border: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
