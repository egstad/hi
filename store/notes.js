export const state = () => ({
  // are they globally draggable?
  areDraggable: false,
  // should they hide from the 'new note' form?
  areScattered: false,
  // when should they never be draggable?
  dragBreakpoint: 1200,
  // draggable area width
  canvasWidth: null,
  // draggable area height
  canvasHeight: null,
  // current highest z-index
  highestZ: 0,
})

export const mutations = {
  updateDraggable(state, val) {
    state.areDraggable = val
  },
  updateScatter(state, val) {
    state.areScattered = val
    console.log('updatescate', state.areScattered)
  },
  setWidth(state, val) {
    state.canvasWidth = val
  },
  setHeight(state, val) {
    state.canvasHeight = val
  },
  setHighestZ(state, val) {
    state.highestZ = val
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
  scatter({ commit }, val) {
    commit('updateScatter', val)
    console.log('scatter fired')

    val === true
      ? window.$app.$emit('newNote::open')
      : window.$app.$emit('newNote::close')
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
  updateHighestZ({ commit, state }, thisZ) {
    if (thisZ > state.highestZ) {
      commit('setHighestZ', thisZ)
    }
  },
}
