export const state = () => ({
  active: 'light',
  options: {
    light: 'theme-light',
    dark: 'theme-dark',
  },
})

export const mutations = {
  light(state) {
    state.active = 'light'
  },
  dark(state) {
    state.active = 'dark'
  },
}

export const actions = {
  init({ state, dispatch }) {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme) {
      // set stored theme
      dispatch('setTheme', storedTheme)
    } else {
      // set default theme
      dispatch('setTheme', state.active)
    }
  },
  setTheme({ state, commit, dispatch }, theme) {
    switch (theme) {
      case 'light':
        commit('light')
        break
      case 'dark':
        commit('dark')
        break
      default:
        console.warn(`the theme "${theme}" is not registered`)
        break
    }

    dispatch('setClasses')
    dispatch('saveThemeToStorage')
  },
  setClasses({ state }) {
    // remove old themes
    Object.keys(state.options).forEach(key => {
      document.documentElement.classList.remove(state.options[key])
    })

    // set new theme
    document.documentElement.classList.add(state.options[state.active])
  },
  saveThemeToStorage({ state }) {
    localStorage.setItem('theme', state.active)
  },
}
