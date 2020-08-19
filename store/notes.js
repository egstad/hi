export const state = () => ({
  areDraggable: false,
  dragBreakpoint: 1200,
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
  initDragOnResize({ dispatch, state }) {
    state.canvasWidth >= state.dragBreakpoint
      ? //  init draggable
        dispatch('updateDraggable', true)
      : // destroy draggable
        dispatch('updateDraggable', false)
  },
  updateWidth({ commit }, val) {
    commit('setWidth', Math.round(val))
    window.$app.$emit('canvasResized')
  },
  updateHeight({ commit }, val) {
    commit('setHeight', Math.round(val))
    window.$app.$emit('canvasResized')
  },
  getCanvasDimensions({ dispatch, state }, el) {
    const notes = el || null
    // use window as a fallback
    const canvas = notes
      ? { width: notes.width, height: notes.height }
      : { width: window.innerWidth, height: window.innerHeight }

    dispatch('updateWidth', canvas.width)
    dispatch('updateHeight', canvas.height)
    dispatch('initDragOnResize')
  },
}
