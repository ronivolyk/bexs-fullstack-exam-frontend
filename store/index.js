export const state = () => ({
  isLogged: false,
  user: '',
  questions: [],
  searchFor: '',
  hideAnswered: false,
  question: {}
})

export const mutations = {
  login: (state, user) => {
    state.isLogged = true
    state.user = user
  },

  logout: (state) => {
    state.isLogged = false
    state.user = ''
  },

  questions: (state, questions) => {
    state.questions = questions
  },

  searchFor: (state, searchFor) => {
    state.searchFor = searchFor
  },

  hideAnswered: (state, hideAnswered) => {
    state.hideAnswered = hideAnswered
  },

  question: (state, question) => {
    state.question = question
  }
}

export const getters = {
  isLogged: (state) => state.isLogged,
  user: (state) => state.user,
  questions: (state) => state.questions,
  searchFor: (state) => state.searchFor,
  hideAnswered: (state) => state.hideAnswered,
  question: (state) => state.question
}

export const actions = {
  init(context) {
    const user = localStorage.getItem('user')

    if (user) {
      context.commit('login', user)
    }
  },

  login(context, user) {
    if (!user || !user.trim()) {
      return { logged: false, error: 'Username must not be empty' }
    }

    context.commit('login', user)
    localStorage.setItem('user', user)

    return { logged: true }
  },

  logout(context) {
    context.commit('logout')
    localStorage.removeItem('user')
  },

  async loadQuestions(context) {
    const questions = (
      await this.$axios.get(
        `http://localhost:8080/questions?search=${context.getters.searchFor}&hideAnswered=${context.getters.hideAnswered}`
      )
    ).data

    context.commit('questions', questions)
  },

  searchFor(context, searchFor) {
    context.commit('searchFor', searchFor)
    context.dispatch('loadQuestions')
  },

  hideAnswered(context, hideAnswered) {
    context.commit('hideAnswered', hideAnswered)
    context.dispatch('loadQuestions')
  },

  async loadQuestion(context, questionId) {
    const question = (
      await this.$axios.get(`http://localhost:8080/questions/${questionId}`)
    ).data

    context.commit('question', question)
  },

  async askQuestion(context, newQuestion) {
    const question = {
      question: newQuestion,
      user: context.getters.user
    }

    await this.$axios.post('http://localhost:8080/questions', question)
    context.dispatch('loadQuestions')
    this.$router.push('/')
  },

  async likeQuestion(context) {
    await this.$axios.post(
      `http://localhost:8080/questions/${context.getters.question._id}/like`
    )

    context.dispatch('loadQuestion', context.getters.question._id)
  },

  async likeAnswer(context, answerPosition) {
    await this.$axios.post(
      `http://localhost:8080/questions/${context.getters.question._id}/answers/${answerPosition}/like`
    )

    context.dispatch('loadQuestion', context.getters.question._id)
  },

  async postAnswer(context, newAnswer) {
    const answer = {
      answer: newAnswer,
      user: context.getters.user
    }

    await this.$axios.post(
      `http://localhost:8080/questions/${context.getters.question._id}/answers`,
      answer
    )

    context.dispatch('loadQuestion', context.getters.question._id)
  }
}
