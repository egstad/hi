export const state = () => ({
  areDraggable: false,
  canvasWidth: null,
  canvasHeight: null,
})

export const mutations = {
  updateDraggable(state, val) {
    state.areDraggable = val
  },
  setWidth(state, val) {
    state.canvasWidth = val
  },
  setHeight(state, val) {
    state.canvasHeight = val
  },
}

export const actions = {
  updateDraggable({ commit }, val) {
    commit('updateDraggable', val)

    // emit setup/teardown events
    val === true
      ? window.$app.$emit('draggableInit')
      : window.$app.$emit('draggableDestroy')
  },
  updateWidth({ commit }, val) {
    commit('setWidth', Math.round(val))
  },
  updateHeight({ commit }, val) {
    commit('setHeight', Math.round(val))
  },
}
