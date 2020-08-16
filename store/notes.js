export const state = () => ({
  areDraggable: false,
  canvasWidth: 0,
  canvasHeight: 0,
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
    commit('setWidth', val)
  },
  updateHeight({ commit }, val) {
    commit('setHeight', val)
  },
}
