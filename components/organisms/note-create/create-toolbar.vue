<template>
  <footer class="note__utilities">
    <FormSelect
      :options="types"
      placeholder="select type"
      ref="type"
      @input="$emit('input', $event)"
    />

    <button class="icon tag" @click.prevent="nextTag">
      <span class="-hidden">note type: {{ tags[tagIndex] }}</span>
      <span class="svg"><Icon :type="tags[tagIndex]"/></span>
    </button>

    <button class="icon cancel">
      <span class="-hidden">cancel note</span>
      <span class="svg"><Icon type="close"/></span>
    </button>
  </footer>
</template>

<style lang="scss" scoped>
.note__utilities {
  width: 100%;
  display: grid;
  grid-template-columns: auto 54px 54px;
  grid-gap: var(--grid-gutter);
}

/deep/ {
  .form-item {
    padding-top: 0;
  }
}
</style>

<script>
import Icon from '@/components/atoms/icons'
import FormSelect from '@/components/molecules/form-select'
export default {
  components: {
    Icon,
    FormSelect,
  },
  props: {
    tags: {
      type: Array,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tagIndex: 0,
    }
  },
  computed: {
    type() {
      return this.$refs.type.$refs.input.value
    },
  },
  watch: {
    tagIndex(newIndex, oldValue) {
      this.tag = this.tags[newIndex]
      return newIndex
    },
  },
  methods: {
    nextTag() {
      if (this.tagIndex + 1 < this.tags.length) {
        this.tagIndex++
      } else {
        this.tagIndex = 0
      }

      this.$parent.$emit('tagUpdated', this.tagIndex)
    },
  },
}
</script>
