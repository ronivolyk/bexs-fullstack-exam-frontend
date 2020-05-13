export const state = () => ({
  isLogged: false,
  user: ''
})

export const mutations = {
  login: (state, { user }) => {
    state.isLogged = true
    state.user = user
  },

  logout: (state) => {
    state.isLogged = false
    state.user = ''
  }
}

export const getters = {
  isLogged: (state) => state.isLogged,
  user: (state) => state.user
}

export const actions = {
  init(context) {
    const user = localStorage.getItem('user')

    if (user) {
      context.commit('login', { user })
    }
  },

  login(context, user) {
    if (!user || !user.trim()) {
      return { logged: false, error: 'Username must not be empty' }
    }

    context.commit('login', { user })
    localStorage.setItem('user', user)

    return { logged: true }
  },

  logout(context) {
    context.commit('logout')
    localStorage.removeItem('user')
  }
}
